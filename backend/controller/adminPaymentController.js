const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { format } = require("date-fns");
const { sendEmail } = require("../utils/email");

const getAllPayments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const startDate = req.query.startDate ? new Date(req.query.startDate) : null;
    const endDate = req.query.endDate ? new Date(req.query.endDate) : null;
    const status = req.query.status || "";
    const paymentMethod = req.query.paymentMethod || "";
    const minAmount = req.query.minAmount ? parseFloat(req.query.minAmount) : null;
    const maxAmount = req.query.maxAmount ? parseFloat(req.query.maxAmount) : null;
    const sortBy = req.query.sortBy || "created_at";
    const sortOrder = req.query.sortOrder?.toLowerCase() === "asc" ? "asc" : "desc";
    const skip = (page - 1) * limit;

    
    let where = {};

    
    if (startDate && endDate) {
      where.created_at = {
        gte: startDate,
        lte: endDate
      };
    } else if (startDate) {
      where.created_at = {
        gte: startDate
      };
    } else if (endDate) {
      where.created_at = {
        lte: endDate
      };
    }

    
    if (status) {
      where.status = status;
    }

    
    if (paymentMethod) {
      where.payment_method = paymentMethod;
    }

    
    if (minAmount !== null || maxAmount !== null) {
      where.amount = {};
      if (minAmount !== null) {
        where.amount.gte = minAmount;
      }
      if (maxAmount !== null) {
        where.amount.lte = maxAmount;
      }
    }

    
    const payments = await prisma.payment.findMany({
      where,
      include: {
        appointment: {
          include: {
            patient: {
              include: {
                user: {
                  select: { name: true }
                }
              }
            },
            doctor: {
              include: {
                user: {
                  select: { name: true }
                }
              }
            }
          }
        }
      },
      orderBy: {
        [sortBy]: sortOrder
      },
      skip,
      take: limit
    });

    
    const formattedPayments = payments.map(payment => ({
      id: payment.id,
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status,
      paymentMethod: payment.payment_method,
      transactionId: payment.transaction_id,
      createdAt: payment.created_at,
      appointment: {
        id: payment.appointment.id,
        patientName: payment.appointment.patient.user.name,
        doctorName: payment.appointment.doctor.user.name,
        patientId: payment.appointment.patient.id,
        doctorId: payment.appointment.doctor.id,
        speciality: payment.appointment.doctor.speciality
      },
      refundAmount: payment.refund_amount,
      refundReason: payment.refund_reason
    }));

    
    const totalPayments = await prisma.payment.count({ where });
    const totalPages = Math.ceil(totalPayments / limit);

    
    const paymentStats = await prisma.payment.aggregate({
      _sum: {
        amount: true,
        refund_amount: true
      },
      _count: true,
      where
    });

    
    const paymentMethods = await prisma.payment.findMany({
      select: {
        payment_method: true
      },
      distinct: ["payment_method"]
    });

    
    const paymentStatuses = await prisma.payment.findMany({
      select: {
        status: true
      },
      distinct: ["status"]
    });

    res.status(200).json({
      payments: formattedPayments,
      filterOptions: {
        paymentMethods: paymentMethods.map(p => p.payment_method).filter(Boolean),
        statuses: paymentStatuses.map(p => p.status).filter(Boolean)
      },
      summary: {
        totalAmount: paymentStats._sum.amount || 0,
        totalRefunds: paymentStats._sum.refund_amount || 0,
        netRevenue: (paymentStats._sum.amount || 0) - (paymentStats._sum.refund_amount || 0),
        count: paymentStats._count
      },
      pagination: {
        totalItems: totalPayments,
        totalPages,
        currentPage: page,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error("Get all payments error:", error);
    res.status(500).json({ error: "Failed to retrieve payments" });
  }
};

/**
 * Get payment details by ID
 */
const getPaymentDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const payment = await prisma.payment.findUnique({
      where: { id: parseInt(id) },
      include: {
        appointment: {
          include: {
            patient: {
              include: {
                user: {
                  select: { name: true, email: true }
                }
              }
            },
            doctor: {
              include: {
                user: {
                  select: { name: true, email: true }
                }
              }
            },
            time_slot: true
          }
        }
      }
    });

    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }

    res.status(200).json({ payment });
  } catch (error) {
    console.error("Get payment details error:", error);
    res.status(500).json({ error: "Failed to retrieve payment details" });
  }
};

/**
 * Process refund
 */
