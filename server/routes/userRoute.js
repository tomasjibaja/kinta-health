const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const Doctor = require('../models/doctorModel');
const Appointment = require('../models/appointmentModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const authMiddleware = require('../middlewares/authMiddleware');
const moment = require('moment')
const dayjs = require('dayjs')

// router.get('/register', async (req, res) => {
//   console.log('GET request received at /register')
//   res.send('Path /register is OK')
// })

// ESTO DE ABAJO ES LO INCIAL PARA EL USER, las rutas del user

router.post('/register', async (req, res) => {
  console.log('POST request received at /register')

  try {
    const userExists = await User.findOne({ email: req.body.email })
    if (userExists) {
      return res
        .status(200)
        .send({ message: 'Email already used', success: false });
    }

    const password = req.body.password;
    const hashedPassword = await bcrypt.hash(password, 10);
    req.body.password = hashedPassword;

    const newuser = new User(req.body);
    await newuser.save()

    res
      .status(200)
      .send({ message: 'User created successfully', success: true });
      console.log(`User ${req.body.name} created successfully`);
  } catch (error) {
    res
      .status(500)
      .send({ message: 'Error creating user', success: false });
  }

})

router.post('/login', async (req, res) => {

  try {
    const user = await User.findOne({ email: req.body.email })

    if (!user) {
      return res
        .status(200)
        .send({ message: 'El usuario no existe', success: false });
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);

    if (!isMatch) {
      return res
        .status(200)
        .send({ message: 'La contraseña es incorrecta', success: false });
    } else {
      const token = jwt.sign({ id:user._id }, process.env.JWT_SECRET, {
        expiresIn: '1d'
      });
      res.status(200).send({ message: 'Inicio de sesión exitoso', success: true, data: token });
      console.log(`User ${req.body.email} logged successfully`);
    }
  } catch (error) {
    res
      .status(200)
      .send({ message: 'Error al inciar sesión', success: false });
  }

})

router.post('/get-user-info-by-id', authMiddleware, async (req, res) => {
  console.log('POST request received at "/get-user-info-by-id" from ' + req.headers.origin)
  try {
    const user = await User.findOne({ _id: req.body.userId });
    user.password = undefined
    if (!user) {
      console.log(`Tried to login with ${req.body.email} but it doesn't exist`)
      return res
        .status(200)
        .send({ message: 'User does not exist', success: false });
    } else {
      res
        .status(200)
        .send({ 
          success: true, 
          data: user
      })
    }
  } catch (error) {
    res
      .status(500)
      .send({ message: 'Error getting user info', success: false, error });
  }
})

// Esto otro es para que un user solicite ser doctor

router.post('/apply-doctor-account', authMiddleware, async (req, res) => {
  console.log('POST request received at "/apply-doctor-account" from ' + req.headers.origin)
  console.log('APPLY DR BODY: ' + JSON.stringify(req.body))
  try {
    const newDoctor = new Doctor({...req.body , status: 'pending'});
    await newDoctor.save();
    const adminUser = await User.findOne({ isAdmin: true });

    const unseenNotifications = adminUser.unseenNotifications;
    unseenNotifications.push({
      type: 'new-doctor-request',
      message: `${newDoctor.firstName} ${newDoctor.lastName} has applied for a doctor account`,
      data: {
        doctorId : newDoctor._id,
        name : newDoctor.firstName + ' ' + newDoctor.lastName
      },
      onClickPath : '/admin/doctorslist'
    })
    
    await User.findByIdAndUpdate(adminUser._id, { unseenNotifications });
    
    res.status(200).send({
      success: true,
      message: 'Doctor account applied successfully'
    })
  } catch (error) {
    res
      .status(500)
      .send({ message: 'Error applying doctor account', success: false, error });
  }
})

router.post('/mark-all-notifications-as-seen', authMiddleware, async (req, res) => {
  console.log('POST request received at "/mark-all-notifications-as-seen" from ' + req.headers.origin)
  try {
    const user = await User.findOne({ _id: req.body.userId });
    const unseenNotifications = user.unseenNotifications;
    user.seenNotifications.push(...unseenNotifications);
    user.unseenNotifications = [];

    const updatedUser = await user.save();
    updatedUser.password = undefined;

    res.status(200).send({
      success: true,
      message: 'All notifications marked as seen',
      data: updatedUser
    });

  } catch (error) {
    console.log(error);
    res
      .status(500)
  }
})

router.post('/mark-notification-as-seen', authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userId });
    const unseenNotifications = user.unseenNotifications;
    user.seenNotifications.push(unseenNotifications[req.body.index]);
    user.unseenNotifications.splice(req.body.index, 1);

    const updatedUser = await user.save();
    updatedUser.password = undefined;

    res.status(200).send({
      success: true,
      message: 'Notification marked as seen',
      data: updatedUser
    });

  } catch (error) {
    console.log(error);
    res
      .status(500)
  }
})

