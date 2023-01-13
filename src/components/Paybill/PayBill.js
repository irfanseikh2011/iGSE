import React, { useEffect, useState } from 'react'

const PayBill = ({data}) => {

  const [balance, setBalance] = useState();
  const [outstanding,setOutstanding] = useState();

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
    setOutstanding(() => data.data.outstanding);
}

async function payBill() {
  try{
    const response = await fetch('http://localhost:1337/api/paybill', {
    method: 'PUT',
    headers: {
        'Content-Type' : 'application/json',
    },
    body : JSON.stringify({
    customerID
  })
})

    const result = await response.json();
    console.log("bill paid",result);
}catch(e){
    console.log(e);
}
}

const handlePayNow = () => {
  if(balance< outstanding) {
    alert("Balance is low, please top up to pay the bill");
  } else {
    payBill();
    alert("Successfully paid the bill");
    getProfile();
  }
}



useEffect(()=> {
  getProfile();
},[])




  return (
    <div>
      <div>
        <h2>Your Balance is : £{balance}</h2>
        <h2>Your outstanding is : £{outstanding}</h2>
        <button onClick={handlePayNow}>Pay Now</button>
      </div>
    </div>
  )
}

export default PayBill