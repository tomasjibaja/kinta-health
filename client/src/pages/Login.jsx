import React from 'react'
import { Button, Form, Input } from 'antd'
import './Login.css'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { hideLoading, showLoading } from '../redux/alertsSlice'
import { API_URL } from '../constants'

const Login = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      dispatch(showLoading())
      const response = await axios.post( API_URL + '/api/user/login', values)
      dispatch(hideLoading())
      if (response.data.success) {
        toast.success(response.data.message);

        localStorage.setItem('token', response.data.data)

        navigate('/');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading())
      toast.error('Error al comunicarse con la base de datos')
    }
  }

  return (
    <div className='authentication d-flex justify-content-evenly'>
    <h1 className="title">KINTA HEALTH</h1>
    <img src="./logo.png" alt="kinta-health-mushroom" />
      <div className='authentication-form card p-3'>
        <h1 className='card-title'>¿Qué tal? 👋</h1>
        <Form layout='vertical' onFinish={onFinish}>
          <p className='my-3'>Ingresa tus datos para acceder</p>
          <Form.Item label='Email' name='email'>
            <Input placeholder='juanperez@gmail.com' type='email' />
          </Form.Item>
          <Form.Item label='Contraseña' name='password'>
            <Input placeholder='123456' type='password' />
          </Form.Item>
          <div className="d-flex flex-column">
            <Button className='primary-button my-2' htmlType='submit'>ACCEDER</Button>
            <Link className='anchor' to='/register'>CREAR UNA CUENTA</Link>
          </div>

        </Form>
      </div>
    </div>
  )
}

export default Login
