import { useContext } from "react";
import { AuthContext } from './../context/Auth/Auth.Context';
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({children}) {
  const {token} = useContext(AuthContext)
  if(token){
    return children;
  }
  return <Navigate to={'/login'}/>;
}

