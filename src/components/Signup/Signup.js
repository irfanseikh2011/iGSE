import React, { useState } from 'react'
import './Signup.css'


const Signup = () => {

  const [isSignIn, setIsSignIn] = useState(false);

  const navigateToLogin = () => {
    setIsSignIn(true);
  }

  const navigateToSignUp = () => {
    setIsSignIn(false);
  }


  return (
    <div className='signup'>
      <div className='bg'></div>
      <div className='signup-details'>
        <h1>Welcome to iGSE</h1>
        {isSignIn ? (<> 
          <div className='signup-input'>
          <p>Customer ID</p>
          <input placeholder='johndoe@gmail.com..'/>
        </div>
        <div className='signup-input'>
          <p>Password</p>
          <input placeholder='Enter your Password'/>
        </div>
        <button className='create-button'>Sign In</button>
        <p>Create an account. <span className='login-hover' onClick={navigateToSignUp}><a>Register</a></span></p>
        </>): (<>
          <div className='signup-input'>
          <p>Customer ID</p>
          <input placeholder='johndoe@gmail.com..'/>
        </div>
        <div className='signup-input'>
          <p>Password</p>
          <input placeholder='Enter your Password'/>
        </div>
        <div className='signup-input'>
          <p>Address</p>
          <input placeholder='Enter your Address here'/>
        </div>
        <div className='signup-input' style={{marginBottom:"2vh"}}>
          <p>Property Type</p>
          <select className='input-select'>
            <option selected value="detached">Detached</option>
            <option value="semi-detached">Semi-detached</option>
            <option value="terraced">Terraced</option>
            <option value="flat">Flat</option>
            <option value="cottage">Cottage</option>
            <option value="bungalow">Bungalow</option>
            <option value="mansion">Mansion</option>
          </select>
        </div>
        <div className='signup-input'>
          <p>Number of bedrooms</p>
          <input placeholder='Enter number of bedrooms..'/>
        </div>
        <div className='signup-input'>
          <p>Energy Voucher Code</p>
          <input placeholder='Enter a valid 8-digit EV Code'/>
        </div>
        <button className='create-button'>Create Account</button>
        <p>Already have an account ? <span className='login-hover' onClick={navigateToLogin}><a>Log in</a></span></p>  
        </>)}
    
      </div>
    </div>
  )
}

export default Signup