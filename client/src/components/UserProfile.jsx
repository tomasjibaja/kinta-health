import React from 'react'
import { hideLoading, showLoading } from '../redux/alertsSlice'
import { useDispatch, useSelector } from 'react-redux'
import Layout from './Layout';

const UserProfile = () => {
  const { user } = useSelector((state) => state.user);

  return (
    <Layout>
      <h1 className='page-title'>Datos de cuenta</h1>
        <div className='card p-2'>
          <div className="card-header d-flex flex-row justify-content-between align-items-center">
            <h1 className="card-title m-0">{user?.name}</h1>
          </div>
          <hr />
          <span><b>Nombre de usuario:</b> {user?.name}</span>
          <span><b>Correo electrónico:</b> {user?.email}</span>
          <span><b>Rol de usuario:</b> {user?.isAdmin && 'ADMIN' || user?.isDoctor && 'DOCTOR' || 'USER'}</span>
        </div>
    </Layout>
  )
}

export default UserProfile
