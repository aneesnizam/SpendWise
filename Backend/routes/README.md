# 💰 Expense Tracker API

A RESTful API for tracking personal expenses, with features like authentication, expense filtering, category grouping, password reset, and weekly email summaries using Node.js, Express, MongoDB, and Node-Cron.

---

## 🚀 Features

- User registration and login (JWT stored in HTTP-only cookies)
- Forgot password with OTP via email
- Add, update, delete expenses
- Filter expenses by date, category, or amount
- Group expenses by category
- Weekly expense email summary using cron jobs
- Secure routes with JWT middleware
- Modular folder structure (routes, controllers, models, utils)

---

## 🛠️ Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JSON Web Tokens (JWT)
- Nodemailer
- Node-Cron
- Cookie-parser
- Dotenv

---

## ⚙️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/spendwise-app/SpendWise.git
cd SpendWise
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root directory and add the following:

```env
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_jwt_secret
EMAIL=your_email@gmail.com
EMAIL_PASSWORD=your_email_password_or_app_password
NODE_ENV = development
```

### 4. Start the server

```bash
npm start
```

The server will run at `http://localhost:5000` by default (or the port you set in `.env`).

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

---

## 📬 Contact

For any inquiries or suggestions, feel free to reach out via [GitHub Issues](https://github.com/spendwise-app/SpendWise/issues).
