import React, { useEffect, useState } from 'react'

const GenerateCode = () => {

    const [active,setActive] = useState();
    const [expired,setExpired] = useState();


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
    },[])




  return (
    <div>
        <div>
            <h2>Generate new Voucher Code.</h2>
            <h3>Active Voucher Codes = {active}</h3>
            <h3>Expired Voucher Codes = {expired}</h3>
            <button onClick={generate}>Generate</button>
        </div>
    </div>
  )
}

export default GenerateCode