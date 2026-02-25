import { Outlet } from 'react-router-dom'
import Footer from '../Footer/Footer'
import Navbar from '../Navbar/Navbar'

export default function Layout() {
  return (
    <>
    <Navbar/>
    <main className='min-h-screen'>
      <Outlet/>
    </main>
    <Footer/>
    </>
  )
}
