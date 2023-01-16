import React, { useEffect, useState } from 'react'
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js'

import { Pie } from 'react-chartjs-2';
import './statistics.css'


ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
);


const Statistics = () => {

    
    const [loading,setLoading] = useState(true);

    const [chartData, setChartData] = useState();

    const [propertyType,setPropertyType] = useState();

    const [rooms,setRooms] = useState();

    const [avgCost,setAvgCost] = useState();


    const [isLoaded,setIsLoaded] = useState(false);


    var dummyData =  {
        labels: ['Terraced', 'Detached', 'Semi-detached', 'Flat', 'Cottage', 'Bungalow','Mansion'],
        datasets: [{
            label: '# of properties',
            data: [4,1,2,4,6,8,2],
            backgroundColor: [
                'red',
                'blue',
                'green',
                'yellow',
                'pink',
                'brown',
                'orange'
            ],
            borderColor: [
                'red',
                'blue',
                'green',
                'yellow',
                'pink',
                'brown',
                'orange'
            ],
            borderWidth: 1
        }]
    };

    async function getPropertyCount(){
        const res = await fetch('http://localhost:1337/igse/propertycount', {
              method: 'GET',
              headers: {
                'Content-Type' : 'application/json',
              },
            })
    
            let resp = await res.json();


            setChartData({
                labels: ['Terraced', 'Detached', 'Semi-detached', 'Flat', 'Cottage', 'Bungalow','Mansion'],
                datasets: [{
                    label: '# of properties',
                    data: [resp[0].Terraced,resp[1].detached,resp[2].Semidetached,resp[3].Flat,resp[4].Cottage,resp[5].Bungalow,resp[6].Mansion],
                    backgroundColor: [
                        'red',
                        'blue',
                        'green',
                        'yellow',
                        'pink',
                        'brown',
                        'orange'
                    ],
                    borderColor: [
                        'red',
                        'blue',
                        'green',
                        'yellow',
                        'pink',
                        'brown',
                        'orange'
                    ],
                    borderWidth: 1
                }]
            })
            
    }

    console.log(chartData)

    useEffect(() => {
        getPropertyCount()

        setTimeout(() => {
            setLoading(false);
        },400);
    },[])


    const handlePropertyType = (e) => {
        setPropertyType(() => e.target.value);
      }


      const handleRooms = (e) => {
        setRooms(() => e.target.value);
      }



    async function getCost(){
        const res = await fetch(`http://localhost:1337/igse/${propertyType}/${rooms}`, {
            method: 'GET',
            headers: {
              'Content-Type' : 'application/json',
            },
          })
  
          let resp = await res.json();

          setAvgCost(() => resp.average_electricity_gas_cost_per_day);
          setIsLoaded(true);
    }
    



  return (
    <div className='container-stats'>
        <div className='heading'>
            <h1>Property Count</h1>
            <h1>Average Cost Finder</h1>
        </div>
        <div className='container-detail'>
        <div className='pie-chart'>
        {loading ? (<></>) : (<><Pie width="50%"
      data={loading ? dummyData : chartData }
      options={{
        title: {
          display: true,
          text: 'Property Count',
          fontSize: 20
        },
        legend: {
          display: true,
          position: 'right'
        }
      }}
    /></>)}
        
        </div>
      <div className='averageCost-container'>
      <div >
            <h3 className='head-average-property'>Property Type </h3>
            <select onChange={(e)=> handlePropertyType(e)} className='input-select'>
            <option selected value="detached">Detached</option>
            <option value="semi-detached">Semi-detached</option>
            <option value="terraced">Terraced</option>
            <option value="flat">Flat</option>
            <option value="cottage">Cottage</option>
            <option value="bungalow">Bungalow</option>
            <option value="mansion">Mansion</option>
          </select>
        </div>

        <div>
            <h3 className='head-average'>Number of bedrooms</h3>
            <input onChange={(e) => handleRooms(e)} className='input-bedroom' type="number" />
        </div>

        <button onClick={getCost} className='check-cost'>Check Cost</button>
        {isLoaded === false?(<></>) : avgCost ? ( <div>
            <h3 className='cost-result'>The Average cost is £ {avgCost}</h3>
        </div>) : (<>
            <h3 className='cost-result red'>Category does not exist {avgCost}</h3>
        </>)}
        </div>
       
       
      </div>
       
    </div>
  )
}

export default Statistics