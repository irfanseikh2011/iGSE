import React from 'react'

const Profile = ({data}) => {
  return (
    <div className='dashboard-profile-details'>
            <div className='dashboard-detail'><h3>Username: </h3><h3 className='dashboard-detail-data'>{data.customerID}</h3></div>
            <div className='dashboard-detail'><h3>Address: </h3><h3 className='dashboard-detail-data'>{data.address}</h3></div>
            <div className='dashboard-detail'><h3>Property Type: </h3><h3 className='dashboard-detail-data'>{data.propertyType}</h3></div>
            <div className='dashboard-detail'><h3>Number of Rooms: </h3><h3 className='dashboard-detail-data'>{data.numberOfRooms}</h3></div>
            <div className='dashboard-detail'><h3>Total Credits Left: </h3><h3 className='dashboard-detail-data'>£{data.balance}</h3></div>
    </div>
  )
}

export default Profile