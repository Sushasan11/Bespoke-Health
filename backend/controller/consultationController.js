const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const updateConsultationNotes = async (req, res) => {
  const { appointmentId } = req.params;
  const doctorId = req.user.doctorProfile.id;
  const { notes } = req.body;
  
  if (!notes) {
    return res.status(400).json({ error: "Notes content is required" });
  }
  
  try {
    
    const appointment = await prisma.appointment.findFirst({
      where: {
        id: parseInt(appointmentId),
        doctor_id: doctorId
      }
    });
    
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found or unauthorized" });
    }
    
    
    const updatedAppointment = await prisma.appointment.update({
      where: { id: parseInt(appointmentId) },
      data: { 
        notes,
        updated_at: new Date()
      }
    });
    
    res.status(200).json({
      message: "Consultation notes updated successfully",
      appointment: {
        id: updatedAppointment.id,
        notes: updatedAppointment.notes
      }
    });
  } catch (error) {
    console.error("Update consultation notes error:", error);
    res.status(500).json({ error: "Failed to save consultation notes" });
  }
};

const getConsultationNotes = async (req, res) => {
  const { appointmentId } = req.params;
  const doctorId = req.user.doctorProfile.id;
  
  try {
    
    const appointment = await prisma.appointment.findFirst({
      where: {
        id: parseInt(appointmentId),
        doctor_id: doctorId
      },
      select: {
        id: true,
        notes: true,
        patient: {
          include: {
            user: {
              select: {
                name: true
              }
            }
          }
        },
        time_slot: {
          select: {
            date: true
          }
        }
      }
    });
    
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found or unauthorized" });
    }
    
    if (!appointment.notes) {
      return res.status(404).json({ error: "No consultation notes found for this appointment" });
    }
    
    res.status(200).json({
      appointment_id: appointment.id,
      patient_name: appointment.patient.user.name,
      appointment_date: appointment.time_slot.date.toISOString().split('T')[0],
      notes: appointment.notes
    });
  } catch (error) {
    console.error("Get consultation notes error:", error);
    res.status(500).json({ error: "Failed to retrieve consultation notes" });
  }
};

module.exports = {
  updateConsultationNotes,
  getConsultationNotes
};