import React, { useEffect, useState } from 'react'

const Profile = ({data}) => {

  const [balance, setBalance] = useState();

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
    
}

useEffect(()=> {
  getProfile();
},[])




  return (
    <div className='dashboard-profile-details'>
            <div className='dashboard-detail'><h3>Username: </h3><h3 className='dashboard-detail-data'>{data.customerID}</h3></div>
            <div className='dashboard-detail'><h3>Address: </h3><h3 className='dashboard-detail-data'>{data.address}</h3></div>
            <div className='dashboard-detail'><h3>Property Type: </h3><h3 className='dashboard-detail-data'>{data.propertyType}</h3></div>
            <div className='dashboard-detail'><h3>Number of Rooms: </h3><h3 className='dashboard-detail-data'>{data.numberOfRooms}</h3></div>
            <div className='dashboard-detail'><h3>Total Credits Left: </h3><h3 className='dashboard-detail-data'>£{balance}</h3></div>
    </div>
  )
}

export default Profile