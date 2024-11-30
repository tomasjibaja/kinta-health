import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Layout from '../components/Layout';
import { showLoading, hideLoading } from '../redux/alertsSlice'
import axios from 'axios'
import { Table } from 'antd'
import { API_URL } from '../constants'
import dayjs from 'dayjs'
import { useMediaQuery } from 'react-responsive'

const weekDays = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab']

const Appointments = () => {

  const [appointments, setAppointments] = useState([]);
  const dispatch = useDispatch()
  const isMobile = useMediaQuery({ query: '(max-width: 768px'})

  const getAppointmentsData = async () => {
    try {
      dispatch(showLoading())
      const response = await axios.get(API_URL + '/api/user/get-appointments-by-user-id', {
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

  useEffect(() => {
    getAppointmentsData();
  }, [])

  const columns = [
    {
      title: 'Id',
      dataIndex: '_id',
      className: 'mobile-hidden-column'
    },
    {
      title: 'Doctor',
      dataIndex: 'name',
      render: (text, record) => (
        <span>{record.doctorInfo.firstName} {record.doctorInfo.lastName}</span>
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
      title: 'Date',
      dataIndex: 'createdAt',
      render: (text, record) => (
        <span className='appointment-date'>{!isMobile && weekDays[dayjs(record.date).day()]} {dayjs(record.date).format('DD-MM-YY')} at {dayjs(record.time).format('HH:mm')} </span>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (text, record) => (
        <span className={record.status === 'aproved' && 'green-frame' || record.status === 'rejected' && 'red-frame' || undefined}>{isMobile ? (record.status[0]) : record.status}</span>
      )
    }
  ]

  const pagination = {
    total: appointments.length,
    pageSize: 8
  }

  return (
    <Layout>
      <h1 className="page-title">Appointments</h1>
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
