import { Outlet } from 'react-router-dom'
import Footer from '../Footer/Footer'
import Navbar from '../Navbar/Navbar'
import LeftSidebar from '../Sidebars/LeftSidebar'
import RightSidebar from '../Sidebars/RightSidebar'
import { useContext } from 'react'
import { AuthContext } from '../../context/Auth/Auth.Context'

export default function Layout() {
  const { token, isLoading } = useContext(AuthContext)

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-white z-[9999] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium animate-pulse">Synchronizing your session...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className={`mx-auto ${token ? "container max-w-7xl flex gap-6" : "w-full"}`}>
        {/* Left Sidebar - Hidden on mobile, visible on lg screens */}
        {token && <LeftSidebar />}

        {/* Main Content Area */}
        <main className={`flex-1 min-w-0 min-h-screen ${token ? "border-x border-gray-100" : "w-full"}`}>
          <Outlet />
        </main>

        {/* Right Sidebar - Hidden on mobile, visible on xl screens */}
        {token && <RightSidebar />}
      </div>
      <Footer />
    </div>
  )
}
