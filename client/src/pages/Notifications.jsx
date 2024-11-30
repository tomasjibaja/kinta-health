import React from 'react'
import Layout from '../components/Layout'
import { useDispatch, useSelector } from 'react-redux'
import { Tabs } from 'antd'
import { useNavigate } from 'react-router-dom'
import { showLoading, hideLoading } from '../redux/alertsSlice'
import { setUser } from '../redux/userSlice'
import axios from 'axios'
import toast from 'react-hot-toast'
import { API_URL } from '../constants'

const Notifications = () => {

  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const markAllAsSeen = async () => {
    try {
      dispatch(showLoading())
      const response = await axios.post(
        API_URL + '/api/user/mark-all-notifications-as-seen', 
        {userId : user._id},
        {
          headers: {
            Authorization: 'Bearer' + ' ' + localStorage.getItem('token')
          }
        }

      )
      dispatch(hideLoading())
      if (response.data.success) {
        toast.success(response.data.message);
        dispatch(setUser(response.data.data));
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error)
      dispatch(hideLoading())
      toast.error('Error al comunicarse con la base de datos')
    }
  }

  const markAsSeen = async (index) => {
    try {
      dispatch(showLoading())
      const response = await axios.post(
        API_URL + '/api/user/mark-notification-as-seen', 
        {
          userId : user._id,
          index: index
        },
        {
          headers: {
            Authorization: 'Bearer' + ' ' + localStorage.getItem('token')
          }
        }

      )
      dispatch(hideLoading())
      if (response.data.success) {
        toast.success(response.data.message);
        dispatch(setUser(response.data.data));
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error)
      dispatch(hideLoading())
      toast.error('Error al comunicarse con la base de datos')
    }
  }

  const deleteAll = async () => {
    try {
      dispatch(showLoading())
      const response = await axios.post(
        API_URL + '/api/user/delete-all-notifications', 
        {userId : user._id},
        {
          headers: {
            Authorization: 'Bearer' + ' ' + localStorage.getItem('token')
          }
        }

      )
      dispatch(hideLoading())
      if (response.data.success) {
        toast.success(response.data.message);
        dispatch(setUser(response.data.data));
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error)
      dispatch(hideLoading())
      toast.error('Error al comunicarse con la base de datos')
    }
  }  

  const deleteNotification = async (index) => {
    try {
      dispatch(showLoading())
      const response = await axios.post(
        API_URL + '/api/user/delete-notification', 
        {
          userId : user._id,
          index: index
        },
        {
          headers: {
            Authorization: 'Bearer' + ' ' + localStorage.getItem('token')
          }
        }

      )
      dispatch(hideLoading())
      if (response.data.success) {
        toast.success(response.data.message);
        dispatch(setUser(response.data.data));
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error)
      dispatch(hideLoading())
      toast.error('Error al comunicarse con la base de datos')
    }
  }

  return (
    <Layout>
      <h1 className="page-title">Notifications</h1>

      <Tabs>
        <Tabs.Pane tab='Unseen' key='unseen'>
          <div className="d-flex justify-content-end">
            <h1 className="anchor pointer" onClick={() => markAllAsSeen()}>Mark all as seen</h1>
          </div>
          {user?.unseenNotifications.map((elem, index) => {
            return (
              <div className="card p-2 m-2 mt-2 d-flex flex-row justify-content-between" key={index}>
                <div className="card-text pointer" onClick={() => navigate(elem.onClickPath)}>{elem.message}</div>
                <i className='ri-checkbox-circle-fill normal-text px-2 pointer' onClick={() => markAsSeen(index)}></i>
              </div>
            )
          })}
        </Tabs.Pane>
        <Tabs.Pane tab='Seen' key='seen'>
          <div className="d-flex justify-content-end">
            <h1 className="anchor pointer" onClick={() => deleteAll()}>Delete all</h1>
          </div>
          {user?.seenNotifications.map((elem, index) => {
            return (
              <div className="card p-2 m-2 mt-2 d-flex flex-row justify-content-between" key={index}>
                <div className="card-text" onClick={() => navigate(elem.onClickPath)}>{elem.message}</div>
                <i className='ri-delete-bin-line normal-text px-2 pointer' onClick={() => deleteNotification(index)}></i>
              </div>
            )
          })}
        </Tabs.Pane>
      </Tabs>
    </Layout>
  )
}

export default Notifications
