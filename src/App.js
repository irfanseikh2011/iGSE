import './App.css';
import Signup from './components/Signup/Signup';
import { BrowserRouter, Route, Routes,redirect ,useNavigate } from 'react-router-dom';
import Dashboard from './components/Dashboard/Dashboard';
import Signin from './components/Signup/Signin';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import jwt from 'jsonwebtoken'
import { useEffect } from 'react';

function App() {


  //  const token = localStorage.getItem('token');
  //  const navigate = useNavigate();

  // useEffect(() => {
  //   const token = localStorage.getItem('token');
  //     if(token){
  //     const user = jwt.decode(token);
  //     if(user) {
  //       isUser = true;
  //       redirect("/dashboard")
  //     }else {
  //       redirect("/")
  //     }
  //   }
  // },[])
 



  return (
    <div className="App">
       <BrowserRouter>
        <Routes>
          <Route exact path="/" element={ <Signup/>}/>
          <Route exact path="/signin" element={<Signin/>}/>
          <Route exact path='/dashboard' element={<Dashboard/>}/>
          <Route exact path='/AdminDashboard' element={<AdminDashboard/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
