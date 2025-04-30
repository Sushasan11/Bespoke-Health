require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const setupWebSockets = require("./utils/setupWebSockets");

const app = express();
const prisma = new PrismaClient();

const server = http.createServer(app);

const io = setupWebSockets(server);

prisma
  .$connect()
  .then(() => console.log("PostgreSQL connected successfully"))
  .catch((error) => console.error("PostgreSQL connection failed:", error));

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);
const kycRoutes = require("./routes/kycRoutes");
app.use("/api/kyc", kycRoutes);
const fileRoutes = require("./routes/fileRoutes");
app.use("/api/uploads", fileRoutes);

const doctorRoutes = require("./routes/doctorRoutes");
const availabilityRoutes = require("./routes/availabilityRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const statRoutes = require("./routes/statRoutes");
const diseaseRoutes = require("./routes/diseaseRoutes");
const medicineRoutes = require("./routes/medicineRoutes");
const chatRoutes = require("./routes/chatRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const adminRoutes = require("./routes/adminRoutes");

app.use("/api/availability", availabilityRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/stats", statRoutes);
app.use("/api/disease", diseaseRoutes);

app.use("/api/appointments", appointmentRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/medicines", medicineRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/admin", adminRoutes);

const { handleFileUploadErrors } = require("./middleware/errorHandler");
app.use(handleFileUploadErrors);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
