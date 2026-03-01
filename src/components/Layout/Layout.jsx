import { Outlet } from 'react-router-dom'
import Footer from '../Footer/Footer'
import Navbar from '../Navbar/Navbar'
import LeftSidebar from '../Sidebars/LeftSidebar'
import RightSidebar from '../Sidebars/RightSidebar'

export default function Layout() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="container max-w-7xl mx-auto flex">
        {/* Left Sidebar - Hidden on mobile, visible on lg screens */}
        <LeftSidebar />

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 border-x border-gray-100 min-h-screen">
          <Outlet />
        </main>

        {/* Right Sidebar - Hidden on mobile, visible on xl screens */}
        <RightSidebar />
      </div>
      <Footer />
    </div>
  )
}
