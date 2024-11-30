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
      <h1 className="page-title">Notificaciones</h1>

      <Tabs>
        <Tabs.Pane tab="Nuevas" key="unseen">
          {user?.unseenNotifications.map((elem, index) => {
            return (
              <div
                className="card p-2 m-2 mt-2 d-flex flex-row justify-content-between align-items-center"
                key={index}
              >
                <div
                  className="card-text pointer px-2"
                  onClick={() => navigate(elem.onClickPath)}
                >
                  {elem.message}
                </div>
                <i
                  className="ri-check-double-line normal-text px-2 pointer notification-action"
                  onClick={() => markAsSeen(index)}
                ></i>
              </div>
            );
          })}
          <div className="d-flex justify-content-end">
            <h1 className="anchor pointer p-2" onClick={() => markAllAsSeen()}>
              Marcar como vistas
            </h1>
          </div>
        </Tabs.Pane>
        <Tabs.Pane tab="Vistas" key="seen">
          {user?.seenNotifications.map((elem, index) => {
            return (
              <div
                className="card p-2 m-2 mt-2 d-flex flex-row justify-content-between align-items-center"
                key={index}
              >
                <div
                  className="card-text pointer px-2"
                  onClick={() => navigate(elem.onClickPath)}
                >
                  {elem.message}
                </div>
                <i
                  className="ri-delete-bin-line normal-text px-2 pointer notification-action"
                  onClick={() => deleteNotification(index)}
                ></i>
              </div>
            );
          })}
          <div className="d-flex justify-content-end">
            <h1 className="anchor pointer p-2" onClick={() => deleteAll()}>
              Eliminar todas
            </h1>
          </div>
        </Tabs.Pane>
      </Tabs>
    </Layout>
  );
}

export default Notifications
