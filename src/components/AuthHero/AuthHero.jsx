import { faBell, faHeart, faImage, faMessage, faStar, faUsers } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom'
import user from '../../assets/images/user.jpg'
import signupbg from '../../assets/images/signup-bg.jpg'
export default function AuthHero({title , description}) {
    const features = [
        {
            icon: faMessage,
            title: 'Real-time Chat',
            description: 'Instant Messaging',
            colors:'bg-teal-400/20 text-green-300'
        },
        {
            icon: faImage,
            title: 'Share Media',
            description: 'photos & Videos',
            colors:'bg-blue-400/20 text-blue-100'
        },
        {
            icon: faBell,
            title: 'Smart Alerts',
            description: 'Stay Updated',
            colors:'bg-pink-400/20 text-pink-100'
        },
        {
            icon: faUsers,
            title: 'Communities',
            description: 'find your tribe',
            colors:'bg-teal-400/20 text-green-300'
        },
    ]
    const stats = [
        {
            icon: faUsers,
            value: '2M+',
            label: 'Active Users',
        },
        {
            icon: faHeart,
            value: '10M+',
            label: 'Posts shared',
        },
        {
            icon: faMessage,
            value: '50M+',
            label: 'Messages sent',
        },
    ]
    return (
        <>
            <div className='signup-hero min-h-screen text-white bg-cover bg-center flex flex-col gap-6 justify-between p-10' style={{ backgroundImage: `linear-gradient(#1447e6cc, #1447e6cc), url(${signupbg})` }}>
                <header>
                    <Link to='/' className='flex items-center gap-3'>
                        <span className="size-12 text-lg font-bold flex items-center justify-center bg-white/40 border border-white/30 rounded-xl">S</span>
                        <span className='text-2xl font-bold'>SocialHub</span>
                    </Link>
                </header>
                <div className="content space-y-6">
                    <div className="title">
                        <h2 className='text-5xl font-bold max-w-96'>{title.normal} <span className='pb-4 bg-linear-to-r from-cyan-300 to-cyan-100 bg-clip-text text-transparent'>{title.highlight}</span></h2>
                        <p className='max-w-md'>{description}</p>
                    </div>
                    <section className='feature-section'>
                        <h3 className='sr-only'>Platform Features</h3>
                        <ul className="feature-cards grid lg:grid-cols-2 gap-4">
                            {features.map((feature, index) => (
                                <li className='flex items-center gap-2 backdrop:blur-sm border border-white/30 bg-white/20 px-4 py-2 rounded-xl hover:scale-105 transition-transform duration-200' key={index}>
                                    <div className={`icon size-10 flex items-center justify-center rounded-xl ${feature.colors}`}>
                                        <FontAwesomeIcon icon={feature.icon} />
                                    </div>
                                    <div className="card-body">
                                        <h4>{feature.title}</h4>
                                        <span>{feature.description}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </section>
                    <section className='stats-section'>
                        <h3 className='sr-only'>Platform Statistics</h3>
                        <ul className="stats-cards flex items-center justify-start gap-6">
                            {stats.map((stat, index) => (
                                <li key={index}>
                                    <div className="stat flex items-center gap-2 ">
                                        <FontAwesomeIcon icon={stat.icon} />
                                        <h4>{stat.value}</h4>
                                    </div>
                                    <div className="card-title">
                                        <span>{stat.label}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </section>
                </div>
                <figure className='backdrop:blur-sm border border-white/30 bg-white/20 p-4 rounded-xl space-y-4 hover:scale-102 hover:bg-white/30 transition-all duration-200'>
                    <div className="rating-average">
                        {[...Array(5)].map((_, index) => (
                            <FontAwesomeIcon key={index} icon={faStar} className="text-yellow-400 hover:scale-110 transition-transform duration-200" />
                        ))}
                    </div>
                    <blockquote className="testimonial">
                        <p className='text-md italic'>"SocialHub has transformed how I connect with friends and discover new communities. The real-time chat and media sharing features are fantastic!"</p>
                    </blockquote>
                    <figcaption className="author flex items-center gap-3">
                        <img src={user} className="size-12 rounded-full object-cover" alt="" />
                        <div className="info flex flex-col">
                            <cite>Jane Doe</cite>
                            <span className='text-sm text-gray-300'>Product Designer</span>
                        </div>
                    </figcaption>
                </figure>
            </div>
        </>
    )
}
