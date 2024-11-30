import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import '../layout.css'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from '../redux/userSlice'
import { Badge } from 'antd'
import '../../node_modules/remixicon/fonts/remixicon.css'
import { useMediaQuery } from 'react-responsive'

const Layout = ({children}) => {

  const isMobile = useMediaQuery({ query: '(max-width: 768px)'})
  const [collapsed, setCollapsed] = useState(isMobile);
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const location = useLocation();
  const dispatch = useDispatch();

  const userMenu = [
    {
      name: 'Cartilla',
      path: '/',
      icon: 'ri-home-line'
    },
    {
      name: 'Turnos',
      path: '/appointments',
      icon: 'ri-file-list-line'
    },
    {
      name: 'Aplicar para doctor',
      path: '/apply-doctor',
      icon: 'ri-check-double-line'
    },
    {
      name: 'Cuenta',
      path: '/profile',
      icon: 'ri-user-line'
    }
  ]

  const doctorMenu = [
    {
      name: 'Notificaciones',
      path: '/',
      icon: 'ri-home-line'
    },
    {
      name: 'Turnos',
      path: '/doctor/appointments',
      icon: 'ri-file-list-line'
    },
    {
      name: 'Perfil',
      path: `/doctor/profile/${user?._id}`,
      icon: 'ri-user-line'
    }
  ]

  const adminMenu = [
    {
      name: 'Notificaciones',
      path: '/',
      icon: 'ri-home-line'
    },
    {
      name: 'Usuarios',
      path: '/admin/userslist',
      icon: 'ri-user-line'
    },
    {
      name: 'Doctores',
      path: '/admin/doctorslist',
      icon: 'ri-team-line'
    },
    {
      name: 'Perfil',
      path: '/profile',
      icon: 'ri-profile-line'
    }
  ]

  const menuToBeRendered = user?.isAdmin ? adminMenu : (user?.isDoctor? doctorMenu : userMenu);

  return (
    <div className='main'>
      <div className='d-flex layout'>
        <div className={`sidebar ${collapsed && 'collapsed-sidebar'}`}>
          <div className='sidebar-header'>
            <div className="logo-wrapper d-flex flex-row align-items-center justify-content-between">
              <h1 className='logo'>KH</h1>
              <img className='mushroom px-2' src="./logo.png" alt="kinta-health-logo" />
            </div>
            <h4 className='user-role'>{user?.isAdmin && 'admin' || user?.isDoctor && 'doctor' || 'user'}</h4>
          </div>
          <div className="menu">
            {menuToBeRendered.map((menu, index) => {
              const isActive = location.pathname === menu.path

              return <div key={index} className={`d-flex menu-item ${isActive && 'active-menu-item'}`}>
                <i className={menu.icon}></i>
                {!collapsed && <Link to={menu.path}>{menu.name}</Link>}
              </div>
            })}
            <div className='d-flex menu-item' onClick={() => {
              localStorage.clear('token')
              dispatch(setUser(null))
              navigate('/login')
            }}>
              <i className='ri-logout-circle-line'></i>
              {!collapsed && <Link to='/login'>Logout</Link>}
            </div>
          </div>
        </div>
        <div className='content'>
          <div className='header'>
            <i className={
              `${!collapsed ? 'ri-menu-fold-line': 'ri-menu-unfold-line'} header-action-icon`}
              onClick={() => setCollapsed(!collapsed)}>
            </i>
            <div className={`d-flex align-items-center px-2 header-links`}>
              <Badge count={user?.unseenNotifications.length} onClick={() => navigate('/notifications')}>
                <i className="ri-notification-line header-action-icon bell px-3"></i>
              </Badge>
              <Link className='anchor' to='/profile'>{user?.name}</Link>
            </div>
          </div>
          <div className='body'>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Layout
