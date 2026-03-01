import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";

export default function RightSidebar() {
    const trendingItems = [
        { category: "Technology", topic: "React 19 Release", posts: "12.5K", type: "Trending" },
        { category: "Entertainment", topic: "Oscar Nominations 2026", posts: "45.2K", type: "Breaking" },
        { category: "Sports", topic: "World Cup Qualifiers", posts: "89K", type: "Live" },
        { category: "Business", topic: "AI Market Surge", posts: "22K", type: "Trending" },
    ];

    const suggestions = [
        { name: "John Doe", handle: "@johndoe", bio: "Full-stack Developer & Designer", avatar: "JD" },
        { name: "Jane Smith", handle: "@janesmith", bio: "Digital Creator | Photography", avatar: "JS" },
        { name: "Tech News", handle: "@technews", bio: "Latest updates from the tech world", avatar: "TN" },
    ];

    return (
        <aside className="hidden xl:flex flex-col w-[350px] h-[calc(100vh-64px)] sticky top-16 px-6 py-6 space-y-6 overflow-y-auto">
            {/* Search Bar - Matches Navbar */}
            <div className="search relative group">
                <FontAwesomeIcon
                    icon={fas.faMagnifyingGlass}
                    className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors"
                />
                <input
                    type="search"
                    placeholder="Search Social App"
                    className="w-full bg-gray-100 border border-transparent rounded-2xl py-3 pl-11 pr-4 text-[15px] focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                />
            </div>

            {/* Trending Section */}
            <div className="trending bg-gray-50/50 border border-gray-100 rounded-3xl p-5 space-y-4">
                <h2 className="text-xl font-extrabold text-gray-900 px-1 italic tracking-tight uppercase text-sm opacity-50">What's happening</h2>
                <div className="space-y-1">
                    {trendingItems.map((item) => (
                        <div
                            key={item.topic}
                            className="group cursor-pointer hover:bg-white hover:shadow-sm p-3 -mx-2 rounded-2xl transition-all duration-300 border border-transparent hover:border-gray-100"
                        >
                            <div className="flex justify-between items-start">
                                <p className="text-[13px] text-gray-500 font-medium">
                                    {item.category} • {item.type}
                                </p>
                                <div className="w-8 h-8 flex items-center justify-center text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <FontAwesomeIcon icon={fas.faEllipsis} />
                                </div>
                            </div>
                            <p className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">
                                {item.topic}
                            </p>
                            <p className="text-[13px] text-gray-500 mt-0.5">{item.posts} posts</p>
                        </div>
                    ))}
                </div>
                <button className="w-full text-blue-600 text-[15px] font-bold hover:bg-blue-50 py-2 rounded-xl transition-colors text-center">
                    Show more
                </button>
            </div>

            {/* Who to Follow */}
            <div className="who-to-follow bg-gray-50/50 border border-gray-100 rounded-3xl p-5 space-y-5">
                <h2 className="text-xl font-extrabold text-gray-900 px-1 italic tracking-tight uppercase text-sm opacity-50">Who to follow</h2>
                <div className="space-y-4">
                    {suggestions.map((user) => (
                        <div key={user.handle} className="flex items-start justify-between gap-3 group">
                            <div className="flex items-start gap-3 min-w-0">
                                <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex-shrink-0 flex items-center justify-center text-white font-bold shadow-md">
                                    {user.avatar}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[15px] font-bold text-gray-900 truncate leading-tight group-hover:text-blue-600 transition-colors">
                                        {user.name}
                                    </p>
                                    <p className="text-[13px] text-gray-500 truncate">{user.handle}</p>
                                    <p className="text-[12px] text-gray-400 truncate mt-0.5 leading-snug">{user.bio}</p>
                                </div>
                            </div>
                            <button className="bg-gray-900 text-white text-[13px] font-bold px-5 py-2 rounded-full hover:bg-gray-800 active:scale-95 transition-all shadow-sm">
                                Follow
                            </button>
                        </div>
                    ))}
                </div>
                <button className="w-full text-blue-600 text-[15px] font-bold hover:bg-blue-50 py-2 rounded-xl transition-colors text-center">
                    Show more
                </button>
            </div>

            {/* Footer Info */}
            <footer className="text-[13px] text-gray-400 px-2 leading-relaxed">
                <div className="flex flex-wrap gap-x-4 gap-y-1">
                    <a href="#" className="hover:underline">Privacy</a>
                    <a href="#" className="hover:underline">Terms</a>
                    <a href="#" className="hover:underline">Cookies</a>
                    <a href="#" className="hover:underline">Ads info</a>
                    <a href="#" className="hover:underline">More...</a>
                </div>
                <p className="mt-3">© 2026 Social App, Inc.</p>
            </footer>
        </aside>
    );
}
