# SportiVerse   
_A dual-role football management and live-score app inspired by FIFA & LiveScore_  

## Overview  
SportiVerse is a centralized platform that provides **live match updates, player/team stats, and game management** for both **users (fans)** and **admins (organizers/officials)**.  

- **Users** → follow matches, view standings, and get notifications.  
- **Admins** → register teams/players, schedule matches, and update scores.  
- **Superadmins** → oversee the platform with elevated privileges.  

This MVP currently focuses on **authentication & role-based access control** with OTP verification and email notifications.  

---

## Features Implemented  

### Authentication & User Roles  
- JWT-based login & registration  
- Three role levels: **User, Admin, Superadmin**  
- Role logic:  
  - **User**: Email OTP verification (4-digit, expires in 5 minutes)  
  - **Admin**: Signup requires **SportiVerse Team approval** (invite flow)  
  - **Superadmin**: Requires secret key from `.env`  

### OTP System  
- OTP generated on signup (`user` role)  
- Email delivery via **Nodemailer + Gmail SMTP**  
- OTP verification endpoint (`/verify-otp`)  
- Resend OTP endpoint (`/resend-otp`) with throttling & expiry checks  

### Email Service  
- Centralized **`emailService.js`** with:  
  - `sendOtpEmail` → sends OTP to users  
  - `sendAdminInviteRequest` → notifies SportiVerse team for admin approval  

### Security  
- Environment variables managed via `.env`  
- Secrets stored securely (`JWT_SECRET`, `ADMIN_SECRET`, `EMAIL_USER`, `EMAIL_PASS`)  
- Passwords hashed before saving  

---

## Project Structure (so far)  

```
SportiVerse/
│── config/
│ └── db.js
│── controllers/
│ └── authController.js 
│ └── userController.js 
│── middleware/
│ └── authMiddleware.js
│ └── roleMiddleware.js
│── models/
│ └── userModel.js
│── routes/
│ └── index.js
│ └── authRoutes.js
│ └── userRoutes.js
│── service/
│ └── userService.js
│── utils/
│ └── constants.js
│ └── emailService.js
│── server.js
│── .env
│── package.json
```

---

## API Endpoints 

### **Register User**
`POST /api/auth/register`  
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securePass123",
  "role": "user"
}
```

---

### **Verify OTP**

`POST /api/auth/verify-otp`
```json
{
  "email": "john@example.com",
  "otp": "1234"
}
```

---

### **Resend OTP**

`POST /api/auth/resend-otp`
```json
{
  "email": "john@example.com"
}
```

---

### **Login**

`POST /api/auth/login`
```json
{
  "email": "john@example.com",
  "password": "securePass123"
}
```

---

### **Logout**
`POST /api/auth/logut`
```json
{
"Authorization" : "BEARER {token}" 
}
```