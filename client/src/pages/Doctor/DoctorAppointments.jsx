import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Layout from '../../components/Layout';
import { showLoading, hideLoading } from '../../redux/alertsSlice'
import axios from 'axios'
import { Table } from 'antd'
import { toast } from 'react-hot-toast'
import dayjs from 'dayjs'
import { API_URL } from '../../constants'
import { useMediaQuery } from 'react-responsive'

const weekDays = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab']

const Appointments = () => {

  const [appointments, setAppointments] = useState([]);
  const dispatch = useDispatch()
  const isMobile = useMediaQuery({ query: '(max-width: 768px'})

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
    // {
    //   title: 'Id',
    //   dataIndex: '_id',
    //   className: 'mobile-hidden-column'
    // },
    {
      title: (isMobile ? <i class="ri-user-3-line"></i> : 'Patient'),
      dataIndex: 'name',
      render: (text, record) => (
        <span>{record.userInfo.name}</span>
      )
    },
    {
      title: 'Phone',
      dataIndex: 'phoneNumber',
      className: 'mobile-hidden-column',
      render: (text, record) => (
        <span>{record.doctorInfo.phoneNumber}</span>
      )
    },
    {
      title: (isMobile ? <i class="ri-calendar-line mx-2"></i> : 'Date'),
      dataIndex: 'createdAt',
      render: (text, record) => (
        <span className='appointment-date'>{!isMobile && weekDays[dayjs(record.date).day()]} {dayjs(record.date).format('DD-MM-YY')} at {dayjs(record.time).format('HH:mm')} </span>
      )
    },
    {
      title: (isMobile ? <i class="ri-sticky-note-fill"></i> : 'Status'),
      dataIndex: 'status',
      render: (text, record) => (
        <span 
          className={
            (record.status === 'aproved' && 'green-frame' || record.status === 'rejected' && 'red-frame' || undefined) + ' p-2'
          }
        >
          {isMobile
            ? (
              (record.status === 'aproved' && <i class="ri-thumb-up-line"></i>)
              || (record.status === 'rejected' && <i class="ri-thumb-down-line"></i>)
              || (record.status === 'pending' && <i class="ri-progress-2-line"></i>)
            )
            : record.status}
        </span>
      )
    },
    {
      title: (isMobile ? <i class="ri-edit-2-line"></i> : 'Actions'),
      dataIndex: 'actions',
      render: (text, record) => (
        <div className='d-flex'>
          {(record.status === 'pending') &&
            <div className={`d-flex ${isMobile && 'flex-column'}`}>
              <span 
                className={`anchor pointer ${isMobile ? 'my-2' : 'mx-2'} green-frame`}
                onClick={() => changeAppointmentStatus(record, 'aproved')}
              >
                {isMobile ? <i class="ri-check-line"></i> : 'Aprobar'}
              </span>
              <span 
                className={`anchor pointer ${isMobile ? 'my-2' : 'mx-2'} red-frame`}
                onClick={() => changeAppointmentStatus(record, 'rejected')}
              >
                {isMobile ? <i class="ri-close-line"></i> : 'Rechazar'}
              </span>
            </div>}
        </div>
      )
    }
  ]

  const pagination = {
    total: appointments.length,
    pageSize: 8
  }

  return (
    <Layout>
      <h1 className="page-header">Appointments</h1>
      <Table 
        columns={columns} 
        dataSource={appointments} 
        pagination={pagination} 
        rowKey='_id'
        rowClassName = {(record, index) => record.status === 'pending' ? 'yellow-bkg' : undefined}
      />
    </Layout>
  )
}

export default Appointments
