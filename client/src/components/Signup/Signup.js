import React, { useState,useEffect  } from 'react'
import './Signup.css'
import {useNavigate } from 'react-router-dom'
import { QrReader } from 'react-qr-reader'
import './Error.css'



const Signup = () => {

  const navigate = useNavigate();
  const [customerID,setcustomerID] = useState();
  const [password,setPassword] = useState();
  const [address, setAddress] = useState();
  const [propertyType, setPropertyType] = useState('Detached');
  const [numberOfRooms, setnumberOfRooms] = useState();
  const [balance, setBalance] = useState();
  const [qrCode, setQrCode] = useState("");
  const [Scan,setScan] = useState(false); 
  const [isMobile, setIsMobile] = useState(false);



  const navigateToLogin = () => {
    navigate('/signin')
  }


  useEffect(() => {
    const checkIsMobile = () => {
      const isMobileDevice = window.matchMedia('(max-width: 1250px)').matches;
      const isTouchEventSupported = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
      
      setIsMobile(isMobileDevice && isTouchEventSupported);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);




  async function registerUser(e) {
    e.preventDefault();
    console.log(numberOfRooms)
    if(customerID === "" || password === "" || address === "" || numberOfRooms === "" || balance === "" ){
      return alert("The form is incomplete");
    }

    const res = await fetch('https://igse-gfv8.onrender.com/api/register', {
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

    if(data.status ==='ok')
    {
      alert("Account Successfully Registered..")
      navigate('/signin')
    }else if(data.message === "Code Invalid"){
      alert("Code is Invalid");
    } else if(data.message === "Code Expired"){
      alert("Code is Expired");
    } else {
      alert("There was an error!");
    }

    console.log(data)
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
    setQrCode(() => e.target.value)
    setBalance(() => e.target.value);
  }

  const openGithub = () => {
    window.open("https://github.com/irfanseikh2011/iGSE", "_blank");
  }


  if(isMobile){
    return (
      <div className="error-page">
        <div className="error-container">
          <h1 className="error-heading">Oops!</h1>
          <p className="error-message">Mobile Device Detected.</p>
          <p className="error-description">
          Apologies for the inconvenience, but the site is not mobile-friendly. Please try again using a desktop.
          </p>
        </div>
      </div>
    );
  }



  return (
    <div className='signup'>
      <div className='bg'></div>
      <div className='signup-details'>
        <h1 style={{marginBottom:"1vh"}}>Welcome to iGSE</h1>
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
          <input value={qrCode} onChange={(e)=> handleCode(e)} placeholder='Enter a valid 8-digit EV Code'/>
          <div className={Scan ? "qrReader" : "hidden qrReader"} >
          {Scan ? (<QrReader style={{ width: "100%" }} onResult={(res,err) => {
            if(res){
              setQrCode(res.text);
              setBalance(() => res.text);
              // setScan(false)
            } 
            if(err)
            {
              console.info(err)
            }
          }}/>) : <></>}
          </div>
       
          <br/><button className='create-button scan-button' onClick={()=> Scan ? setScan(false) : setScan(true)} >{Scan ? "Stop Scanning" : "Scan Code"}</button>
        </div>
        <button onClick={registerUser} className='create-button'>Create Account</button>
        <p>Already have an account ? <span className='login-hover' onClick={navigateToLogin}><a>Log in</a></span></p>  
        <h4>Don't have a Voucher code ? <span onClick={openGithub} className='login-hover'>Get it here</span></h4>
      </div>
    </div>
  )
}

export default Signup


