import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Layout from '../../components/Layout';
import { showLoading, hideLoading } from '../../redux/alertsSlice'
import axios from 'axios'
import { Table } from 'antd'
import { toast } from 'react-hot-toast'
import dayjs from 'dayjs';
import { API_URL } from '../../constants'

const DoctorsList = () => {
  const [doctors, setDoctors] = useState([]);
  const dispatch = useDispatch()

  const getDoctorsData = async () => {
    try {
      dispatch(showLoading())
      const response = await axios.get(API_URL + '/api/admin/get-all-doctors', {
        headers: {
          'Authorization': 'Bearer' + ' ' + localStorage.getItem('token')
        }
      })
      dispatch(hideLoading())
      if (response.data.success){
        setDoctors(response.data.data)
      }
    } catch (error) {
      dispatch(hideLoading())
    }
  }

  const changeDoctorStatus = async (record, status) => {
    try {
      dispatch(showLoading())
      const response = await axios.post(
        API_URL + '/api/admin/change-doctor-status', 
        {
          doctorId: record._id,
          status: status,
          userId: record.userId
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
        getDoctorsData();
      }
    } catch (error) {
      toast.error('Error changing doctor status')
      dispatch(hideLoading())
    }
  }

  useEffect(() => {
    getDoctorsData();
  }, [])

  const columns = [
    {
      title: 'Name',
      dataIndex: 'firstName',
      render: (text, record) => (
        <span className="normal-text">{record.firstName} {record.lastName}</span>
      )
    },
    {
      title: 'Phone',
      dataIndex: 'phoneNumber'
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      render: (record, text) => (
        <span>{dayjs(record).format('DD-MM-YYYY / HH:mm')}</span>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status'
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      render: (text, record) => (
        <div className='d-flex'>
          {(record.status === 'pending' || record.status === 'blocked') && <span className='anchor pointer' onClick={() => changeDoctorStatus(record, 'aproved')}>Aprove</span>}
          {record.status === 'aproved' && <span className='anchor pointer' onClick={() => changeDoctorStatus(record, 'blocked')}>Block</span>}
        </div>
      )
    }
  ]

  return (
    <Layout>
      <h1 className="page-header">Doctors List</h1>
      <Table columns={columns} dataSource={doctors} />
    </Layout>
  )
}

export default DoctorsList
