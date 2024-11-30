import React from 'react'
import Layout from '../components/Layout'
import { useDispatch, useSelector } from 'react-redux'
import { showLoading, hideLoading } from '../redux/alertsSlice'
import { toast } from 'react-hot-toast'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import DoctorForm from '../components/DoctorForm'
import { API_URL } from '../constants'
import dayjs from 'dayjs'

const ApplyDoctor = () => {

  const dispatch = useDispatch();
  const { user } = useSelector(state => state.user);
  const navigate = useNavigate();
  
  const onFinish = async (values) => {
    console.log(dayjs(values?.timings[0]).format('HH:mm'))
    try {
      dispatch(showLoading())
      const response = await axios.post(API_URL + '/api/user/apply-doctor-account', {
        ...values,
        userId : user._id,
        timings: [
          dayjs(values?.timings[0]).format('HH:mm'),
          dayjs(values?.timings[1]).format('HH:mm')
        ]
      } , {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      dispatch(hideLoading())
      if (response.data.success) {
        toast.success(response.data.message);
        navigate('/');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error)
      dispatch(hideLoading())
      toast.error('Error al comunicarse con la base de datos')
    }
  }

  return (
    <Layout>
      <h1 className='page-title'>Aplicar para doctor</h1>
      <hr />

      <DoctorForm onFinish={onFinish} />

    </Layout>
  )
}

export default ApplyDoctor
