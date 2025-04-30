const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const {
  sendVerificationEmail,
  sendForgotPasswordEmail,
} = require("../utils/email");
const { generateOTP, verifyOTP } = require("../utils/otp");

const prisma = new PrismaClient();

const signup = async (req, res) => {
  const {
    name,
    email,
    password,
    role,
    
    nmc_number,
    speciality,
    educational_qualification,
    years_of_experience,
    former_organisation,
    
    phone_number,
    date_of_birth,
    gender,
  } = req.body;

  let cv_url = null;

  
  if (role === "Doctor" && req.file) {
    cv_url = req.file.path.replace(/\\/g, "/"); 
  }

  if (!["Patient", "Doctor"].includes(role)) {
    return res.status(400).json({ error: "Invalid role" });
  }

  try {
    const existingUser = await prisma.users.findUnique({ where: { email } });
    if (existingUser)
      return res.status(400).json({ error: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();

    
    const result = await prisma.$transaction(async (prisma) => {
      
      const user = await prisma.users.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role,
          kyc_status: "Pending",
          email_verified: false,
          otp,
          otp_expires: new Date(Date.now() + 10 * 60 * 1000), 
        },
      });

      
      if (role === "Doctor") {
        
        if (!nmc_number || !speciality || !educational_qualification) {
          throw new Error("Missing required doctor information");
        }

        await prisma.doctor.create({
          data: {
            nmc_number,
            speciality,
            educational_qualification,
            years_of_experience: parseInt(years_of_experience) || 0,
            former_organisation,
            cv_url,
            userId: user.id,
          },
        });
      } else if (role === "Patient") {
        await prisma.patient.create({
          data: {
            phone_number,
            date_of_birth: date_of_birth ? new Date(date_of_birth) : null,
            gender,
            userId: user.id,
          },
        });
      }

      return user;
    });

    await sendVerificationEmail(email, otp);
    res.status(201).json({
      message: "Signup successful. Check your email for OTP verification.",
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: error.message || "Signup failed" });
  }
};

const verifyEmail = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ error: "Email and OTP are required" });
  }

  try {
    const isValid = await verifyOTP(email, otp);

    if (!isValid) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    return res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Email verification error:", error);
    return res.status(500).json({ error: "Verification failed" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.users.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(400).json({ error: "Invalid credentials" });

    if (!user.email_verified) {
      return res.status(403).json({
        error: "Email not verified. Please verify your email first.",
      });
    }

    
    let doctorProfileId = null;
    if (user.role === "Doctor") {
      const doctorProfile = await prisma.doctor.findFirst({
        where: { userId: user.id },
        select: { id: true },
      });
      if (doctorProfile) {
        doctorProfileId = doctorProfile.id;
      }
    }

    
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        kyc_status: user.kyc_status,
        doctorId: doctorProfileId, 
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.json({ token, role: user.role, kyc_status: user.kyc_status });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await prisma.users.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: "User not found" });

    if (!user.email_verified) {
      return res.status(403).json({
        error: "Email not verified. Please verify your email first.",
      });
    }

    const resetToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    await prisma.users.update({
      where: { id: user.id },
      data: {
        reset_token: resetToken,
        reset_token_expires: new Date(Date.now() + 60 * 60 * 1000),
      },
    });

    await sendForgotPasswordEmail(email, resetToken);
    res.json({ message: "Password reset email sent. Check your inbox." });
  } catch (error) {
    res.status(500).json({ error: "Forgot password failed" });
  }
};

const changePassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.users.findUnique({
      where: {
        id: decoded.id,
        reset_token: token,
        reset_token_expires: { gt: new Date() },
      },
    });
    if (!user)
      return res.status(400).json({ error: "Invalid or expired token" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.users.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        reset_token: null,
        reset_token_expires: null,
      },
    });

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ error: "Change password failed" });
  }
};

const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        kyc_status: true,
        email_verified: true,
        created_at: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    
    let profileData = { ...user };

    if (user.role === "Doctor") {
      const doctorProfile = await prisma.doctor.findUnique({
        where: { userId: userId },
      });
      profileData.doctorProfile = doctorProfile;
    } else if (user.role === "Patient") {
      const patientProfile = await prisma.patient.findUnique({
        where: { userId: userId },
      });
      profileData.patientProfile = patientProfile;
    }

    res.json(profileData);
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ error: "Failed to retrieve profile" });
  }
};

module.exports = {
  signup,
  login,
  forgotPassword,
  changePassword,
  verifyEmail,
  getProfile,
};
