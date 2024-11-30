import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout';
import Handbook from '../components/Handbook';
import Notifications from './Notifications'
import { useDispatch, useSelector } from 'react-redux'
import { showLoading, hideLoading } from '../redux/alertsSlice'
import { API_URL } from '../constants'
import { Navigate } from 'react-router-dom';

const Home = () => {

  const { user } = useSelector((state) => state.user)

  return (
    <Layout>
      {(!user?.isAdmin && !user?.isDoctor) ? <Handbook /> : <Navigate to={'/notifications'} />}
    </Layout>
  )
}

export default Home
