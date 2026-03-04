import { fab } from '@fortawesome/free-brands-svg-icons'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { zodResolver } from '@hookform/resolvers/zod'
import { useContext, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { loginSchema } from './../../schema/loginSchema/loginSchema'
import { AuthContext } from '../../context/Auth/Auth.Context'
import SignIn from '../../services/api/AuthApi/loginApi'
import { getUserProfile } from '../../services/api/userApi'
export default function Login() {
    const { setToken, setUser } = useContext(AuthContext)
    const navigate = useNavigate()
    const [apiError, setApiError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const { handleSubmit, register, formState: { errors, touchedFields, isValid } } = useForm({
        defaultValues: {
            email: '',
            password: '',
        },
        resolver: zodResolver(loginSchema),
        mode: 'onBlur',
        reValidateMode: 'onBlur'
    })
    async function submitForm(userData) {
        try {
            setIsLoading(true)
            setApiError(null)
            const res = await SignIn(userData)
            console.log(res)
            if (res.success) {
                const token = res.data.token;

                // Immediately fetch full profile data BEFORE setting token/user and navigating
                const profileRes = await getUserProfile(token);
                if (profileRes.success) {
                    setToken(token);
                    setUser(profileRes.data);
                    toast.success('Logged in successfully!');
                    setTimeout(() => {
                        navigate('/')
                    }, 500)
                } else {
                    toast.error('Failed to load your profile details');
                }
            } else {
                setApiError(res.message)
                toast.error(res.message)
            }
        } catch (error) {
            setApiError(error.message || 'An unexpected error occurred')
            toast.error('Something went wrong')
        } finally {
            setIsLoading(false)
        }
    }
    return (
        <>
            <div className="min-h-screen flex items-center justify-center px-4 bg-linear-to-br from-blue-50 to-gray-100">
                <form onSubmit={handleSubmit(submitForm)} className="bg-white w-full max-w-xl mx-auto p-10 rounded-3xl shadow-xl space-y-6 border border-gray-100">
                    <header className="text-center space-y-2">
                        <h2 className="text-3xl font-bold">Welcome Back!</h2>
                        <p>Don't have an account? <Link to="/signup" className='text-blue-400'>Sign Up</Link></p>
                    </header>
                    <div className="social-btns flex gap-3 items-center *:grow">
                        <button className='btn hover:scale-105 transition-transform duration-200'>
                            <FontAwesomeIcon icon={fab.faGoogle} className='text-red-500' />
                            <span>Google</span>
                        </button>
                        <button className='btn hover:scale-105 transition-transform duration-200'>
                            <FontAwesomeIcon icon={fab.faFacebookF} className='text-blue-500' />
                            <span>Facebook</span>
                        </button>
                    </div>
                    <div className="divider text-gray-400 text-sm relative text-center before:w-1/3 before:h-px before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:bg-linear-to-r before:from-transparent before:via-gray-400/80 before:to-transparent after:w-1/3 after:h-px after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:bg-linear-to-l after:from-transparent after:via-gray-400/80 after:to-transparent">or continue with email</div>
                    <div className="form-controls space-y-4">
                        <div className="email">
                            <label className="text-sm mb-1" htmlFor="email">Email Address</label>
                            <div className="input-field relative">
                                <input {...register('email')} errorMessage={errors.email?.message} isInvalid={Boolean(errors.email) && touchedFields.email} className='form-control' id="email" type="email" placeholder="name@example.com" required />
                                <FontAwesomeIcon icon={fas.faEnvelope} className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-500' />
                            </div>
                            {errors.email && (<p className="text-red-500 text-sm mt-1">{errors.email.message}</p>)}
                        </div>
                        <div className="password">
                            <label className="text-sm mb-1" htmlFor="password">Password</label>
                            <div className="input-field relative">
                                <input {...register('password')} errorMessage={errors.password?.message} isInvalid={Boolean(errors.password) && touchedFields.password} className='form-control' id="password" type="password" placeholder="Enter your password" required />
                                <FontAwesomeIcon icon={fas.faLock} className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-500' />
                            </div>
                            {errors.password && (<p className="text-red-500 text-sm mt-1">{errors.password.message}</p>)}
                        </div>
                    </div>
                    {apiError && <p className="text-red-600 py-2 text-center">{apiError}</p>}
                    <button disabled={!isValid || isLoading} type="submit" className={`w-full py-3 rounded-xl text-white font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${!isValid || isLoading
                        ? "bg-linear-to-r from-gray-500 to-gray-300 cursor-not-allowed"
                        : "bg-linear-to-r from-blue-600 to-blue-400 hover:shadow-lg hover:-translate-y-0.5"}`}>
                        {isLoading ? (<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />) : (
                            <>
                                <span>Login</span>
                                <FontAwesomeIcon icon={fas.faArrowRight} />
                            </>
                        )}
                    </button>
                </form>
            </div>
        </>
    )
}
