import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '../../redux/alertsSlice'
import axios from 'axios';
import dayjs from 'dayjs';
import { Table } from 'antd'
import { API_URL } from '../../constants'

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const dispatch = useDispatch()

  const getUsersData = async () => {
    try {
      dispatch(showLoading())
      const response = await axios.get( API_URL + '/api/admin/get-all-users', {
        headers: {
          'Authorization': 'Bearer' + ' ' + localStorage.getItem('token')
        }
      })
      dispatch(hideLoading())
      if (response.data.success){
        setUsers(response.data.data)
      }
    } catch (error) {
      dispatch(hideLoading())
    }
  }

  useEffect(() => {
    getUsersData();
  }, [])

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name'
    },
    {
      title: 'Email',
      dataIndex: 'email'
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      render: (record, text) => (
        <span>{dayjs(record).format('DD-MM-YYYY / HH:mm')}</span>
      )
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      render: (text, record) => (
        <div className='d-flex'>
          <h1 className='anchor pointer'>Block</h1>
        </div>
      )
    }
  ]

  return (
    <Layout>
      <h1 className="page-header">Users List</h1>
      <Table columns={columns} dataSource={users} rowKey='email' />
    </Layout>
  )
}

export default UsersList
