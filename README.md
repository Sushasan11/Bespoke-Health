# Bespoke Health

## Overview

Bespoke Health is a comprehensive healthcare platform designed to facilitate interaction between patients and healthcare providers. It features appointment booking, real-time chat, medical record management, and analytics dashboard.

## Tech Stack

### Backend

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL (via Prisma ORM)
- **Real-time Communication:** Socket.io
- **Authentication:** JSON Web Tokens (JWT) & bcryptjs
- **File Storage:** Cloudinary (via Multer)
- **Email Service:** Nodemailer

### Frontend

- **Framework:** React (Vite)
- **Styling:** Tailwind CSS & Lucide React (Icons)
- **Routing:** React Router
- **State & Animations:** Framer Motion
- **Visualization:** Recharts
- **HTTP Client:** Axios

## Project Structure

- `backend/`: Node.js/Express API server managing routes, controllers, and services.
- `frontend/`: React client application for user interface and interactions.

## Setup Instructions

### Prerequisites

- Node.js installed
- PostgreSQL installed and running

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables in a `.env` file (refer to usage in `app.js` and `Prisma`).
   - `PORT`
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `CLOUDINARY_*` keys
   - Email configuration
4. Run database migrations:

   ```bash
   npx prisma migrate dev
   ```

5. Start the server:

   ```bash
   npm start
   ```

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file in the respective directories.

### Backend (`backend/.env`)

```env
PORT=3000
DATABASE_URL="postgresql://postgres:admin@localhost:5432/bespoke_health"
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
KHALTI_SECRET=your_khalti_secret
KHALTI_PUBLIC=your_khalti_public_key
FRONTEND_URL=http://localhost:5173
```

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:3000/api
```
