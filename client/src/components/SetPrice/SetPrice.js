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
            const res = await fetch('https://igse-gfv8.onrender.com/api/getRates', {
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

    //     const res = await fetch('https://igse-gfv8.onrender.com/api/postRate', {
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

        

        if(dayRate === ''){
            return alert("Please enter day rate before changing.")
        }

        const res = await fetch('https://igse-gfv8.onrender.com/api/postDayRate', {
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

        if(nightRate === undefined){
            return alert("Please enter night rate before changing.")
        }



        e.preventDefault();
        const res = await fetch('https://igse-gfv8.onrender.com/api/postNightRate', {
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

        if(gas === undefined){
            return alert("Please enter gas rate before changing.")
        }

        e.preventDefault();

        const res = await fetch('https://igse-gfv8.onrender.com/api/postGasRate', {
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

        if(standingRate === undefined ){
            return alert("Please enter standing rate before changing.")
        }

        e.preventDefault();
        const res = await fetch('https://igse-gfv8.onrender.com/api/postStandingRate', {
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
    <div className='container'>
        <div className='price-container'>
            <div className='container-details'>
            <div> <h2 className='price-data'>Day Rate </h2> <h2 className='price-data'>£{rates[0]}</h2></div>
            <div><h2 className='price-data'>Night Rate </h2><h2 className='price-data'>£{rates[1]}</h2></div>
            <div><h2 className='price-data'>Gas Rate </h2><h2 className='price-data'>£{rates[2]}</h2></div>
            <div> <h2 className='price-data'>Standing Rate </h2> <h2 className='price-data last-rate'>£{rates[3]}</h2></div>
            <div className='button-container'>
                <button className={change[1]===1 ? 'change-rate red':'change-rate'} onClick={changeRates}>{change[1]===1 ? 'X':'Change Rates'}</button>
            </div>
           
            <div className={change[0]==true ? "displayRates":"hiddenRates"}>
                <h3>New Rates</h3>
                <div className='flex-input'>
                <input className='rate-input' onChange={handleDay} placeholder='Enter the new Day rates'/><button className='changeButton' onClick={(e) => handleDayChange(e)}>Change</button>
                </div>
                <div className='flex-input'><input className='rate-input' onChange={handleNight} placeholder='Enter the new Night rates'/><button className='changeButton' onClick={(e) => handleNightChange(e)}>Change</button></div>
                <div className='flex-input'><input className='rate-input' onChange={handleGas} placeholder='Enter the new Gas rates'/><button className='changeButton' onClick={(e) =>handleGasChange(e)}>Change</button></div>
                <div className='flex-input'><input className='rate-input' onChange={handleStanding} placeholder='Enter the new Standing rates'/><button className='changeButton' onClick={(e) =>handleStandingChange(e)}>Change</button></div>
                
                {/* <button onClick={postRates}>Change </button> */}
            </div>

            </div>
            
           
           
        </div>
    </div>
  )
}

export default SetPrice