import React, { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import DoctorProfile from '../../components/DoctorProfile'
import { useDispatch, useSelector } from 'react-redux'
import { showLoading, hideLoading } from '../../redux/alertsSlice'
import { toast } from 'react-hot-toast'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import dayjs from 'dayjs'
import { API_URL } from '../../constants'

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.user);
  const params = useParams()
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null)

  const onFinish = async (values) => {
    try {
      dispatch(showLoading())
      const response = await axios.post(API_URL + '/api/doctor/update-doctor-profile', {
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
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error)
      dispatch(hideLoading())
      toast.error('Error al comunicarse con la base de datos')
    }
  }

  const getDoctorData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios
        .post(
          API_URL + '/api/doctor/get-doctor-info-by-user-id',
          {
            userId: params?.userId
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
    }
  }

  useEffect(() => {
    getDoctorData();
  }, [])

  return (
    <Layout>
      <h1 className="page-title">Doctor Profile</h1>
      <hr />

      {doctor && <DoctorProfile onFinish={onFinish} data={doctor} />}
    </Layout>
  )
}

export default Profile
