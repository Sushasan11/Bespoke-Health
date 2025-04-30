const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { sendEmail } = require("../utils/email");


const getAllDoctors = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const speciality = req.query.speciality || "";
    const sortBy = req.query.sortBy || "created_at";
    const sortOrder = req.query.sortOrder?.toLowerCase() === "asc" ? "asc" : "desc";
    const status = req.query.status || ""; 
    const skip = (page - 1) * limit;

    
    let where = {
      OR: [
        {
          user: {
            name: { contains: search, mode: "insensitive" }
          }
        },
        {
          user: {
            email: { contains: search, mode: "insensitive" }
          }
        },
        {
          nmc_number: { contains: search, mode: "insensitive" }
        }
      ]
    };

    
    if (speciality) {
      where.speciality = { equals: speciality, mode: "insensitive" };
    }

    
    if (status) {
      where.user = {
        ...where.user,
        
        kyc_status: status
      };
    }

    
    const doctors = await prisma.doctor.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            
            created_at: true,
            
            kyc_status: true,
            email_verified: true
          }
        },
        _count: {
          select: {
            appointments: true,
            time_slots: true
          }
        }
      },
      orderBy: {
        [sortBy]: sortOrder
      },
      skip,
      take: limit
    });

    
    const totalDoctors = await prisma.doctor.count({ where });
    
    
    const specialities = await prisma.doctor.findMany({
      select: {
        speciality: true
      },
      distinct: ["speciality"]
    });

    const totalPages = Math.ceil(totalDoctors / limit);

    res.status(200).json({
      doctors,
      specialities: specialities.map(s => s.speciality).filter(Boolean),
      pagination: {
        totalItems: totalDoctors,
        totalPages,
        currentPage: page,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error("Get all doctors error:", error);
    res.status(500).json({ error: "Failed to retrieve doctors" });
  }
};


const getDoctorDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const doctor = await prisma.doctor.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            
            kyc_status: true,
            created_at: true
          }
        },
        appointments: {
          include: {
            patient: {
              include: {
                user: {
                  select: { name: true }
                }
              }
            },
            time_slot: true,
            payment: true
          },
          take: 10,
          orderBy: {
            created_at: "desc"
          }
        },
        availabilities: true,
        time_slots: {
          take: 20,
          orderBy: {
            date: "asc"
          }
        },
        _count: {
          select: {
            appointments: true,
            time_slots: true
          }
        }
      }
    });

    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    
    const totalAppointments = doctor._count.appointments;
    const completedAppointments = doctor.appointments.filter(a => a.status === "completed").length;
    const cancelledAppointments = doctor.appointments.filter(a => a.status === "cancelled").length;
    
    const metrics = {
      totalAppointments,
      completedAppointments,
      cancelledAppointments,
      completionRate: totalAppointments ? (completedAppointments / totalAppointments * 100).toFixed(2) : 0,
      cancellationRate: totalAppointments ? (cancelledAppointments / totalAppointments * 100).toFixed(2) : 0,
      totalRevenue: doctor.appointments
        .filter(a => a.payment)
        .reduce((sum, a) => sum + (a.payment?.amount || 0), 0)
    };

    res.status(200).json({ 
      doctor,
      metrics
    });
  } catch (error) {
    console.error("Get doctor details error:", error);
    res.status(500).json({ error: "Failed to retrieve doctor details" });
  }
};


const updateDoctorStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    if (!["active", "inactive", "suspended"].includes(status)) {
      return res.status(400).json({ error: "Invalid status. Must be active, inactive, or suspended" });
    }

    
    const updatedDoctor = await prisma.$transaction(async (prisma) => {
      
      const doctor = await prisma.doctor.findUnique({
        where: { id: parseInt(id) },
        select: { userId: true }
      });

      if (!doctor) {
        throw new Error("Doctor not found");
      }

      
      await prisma.users.update({
        where: { id: doctor.userId },
        data: {
          kyc_status: status
        }
      });

      
      return prisma.doctor.update({
        where: { id: parseInt(id) },
        data: {
          ...(notes && { admin_notes: notes })
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              kyc_status: true
            }
          }
        }
      });
    });

    
    await sendEmail({
      to: updatedDoctor.user.email,
      subject: `Bspoke Health: Your Account Status Update`,
      text: `Your doctor account status has been updated to: ${status}. ${notes ? `\n\nAdmin notes: ${notes}` : ''}`,
      html: `<p>Hello ${updatedDoctor.user.name},</p>
             <p>Your doctor account status has been updated to: <strong>${status}</strong>.</p>
             ${notes ? `<p>Admin notes: ${notes}</p>` : ''}
             <p>Best regards,<br>Bspoke Health Admin Team</p>`
    });

    res.status(200).json({
      message: "Doctor status updated successfully",
      doctor: updatedDoctor
    });
  } catch (error) {
    console.error("Update doctor status error:", error);
    if (error.message === "Doctor not found") {
      return res.status(404).json({ error: "Doctor not found" });
    }
    res.status(500).json({ error: "Failed to update doctor status" });
  }
};


const sendEmailToDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const { subject, message } = req.body;

    if (!subject || !message) {
      return res.status(400).json({ error: "Subject and message are required" });
    }

    
    const doctor = await prisma.doctor.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    
    await sendEmail({
      to: doctor.user.email,
      subject: subject,
      text: message,
      html: `<p>Hello Dr. ${doctor.user.name},</p>
             <p>${message}</p>
             <p>Best regards,<br>Bspoke Health Admin Team</p>`
    });

    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Send email to doctor error:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
};

module.exports = {
  getAllDoctors,
  getDoctorDetails,
  updateDoctorStatus,
  sendEmailToDoctor
};