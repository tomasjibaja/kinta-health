import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Layout from '../../components/Layout';
import { showLoading, hideLoading } from '../../redux/alertsSlice'
import axios from 'axios'
import { Table } from 'antd'
import { toast } from 'react-hot-toast'
import dayjs from 'dayjs';
import { API_URL } from '../../constants'
import { useMediaQuery } from 'react-responsive';

const DoctorsList = () => {
  const [doctors, setDoctors] = useState([]);
  const dispatch = useDispatch()
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' })
  const [showPhone, setShowPhone] = useState(false)

  const getDoctorsData = async () => {
    try {
      dispatch(showLoading())
      const response = await axios.get(API_URL + '/api/admin/get-all-doctors', {
        headers: {
          'Authorization': 'Bearer' + ' ' + localStorage.getItem('token')
        }
      })
      dispatch(hideLoading())
      if (response.data.success){
        setDoctors(response.data.data)
      }
    } catch (error) {
      dispatch(hideLoading())
    }
  }

  const changeDoctorStatus = async (record, status) => {
    try {
      dispatch(showLoading())
      const response = await axios.post(
        API_URL + '/api/admin/change-doctor-status', 
        {
          doctorId: record._id,
          status: status,
          userId: record.userId
        }, 
        {
          headers: {
            'Authorization': 'Bearer' + ' ' + localStorage.getItem('token')
          }
        }
      )
      dispatch(hideLoading())
      if (response.data.success){
        toast.success(response.data.message)
        getDoctorsData();
      }
    } catch (error) {
      toast.error('Error changing doctor status')
      dispatch(hideLoading())
    }
  }

  useEffect(() => {
    getDoctorsData();
  }, [])

  const columns = [
    {
      title: isMobile ? <i class="ri-user-3-line"></i> : "Name",
      dataIndex: "firstName",
      render: (text, record) => (
        <span className="normal-text">
          {record.firstName} {record.lastName}
        </span>
      ),
    },
    {
      title: isMobile ? <i class="ri-phone-line"></i> : "Phone",
      dataIndex: "phoneNumber",
      render: (record, text) => (
        isMobile
          ? <a className='text-decoration-none orange-frame py-2' href={`tel:${record}`}>
              <i class="ri-phone-fill"></i>
            </a>
          : record
      )
    },
    {
      title: isMobile ? <i class="ri-account-box-line mx-2"></i> : "Created At",
      dataIndex: "createdAt",
      render: (record, text) => (
        <span>{dayjs(record).format("DD-MM-YYYY / HH:mm")}</span>
      ),
    },
    {
      title: isMobile ? <i class="ri-sticky-note-fill"></i> : "Status",
      dataIndex: "status",
      render: (text, record) => (
        <span
          className={
            ((record.status === "aproved" && "green-frame") ||
              (record.status === "blocked" && "red-frame") ||
              undefined) + " p-2"
          }
        >
          {isMobile
            ? (record.status === "aproved" && (
                <i class="ri-bookmark-line"></i>
              )) ||
              (record.status === "blocked" && <i class="ri-spam-3-line"></i>) ||
              (record.status === "pending" && (
                <i class="ri-progress-2-line"></i>
              ))
            : record.status}
        </span>
      ),
    },
    {
      title: isMobile ? <i class="ri-edit-2-line"></i> : "Actions",
      dataIndex: "actions",
      render: (text, record) => (
        <div className="d-flex">
          {(record.status === "pending" || record.status === "blocked") && (
            <span
              className="anchor pointer green-frame"
              onClick={() => changeDoctorStatus(record, "aproved")}
            >
              {isMobile ? (
                <i class="ri-thumb-up-line py-2"></i>
              ) : (
                "Aprobar"
              )}
            </span>
          )}
          {record.status === "aproved" && (
            <span
              className="anchor pointer red-frame"
              onClick={() => changeDoctorStatus(record, "blocked")}
            >
              {isMobile ? (
                <i class="ri-thumb-down-line py-2"></i>
              ) : (
                "Rechazar"
              )}
            </span>
          )}
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <h1 className="page-title">Listado de profesionales</h1>
      <Table columns={columns} dataSource={doctors} />
    </Layout>
  )
}

export default DoctorsList
