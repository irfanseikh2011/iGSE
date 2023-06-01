import React, { useEffect, useState } from 'react'

import './ViewBill.css'

const ViewBills = () => {

  const [bills, setBills] = useState();
  const [loading, setLoading] = useState(true);


  async function getBills(){

    const res = await fetch('https://igse-gfv8.onrender.com/api/getAllBills', {
      method: 'GET',
      headers: {
        'Content-Type' : 'application/json',
      },
    })

    let data = await res.json();


    console.log(data.data)
    setBills(() => data.data)
    setLoading(false);
  }

  useEffect(()=> {
    getBills();
  },[])


  return (
    <div className='background'>
      <div className='scrolable'>
        <div>
          <h1>ALL ELECTRICITY BILLS:</h1>
          {loading ? (<></>) : (<> <div className='all-bill-container'>
            {bills.map(item => (
                <div key={item.id}>
                  <div className='customer-details'><h2>CustomerID: {item.customerID} </h2>
                    {item.outstanding ? (<h2>Outstanding: £ {Number.parseFloat(item.outstanding).toFixed(2)}</h2>) : (<h2>PAID</h2>)}
                   {/* <h2>Outstanding: £{item.outstanding ? Number.parseFloat(item.outstanding).toFixed(2) : "PAID"}</h2> */}
                   </div>
                    <div className="customer-readings">
                        {item.bills.map((subItem,i )=> (
                            <div key={subItem.id}>
                              <div className='customer-reading-details'>
                                <h3 className='reading-data'>{i+1}.</h3>
                                <h3 className='reading-data'>Day Electricity Readings :{subItem.dayElectricity}</h3>
                                <h3 className='reading-data'> Night Electricity Readings :{subItem.nightElectricity}</h3>
                                <h3 className='reading-data'>Gas Readings :{subItem.gas}</h3>
                                <h3 className='reading-data'> Date : {subItem.date.substring(0,10)}</h3>
                              </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div></>)}
       
        </div>
      </div>
    </div>
  )
}

export default ViewBills