const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/attendanceDB')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.log('❌ MongoDB error:', err));

const studentSchema = new mongoose.Schema({
  name: String,
  rollNo: String
});

const Student = mongoose.model('Student', studentSchema);
const attendanceSchema = new mongoose.Schema({
  rollNo: String,
  date: String,
  status: String
});
const Attendance = mongoose.model('Attendance',attendanceSchema);
app.post('/add-student', async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.json({ message: 'Student added successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/mark-attendance', async (req, res) => {
  try {
    const { rollNo, status } = req.body;
    
    const student = await Student.findOne({ rollNo });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const today = new Date().toISOString().split('T')[0];

    const existing = await Attendance.findOne({ rollNo, date: today });
    if (existing) {
      return res.status(400).json({ message: "Attendance already marked for today" });
    }

    const attendance = new Attendance({ rollNo, date: today, status });
    await attendance.save();
    res.json({ message: `Marked ${status} for Roll No ${rollNo}` });
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/', (req, res) => {
  res.send('Attendance API is running');
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));