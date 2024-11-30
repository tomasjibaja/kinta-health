import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import React from 'react'
import Login from './pages/Login'
import Register from './pages/Register'
import { Toaster } from 'react-hot-toast'
import Home from './pages/Home'
import { useSelector } from 'react-redux'
import ProtectedRoute from './components/ProtectedRoute'
import PublicRoute from './components/PublicRoute'
import ApplyDoctor from './pages/ApplyDoctor'
import Notifications from './pages/Notifications'
import UsersList from './pages/Admin/UsersList'
import DoctorsList from './pages/Admin/DoctorsList'
import Profile from './pages/Doctor/Profile'
import BookAppointment from './pages/BookAppointment'
import Appointments from './pages/Appointments'
import DoctorAppointments from './pages/Doctor/DoctorAppointments'
import Error404 from './pages/Error404'
import AdminRoute from './components/AdminRoute'
import DoctorRoute from './components/DoctorRoute'
import UserProfile from './components/UserProfile'

function App() {
  const { loading } = useSelector( state => state.alerts )
  return (
    <div>
      <BrowserRouter>
      {loading && <div className='spinner-parent'>
        <div className="spinner-border" role="status"></div>
      </div>}
      <Toaster position='top-center' reverseOrder={false} />
        <Routes>

// USER ROUTES
          <Route 
            path='/' 
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } 
          />
          <Route 
            path='/apply-doctor' 
            element={
              <ProtectedRoute>
                <ApplyDoctor />
              </ProtectedRoute>
            } 
          />
          <Route 
            path='/notifications' 
            element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            } 
          />
          <Route 
            path='/book-appointment/:doctorId' 
            element={
              <ProtectedRoute>
                <BookAppointment />
              </ProtectedRoute>
            } 
          />
          <Route 
            path='/appointments' 
            element={
              <ProtectedRoute>
                <Appointments />
              </ProtectedRoute>
            } 
          />
          <Route 
            path='/profile' 
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            } 
          />


// ADMIN ROUTES
          <Route 
            path='/admin/userslist' 
            element={
              <ProtectedRoute>
                <AdminRoute>
                  <UsersList />
                </AdminRoute>
              </ProtectedRoute>
            } 
          />
          <Route 
            path='/admin/doctorslist' 
            element={
              <ProtectedRoute>
                <AdminRoute>
                  <DoctorsList />
                </AdminRoute>
              </ProtectedRoute>
            } 
          />

// DOCTOR ROUTES
          <Route 
            path='/doctor/profile/:userId' 
            element={
              <ProtectedRoute>
                <DoctorRoute>
                  <Profile />
                </DoctorRoute>
              </ProtectedRoute>
            } 
          />
          <Route 
            path='/doctor/appointments' 
            element={
              <ProtectedRoute>
                <DoctorRoute>
                  <DoctorAppointments />
                </DoctorRoute>
              </ProtectedRoute>
            } 
          />

// PUBLIC ROUTES
          <Route 
            path='/*' 
            element={
              <ProtectedRoute>
                <Error404 />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path='/login' 
            element={
              <PublicRoute>
                <Login/>
              </PublicRoute>
            } 
          />
          <Route 
            path='/register' 
            element={
              <PublicRoute>
                <Register/>
              </PublicRoute>
            } 
          />
        </Routes>
      </BrowserRouter>
    </div>

  )
}

export default App
