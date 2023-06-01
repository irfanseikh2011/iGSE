import React, { useEffect, useState } from 'react'
import './profile.css'

const Profile = ({data}) => {

  const [balance, setBalance] = useState();

  const customerID = data.customerID;

  async function getProfile(){
    const res = await fetch(`https://igse-gfv8.onrender.com/api/profile/${customerID}`, {
        method: 'GET',
        headers: {
        'Content-Type' : 'application/json',
        },
        
    })

    let data = await res.json();
    setBalance(() => data.data.balance);
    
}

useEffect(()=> {
  getProfile();
},[])




  return (
    <div className='background'>
      <div className='profile-outer-container'>
          <div className='profile-container'>
          <div className=''><h3>Username: </h3><h3 className='dashboard-detail-data'>{data.customerID}</h3></div>
            <div className=''><h3>Address: </h3><h3 className='dashboard-detail-data'>{data.address}</h3></div>
            <div className=''><h3>Property Type: </h3><h3 className='dashboard-detail-data'>{data.propertyType}</h3></div>
            <div className=''><h3>Number of Rooms: </h3><h3 className='dashboard-detail-data'>{data.numberOfRooms}</h3></div>
            <div className=''><h3>Total Credits Left: </h3><h3 className='dashboard-detail-data'>£{balance}</h3></div>
          </div>
      </div>
    </div>
  )
}

export default Profile