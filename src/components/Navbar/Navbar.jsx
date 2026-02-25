import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, NavLink } from "react-router-dom";
import { fas } from "@fortawesome/free-solid-svg-icons";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md px-3 py-4 text-lg">
      <div className="container max-w-7xl mx-auto flex items-center justify-between">
        <div className="left-side flex items-center gap-8">
          <h1 className="text-2xl space-x-1">
            <Link to="/" >
              <FontAwesomeIcon icon={fas.faShareNodes} className="text-blue-500" />
              <span className="font-bold text-black">Social App</span>
            </Link>
          </h1>
          <ul className="hidden md:flex items-center gap-5">
            <li>
              <NavLink to="/" className={({ isActive }) => `${isActive && "text-blue-500"} space-x-2 hover:text-blue-500 transition-colors duration-200`} >
                <FontAwesomeIcon icon={fas.faHouse} />
                <span>Home</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/explore" className={({ isActive }) => `${isActive && "text-blue-500"} space-x-2 hover:text-blue-500 transition-colors duration-200`} >
                <FontAwesomeIcon icon={fas.faMagnifyingGlass} />
                <span>Explore</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/communities" className={({ isActive }) => `${isActive && "text-blue-500"} space-x-2 hover:text-blue-500 transition-colors duration-200`} >
                <FontAwesomeIcon icon={fas.faUsers} />
                <span>Communities</span>
              </NavLink>
            </li>
          </ul>
        </div>
        <div className="right-side hidden md:flex items-center gap-5">
          <div className="search-input relative hidden xl:block">
            <FontAwesomeIcon icon={fas.faMagnifyingGlass} className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400" />
            <input className="border-2 border-transparent transition-colors duration-200 focus:border-blue-500 focus:outline-none bg-gray-200 px-4 py-1 rounded-full pl-11 min-w-72" type="search" placeholder="Search posts,people,topics..." />
          </div>
          <div className="icons space-x-4 text-xl">
            <button className="notifications-btn relative cursor-pointer before:w-2 before:h-2 before:bg-red-500 before:rounded-full before:absolute before:top-0 before:right-0 before:translate-x-1/3 before:-translate-y-1/2">
              <FontAwesomeIcon icon={fas.faBell} />
            </button>
            <button className="messages-btn relative cursor-pointer before:w-2 before:h-2 before:bg-red-500 before:rounded-full before:absolute before:top-0 before:right-0 before:translate-x-1/3 before:-translate-y-1/2">
              <FontAwesomeIcon icon={fas.faMessage} />
            </button>
            <button className="px-3 py-1.5 bg-blue-500 text-white rounded-full cursor-pointer space-x-1 hover:bg-blue-600 transition-colors duration-200">
              <FontAwesomeIcon icon={fas.faPlus} />
              <span>
                Create Post
              </span>
            </button>
          </div>
        </div>
        <button className="md:hidden text-2xl  cursor-pointer">
          <FontAwesomeIcon icon={fas.faBars} />
        </button>
      </div>
    </nav>
  )
}
