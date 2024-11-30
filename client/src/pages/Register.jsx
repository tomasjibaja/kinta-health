import React from 'react'
import { Button, Form, Input } from 'antd'
import './Register.css'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { showLoading, hideLoading } from '../redux/alertsSlice'
import { API_URL } from '../constants'

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onFinish = async (values) => {
      try {
        dispatch(showLoading())
        const response = await axios.post(API_URL + '/api/user/register', values)
        dispatch(hideLoading())
        if (response.data.success) {
          toast.success(response.data.message);
          navigate('/login');
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        dispatch(hideLoading())
        toast.error('Error al comunicarse con la base de datos')
      }
  }

  return (
    <div className='authentication'>
      <div className='authentication-form card p-3'>

        <h1 className='card-title'>Gusto en conocerte 😉</h1>

        <Form layout='vertical' onFinish={onFinish}>
          <Form.Item label='Nombre' name='name'>
            <Input placeholder='Juan Pérez' />
          </Form.Item>
          <Form.Item label='Email' name='email'>
            <Input placeholder='juanperez@gmail.com' />
          </Form.Item>
          <Form.Item label='Contraseña' name='password'>
            <Input placeholder='123456' type='password' />
          </Form.Item>

          <div className="d-flex flex-column">
            <Button className='primary-button my-2' htmlType='submit'>CREAR CUENTA</Button>
            <Link className='anchor' to='/login'>YA TENGO UNA CUENTA</Link>
          </div>

        </Form>
      </div>
    </div>
  )
}

export default Register
