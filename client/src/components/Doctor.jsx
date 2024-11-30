import React from 'react'
import { useNavigate } from 'react-router-dom'

const Doctor = ({ doctor }) => {
  const navigate = useNavigate();

  return (
    <div className='card p-2 pointer' onClick={() => navigate(`/book-appointment/${doctor?._id}`)}>
      <div className="card-header d-flex flex-row justify-content-between align-items-center">
        <h1 className="card-title m-0">{doctor?.firstName} {doctor?.lastName}</h1>
        <div className="doctor-rating d-flex align-items-center">
          <i class="ri-star-line rating-star"></i>
          <span className="rating-number">{doctor?.rating}</span>
        </div>
      </div>
      <hr />
      <p className="card-text"><b>Especialidad: </b>{doctor?.specialization}</p>
      <p className="card-text"><b>Teléfono: </b>{doctor?.phoneNumber}</p>
      <p className="card-text"><b>Domicilio: </b>{doctor?.address}</p>
      <p className="card-text"><b>Valor de consulta:</b> ${doctor?.feePerConsultation}.-</p>
      <p className="card-text"><b>Horario:</b> {doctor?.timings[0]} a {doctor?.timings[1]}</p>
    </div>
  )
}

export default Doctor