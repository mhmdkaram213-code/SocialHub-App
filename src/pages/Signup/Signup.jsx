import AuthHero from '../../components/AuthHero/AuthHero'
import SignupForm from '../../components/SignupForm/SignupForm'

export default function Signup() {
  return (
    <main>
      <div className='grid lg:grid-cols-2'>
        <AuthHero title={{normal:'Connect With' , highlight:'amazing people'}} description="Join millions of users sharing moments, ideas and building meaningful connections every day" />
        <SignupForm />
      </div>
    </main>
  )
}
