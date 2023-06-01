import React, { useEffect, useState } from 'react'
import { QrReader } from 'react-qr-reader';
import './topup.css'



const Topup = ({data}) => {

    const [topUp, setTopUp] = useState(false);
    const [qrCode, setQrCode] = useState();
    const [balance, setBalance] = useState(data.balance)

    const customerID = data.customerID;

    async function getProfile(){
        const res = await fetch(`https://igse-gfv8.onrender.com/api/profile/${customerID}`, {
            method: 'GET',
            headers: {
            'Content-Type' : 'application/json',
            },
            
        })

        let data = await res.json();
        setBalance(() => data.data.balance);
        
    }

    useEffect(() => {
        getProfile();
    },[])

    // console.log(user)

    const handleCode = (e) => {
        setQrCode(() => e.target.value)
    }

    const handleButton = () => {
        if(topUp){
            setTopUp(false);
        }else{
            setTopUp(true);
        }
    }

    const recharge = async (e) => {
        e.preventDefault();

        try{
          const res = await fetch('https://igse-gfv8.onrender.com/api/topup', {
          method: 'POST',
          headers: {
            'Content-Type' : 'application/json',
          },
          body : JSON.stringify({
          customerID,
          qrCode,
        })
      })
    
        const data = await res.json();

        if(data.status === 'Coupon Code Expired'){
          alert("Coupon Code Expired");
        }else if(data.status === 'Coupon Code is Invalid'){
          alert("Coupon Code is Invalid");
        }
        getProfile();
        } catch(e) {
          console.log(e);
        }

      

    
    // .then(data => data.json())
    // .then(res => {
    //     getProfile();
    // }) 

    console.log(data)
  }



  return (
    <div className='background'>
        <div className='topup-outer-container'>
          <div className='topup-container'>
          <h2>Current Balance: £{balance}</h2>
            <h3>Top up your account</h3>
            <div className='topup-input-detail'> <input className='topup-input' value={qrCode} onChange={(e)=> handleCode(e)} placeholder='Enter a valid 8-digit EV Code'/>
            <button className='topup-but' onClick={handleButton}>{topUp ? 'Close' : 'Scan QR'}</button></div>
           
          <div className={topUp ? "qrReader" : "hidden qrReader"} >
          {topUp ? (<QrReader style={{ width: "100%" }} onResult={(res,err) => {
            if(res){
              setQrCode(res.text);
            //   setBalance(() => res.text);
            } 
            if(err)
            {
              console.info(err)
            }
          }}/>) : <></>}
          </div>

          <button className='recharge-but' onClick={recharge}>Recharge</button>
          </div>
           
        </div>
    </div>
  )
}

export default Topup