const processRefund = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, reason } = req.body;

    if (!amount || parseFloat(amount) <= 0) {
      return res.status(400).json({ error: "Valid refund amount is required" });
    }

    const payment = await prisma.payment.findUnique({
      where: { id: parseInt(id) },
      include: {
        appointment: {
          include: {
            patient: {
              include: {
                user: true
              }
            }
          }
        }
      }
    });

    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }

    if (payment.status !== "completed") {
      return res.status(400).json({ error: "Only completed payments can be refunded" });
    }

    if (parseFloat(amount) > payment.amount) {
      return res.status(400).json({ error: "Refund amount cannot exceed the original payment amount" });
    }

    
    

    
    const updatedPayment = await prisma.payment.update({
      where: { id: parseInt(id) },
      data: {
        refund_amount: parseFloat(amount),
        refund_reason: reason || "Administrative refund",
        status: "refunded"
      }
    });

    
    await sendEmail({
      to: payment.appointment.patient.user.email,
      subject: "Your Bspoke Health Payment Has Been Refunded",
      text: `We have processed a refund of ${amount} for your appointment. Reason: ${reason || "Administrative refund"}`,
      html: `<p>Hello ${payment.appointment.patient.user.name},</p>
             <p>We have processed a refund of <strong>${amount}</strong> for your appointment.</p>
             <p>Reason: ${reason || "Administrative refund"}</p>
             <p>The refund should appear in your account within 5-7 business days.</p>
             <p>Best regards,<br>Bspoke Health Team</p>`
    });

    res.status(200).json({
      message: "Refund processed successfully",
      payment: updatedPayment
    });
  } catch (error) {
    console.error("Process refund error:", error);
    res.status(500).json({ error: "Failed to process refund" });
  }
};


const generatePaymentReport = async (req, res) => {
  try {
    const { startDate, endDate, groupBy = "day" } = req.body;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ error: "Start date and end date are required" });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    
    if (start > end) {
      return res.status(400).json({ error: "Start date must be before end date" });
    }

    
    const payments = await prisma.payment.findMany({
      where: {
        created_at: {
          gte: start,
          lte: end
        }
      },
      include: {
        appointment: {
          include: {
            doctor: {
              select: {
                speciality: true
              }
            }
          }
        }
      }
    });

    
    let groupedData = {};
    let dateFormat = "";

    if (groupBy === "day") {
      dateFormat = "yyyy-MM-dd";
    } else if (groupBy === "month") {
      dateFormat = "yyyy-MM";
    } else if (groupBy === "year") {
      dateFormat = "yyyy";
    }

    
    payments.forEach(payment => {
      const dateKey = format(payment.created_at, dateFormat);
      
      if (!groupedData[dateKey]) {
        groupedData[dateKey] = {
          totalAmount: 0,
          count: 0,
          refundAmount: 0,
          bySpeciality: {}
        };
      }

      
      const amount = parseFloat(payment.amount) || 0;
      const refundAmount = parseFloat(payment.refund_amount) || 0;
      
      groupedData[dateKey].totalAmount += amount;
      groupedData[dateKey].count += 1;
      
      if (refundAmount > 0) {
        groupedData[dateKey].refundAmount += refundAmount;
      }

      
      const speciality = payment.appointment?.doctor?.speciality || "Unknown";
      if (!groupedData[dateKey].bySpeciality[speciality]) {
        groupedData[dateKey].bySpeciality[speciality] = {
          amount: 0,
          count: 0
        };
      }
      
      groupedData[dateKey].bySpeciality[speciality].amount += amount;
      groupedData[dateKey].bySpeciality[speciality].count += 1;
    });

    
    const formattedData = Object.entries(groupedData).map(([date, data]) => ({
      date,
      totalAmount: parseFloat(data.totalAmount.toFixed(2)),
      count: data.count,
      refundAmount: parseFloat(data.refundAmount.toFixed(2)),
      netAmount: parseFloat((data.totalAmount - data.refundAmount).toFixed(2)),
      bySpeciality: Object.entries(data.bySpeciality).map(([speciality, stats]) => ({
        speciality,
        amount: parseFloat(stats.amount.toFixed(2)),
        count: stats.count
      }))
    }));

    
    formattedData.sort((a, b) => a.date.localeCompare(b.date));

    
    const totalAmount = payments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
    const totalRefunds = payments.reduce((sum, p) => sum + (parseFloat(p.refund_amount) || 0), 0);
    
    const summary = {
      totalPayments: payments.length,
      totalAmount: parseFloat(totalAmount.toFixed(2)),
      totalRefunds: parseFloat(totalRefunds.toFixed(2)),
      netRevenue: parseFloat((totalAmount - totalRefunds).toFixed(2)),
      dateRange: {
        start: startDate,
        end: endDate
      }
    };

    res.status(200).json({
      report: formattedData,
      summary
    });
  } catch (error) {
    console.error("Generate payment report error:", error);
    res.status(500).json({ error: "Failed to generate payment report" });
  }
};

module.exports = {
  getAllPayments,
  getPaymentDetails,
  processRefund,
  generatePaymentReport
};