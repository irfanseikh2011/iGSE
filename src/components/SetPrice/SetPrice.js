import React, { useEffect, useState } from 'react'
import './SetPrice.css'

const SetPrice = () => {

    const [change,setChange] = useState([false,0]);
    const [rates,setRates] = useState([]);
    const [dayRate, setDayRates] = useState();
    const [nightRate, setNightRates] = useState();
    const [gas, setGas] = useState();
    const [standingRate, setStandingRate] = useState();

    const changeRates = () => {
        if(change[1] === 0){
            setChange(()=> [true,1]);
        }  
        else {
            setChange(() => [false,0])
        }
    }

    console.log(rates)


    async function getRates(){
            const res = await fetch('http://localhost:1337/api/getRates', {
              method: 'GET',
              headers: {
                'Content-Type' : 'application/json',
              },
            })
    
            let data = await res.json();
            setRates(() => [data.data[0].dayRate,data.data[0].nightRate,data.data[0].gas,data.data[0].standingRate])
        }


    // async function postRates(){

    //     if(property === null || property.length === 0){
    //         return alert("Please enter the rate.")
    //     }

    //     const res = await fetch('http://localhost:1337/api/postRate', {
    //         method: 'POST',
    //         headers: {
    //           'Content-Type' : 'application/json',
    //         },
    //         body : JSON.stringify({
    //             property,
    //             type
    //         })
    //       })
      
    //       const data = await res.json();
    //       getRates();
    //       if(data.status === "ok")
    //       {
    //         alert(data.message);
    //       }
    // }


    const handleDay = (e) => {
        setDayRates(() => e.target.value)
    }

    const handleNight = (e) => {
        setNightRates(() => e.target.value)
    }

    const handleGas = (e) => {
        setGas(() => e.target.value)
    }

    const handleStanding = (e) => {
        setStandingRate(() => e.target.value)
    }


    const handleDayChange = async (e) => {

        e.preventDefault();

        const res = await fetch('http://localhost:1337/api/postDayRate', {
            method: 'POST',
            headers: {
              'Content-Type' : 'application/json',
            },
            body : JSON.stringify({
                dayRate
            })
          })
      
          const data = await res.json();
          getRates();

          if(data.status === "ok")
          {
            alert(data.message);
          }
        
    }


    const handleNightChange = async (e) => {

        e.preventDefault();
        const res = await fetch('http://localhost:1337/api/postNightRate', {
            method: 'POST',
            headers: {
              'Content-Type' : 'application/json',
            },
            body : JSON.stringify({
                nightRate
            })
          })
      
          const data = await res.json();
          getRates();
          
          if(data.status === "ok")
          {
            alert(data.message);
          }
        
        
    }


    const handleGasChange = async (e) => {

        e.preventDefault();

        const res = await fetch('http://localhost:1337/api/postGasRate', {
            method: 'POST',
            headers: {
              'Content-Type' : 'application/json',
            },
            body : JSON.stringify({
                gas
            })
          })
      
          const data = await res.json();
          getRates();
          
          if(data.status === "ok")
          {
            alert(data.message);
          }
        
        
       
    }


    const handleStandingChange = async (e) => {

        e.preventDefault();
        const res = await fetch('http://localhost:1337/api/postStandingRate', {
            method: 'POST',
            headers: {
              'Content-Type' : 'application/json',
            },
            body : JSON.stringify({
                standingRate
            })
          })
      
          const data = await res.json();
          getRates();
          
          if(data.status === "ok")
          {
            alert(data.message);
          }
        
        
       
    }





        useEffect(() => {
            getRates();
        },[])




  return (
    <div>
        <div>
            <h2>Current Electricity Day Rate : {rates[0]}</h2>
            <h2>Current Electricity Night Rate : {rates[1]}</h2>
            <h2>Current Gas Rate : {rates[2]}</h2>
            <h2>Current Standing Rate : {rates[3]}</h2>
            <button onClick={changeRates}>{change[1]===1 ? 'X':'Change Rates'}</button>
            <div className={change[0]==true ? "displayRates":"hiddenRates"}>
                <h3>New Rates</h3>
                <input onChange={handleDay} placeholder='Enter the new Day rates'/><br></br> <button onClick={(e) => handleDayChange(e)}>Change</button><br></br>
                <input onChange={handleNight} placeholder='Enter the new Night rates'/><br></br><button onClick={(e) => handleNightChange(e)}>Change</button><br></br>
                <input onChange={handleGas} placeholder='Enter the new Gas rates'/><br></br><button onClick={(e) =>handleGasChange(e)}>Change</button><br></br>
                <input onChange={handleStanding} placeholder='Enter the new Standing rates'/><br></br><button onClick={(e) =>handleStandingChange(e)}>Change</button><br></br>
                {/* <button onClick={postRates}>Change </button> */}
            </div>
        </div>
    </div>
  )
}

export default SetPrice