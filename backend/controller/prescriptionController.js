const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { createNotification } = require("../services/notificationService");


const createOrUpdatePrescription = async (req, res) => {
  const { appointmentId } = req.params;
  const doctorId = req.user.doctorProfile.id;
  const {
    diagnosis,
    doctor_notes,
    medications,
    follow_up_needed,
    follow_up_date,
  } = req.body;

  try {
    
    const appointment = await prisma.appointment.findFirst({
      where: {
        id: parseInt(appointmentId),
        doctor_id: doctorId,
      },
      include: {
        patient: {
          include: {
            user: true,
          },
        },
        doctor: {
          include: {
            user: true,
          },
        },
        time_slot: true, 
      },
    });

    if (!appointment) {
      return res
        .status(404)
        .json({ error: "Appointment not found or unauthorized" });
    }

    
    if (appointment.status !== "completed") {
      await prisma.appointment.update({
        where: { id: parseInt(appointmentId) },
        data: { status: "completed" },
      });
    }

    
    const existingPrescription = await prisma.prescription.findUnique({
      where: { appointment_id: parseInt(appointmentId) },
      include: { medications: true },
    });

    let prescription;

    
    await prisma.$transaction(async (prisma) => {
      if (existingPrescription) {
        
        prescription = await prisma.prescription.update({
          where: { id: existingPrescription.id },
          data: {
            diagnosis,
            doctor_notes,
            follow_up_needed: follow_up_needed || false,
            follow_up_date: follow_up_date ? new Date(follow_up_date) : null,
            updated_at: new Date(),
          },
        });

        
        await prisma.medication.deleteMany({
          where: { prescription_id: existingPrescription.id },
        });
      } else {
        
        prescription = await prisma.prescription.create({
          data: {
            appointment_id: parseInt(appointmentId),
            diagnosis,
            doctor_notes,
            follow_up_needed: follow_up_needed || false,
            follow_up_date: follow_up_date ? new Date(follow_up_date) : null,
          },
        });
      }

      
      if (medications && medications.length > 0) {
        for (const med of medications) {
          await prisma.medication.create({
            data: {
              prescription_id: prescription.id,
              name: med.name,
              dosage: med.dosage,
              frequency: med.frequency,
              duration: med.duration,
              instructions: med.instructions || "",
            },
          });
        }
      }
    });

    
    const completePrescription = await prisma.prescription.findUnique({
      where: { id: prescription.id },
      include: { medications: true },
    });

    
    await createNotification(
      appointment.patient.user.id,
      `Dr. ${
        appointment.doctor.user.name
      } has issued a prescription for your appointment on ${
        appointment.time_slot.date.toISOString().split("T")[0]
      }.`,
      "prescription_added"
    );

    res.status(200).json({
      message: existingPrescription
        ? "Prescription updated successfully"
        : "Prescription created successfully",
      prescription: completePrescription,
    });
  } catch (error) {
    console.error("Create/update prescription error:", error);
    res.status(500).json({ error: "Failed to save prescription" });
  }
};


const getPrescription = async (req, res) => {
  const { appointmentId } = req.params;
  const userId = req.user.id;

  try {
    
    const appointment = await prisma.appointment.findUnique({
      where: { id: parseInt(appointmentId) },
      include: {
        patient: {
          include: {
            user: true,
          },
        },
        doctor: {
          include: {
            user: true,
          },
        },
        time_slot: true,
      },
    });

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    
    const isDoctor = appointment.doctor.user.id === userId;
    const isPatient = appointment.patient.user.id === userId;

    if (!isDoctor && !isPatient) {
      return res
        .status(403)
        .json({ error: "You are not authorized to view this prescription" });
    }

    
    const prescription = await prisma.prescription.findUnique({
      where: { appointment_id: parseInt(appointmentId) },
      include: { medications: true },
    });

    if (!prescription) {
      return res
        .status(404)
        .json({ error: "No prescription found for this appointment" });
    }

    
    const formattedResponse = {
      id: prescription.id,
      appointment_id: prescription.appointment_id,
      appointment_date: appointment.time_slot.date.toISOString().split("T")[0],
      doctor: {
        id: appointment.doctor.id,
        name: appointment.doctor.user.name,
      },
      patient: {
        id: appointment.patient.id,
        name: appointment.patient.user.name,
      },
      diagnosis: prescription.diagnosis,
      doctor_notes: prescription.doctor_notes,
      follow_up: {
        needed: prescription.follow_up_needed,
        date: prescription.follow_up_date,
      },
      medications: prescription.medications.map((med) => ({
        id: med.id,
        name: med.name,
        dosage: med.dosage,
        frequency: med.frequency,
        duration: med.duration,
        instructions: med.instructions,
      })),
      created_at: prescription.created_at,
      updated_at: prescription.updated_at,
    };

    res.status(200).json(formattedResponse);
  } catch (error) {
    console.error("Get prescription error:", error);
    res.status(500).json({ error: "Failed to retrieve prescription" });
  }
};


