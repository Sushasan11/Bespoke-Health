const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};

const verifyOTP = async (email, otp) => {
  const user = await prisma.users.findUnique({ where: { email } });
  if (!user || user.otp !== otp || new Date() > user.otp_expires) {
    return false;
  }
  await prisma.users.update({
    where: { email },
    data: { 
      otp: null, 
      otp_expires: null, 
      email_verified: true 
      
    },
  });
  return true;
};

module.exports = { generateOTP, verifyOTP };