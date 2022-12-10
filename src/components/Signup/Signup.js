import React from 'react'
import './Signup.css'


const Signup = () => {
  return (
    <div className='signup'>
      <div className='bg'></div>
      <div className='signup-details'>
        <h1>Welcome to iGSE</h1>
        <div className='signup-input'>
          <p>Full Name</p>
          <input placeholder='John Doe'/>
        </div>
        <div className='signup-input'>
          <p>Email</p>
          <input placeholder='Enter your Email here'/>
        </div>
        <div className='signup-input'>
          <p>Password</p>
          <input placeholder='Enter your Password'/>
        </div>
      </div>
    </div>
  )
}

export default Signup