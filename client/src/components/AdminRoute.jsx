import React from 'react'
import { useSelector } from 'react-redux';
import Error404 from '../pages/Error404';

const AdminRoute = (props) => {

  const { user } = useSelector((state) => state.user);

  if (user?.isAdmin) {
    return props.children
  } else {
    return <Error404/>
  }
}

export default AdminRoute
