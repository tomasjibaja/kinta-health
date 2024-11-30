// traer el modulo de express
const express = require('express');
// crear la app con el metodo de express()
const app = express();
// hay que usar cors
const cors = require('cors')

// configurar el modulo dotenv
require('dotenv').config()
// traer el config de la DB
const dbConfig = require('./config/dbConfig')

// traer la logica de las peticiones desde el ruteo de los endpoints
const userRoute = require('./routes/userRoute')
const adminRoute = require('./routes/adminRoute')
const doctorsRoute = require('./routes/doctorsRoute')

// declarar el puerto por variable de entorno, 5000 por defecto
const port = process.env.PORT || 5000;

// levantar el server en el puerto y dar aviso
app.listen(port, () => console.log(`Node server started at port ${port}`));

// Aplicar los middleware
app.use(cors())
app.use(cors({
  origin: ['https://kinta-health-backend.vercel.app'],
  methods: ['POST', 'GET'],
  credentials: true
}))
app.use(express.json()) // este parsea lo necesario
app.use('/api/user', userRoute) // este aplica la lógica de userRoute a todo lo que venga de /api/user/
app.use('/api/admin', adminRoute) // este aplica la lógica de adminRoute a todo lo que venga de /api/admin/
app.use('/api/doctor', doctorsRoute) // este aplica la lógica de doctorsRoue a todo lo que venga de /api/doctor/


app.get('/', (req, res) => {
  console.log('GET request received at root')
  res.send('Server is OK')
})

