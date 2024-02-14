import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, } from "react-router-dom";

import './App.css';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import Dashboard from './components/dashboard/Dashboard';

const SERVER_URL = window.location.origin;

const API_URL = window.location.origin + '/v1';

function App() {

  const [isAuthenticated, setAuthenticated] = useState(false);
  const [userId, setId] = useState();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [sessionChecked, setSessionChecked] = useState(false);

  function loadUser (user, callback) {
    setId(user.id);
    setUsername(user.username)
    setEmail(user.email)
    setAuthenticated(true);
    if (callback) {
      callback();
    }
  }

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/auth/login' element= {
            <LoginForm loadUser={loadUser} API_URL={API_URL}/>
          }/>
          <Route path='/auth/register' element= {
            <RegisterForm loadUser={loadUser} API_URL={API_URL}/>
          }/>
          <Route path='/' element= {
            <Dashboard username={username} email={email}/>
          }/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;