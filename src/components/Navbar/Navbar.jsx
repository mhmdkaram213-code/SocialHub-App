import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/Auth/Auth.Context";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@heroui/react";
import userImage from '../../assets/images/user.jpg';

export default function Navbar() {
  const { token, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const isLoggedIn = !!token;

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);
  const mobileToggleRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const handlePointerDown = (e) => {
      const menuEl = mobileMenuRef.current;
      const toggleEl = mobileToggleRef.current;

      const clickedInsideMenu = !!menuEl && menuEl.contains(e.target);
      const clickedToggle = !!toggleEl && toggleEl.contains(e.target);

      if (!clickedInsideMenu && !clickedToggle) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown, { passive: true });

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 px-4 py-3 md:py-4 text-lg relative z-50">
      <div className="container max-w-7xl mx-auto flex items-center justify-between min-h-[48px] md:min-h-0">
        <div className="left-side flex items-center gap-8">
          <h1 className="text-xl md:text-2xl flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
              <FontAwesomeIcon icon={fas.faShareNodes} className="text-blue-500" />
              <span className="font-bold text-gray-900 tracking-tight">Social App</span>
            </Link>
          </h1>
          <ul className="hidden md:flex items-center gap-6">
            <li>
              <NavLink to="/" className={({ isActive }) => `${isActive ? "text-blue-600 font-semibold" : "text-gray-600"} flex items-center gap-2 hover:text-blue-500 transition-all duration-200 text-base`} >
                <FontAwesomeIcon icon={fas.faHouse} className="text-sm" />
                <span>Home</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/explore" className={({ isActive }) => `${isActive ? "text-blue-600 font-semibold" : "text-gray-600"} flex items-center gap-2 hover:text-blue-500 transition-all duration-200 text-base`} >
                <FontAwesomeIcon icon={fas.faMagnifyingGlass} className="text-sm" />
                <span>Explore</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/communities" className={({ isActive }) => `${isActive ? "text-blue-600 font-semibold" : "text-gray-600"} flex items-center gap-2 hover:text-blue-500 transition-all duration-200 text-base`} >
                <FontAwesomeIcon icon={fas.faUsers} className="text-sm" />
                <span>Communities</span>
              </NavLink>
            </li>
          </ul>
        </div>

        <div className="right-side hidden md:flex items-center gap-6">
          <div className="search-input relative hidden xl:block">
            <FontAwesomeIcon icon={fas.faMagnifyingGlass} className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input className="border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 outline-none px-4 py-2 rounded-full pl-11 min-w-[300px] text-sm" type="search" placeholder="Search posts, people, topics..." />
          </div>
          <div className="icons gap-4 text-xl flex items-center">
            <button className="text-gray-600 hover:text-blue-500 transition-colors relative cursor-pointer active:scale-95 group">
              <FontAwesomeIcon icon={fas.faBell} />
              <span className="w-2 h-2 bg-red-500 rounded-full absolute top-0 right-0 border-2 border-white group-hover:animate-pulse"></span>
            </button>
            <button className="text-gray-600 hover:text-blue-500 transition-colors relative cursor-pointer active:scale-95 group">
              <FontAwesomeIcon icon={fas.faMessage} />
              <span className="w-2 h-2 bg-red-500 rounded-full absolute top-0 right-0 border-2 border-white group-hover:animate-pulse"></span>
            </button>

            {/* Conditional rendering: Login/Register or Profile Dropdown */}
            {!isLoggedIn ? (
              // Not logged in - show Login and Register buttons
              <div className="flex gap-3">
                <Button
                  color="default"
                  variant="flat"
                  onClick={() => navigate('/login')}
                  className="font-medium text-gray-700 hover:bg-gray-100"
                >
                  Login
                </Button>
                <Button
                  color="primary"
                  onClick={() => navigate('/signup')}
                  className="bg-blue-600 text-white font-medium shadow-sm hover:shadow-md hover:bg-blue-700 transition-all"
                >
                  Register
                </Button>
              </div>
            ) : (
              // Logged in - show Profile picture with dropdown
              <Dropdown placement="bottom-end" className="w-56" classNames={{
                base: "rounded-xl",
                content: "rounded-xl bg-white shadow-xl border border-gray-100 p-1"
              }}>
                <DropdownTrigger>
                  <Button
                    isIconOnly
                    variant="light"
                    className="rounded-full h-11 w-11 p-0.5 overflow-hidden cursor-pointer ring-2 ring-gray-100 hover:ring-blue-400 transition-all duration-300 active:scale-95"
                  >
                    <img
                      src={user?.photo || userImage}
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover"
                      onError={(e) => {
                        e.target.src = userImage;
                      }}
                    />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Profile Actions"
                >
                  <DropdownItem
                    key="profile"
                    textValue="Profile"
                    onClick={handleProfileClick}
                    className="rounded-lg hover:bg-blue-50 group"
                  >
                    <div className="flex items-center gap-3 py-1">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <FontAwesomeIcon icon={fas.faUser} />
                      </div>
                      <span className="font-medium text-gray-700">My Profile</span>
                    </div>
                  </DropdownItem>
                  <DropdownItem
                    key="logout"
                    textValue="Logout"
                    onClick={handleLogout}
                    className="rounded-lg hover:bg-red-50 group"
                  >
                    <div className="flex items-center gap-3 py-1">
                      <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors">
                        <FontAwesomeIcon icon={fas.faSignOutAlt} />
                      </div>
                      <span className="font-medium text-red-600">Logout</span>
                    </div>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            )}
          </div>
        </div>

        {/* Professional Mobile Toggle Icon */}
        <button
          ref={mobileToggleRef}
          type="button"
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-nav"
          onClick={() => setIsMobileMenuOpen((v) => !v)}
          className="md:hidden flex items-center justify-center h-11 w-11 rounded-xl hover:bg-gray-100 transition-all duration-300 active:scale-90"
        >
          <div className="relative w-6 h-5 flex flex-col justify-between items-center overflow-hidden">
            <span className={`w-full h-0.5 bg-gray-900 rounded-full transform transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'rotate-45 translate-y-[9px]' : ''}`} />
            <span className={`w-full h-0.5 bg-gray-900 rounded-full transition-all duration-300 ease-in-out ${isMobileMenuOpen ? '-translate-x-full opacity-0' : 'opacity-100'}`} />
            <span className={`w-full h-0.5 bg-gray-900 rounded-full transform transition-all duration-300 ease-in-out ${isMobileMenuOpen ? '-rotate-45 -translate-y-[9px]' : ''}`} />
          </div>
        </button>
      </div>

      {/* Backdrop with Backdrop Blur */}
      <div
        className={`md:hidden fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={closeMobileMenu}
      />

      {/* Improved Mobile Dropdown Menu */}
      <div
        id="mobile-nav"
        ref={mobileMenuRef}
        className={`md:hidden absolute left-0 right-0 top-full z-50 p-4 transition-all duration-300 ease-in-out transform origin-top ${isMobileMenuOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-4 scale-95 pointer-events-none'}`}
      >
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden ring-1 ring-black/5">
          <div className="p-2 space-y-1">
            <NavLink
              to="/"
              onClick={closeMobileMenu}
              className={({ isActive }) => `flex items-center gap-4 rounded-xl px-4 py-3.5 text-base transition-all duration-200 active:scale-[0.98] ${isActive ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg transition-colors ${isMobileMenuOpen ? 'bg-blue-50' : ''}`}>
                <FontAwesomeIcon icon={fas.faHouse} />
              </div>
              <span>Home</span>
            </NavLink>
            <NavLink
              to="/explore"
              onClick={closeMobileMenu}
              className={({ isActive }) => `flex items-center gap-4 rounded-xl px-4 py-3.5 text-base transition-all duration-200 active:scale-[0.98] ${isActive ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg">
                <FontAwesomeIcon icon={fas.faMagnifyingGlass} />
              </div>
              <span>Explore</span>
            </NavLink>
            <NavLink
              to="/communities"
              onClick={closeMobileMenu}
              className={({ isActive }) => `flex items-center gap-4 rounded-xl px-4 py-3.5 text-base transition-all duration-200 active:scale-[0.98] ${isActive ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg">
                <FontAwesomeIcon icon={fas.faUsers} />
              </div>
              <span>Communities</span>
            </NavLink>
          </div>

          <div className="mt-2 border-t border-gray-100 bg-gray-50/50 p-4">
            {!isLoggedIn ? (
              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => {
                    closeMobileMenu();
                    navigate('/login');
                  }}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-base font-semibold text-gray-700 hover:bg-gray-50 active:scale-[0.98] transition-all shadow-sm"
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => {
                    closeMobileMenu();
                    navigate('/signup');
                  }}
                  className="w-full rounded-xl bg-blue-600 px-4 py-3 text-base font-semibold text-white hover:bg-blue-700 active:scale-[0.98] transition-all shadow-sm shadow-blue-200"
                >
                  Create Account
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => {
                    closeMobileMenu();
                    handleProfileClick();
                  }}
                  className="w-full flex items-center gap-4 rounded-xl p-3 hover:bg-white active:scale-[0.98] transition-all border border-transparent hover:border-gray-100 hover:shadow-sm"
                >
                  <div className="relative">
                    <img
                      src={user?.photo || userImage}
                      alt="Profile"
                      className="h-12 w-12 rounded-full object-cover border-2 border-gray-200"
                      onError={(e) => {
                        e.target.src = userImage;
                      }}
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                  </div>
                  <div className="text-left flex-1">
                    <div className="text-base font-bold text-gray-900 leading-tight">{user?.name || 'Profile'}</div>
                    <div className="text-sm text-gray-500">Manage your account</div>
                  </div>
                  <FontAwesomeIcon icon={fas.faChevronRight} className="text-gray-300 text-sm" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    closeMobileMenu();
                    handleLogout();
                  }}
                  className="w-full flex items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50/50 px-4 py-3 text-base font-semibold text-red-600 hover:bg-red-50 hover:border-red-200 active:scale-[0.98] transition-all"
                >
                  <FontAwesomeIcon icon={fas.faSignOutAlt} className="text-sm" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
