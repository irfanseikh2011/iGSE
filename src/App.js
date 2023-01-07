import './App.css';
import Signup from './components/Signup/Signup';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard/Dashboard';
import Signin from './components/Signup/Signin';

function App() {
  return (
    <div className="App">
       <BrowserRouter>
        <Routes>
          <Route exact path="/" element={ <Signup/>}/>
          <Route exact path="/dashboard" element={ <Dashboard />}/>
          <Route exact path="/signin" element={<Signin/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
