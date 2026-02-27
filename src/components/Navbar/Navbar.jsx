import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { useContext } from "react";
import { AuthContext } from "../../context/Auth/Auth.Context";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@heroui/react";
import userImage from '../../assets/images/user.jpg';

export default function Navbar() {
  const { token, user, setToken, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const isLoggedIn = !!token;

  const handleLogout = () => {
    // Remove token and user from context and localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    // Redirect to login page
    navigate('/login');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

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
          <div className="icons space-x-4 text-xl flex items-center">
            <button className="notifications-btn relative cursor-pointer before:w-2 before:h-2 before:bg-red-500 before:rounded-full before:absolute before:top-0 before:right-0 before:translate-x-1/3 before:-translate-y-1/2">
              <FontAwesomeIcon icon={fas.faBell} />
            </button>
            <button className="messages-btn relative cursor-pointer before:w-2 before:h-2 before:bg-red-500 before:rounded-full before:absolute before:top-0 before:right-0 before:translate-x-1/3 before:-translate-y-1/2">
              <FontAwesomeIcon icon={fas.faMessage} />
            </button>

            {/* Conditional rendering: Login/Register or Profile Dropdown */}
            {!isLoggedIn ? (
              // Not logged in - show Login and Register buttons
              <div className="flex gap-3">
                <Button
                  color="default"
                  variant="bordered"
                  onClick={() => navigate('/login')}
                  className="border-blue-500 text-blue-500 hover:bg-blue-50"
                >
                  Login
                </Button>
                <Button
                  color="primary"
                  onClick={() => navigate('/signup')}
                  className="bg-blue-500 text-white hover:bg-blue-600"
                >
                  Register
                </Button>
              </div>
            ) : (
              // Logged in - show Profile picture with dropdown
              <Dropdown className="w-52" classNames={{
                base: "rounded-lg",
                content: "rounded-lg bg-white shadow-lg border border-gray-100"
              }}>
                <DropdownTrigger>
                  <Button
                    isIconOnly
                    variant="light"
                    className="rounded-full p-0 h-12 w-12 overflow-hidden cursor-pointer border-2 border-blue-300 hover:border-blue-500 transition-colors duration-200"
                  >
                    <img
                      src={user?.photo || userImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = userImage;
                      }}
                    />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu 
                  aria-label="Profile Actions"
                  classNames={{
                    base: "rounded-lg",
                    list: "gap-0 p-1"
                  }}
                >
                  <DropdownItem
                    key="profile"
                    textValue="Profile"
                    onClick={handleProfileClick}
                    className="px-4 py-3 rounded-md hover:bg-gray-100 transition-colors duration-150 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <FontAwesomeIcon icon={fas.faUser} className="text-blue-500 text-lg" />
                      <span className="font-medium text-gray-800">Profile</span>
                    </div>
                  </DropdownItem>
                  <DropdownItem
                    key="logout"
                    textValue="Logout"
                    onClick={handleLogout}
                    className="px-4 py-3 rounded-md hover:bg-red-50 transition-colors duration-150 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <FontAwesomeIcon icon={fas.faSignOutAlt} className="text-red-500 text-lg" />
                      <span className="font-medium text-red-600">Logout</span>
                    </div>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            )}
          </div>
        </div>
        <button className="md:hidden text-2xl cursor-pointer">
          <FontAwesomeIcon icon={fas.faBars} />
        </button>
      </div>
    </nav>
  )
}
