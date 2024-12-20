import { useState } from 'react'
import { fetchDataWithoutAccessToken, showToastError } from '../global'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import useAuth from '../context/AuthContext'

function SignUp() {


  const { checkAuth } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  const [isRemember, setIsRemember] = useState()
  const [firstName, setFirstName] = useState()
  const [lastName, setLastName] = useState()
  const [confirmPassword, setConfirmPassword] = useState()


  async function postSignUp(email, password, firstName, lastName, isRemember) {
    const subUrl = '/auth/sign-up'
    const body = { email, password, firstName, lastName, isRemember }
    try {
      const response = await fetchDataWithoutAccessToken(subUrl, 'POST', body)
      const auth = response.data
      localStorage.setItem('accessToken', auth.accessToken)
      checkAuth()
      navigate('/')
    }
    catch (error) {
      showToastError(error.message)

    }
  }
  function handleSignUp(event) {  
    event.preventDefault()

    // kiểm tra password oke chưa 
    if (password != confirmPassword) { 
      showToastError('Mật khẩu và mật khẩu xác nhận không trùng nhau!')
      return
    }

    // trim 
    setEmail(email.trim())
    setFirstName(firstName.trim())
    setLastName(lastName.trim())
    
    postSignUp(email, password, firstName, lastName, isRemember)
  }


  return (<div className="flex justify-center items-center h-screen overflow-y-hidden">
   
    {/* Right: Login Form */}
    <div className="lg:p-36 md:p-52 sm:20 p-8 w-full lg:w-1/2">
      <h1 className="text-2xl font-semibold mb-4">Sign up</h1>
      <form onSubmit={handleSignUp}>


        {/* Firstname và LastName */}
        <div className='flex gap-x-8'>
          {/* Firstname Input */}
          <div className="mb-4 w-full">
            <label htmlFor="password" className="block text-gray-600">
              Firstname
            </label>
            <div className='relative'>
              <input
                onChange={e => setFirstName(e.target.value)}

                type="text"
                className="w-full borde rounded-md py-2 px-3"
                required
              />
            </div>
          </div>

          {/* LastName Input */}
          <div className="mb-4 w-full">
            <label htmlFor="password" className="block text-gray-600 mb-2">
              Lastname
            </label>
            <div className='relative'>
              <input
                onChange={e => setLastName(e.target.value)}
                type="text"
                className="w-full borde rounded-md py-2 px-3"
                required
              />
            </div>
          </div>
        </div>
        {/* Email Input */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-600">
            Email
          </label>
          <input
            onChange={e => setEmail(e.target.value)}
            type="email"
            className="mt-2 w-full rounded-md py-2 px-3"
            required
          />
        </div>
        {/* Password Input */}
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-600 mb-2">
            Password
          </label>
          <div className='relative'>
            <input
              onChange={e => setPassword(e.target.value)}
      
              type="password"
              className="w-full borde rounded-md py-2 px-3"
              required
            />
            {/* <img onClick={handleChangeView} loading='lazy' id='view-password' src="/hide.png" className='cursor-pointer absolute top-1/2 right-4' style={{ transform: 'translateY(-50%)' }} alt="" /> */}
          </div>

        </div>

         {/* Confirm Password Input */}
         <div className="mb-4">
          <label htmlFor="password" className="block text-gray-600 mb-2">
          Confirm password
          </label>
          <div className='relative'>
            <input
              onChange={e => setConfirmPassword(e.target.value)}
              id='password'
              type="password"
              className="w-full borde rounded-md py-2 px-3"
              required
            />
            {/* <img onClick={handleChangeView} loading='lazy' id='view-password' src="/hide.png" className='cursor-pointer absolute top-1/2 right-4' style={{ transform: 'translateY(-50%)' }} alt="" /> */}
          </div>

        </div>


        {/* Remember Me Checkbox */}
        <div className="mb-4 flex items-center">
          <input
            onChange={e => setIsRemember(e.target.value)}
            type="checkbox"
            className="text-blue-500"

          />
          <label htmlFor="remember" className="text-gray-600 ml-2">
          Remember account
          </label>
        </div>
        {/* Forgot Password Link */}
        <div className="mb-6 text-blue-500">
          <Link to={'/forgot-password'} className="hover:underline">
          Forgot password
          </Link>
        </div>
        {/* Login Button */}
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full"
        >
          Submit
        </button>
      </form>
      {/* Sign up  Link */}
      <div className="mt-6 text-blue-500 text-center">
        <Link to={'/sign-in'} className="hover:underline">
          Sign in
        </Link>
      </div>
    </div>
     {/* Left: Image */}
     <div className="w-1/2 hidden lg:block h-screen">
      <img
        src="/touann-gatouillat-vergos-dSBJv66Yjlk-unsplash.jpg"
        alt="login image"
        loading="lazy"
        className="object-cover w-full h-full"
      />
    </div>
    <ToastContainer />
  </div>)

}
export default SignUp
