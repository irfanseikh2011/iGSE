import React, { useEffect, useState} from 'react'
import './Dashboard.css'
import logo from './bulb.png'
import avator from './avator.png'
import jwt from 'jsonwebtoken'
import { useNavigate, useLocation} from 'react-router-dom'
import Profile from '../Profile/Profile'
import Bill from '../Bills/Bill'
import MeterReading from '../Readings/MeterReading'
import Topup from '../Topup/Topup'
import PayBill from '../Paybill/PayBill'

const Dashboard = () => {

  const navigate = useNavigate();
  const {state} = useLocation();
  const {data} = state;
  const [view,setView] = useState('profile');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if(token){
      const user = jwt.decode(token);
      if(!user) {
        localStorage.removeItem('token');
        navigate('/');
      }
    } else {
      navigate('/');
    } 
  }, [])


  const logoutFunc = () => {
    localStorage.clear();
    navigate('/');
  }

  const profile = () => {
    setView(() => "profile")
  }

  const submitReading = () => {
    setView(() => "reading")
  }

  const viewBill = () => {
    setView(() => "viewbill")
  }

  const payBill = () => {
    setView(() => "paybill")
  }

  const topupVoucher = () => {
    setView(() => "topup")
  }


  return (
    <div className='dashboard-body'>
      <div className='dashboard-aside'>
          <div className='dashboard-logo'><img style={{width:"50px",margin:"10px"}} alt="logo" src={logo}/><h2> iGSE </h2></div>
          <div className='dashboard-aside-buttons'>
            <button onClick={profile} className='dashboard-button'>Profile</button>
            <button onClick={submitReading} className='dashboard-button'>Submit Reading</button>
            <button onClick={viewBill} className='dashboard-button'>View Bill</button>
            <button onClick={payBill} className='dashboard-button'>Pay Bill</button>
            <button onClick={topupVoucher} className='dashboard-button'>Topup Voucher</button>
          </div>
          <div className='dashboard-logout'>
            <button onClick={logoutFunc} className='dashboard-button'>LOGOUT</button>
          </div>
      </div>
      <div className='dashboard-main'>
         <div className='dashboard-main-profile-div'>
            <div className='space-hidden'>space</div>
            <div className='identity-div'><div className='overview-avator'><img src={avator} alt="avator"/></div>
            <div className='overview-name'><h3>{data.customerID}</h3></div></div>
            <div className='space-hidden'>space</div>
            <div className='space-hidden'>space</div>
            <div className='space-hidden'>space</div>
            <div className='space-hidden'>space</div>
         </div>
         {view === 'profile' ? <Profile data={data} /> : view === 'viewbill' ? <Bill/> : view === 'reading' ? <MeterReading/> : view === 'topup' ? <Topup/> : view === 'paybill' ? <PayBill/> : ''}
        {/* //  <div className='dashboard-profile-details'>
        //     <div className='dashboard-detail'><h3>Username: </h3><h3 className='dashboard-detail-data'>{data.customerID}</h3></div>
        //     <div className='dashboard-detail'><h3>Address: </h3><h3 className='dashboard-detail-data'>{data.address}</h3></div>
        //     <div className='dashboard-detail'><h3>Property Type: </h3><h3 className='dashboard-detail-data'>{data.propertyType}</h3></div>
        //     <div className='dashboard-detail'><h3>Number of Rooms: </h3><h3 className='dashboard-detail-data'>{data.numberOfRooms}</h3></div>
        //     <div className='dashboard-detail'><h3>Total Credits Left: </h3><h3 className='dashboard-detail-data'>£{data.balance}</h3></div>
        //  </div> */}

      </div>
    </div>
  )
}

export default Dashboard