const getDoctorPrescriptions = async (req, res) => {
  const doctorId = req.user.doctorProfile.id;
  const { page = 1, limit = 10, patient_id } = req.query;

  try {
    
    let whereClause = {
      appointment: {
        doctor_id: doctorId,
      },
    };

    
    if (patient_id) {
      whereClause.appointment.patient_id = parseInt(patient_id);
    }

    
    const skip = (parseInt(page) - 1) * parseInt(limit);

    
    const prescriptions = await prisma.prescription.findMany({
      where: whereClause,
      include: {
        medications: true,
        appointment: {
          include: {
            patient: {
              include: {
                user: {
                  select: {
                    name: true,
                  },
                },
              },
            },
            time_slot: true,
          },
        },
      },
      orderBy: { created_at: "desc" },
      skip,
      take: parseInt(limit),
    });

    
    const totalCount = await prisma.prescription.count({
      where: whereClause,
    });

    
    const formattedPrescriptions = prescriptions.map((prescription) => ({
      id: prescription.id,
      appointment_id: prescription.appointment_id,
      patient: {
        id: prescription.appointment.patient.id,
        name: prescription.appointment.patient.user.name,
      },
      appointment_date: prescription.appointment.time_slot.date
        .toISOString()
        .split("T")[0],
      diagnosis: prescription.diagnosis,
      medication_count: prescription.medications.length,
      follow_up_needed: prescription.follow_up_needed,
      follow_up_date: prescription.follow_up_date,
      created_at: prescription.created_at,
    }));

    res.status(200).json({
      prescriptions: formattedPrescriptions,
      pagination: {
        total: totalCount,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(totalCount / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Get doctor prescriptions error:", error);
    res.status(500).json({ error: "Failed to retrieve prescriptions" });
  }
};


const getPatientPrescriptions = async (req, res) => {
  try {
    
    if (!req.user || req.user.role !== "Patient") {
      return res
        .status(403)
        .json({ error: "Only patients can access this endpoint" });
    }

    
    const patient = await prisma.patient.findFirst({
      where: { userId: req.user.id },
    });

    if (!patient) {
      return res.status(404).json({ error: "Patient profile not found" });
    }

    const patientId = patient.id;
    const { page = 1, limit = 10 } = req.query;

    
    const skip = (parseInt(page) - 1) * parseInt(limit);

    
    const prescriptions = await prisma.prescription.findMany({
      where: {
        appointment: {
          patient_id: patientId,
        },
      },
      include: {
        medications: true,
        appointment: {
          include: {
            doctor: {
              include: {
                user: {
                  select: {
                    name: true,
                  },
                },
               
              },
            },
            time_slot: true,
          },
        },
      },
      orderBy: { created_at: "desc" },
      skip,
      take: parseInt(limit),
    });

    
    const totalCount = await prisma.prescription.count({
      where: {
        appointment: {
          patient_id: patientId,
        },
      },
    });

    
    const formattedPrescriptions = prescriptions.map((prescription) => ({
      id: prescription.id,
      appointment_id: prescription.appointment_id,
      doctor: {
        id: prescription.appointment.doctor.id,
        name: prescription.appointment.doctor.user.name,
      },
      appointment_date: prescription.appointment.time_slot.date
        .toISOString()
        .split("T")[0],
      diagnosis: prescription.diagnosis,
      medication_count: prescription.medications.length,
      medications: prescription.medications.map((med) => ({
        name: med.name,
        dosage: med.dosage,
        frequency: med.frequency,
        duration: med.duration,
      })),
      follow_up_needed: prescription.follow_up_needed,
      follow_up_date: prescription.follow_up_date,
      created_at: prescription.created_at,
    }));

    res.status(200).json({
      prescriptions: formattedPrescriptions,
      pagination: {
        total: totalCount,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(totalCount / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Get patient prescriptions error:", error);
    res.status(500).json({ error: "Failed to retrieve prescriptions" });
  }
};

module.exports = {
  createOrUpdatePrescription,
  getPrescription,
  getDoctorPrescriptions,
  getPatientPrescriptions,
};