router.post('/delete-all-notifications', authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userId});
    user.seenNotifications = [];

    const updatedUser = await user.save();
    updatedUser.password = undefined;

    res.status(200).send({
      success: true,
      message: 'All notifications deleted',
      data: updatedUser
    });

  } catch (error) {
    console.log(error);
    res
      .status(500)
  }
})

router.post('/delete-notification', authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userId});
    user.seenNotifications.splice(req.body.index, 1);

    const updatedUser = await user.save();
    updatedUser.password = undefined;

    res.status(200).send({
      success: true,
      message: 'Notification deleted',
      data: updatedUser
    });

  } catch (error) {
    console.log(error);
    res
      .status(500)
  }
})

router.get('/get-all-aproved-doctors', authMiddleware, async (req, res) => {
  try {
    const doctors = await Doctor.find({ status: 'aproved' });
    res.status(200).send({
      message: 'Doctors fetched successfully',
      success: true,
      data: doctors
    });
    console.log('Response for aproved doctors sent successfully')
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: 'Error fetching doctors',
      success: false,
      error
    })
  }
})

router.post('/book-appointment', authMiddleware, async (req, res) => {
  try {
    req.body.status = 'pending';
    req.body.date = moment(req.body.date, 'DD-MM-YYYY').toISOString();
    req.body.time = moment(req.body.time, 'HH:mm').toISOString();
    const newAppointment = new Appointment(req.body);
    await newAppointment.save();

    const user = await User.findOne({ _id: req.body.doctorInfo.userId });
    user.unseenNotifications.push({
      type: 'new-appointment-request',
      message: `New appointment request for ${req.body.userInfo.name} on ${dayjs(req.body.date).format('DD-MM-YYYY')} at ${dayjs(req.body.time).format('HH:mm')}`,
      onClickPath: '/doctor/appointments'
    })

    await user.save();

    res.status(200).send({
      message: "Appointment booked successfully",
      success: true,
    })
    
  } catch (error) {
    console.log(error)
    res
      .status(500)
      .send({ message: 'Error booking doctor appointment', success: false, error})
  }
});

router.post('/check-booking-availability', authMiddleware, async (req, res) => {
  try {
    const date = moment(req.body.date, 'DD-MM-YYYY').toISOString();
    const appointmentTime = moment(req.body.time, 'HH:mm').toISOString();
    const fromTime = moment(req.body.time, 'HH:mm').subtract(59, 'minutes').toISOString();
    const toTime = moment(req.body.time, 'HH:mm').add(59, 'minutes').toISOString();
    const doctorId = req.body.doctorId;
    const appointments = await Appointment.find({
      doctorId,
      date,
      time: { $gte: fromTime, $lte: toTime }
    })

    const doctor = await Doctor.findOne({
      _id: doctorId
    })

    const matchesDoctorShift = (appointmentTime >= moment(doctor.timings[0], 'HH:mm').toISOString()) && (appointmentTime <= moment(doctor.timings[1], 'HH:mm').subtract(1, 'hours').toISOString())
    
    const isWeekend = moment(date).day() > 5 || moment(date).day() < 1;

    console.log(moment().format('DD-MM-YYYY'), dayjs(req.body.date).format('DD-MM-YYYY'))

    if (appointments.length > 0) {
      return res.status(200).send({
        message: 'Appointment not available',
        success: false,
      })
    } else if (isWeekend) {
      return res.status(200).send({
        message: 'Appointment must not be on weekends',
        success: false,
      })
    } else if (moment().toISOString() > date) {
      return res.status(200).send({
        message: 'Appointment must be on a future date',
        success: false,
      })
    } else if (moment('DD-MM-YYYY').add(2, 'months').toISOString() > appointmentTime) {
      return res.status(200).send({
        message: "We are not taking appointments for that date",
        success: false,
      })
    } else if (!matchesDoctorShift) {
      return res.status(200).send({
        message: 'Appointment must match Doctor shift',
        success: false,
      })

    } else {
      res.status(200).send({
        message: "Appointments available",
        success: true,
      })
    }


    
  } catch (error) {
    console.log(error)
    res
      .status(500)
      .send({ message: 'Error booking doctor appointment', success: false, error})
  }
});

router.get('/get-appointments-by-user-id', authMiddleware, async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.body.userId });

    res.status(200).send({
      message: 'Appointments fetched successfully',
      success: true,
      data: appointments
    });
    console.log('Response for appointments sent successfully')

  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: 'Error fetching appointments',
      success: false,
      error
    })
  }
})

module.exports = router;