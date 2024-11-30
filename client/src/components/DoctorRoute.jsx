import React from 'react'
import { useSelector } from 'react-redux';
import Error404 from '../pages/Error404';

const DoctorRoute = (props) => {

  const { user } = useSelector((state) => state.user);

  if (user?.isDoctor) {
    return props.children
  } else {
    return <Error404/>
  }
}

export default DoctorRoute
