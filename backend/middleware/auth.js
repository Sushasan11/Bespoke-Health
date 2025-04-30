const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 

    
    if (decoded.role === "Doctor") {
      const doctorProfile = await prisma.doctor.findFirst({
        where: { userId: decoded.id },
      });

      if (doctorProfile) {
        req.user.doctorProfile = doctorProfile;
      }
    }

    
    if (decoded.role === "Patient") {
      
      const patientProfile = await prisma.patient.findFirst({
        where: { userId: decoded.id },
      });

      if (patientProfile) {
        req.user.patientProfile = patientProfile;
      } else {
        console.log(`Patient profile not found for user ID: ${decoded.id}`);
      }
    }

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};

const authorizeRoles = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Access denied" });
    }
    next();
  };
};

module.exports = { authenticateToken, authorizeRoles };
