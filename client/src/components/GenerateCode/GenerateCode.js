import React, { useEffect, useState } from 'react'

import './generateCode.css'

const GenerateCode = () => {

    const [active,setActive] = useState();
    const [expired,setExpired] = useState();
    const [codes,setCodes] = useState();
    const [loading, setLoading] = useState(true);

  async function getCodes() {
    try {
      const res = await fetch('http://localhost:1337/api/getCodes', {
        method: 'GET',
        headers: {
          'Content-Type' : 'application/json',
        }
      })
  
      const data = await res.json();
      setCodes(()=> data);
    } catch {
      console.log("Something went wrong in fetching the codes");
    }
  }




    async function generate() {
        try{
            const res = await fetch('http://localhost:1337/api/generateCode', {
                method: 'POST',
                headers: {
                  'Content-Type' : 'application/json',
                }
              })
          
              const data = await res.json();
              getActiveAndExpiry();
              getCodes();

              if(data.status === 'ok'){
                alert(data.message);
              }
        } catch {
            alert("Something went wrong! Try again.")
        }
    }

    async function getActiveAndExpiry() {
            const res = await fetch('http://localhost:1337/api/countCodes', {
                method: 'GET',
                headers: {
                  'Content-Type' : 'application/json',
                }
              })
          
              const data = await res.json();
              setActive(() => data.count);

              const exp = await fetch('http://localhost:1337/api/countExpiredCodes', {
                method: 'GET',
                headers: {
                  'Content-Type' : 'application/json',
                }
              })
          
              const data2 = await exp.json();
              setExpired(() => data2.count);
    }

    useEffect(() => {
        getActiveAndExpiry();
        getCodes().then(() => {
            setLoading(false);
        });
    },[])

    console.log(codes)


    if(loading){
      return (
        <div>Loading..</div>
      )
    }


  return (
    <div className='container-background'>
        <div className='container-outer'>
            <div className='code-container'>
            <h2>Generate new Voucher Code.</h2>
            <h3>Active Voucher Codes = {active}</h3>
            <h3>Expired Voucher Codes = {expired}</h3>
            <button className='generate-but' onClick={generate}>Generate</button>
            </div>

            <div className='code-container'>
            <h2>List of Voucher Codes</h2>
            <div className='list-heading'> 
            <h4 classname='head1'>Voucher Code</h4>
            <h4>Expired</h4>
            </div>
        
            <div className='list-value' style={{ overflowY: 'scroll'}}>
               {codes.map((item, index) => (
            <div className='list-value-item' key={index}>
              <h4> {item.code}</h4>
              <h4> {item.expired ? 'YES' : 'NO'}</h4>
              </div>
              ))}

            {/* {codes.map((item, index) => (
            <div className='list-value-item'  key={index}>
                 <h4> {item.expired ? 'YES' : 'NO'}</h4>
              </div>
              ))} */}

             </div>
            {/* <button className='generate-but' onClick={generate}>Generate</button> */}
            </div>
        </div>
    </div>
  )
}

export default GenerateCode