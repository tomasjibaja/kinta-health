import React from 'react'
import { Button } from 'antd'
import Layout from '../components/Layout'
import { useNavigate } from 'react-router-dom'

const Error404 = () => {

  const navigate = useNavigate()

  return (
    <Layout>
      <div className='d-flex flex-column align-items-center m-4'>
        <h1 className='page-title mt-4'>ERROR 404</h1>
        <h2 className='normal-text my-4'>Parece que la página que buscas no existe</h2>
        <Button className='primary-button my-4' onClick={() => navigate(-1)}>Volver</Button>
      </div>
    </Layout>
  )
}

export default Error404
