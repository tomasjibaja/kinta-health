import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Layout from '../components/Layout';
import { Row, Col } from 'antd';
import Doctor from '../components/Doctor';
import { useDispatch } from 'react-redux'
import { showLoading, hideLoading } from '../redux/alertsSlice'
import { API_URL } from '../constants'

const Home = () => {
  const [doctors, setDoctors] = useState([])
  const dispatch = useDispatch();


  const getData = async () => {
    try {
      dispatch(showLoading())
      const response = await axios.get(API_URL + '/api/user/get-all-aproved-doctors',
        {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token')
          }
        });
      dispatch(hideLoading())
      if (response.data.success) {
        setDoctors(response.data.data);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error)
    }
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <Layout>
      <Row gutter={20}>
        {
          doctors.map((doctor, index) => (
            <Col span={8} xs={24} sm={24} lg={8} key={index} >
              <Doctor doctor={doctor} />
            </Col>
          ))
        }
      </Row>
    </Layout>
  )
}

export default Home
