import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink, Link } from "react-router-dom";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { useContext } from "react";
import { AuthContext } from "../../context/Auth/Auth.Context";
import userImage from '../../assets/images/user.jpg';

export default function LeftSidebar() {
    const { user } = useContext(AuthContext);

    const navItems = [
        { icon: fas.faHouse, label: "Home", path: "/" },
        { icon: fas.faMagnifyingGlass, label: "Explore", path: "/explore" },
        { icon: fas.faBell, label: "Notifications", path: "/notifications", badge: 3 },
        { icon: fas.faMessage, label: "Messages", path: "/messages", badge: 5 },
        { icon: fas.faBookmark, label: "Bookmarks", path: "/bookmarks" },
        { icon: fas.faListUl, label: "Lists", path: "/lists" },
        { icon: fas.faUser, label: "Profile", path: "/profile" },
    ];

    return (
        <aside className="hidden lg:flex flex-col w-72 h-[calc(100vh-64px)] sticky top-16 px-4 py-6 border-r border-gray-100 bg-white overflow-y-auto">
            {/* Navigation Links */}
            <div className="flex-1 space-y-1.5">
                {navItems.map((item) => (
                    <NavLink
                        key={item.label}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative ${isActive
                                ? "bg-blue-600 text-white font-bold shadow-lg shadow-blue-200"
                                : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                            }`
                        }
                    >
                        <div className={`text-xl transition-transform duration-300 group-hover:scale-110 flex items-center justify-center w-6`}>
                            <FontAwesomeIcon icon={item.icon} />
                        </div>
                        <span className="text-[17px] tracking-tight">{item.label}</span>

                        {item.badge && (
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center border-2 border-white">
                                {item.badge}
                            </span>
                        )}
                    </NavLink>
                ))}

                {/* Post CTA */}
                <div className="pt-6 pb-2">
                    <button className="w-full bg-blue-600 text-white rounded-full py-4 px-6 font-bold text-lg shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all duration-300 flex items-center justify-center gap-3">
                        <FontAwesomeIcon icon={fas.faPenNib} />
                        <span>Post</span>
                    </button>
                </div>
            </div>

            {/* User Card */}
            <div className="mt-8">
                <div className="p-1 rounded-3xl bg-gray-50/50 hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all duration-300 group">
                    <Link
                        to="/profile"
                        className="flex items-center gap-3 p-3"
                    >
                        <div className="relative">
                            <img
                                src={user?.user?.photo || userImage}
                                alt="Profile"
                                className="w-12 h-12 rounded-2xl object-cover border-2 border-white shadow-sm transition-transform group-hover:scale-105"
                            />
                            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[15px] font-bold text-gray-900 truncate tracking-tight">{user?.user?.name || 'User'}</p>
                            <p className="text-xs text-gray-500 truncate font-medium">@{user?.user?.email?.split('@')[0] || 'username'}</p>
                        </div>
                        <div className="w-8 h-8 flex items-center justify-center text-gray-400 group-hover:text-gray-600 rounded-full hover:bg-white transition-colors">
                            <FontAwesomeIcon icon={fas.faEllipsis} />
                        </div>
                    </Link>
                </div>
            </div>
        </aside>
    );
}
