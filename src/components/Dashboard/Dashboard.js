import React from 'react'
import './Dashboard.css'
import logo from './bulb.png'
import avator from './avator.png'

const Dashboard = () => {
  return (
    <div className='dashboard-body'>
      <div className='dashboard-aside'>
          <div className='dashboard-logo'><img style={{width:"50px",margin:"10px"}} alt="logo" src={logo}/><h2> iGSE </h2></div>
          <div className='dashboard-aside-buttons'>
            <button className='dashboard-button'>Profile</button>
            <button className='dashboard-button'>Submit Reading</button>
            <button className='dashboard-button'>View Bill</button>
            <button className='dashboard-button'>Pay Bill</button>
            <button className='dashboard-button'>Topup Voucher</button>
          </div>
          <div className='dashboard-logout'>
            <button className='dashboard-button'>LOGOUT</button>
          </div>
      </div>
      <div className='dashboard-main'>
         <div className='dashboard-main-profile-div'>
            <div className='space-hidden'>space</div>
            <div className='identity-div'><div className='overview-avator'><img src={avator} alt="avator"/></div>
            <div className='overview-name'><h3>Sekh Mohammad Irfan</h3></div></div>
            <div className='space-hidden'>space</div>
            <div className='space-hidden'>space</div>
            <div className='space-hidden'>space</div>
            <div className='space-hidden'>space</div>
         </div>
         <div className='dashboard-profile-details'>
            <div className='dashboard-detail'><h3>Username: </h3><h3 className='dashboard-detail-data'>sk@gmail.com</h3></div>
            <div className='dashboard-detail'><h3>Address: </h3><h3 className='dashboard-detail-data'>25/2/1C Darga Road, Kolkata - 700017</h3></div>
            <div className='dashboard-detail'><h3>Property Type: </h3><h3 className='dashboard-detail-data'>Detached</h3></div>
            <div className='dashboard-detail'><h3>Number of Rooms: </h3><h3 className='dashboard-detail-data'>4</h3></div>
            <div className='dashboard-detail'><h3>Total Credits Left: </h3><h3 className='dashboard-detail-data'>£200</h3></div>
         </div>

      </div>
    </div>
  )
}

export default Dashboard