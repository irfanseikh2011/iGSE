import './App.css';
import Signup from './components/Signup/Signup';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard/Dashboard';

function App() {
  return (
    <div className="App">
       <BrowserRouter>
        <Routes>
          <Route exact path="/" element={ <Signup/>}/>
          <Route exact path="/dashboard" element={ <Dashboard />}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
