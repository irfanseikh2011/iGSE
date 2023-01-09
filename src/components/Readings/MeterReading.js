import React, { useState } from 'react'

const MeterReading = ({data}) => {

 let todaysDate = new Date();
 let dateString = todaysDate.toISOString().substring(0, 10);

 const [date,setDay] = useState();
 const [dayElectricity,setDayElec] = useState();
 const [nightElectricity,setNightElec] = useState();
 const [gas,setGas] = useState();


 const user = data.customerID;




 async function submitReading(e){
    e.preventDefault();

    try {
        const res = await fetch('http://localhost:1337/api/submitreading', {
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json',
      },
      body : JSON.stringify({
        date,
        dayElectricity ,
        nightElectricity,
        gas,
        user
      })
    })


    const data = await res.json();

    alert("Readings Submitted Successfully")
    console.log(data)
    } catch {
        alert("Something went wrong")
    }
    

    console.log(data);
   
  }


  const handleDate = (e) => {
    setDay(() => e.target.value);
  }

  const handleDayElec = (e) => {
    setDayElec(() => e.target.value);
  }

  const handleNightElec = (e) => {
    setNightElec(() => e.target.value);
  }

  const handleGas = (e) => {
    setGas(() => e.target.value);
  }



  return (
    <div>
        <div>
            <h2>Submit Your Electricty and Gas Readings.</h2>
        </div>
        <div>
            <h3>Submission Date: </h3>
            <input onChange={handleDate} type="date" defaultValue={dateString}/>
            <h3>Electricity Consumption during day : </h3>
            <input onChange={handleDayElec} type="number"/><span> kWh</span>
            <h3>Electricity Consumption during night : </h3>
            <input onChange={handleNightElec} type='number' /><span> kWh</span>
            <h3>Gas Consumption :</h3>
            <input onChange={handleGas} type="number" /><span> kWh</span><br></br>
            <button onClick={(e) => submitReading(e)}>Submit Reading</button>
        </div>

    </div>
  )
}

export default MeterReading