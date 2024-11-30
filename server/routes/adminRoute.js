const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const Doctor = require('../models/doctorModel');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/get-all-doctors', authMiddleware, async (req, res) => {
  console.log('---')
  console.log('GET request received at "/get-all-doctors" from ' + req.headers.origin)
  console.log(req.headers['user-agent'])
  console.log('---')
  try {
    const doctors = await Doctor.find({});
    res.status(200).send({
      message: 'Doctors fetched successfully',
      success: true,
      data: doctors
    });
    console.log('Response sent successfully')
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: 'Error fetching doctors',
      success: false,
      error
    })
  }
})

router.get('/get-all-users', authMiddleware, async (req, res) => {
  console.log('---')
  console.log('GET request received at "/get-all-users" from ' + req.headers.origin)
  console.log(req.headers['user-agent'])
  console.log('---')
  try {
    const users = await User.find({});
    res.status(200).send({
      message: 'Users fetched successfully',
      success: true,
      data: users
    });
    console.log('Response sent successfully')
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: 'Error fetching users',
      success: false,
      error
    })
  }
})

router.post('/change-doctor-status', authMiddleware, async (req, res) => {
  try {
    const { doctorId, status } = req.body;
    const doctor = await Doctor.findByIdAndUpdate(doctorId, {
      status
    });

    const user = await User.findOne({ _id: doctor.userId }); 
    user.isDoctor = status === 'aproved' ? true : false;
    const unseenNotifications = user.unseenNotifications;
    unseenNotifications.push({
      type: 'new-doctor-request-changed',
      message: `Tu aplicación para doctor ha cambiado al estado: ${status}.`,
      onClickPath : '/notifications'
    });
    await user.save();

    res.status(200).send({
      message: 'Doctor status updated successfully',
      success: true,
      data: doctor
    });

  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: 'Error updating doctor status',
      success: false,
      error
    })
  }
})

module.exports = router;