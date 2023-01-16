import React, { useEffect, useState} from 'react'
import './Dashboard.css'
import logo from './bulb.png'
import avator from './avator.png'
import jwt from 'jsonwebtoken'
import { useNavigate, useLocation} from 'react-router-dom'
import Statistics from '../Statistics/Statistics'
import SetPrice from '../SetPrice/SetPrice'
import ViewBills from '../Bills/ViewBills'
import GenerateCode from '../GenerateCode/GenerateCode'

const AdminDashboard = () => {

  const navigate = useNavigate();
  const {state} = useLocation();
  const {data} = state;


  const [view,setView] = useState('statistics');


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


  const statistics = () => {
    setView(() => "statistics")
  }

  const unitPrice = () => {
    setView(() => "unitPrice")
  }

  const viewBills = () => {
    setView(() => "viewBills")
  }

  const generateCode = () => {
    setView(() => "generateCode")
  }



  return (
    <div className='dashboard-body'>
      <div className='dashboard-aside'>
          <div className='dashboard-logo'><img style={{width:"50px",margin:"10px"}} alt="logo" src={logo}/><h2 className='igse'> iGSE</h2></div>
          <div className='dashboard-aside-buttons'>
            <button onClick={statistics} className={view==='statistics' ? 'dashboard-button active-but': 'dashboard-button'}>Statistics</button>
            <button onClick={unitPrice} className={view==='unitPrice' ? 'dashboard-button active-but': 'dashboard-button'}>Set Unit Price</button>
            <button onClick={viewBills} className={view==='viewBills' ? 'dashboard-button active-but': 'dashboard-button'}>View Bills</button>
            <button onClick={generateCode} className={view==='generateCode' ? 'dashboard-button active-but': 'dashboard-button'}>Generate Voucher Codes</button>
          </div>
          {/* <div className='dashboard-logout'>
            <button onClick={logoutFunc} className='dashboard-button'>Logout</button>
          </div> */}
      </div>
      <div className='dashboard-main'>
         <div className='dashboard-main-profile-div'>
            <div className='space-hidden'>space</div>
            <div className='identity-div'><div className='overview-avator admin-pic'><img src={avator} alt="avator"/></div>
            <div className='overview-name'><h3>ADMINISTRATOR</h3><div className='logout-link' onClick={logoutFunc}>Logout</div></div></div>
            <div className='space-hidden'>space</div>
            <div className='space-hidden'>space</div>
            <div className='space-hidden'>space</div>
            <div className='space-hidden'>space</div>
         </div>
      
         {view === 'statistics' ? <Statistics /> : view === 'unitPrice' ? <SetPrice/> : view === 'viewBills' ? <ViewBills/> :  view === 'generateCode' ? <GenerateCode/> : ''}

      </div>
    </div>
  )
}

export default AdminDashboard