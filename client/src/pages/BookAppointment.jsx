import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Layout from '../components/Layout'
import axios from 'axios'
import { hideLoading, showLoading } from '../redux/alertsSlice'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Col, DatePicker, Row, Table, TimePicker } from 'antd'
import { API_URL } from '../constants'
import dayjs from 'dayjs'
import toast from 'react-hot-toast'

const BookAppointment = () => {
  const [isAvailable, setIsAvailable] = useState(false)
  const [date, setDate] = useState()
  const [time, setTime] = useState()
  const { user } = useSelector((state) => state.user)
  const params = useParams()
  const [doctor, setDoctor] = useState(null)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const getDoctorData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios
        .post(
          'http://localhost:5000/api/doctor/get-doctor-info-by-id',
          {
            doctorId: params.doctorId
          },
          {
            headers: {
              Authorization : `Bearer ${localStorage.getItem('token')}`
            }
          });
        dispatch(hideLoading());
        if (response.data.success) {
          setDoctor(response.data.data)
        }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error)
    }
  }

  const bookNow = async () => {
    setIsAvailable(false)
    try {
      dispatch(showLoading());
      const response = await axios
        .post(
          API_URL + '/api/user/book-appointment',
          {
            doctorId: params.doctorId,
            userId: user._id,
            doctorInfo: doctor,
            userInfo: user,
            date: date,
            time: time
          },
          {
            headers: {
              Authorization : `Bearer ${localStorage.getItem('token')}`
            }
          });
        dispatch(hideLoading());
        if (response.data.success) {
          toast.success(response.data.message);
          navigate('/appointments')
        }
    } catch (error) {
      dispatch(hideLoading());
      toast.error(response.data.message)
    }
  }

  const checkAvailability = async () => {
    try {
      dispatch(showLoading())
      const response = await axios.post(
        API_URL + '/api/user/check-booking-availability',
        {
          doctorId: params.doctorId,
          date: date,
          time: time
        },
        {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token')
          }
        }
      )

      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        setIsAvailable(true)
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('Error checking availability');
      dispatch(hideLoading());
    }
  }

  useEffect(() => {
    getDoctorData();
  }, [])



  return (
    <Layout>
      <h1 className="page-title">
        {doctor?.firstName} {doctor?.lastName}
      </h1>
      <hr />
      <h1 className="normal-text">
        <b>Horario de atención: </b>
        {doctor?.timings[0]} a {doctor?.timings[1]}
      </h1>
      <h2 className="normal-text">
        <b>Domicilio: </b>
        {doctor?.address}
      </h2>
      <h2 className="normal-text">
        <b>Valor de consulta: </b>
        ${doctor?.feePerConsultation}.-
      </h2>

      <Row>
        <Col span={12} sm={24} xs={24} lg={8}>
          <div className="d-flex flex-column pt-2">
            <DatePicker
              placeholder='Seleccione fecha'
              format="DD-MM-YYYY"
              onChange={(value) => {
                setIsAvailable(false)
                setDate(dayjs(value).format("DD-MM-YYYY"))
              }}
            />
            <TimePicker
              placeholder='Seleccione horario'
              format="HH:mm"
              className="mt-3"
              onChange={(value) => {
                setIsAvailable(false)
                setTime(dayjs(value).format("HH:mm"));
              }}
            />
      <h2 className='small-text my-2'>los turnos tienen una duración de 1 (una) hora</h2>
            <Button className="primary-button full-width mt-3" onClick={checkAvailability}>Comprobar disponibilidad</Button>
            {isAvailable && <Button className="primary-button full-width mt-3" onClick={bookNow}>Agendar turno</Button>}
          </div>
        </Col>
      </Row>
    </Layout>
  );
}

export default BookAppointment
