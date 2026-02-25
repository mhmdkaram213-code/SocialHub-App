import { fab } from '@fortawesome/free-brands-svg-icons'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { registerSchema } from '../../schema/registerSchema/registerSchema'
import SignUp from '../../services/api/AuthApi/registerApi'
export default function Register() {
    const navigate = useNavigate()
    const [apiError, setApiError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const { handleSubmit, register, formState: { errors, touchedFields, isValid } } = useForm({
        defaultValues: {
            name: '',
            username: '',
            email: '',
            password: '',
            rePassword: '',
            dateOfBirth: '',
            gender: ''
        },
        resolver: zodResolver(registerSchema),
        mode: 'onBlur',
        reValidateMode: 'onBlur'
    })
    async function submitForm(userData) {
        try {
            setIsLoading(true)
            setApiError(null)
            const res = await SignUp(userData)
            console.log(res)
            if (res.success) {
                toast.success('Account created successfully! Please log in.')
                setTimeout(() => {
                    navigate('/login')
                }, 1500)
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
            <div className="signup-form bg-gray-100 py-12 min-h-screen flex items-center justify-center">
                <form onSubmit={handleSubmit(submitForm)} className="bg-white  max-w-lg mx-auto p-8 rounded-2xl shadow space-y-5">
                    <header className="text-center space-y-2">
                        <h2 className="text-3xl font-bold">Create account</h2>
                        <p>Already have an account? <Link to="/login" className='text-blue-400'>Sign In</Link></p>
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
                        <div className="name">
                            <label className="text-sm mb-1" htmlFor="name">Full Name</label>
                            <div className="input-field relative">
                                <input isInvalid={Boolean(errors.name && touchedFields.name)} errorMessage={errors.name?.message} {...register('name')} className='form-control' id="name" type="text" placeholder="Enter your full name" required />
                                <FontAwesomeIcon icon={fas.faUser} className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-500' />
                            </div>
                            {errors.name && (<p className="text-red-500 text-sm mt-1">{errors.name.message}</p>)}
                        </div>
                        <div className="username">
                            <label className="text-sm mb-1" htmlFor="username">Username</label>
                            <div className="input-field relative">
                                <input isInvalid={Boolean(errors.username && touchedFields.username)} errorMessage={errors.username?.message} {...register('username')} className='form-control' id="username" type="text" placeholder="Enter your username" required />
                                <FontAwesomeIcon icon={fas.faUser} className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-500' />
                            </div>
                            {errors.username && (<p className="text-red-500 text-sm mt-1">{errors.username.message}</p>)}
                        </div>
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
                        <div className="rePassword">
                            <label className="text-sm mb-1" htmlFor="rePassword">Confirm Password</label>
                            <div className="input-field relative">
                                <input {...register('rePassword')} errorMessage={errors.rePassword?.message} isInvalid={Boolean(errors.rePassword) && touchedFields.rePassword} className='form-control' id="rePassword" type="password" placeholder="Re-enter your password" required />
                                <FontAwesomeIcon icon={fas.faLock} className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-500' />
                            </div>
                            {errors.rePassword && (<p className="text-red-500 text-sm mt-1">{errors.rePassword.message}</p>)}
                        </div>
                        <div className="personal-info flex gap-3 items-center *:grow">
                            <div className="date-of-birth">
                                <label className="text-sm mb-1" htmlFor="dateOfBirth">Date of Birth</label>
                                <div className="input-field relative">
                                    <input {...register('dateOfBirth')} errorMessage={errors.dateOfBirth?.message} isInvalid={Boolean(errors.dateOfBirth) && touchedFields.dateOfBirth} className='form-control' id="dateOfBirth" type="date" required />
                                    <FontAwesomeIcon icon={fas.faCalendarAlt} className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-500' />
                                </div>
                                {errors.dateOfBirth && (<p className="text-red-500 text-sm mt-1">{errors.dateOfBirth.message}</p>)}
                            </div>
                            <div className="gender">
                                <label className="text-sm mb-1" htmlFor="gender">Gender</label>
                                <div className="input-field relative">
                                    <select {...register('gender')} errorMessage={errors.gender?.message} isInvalid={Boolean(errors.gender) && touchedFields.gender} className='form-control' id="gender" required>
                                        <option value="">Select Gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </select>
                                    <FontAwesomeIcon icon={fas.faVenusMars} className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-500' />
                                </div>
                                {errors.gender && (<p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>)}
                            </div>
                        </div>
                    </div>
                    {apiError && <p className="text-red-600 py-2 text-center">{apiError}</p>}
                    <button disabled={!isValid || isLoading} type="submit" className={`w-full py-3 rounded-xl text-white font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${!isValid || isLoading
                        ? "bg-linear-to-r from-gray-500 to-gray-300 cursor-not-allowed"
                        : "bg-linear-to-r from-blue-600 to-blue-400 hover:shadow-lg hover:-translate-y-0.5"}`}>
                        {isLoading ? (<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />) : (
                            <>
                                <span>Create Account</span>
                                <FontAwesomeIcon icon={fas.faArrowRight} />
                            </>
                        )}
                    </button>
                </form>
            </div>
        </>
    )
}
