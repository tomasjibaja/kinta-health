// traer mongoose
const mongoose = require('mongoose')
// hacer la conexión y asignar el resultado a una variable
const connect = mongoose.connect(process.env.MONGO_URL)

// crear el puntero a la conexión
const connection = mongoose.connection;

// acción a ejecutar si sucede el evento 'connected'
connection.on('connected', () => {
  console.log('MongoDB is connected')
})

// acción a ejecutar si sucede el evento 'error'
connection.on('error', (error) => {
  console.log('Error while making MongoDB connection', error)
})

// exportar mongoose
module.exports = mongoose;