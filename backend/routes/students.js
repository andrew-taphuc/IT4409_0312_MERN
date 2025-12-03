const express = require('express');
const router = express.Router();
const Student = require('../Student');

// API route để lấy danh sách students
router.get('/', async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// API route để tạo sinh viên mới
router.post('/', async (req, res) => {
    try {
        const { name, age, class: className, mssv } = req.body;

        // Validation
        if (!name || !age || !className || !mssv) {
            return res.status(400).json({ 
                error: 'Vui lòng cung cấp đầy đủ thông tin: name, age, class, mssv' 
            });
        }

        // Kiểm tra age là số
        if (typeof age !== 'number' || age <= 0) {
            return res.status(400).json({ 
                error: 'Age phải là một số dương' 
            });
        }

        // Kiểm tra mssv là chuỗi không rỗng
        if (typeof mssv !== 'string' || mssv.trim() === '') {
            return res.status(400).json({ 
                error: 'Mã số sinh viên (mssv) không hợp lệ' 
            });
        }

        // Tạo sinh viên mới
        const newStudent = new Student({
            name,
            age,
            class: className,
            mssv
        });

        const savedStudent = await newStudent.save();
        res.status(201).json(savedStudent);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// API route để cập nhật thông tin sinh viên theo id
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, age, class: className, mssv } = req.body;

        // Validation
        if (!name || !age || !className || !mssv) {
            return res.status(400).json({ 
                error: 'Vui lòng cung cấp đầy đủ thông tin: name, age, class, mssv' 
            });
        }

        // Kiểm tra age là số
        if (typeof age !== 'number' || age <= 0) {
            return res.status(400).json({ 
                error: 'Age phải là một số dương' 
            });
        }

        // Kiểm tra mssv là chuỗi không rỗng
        if (typeof mssv !== 'string' || mssv.trim() === '') {
            return res.status(400).json({ 
                error: 'Mã số sinh viên (mssv) không hợp lệ' 
            });
        }

        // Tìm và cập nhật sinh viên
        const updatedStudent = await Student.findByIdAndUpdate(
            id,
            {
                name,
                age,
                class: className,
                mssv
            },
            { new: true, runValidators: true }
        );

        if (!updatedStudent) {
            return res.status(404).json({ error: 'Không tìm thấy sinh viên' });
        }

        res.json(updatedStudent);
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({ error: 'ID không hợp lệ' });
        }
        res.status(500).json({ error: err.message });
    }
});

// API route để xóa sinh viên theo id
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const deletedStudent = await Student.findByIdAndDelete(id);

        if (!deletedStudent) {
            return res.status(404).json({ error: 'Không tìm thấy sinh viên' });
        }

        res.json({ message: 'Xóa sinh viên thành công', student: deletedStudent });
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({ error: 'ID không hợp lệ' });
        }
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

