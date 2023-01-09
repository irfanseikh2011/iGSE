import React, { useEffect, useState } from 'react'
import { QrReader } from 'react-qr-reader';



const Topup = ({data}) => {

    const [topUp, setTopUp] = useState(false);
    const [qrCode, setQrCode] = useState();
    const [balance, setBalance] = useState(data.balance)

    const customerID = data.customerID;

    async function getProfile(){
        const res = await fetch(`http://localhost:1337/api/profile/${customerID}`, {
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

      const res = await fetch('http://localhost:1337/api/topup', {
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json',
      },
      body : JSON.stringify({
        customerID,
        qrCode,
      })
    }).then(data => data.json())
    .then(res => {
        getProfile();
    }) 

    console.log(data)
  }



  return (
    <div>
        <div>
            <h2>Current Balance: £{balance}</h2>
            <h3>Top up your account</h3>
            <input value={qrCode} onChange={(e)=> handleCode(e)} placeholder='Enter a valid 8-digit EV Code'/>
            <button onClick={handleButton}>{topUp ? 'Close' : 'Scan QR'}</button>
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

          <button onClick={recharge}>Recharge</button>
        </div>
    </div>
  )
}

export default Topup