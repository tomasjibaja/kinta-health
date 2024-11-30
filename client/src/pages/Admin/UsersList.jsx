import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '../../redux/alertsSlice'
import axios from 'axios';
import dayjs from 'dayjs';
import { Table } from 'antd'
import { API_URL } from '../../constants'
import { useMediaQuery } from 'react-responsive';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const dispatch = useDispatch()
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' })

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
      title: (isMobile ? <i class="ri-user-3-line"></i> : 'Name'),
      dataIndex: 'name'
    },
    {
      title: (isMobile ? <i class="ri-mail-line"></i> : 'Email'),
      dataIndex: 'email',
      render: (text, record) => (
        isMobile 
          ? <a href={`mailto:${record.email}`}><i class="ri-mail-send-fill"></i></a>
          : <span>{record.email}</span>
      )
    },
    {
      title: (isMobile ? <i class="ri-account-box-line mx-2"></i> : 'Created At'),
      dataIndex: 'createdAt',
      render: (record, text) => (
        <span>{dayjs(record).format('DD-MM-YYYY / HH:mm')}</span>
      )
    },
    {
      title: (isMobile ? <i class="ri-edit-2-line"></i> : 'Actions'),
      dataIndex: 'actions',
      render: (text, record) => (
        <div>
          <h1 className='anchor pointer'>{isMobile ? <i class="ri-delete-bin-line red-frame py-2"></i> : 'Eliminar'}</h1>
        </div>
      )
    }
  ]

  return (
    <Layout>
      <h1 className="page-title">Listado de usuarios</h1>
      <Table columns={columns} dataSource={users} rowKey='email' />
    </Layout>
  )
}

export default UsersList
