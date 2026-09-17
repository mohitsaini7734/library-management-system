# LibTrack — Library Management System

A complete, responsive Library Management System built with **Node.js, Express, MongoDB, Mongoose and EJS**. It is designed as a college-ready full-stack project with a polished dashboard and complete CRUD + circulation workflow.

## Features
- Professional responsive dashboard
- Book catalog: add, edit, delete, search and category filter
- Member management: register, edit, activate/deactivate, search
- Book issue and return workflow
- Automatic copy availability tracking
- Automatic overdue status refresh
- Automatic fine calculation at ₹5/day
- Transaction history with filters
- Duplicate/invalid transaction protection
- Demo seed data
- Environment-based MongoDB configuration
- Clean MVC-style project structure

## Tech Stack
- **Frontend:** EJS, HTML5, CSS3, Vanilla JavaScript
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **ODM:** Mongoose
- **Session:** express-session

## Project Structure
```text
library-management-system/
├── models/
│   ├── Book.js
│   ├── Member.js
│   └── Transaction.js
├── routes/
│   ├── index.js
│   ├── books.js
│   ├── members.js
│   └── transactions.js
├── public/
│   ├── css/style.css
│   └── js/app.js
├── views/
│   ├── books/
│   ├── members/
│   ├── transactions/
│   ├── partials/
│   ├── dashboard.ejs
│   ├── 404.ejs
│   └── 500.ejs
├── .env.example
├── .gitignore
├── package.json
├── seed.js
└── server.js
```

## Run in VS Code
### 1. Install dependencies
```bash
npm install
```

### 2. Configure MongoDB
Copy `.env.example` to `.env`.

For local MongoDB:
```env
MONGODB_URI=mongodb://127.0.0.1:27017/library_management
SESSION_SECRET=your-secret
PORT=5000
```

For MongoDB Atlas, use your Atlas SRV connection string instead.

### 3. Insert demo data
```bash
npm run seed
```

### 4. Start
```bash
npm start
```

Open:
```text
http://localhost:5000
```

## MongoDB Collections
Mongoose creates these collections automatically:
- `books`
- `members`
- `transactions`

## Important
Do not commit `.env` or `node_modules` to GitHub. They are excluded through `.gitignore`.

## GitHub
```bash
git add .
git commit -m "Upgrade LibTrack Library Management System"
git push origin main
```
