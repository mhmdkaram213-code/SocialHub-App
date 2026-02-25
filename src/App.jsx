import { RouterProvider } from 'react-router-dom'
import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import Profile from "./pages/Profile/Profile";
import PostDetails from "./pages/PostDetails/PostDetails";
import Notfound from "./pages/Notfound/Notfound";
import Layout from "./components/Layout/Layout";
import { Bounce, ToastContainer } from 'react-toastify';
import ProtectedRoute from './ProtectedRoute/ProtectedRoute';
import AuthRoute from './AuthRoute/AuthRoute';
import AuthProvider from './context/Auth/Auth.Context.Provider';
function App() {
  const routes = createBrowserRouter([
    {
      path: '/', element: <Layout />, children: [
        { index: true, element: <ProtectedRoute><Home /></ProtectedRoute> },
        { path: 'login', element: <AuthRoute><Login /></AuthRoute> },
        { path: 'signup', element: <AuthRoute><Signup /></AuthRoute> },
        { path: 'profile', element: <ProtectedRoute><Profile /></ProtectedRoute> },
        { path: 'post/:id', element: <ProtectedRoute><PostDetails /></ProtectedRoute> },
        { path: '*', element: <Notfound /> },
      ]
    }
  ])
  return (
    <>
      <AuthProvider>
        <RouterProvider router={routes} />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition={Bounce}
        />
      </AuthProvider>
    </>
  )
}
export default App
