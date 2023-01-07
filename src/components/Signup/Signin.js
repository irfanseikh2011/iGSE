import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Signin = () => {
    const navigate = useNavigate();
    const [isValidUser,setIsValidUser] = useState(false);
    const [signInTry,setSignInTry] = useState(0);
    const [customerID,setcustomerID] = useState();
    const [password,setPassword] = useState();
   

    const navigateToSignUp = () => {
        navigate('/')
        setSignInTry(0);
      }

      async function loginUsers(e){
        e.preventDefault();
    
        const res = await fetch('http://localhost:1337/api/login', {
          method: 'POST',
          headers: {
            'Content-Type' : 'application/json',
          },
          body : JSON.stringify({
            customerID,
            password,
          })
        })
    
        const data = await res.json();
    
        if(data.user){
          localStorage.setItem('token', data.user);
          setIsValidUser(true);
          navigate('/dashboard');
        } else {
          setSignInTry((prev) => prev + 1);
        }
    
        console.log(data)
      }

      const handleEmail = (e) => {
        setcustomerID(() => e.target.value);
      }
    
      const handlePassword = (e) => {
        setPassword(() => e.target.value);
      }


  return (
        <div className='signup'>
        <div className='bg'></div>
        <div className='signup-details'>
        <h1 style={{marginBottom:"1vh"}}>Welcome to iGSE</h1>
        <> 
          <div className='signup-input'>
          <p className={isValidUser === false && (signInTry === 1) ? 'signin-error-msg' : "error-msg-hidden"}>Incorrect email or password.</p>
          <p>Customer ID</p>
          <input onChange={(e) => handleEmail(e)} type="email" placeholder='johndoe@gmail.com..'/>
        </div>
        <div className='signup-input'>
          <p>Password</p>
          <input onChange={(e) => handlePassword(e)} type="password" placeholder='Enter your Password'/>
        </div>
        <button onClick={(e) => loginUsers(e)} className='create-button'>Sign In</button>
        <p>Create an account. <span className='login-hover' onClick={navigateToSignUp}><a>Register</a></span></p>
        </>
    </div>
    </div>
)}

export default Signin