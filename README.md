
# SpendWise

SpendWise is a simple daily expense tracker app designed to help users monitor and manage their spending habits easily. The project is split into two parts:  
- **Frontend:** A React-based user interface for adding, editing, and viewing expenses.  
- **Backend:** A RESTful API built with Node.js, Express, and MongoDB to handle data storage, user authentication, and email notifications.

---

## Repository Structure

/SpendWise  
│  
├── Frontend/      # React app for the user interface  
└── Backend/       # Node.js API server for expense tracking and user management

---

# Frontend (React)

SpendWise frontend is focused on ease of use and clean design, allowing users to input common expenses like travel, food, and miscellaneous items.

### Features

- Add daily expenses by category (Travel, Food, Others)  
- View total daily spending  
- Edit or delete entries  
- Responsive and mobile-friendly UI  

### Built With

- React  
- CSS Modules  
- React Hooks (\`useState\`, \`useEffect\`)  

---

# Backend (API)

A RESTful API for tracking personal expenses with authentication, filtering, category grouping, password reset, and weekly email summaries.

### Features

- User registration and login (JWT stored in HTTP-only cookies)  
- Forgot password with OTP via email  
- Add, update, delete expenses  
- Filter expenses by date, category, or amount  
- Group expenses by category  
- Weekly expense summary email using cron jobs  
- Secure routes with JWT middleware  
- Modular folder structure (routes, controllers, models, utils)  

### Built With

- Node.js  
- Express.js  
- MongoDB with Mongoose  
- JSON Web Tokens (JWT)  
- Nodemailer  
- Node-Cron  
- Cookie-parser  
- Dotenv  

---

# Setup Instructions

### 1. Clone the repository

\`\`\`bash
git clone https://github.com/aneesnizam/SpendWise.git
cd SpendWise
\`\`\`

---

### 2. Setup Backend

```bash
cd Backend
npm install
```

Create a \`.env\` file in \`Backend/\` with:

```
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_jwt_secret
EMAIL=your_email@gmail.com
EMAIL_PASSWORD=your_email_password_or_app_password
NODE_ENV=development
```


Start the backend server:

```
npm start
```

The backend will run at \`http://localhost:5000` by default.

---

### 3. Setup Frontend

Open a new terminal and run:

```
cd Frontend
npm install
npm start
```

The React app will start on \`http://localhost:3000` (default).

---

# Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you want to change.

---

# Contact

For inquiries or suggestions, reach out via [GitHub Issues](https://github.com/aneesnizam/SpendWise/issues).

---

# Notes

🚧 The project is currently under development and not yet fully functional. Updates will follow soon.
