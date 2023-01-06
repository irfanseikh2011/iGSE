import React, { useState } from 'react'
import './Signup.css'
import data from '../userData'
import {useNavigate } from 'react-router-dom'


const Signup = () => {

  const navigate = useNavigate();

  const [isSignIn, setIsSignIn] = useState(false);
  const [isValidUser,setIsValidUser] = useState(false);
  const [signInTry,setSignInTry] = useState(0);
  const [customerID,setcustomerID] = useState();
  const [password,setPassword] = useState();
  const [address, setAddress] = useState();
  const [propertyType, setPropertyType] = useState();
  const [numberOfRooms, setnumberOfRooms] = useState();
  const [balance, setBalance] = useState();

  const navigateToLogin = () => {
    setIsSignIn(true);
  }

  const navigateToSignUp = () => {
    setIsSignIn(false);
    setSignInTry(0);
  }

  async function registerUser(e) {
    e.preventDefault();

    const res = await fetch('http://localhost:1337/api/register', {
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json',
      },
      body : JSON.stringify({
        customerID,
        password,
        address,
        propertyType,
        numberOfRooms,
        balance,
      })
    })

    const data = await res.json();

    console.log(data)
  }

  


  const validateSignIn = () => {
    data.map((i) => {
      if(i.customerID === customerID)
        {
          if(i.password === password)
            setIsValidUser(true);
        }
    })

    if(isValidUser)
      navigate('/dashboard');

    setSignInTry((prev) => prev + 1);
  }


  const handleEmail = (e) => {
    setcustomerID(() => e.target.value);
  }

  const handlePassword = (e) => {
    setPassword(() => e.target.value);
  }


  const handleAddress = (e) => {
    setAddress(() => e.target.value);
  }

  const handlePropertyType = (e) => {
    setPropertyType(() => e.target.value);
  }

  const handleRooms = (e) => {
    setnumberOfRooms(() => e.target.value);
  }

  const handleCode = (e) => {
    setBalance(() => e.target.value);
  }

  return (
    <div className='signup'>
      <div className='bg'></div>
      <div className='signup-details'>
        <h1 style={{marginBottom:"1vh"}}>Welcome to iGSE</h1>
        {isSignIn ? (<> 
          <div className='signup-input'>
          <p className={isValidUser === false && (signInTry === 1) ? 'signin-error-msg' : "error-msg-hidden"}>Incorrect email or password.</p>
          <p>Customer ID</p>
          <input onChange={(e) => handleEmail(e)} type="email" placeholder='johndoe@gmail.com..'/>
        </div>
        <div className='signup-input'>
          <p>Password</p>
          <input onChange={(e) => handlePassword(e)} type="password" placeholder='Enter your Password'/>
        </div>
        <button onClick={validateSignIn} className='create-button'>Sign In</button>
        <p>Create an account. <span className='login-hover' onClick={navigateToSignUp}><a>Register</a></span></p>
        </>): (<>
          <div className='signup-input'>
          <p>Customer ID</p>
          <input onChange={(e)=> handleEmail(e)} placeholder='johndoe@gmail.com..'/>
        </div>
        <div className='signup-input'>
          <p>Password</p>
          <input type="password" onChange={(e)=> handlePassword(e)} placeholder='Enter your Password'/>
        </div>
        <div className='signup-input'>
          <p>Address</p>
          <input onChange={(e)=> handleAddress(e)} placeholder='Enter your Address here'/>
        </div>
        <div className='signup-input' style={{marginBottom:"2vh"}}>
          <p>Property Type</p>
          <select onChange={(e)=> handlePropertyType(e)} className='input-select'>
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
          <input onChange={(e)=> handleRooms(e)} placeholder='Enter number of bedrooms..'/>
        </div>
        <div className='signup-input'>
          <p>Energy Voucher Code</p>
          <input onChange={(e)=> handleCode(e)} placeholder='Enter a valid 8-digit EV Code'/>
        </div>
        <button onClick={registerUser} className='create-button'>Create Account</button>
        <p>Already have an account ? <span className='login-hover' onClick={navigateToLogin}><a>Log in</a></span></p>  
        </>)}
    
      </div>
    </div>
  )
}

export default Signup