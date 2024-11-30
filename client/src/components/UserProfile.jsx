import React from 'react'
import { hideLoading, showLoading } from '../redux/alertsSlice'
import { useDispatch, useSelector } from 'react-redux'
import Layout from './Layout';

const UserProfile = () => {
  const { user } = useSelector((state) => state.user);

  return (
    <Layout>
      <h1 className='page-title'>User Profile</h1>
        <div className='card p-4'>
          <span><b>Nombre:</b> {user?.name}</span>
          <span><b>Correo electrónico:</b> {user?.email}</span>
          <span><b>Rol de usuario:</b> {user?.isAdmin && 'ADMIN' || user?.isDoctor && 'DOCTOR' || 'USER'}</span>
        </div>
    </Layout>
  )
}

export default UserProfile
