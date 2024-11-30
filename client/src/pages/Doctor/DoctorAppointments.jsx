import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Layout from '../../components/Layout';
import { showLoading, hideLoading } from '../../redux/alertsSlice'
import axios from 'axios'
import { Table } from 'antd'
import { toast } from 'react-hot-toast'
import dayjs from 'dayjs'
import { API_URL } from '../../constants'

const weekDays = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab']

const Appointments = () => {

  const [appointments, setAppointments] = useState([]);
  const dispatch = useDispatch()

  const getAppointmentsData = async () => {
    try {
      dispatch(showLoading())
      const response = await axios.get(API_URL + '/api/doctor/get-appointments-by-doctor-id', {
        headers: {
          'Authorization': 'Bearer' + ' ' + localStorage.getItem('token')
        }
      })
      dispatch(hideLoading())
      if (response.data.success){
        setAppointments(response.data.data)
      }
    } catch (error) {
      dispatch(hideLoading())
    }
  }

  const changeAppointmentStatus = async (record, status) => {
    try {
      dispatch(showLoading())
      const response = await axios.post(
        API_URL + '/api/doctor/change-appointment-status', 
        {
          appointmentId: record._id,
          status: status
        }, 
        {
          headers: {
            'Authorization': 'Bearer' + ' ' + localStorage.getItem('token')
          }
        }
      )
      dispatch(hideLoading())
      if (response.data.success){
        toast.success(response.data.message)
        getAppointmentsData();
      }
    } catch (error) {
      toast.error('Error changing appointment status')
      dispatch(hideLoading())
    }
  }

  useEffect(() => {
    getAppointmentsData();
  }, [])

  const columns = [
    {
      title: 'Id',
      dataIndex: '_id'
    },
    {
      title: 'Patient',
      dataIndex: 'name',
      render: (text, record) => (
        <span>{record.userInfo.name}</span>
      )
    },
    {
      title: 'Phone',
      dataIndex: 'phoneNumber',
      render: (text, record) => (
        <span>{record.doctorInfo.phoneNumber}</span>
      )
    },
    {
      title: 'Date and time',
      dataIndex: 'createdAt',
      render: (text, record) => (
        <span>{weekDays[dayjs(record.date).day()]} {dayjs(record.date).format('DD-MM-YYYY')} at {dayjs(record.time).format('HH:mm')} </span>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (text, record) => (
        <span className={record.status === 'aproved' && 'green-frame' || record.status === 'rejected' && 'red-frame'}>{record.status}</span>
      )
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      render: (text, record) => (
        <div className='d-flex'>
          {(record.status === 'pending') &&
            <div className='d-flex'>
              <span className='anchor pointer mx-2 green-frame' onClick={() => changeAppointmentStatus(record, 'aproved')}>Aprove</span>
              <span className='anchor pointer mx-2 red-frame' onClick={() => changeAppointmentStatus(record, 'rejected')}>Reject</span>
            </div>}
        </div>
      )
    }
  ]

  return (
    <Layout>
      <h1 className="page-header">Appointments</h1>
      <Table columns={columns} dataSource={appointments} rowKey='_id' />
    </Layout>
  )
}

export default Appointments
