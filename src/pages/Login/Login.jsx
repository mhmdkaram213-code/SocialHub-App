import AuthHero from '../../components/AuthHero/AuthHero'
import SigninForm from '../../components/SigninForm/SigninForm'

export default function Login() {
  return (
    <main>
      <div className='grid lg:grid-cols-2'>
        <AuthHero title={{normal:'Welcome Back' , highlight:'to SocialHub App'}} description="Sign in to your account to continue exploring amazing connections and content." />
        <SigninForm />
      </div>
    </main>
  )
}