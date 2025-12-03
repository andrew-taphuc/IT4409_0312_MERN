const mongoose = require('mongoose');
const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const studentsRoutes = require('./routes/students');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Cho phép frontend truy cập API
app.use(express.json()); // Parse JSON request body

// Routes
// Test route
app.get('/', (req, res) => {
    res.json({ message: 'Server đang chạy!' });
});

// API routes cho students
app.use('/api/students', studentsRoutes);

// Kết nối MongoDB và khởi động server
mongoose.connect('mongodb://localhost:27017/student_db')
    .then(() => {
        console.log("Đã kết nối MongoDB thành công");
        // Khởi động server sau khi kết nối MongoDB thành công
        app.listen(PORT, () => {
            console.log(`Server đang chạy trên cổng ${PORT}`);
            console.log(`Truy cập: http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error("Lỗi kết nối MongoDB:", err);
        process.exit(1);
    });
