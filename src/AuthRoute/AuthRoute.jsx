import React, { useContext } from 'react'
import { AuthContext } from '../context/Auth/Auth.Context';
import { Navigate } from 'react-router-dom';

export default function AuthRoute({children}) {
  const token = useContext(AuthContext)
  if(token){
    return <Navigate to={'/'}/>;
  }
  return children;
}
