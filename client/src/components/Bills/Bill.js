import React, { useEffect, useState } from 'react'
import './bill.css'

const Bill = ({data}) => {
  const id = data.customerID;
  const [date, setDate] = useState();
  const [dayElectricity, setdayElectricity] = useState();
  const [nightElectricity, setnightElectricity] = useState();
  const [gas,setGas] = useState();
  const [rates,setRates] = useState();
  const [outstanding,setOutstanding] = useState(data.outstanding);

  async function getBill() {
    try {
        const res = await fetch(`https://igse-gfv8.onrender.com/api/getBill/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type' : 'application/json',
          },
        })

        let data = await res.json();
        console.log(data)
        if(data.data===null){
            data = {
                data: {
                    date: "XXXX-XX-XX",
                    dayElectricity: "0",
                    nightElectricity: 0,
                    gas: 0
                }
            }
        }

        setDate(()=> data.data.date.substring(0,10));
        setdayElectricity(()=> data.data.dayElectricity);
        setnightElectricity(() => data.data.nightElectricity);
        setGas(()=> data.data.gas);

    } catch (e) {
        console.log("Something went wrong in getting the bill",e);
    }
  } 

  async function getOutstanding(){
    try {
      const res = await fetch(`https://igse-gfv8.onrender.com/api/profile/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type' : 'application/json',
          },
        })

        let data = await res.json();
        setOutstanding(() => Number.parseFloat(data.data.outstanding).toFixed(2))
    } catch(e) {
      console.log(e);
    }
  }


  async function getRates() {
    try {
        const res = await fetch('https://igse-gfv8.onrender.com/api/getRates', {
          method: 'GET',
          headers: {
            'Content-Type' : 'application/json',
          },
        })

        let data = await res.json();

        setRates(data);
    } catch(e) {
        console.log(e);
    }
  }


  useEffect(()=> {
    getBill();
    getRates();
    getOutstanding();
  },[])

  return (
    <div className='background'>
        <div className='bill-outer-container'>
          <div className='bill-container'>
          <h2>Meter Reading Date: {date}</h2>
            <h2>Day Electricity Reading : {dayElectricity}</h2>
            <h2>Night Electricity Reading : {nightElectricity}</h2>
            <h2>Gas Reading : {gas}</h2>
            <h2>Total outstanding = £{outstanding}</h2>
          </div>
        </div>
    </div>
  )
}

export default Bill