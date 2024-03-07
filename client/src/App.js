import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, } from "react-router-dom";

import './App.css';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import Dashboard from './components/dashboard/Dashboard';
import MarketItem from './components/market/MarketItem';

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

  async function sessionChecker () {
      try {
        const resp = await fetch(API_URL + '/check_session');

        if (resp.ok) {
          const data = await resp.json();
          return data;
        } else {
          console.error('Error checking session:', resp.status);
          return { isAuthenticated: false };
        }
      } catch (error) {
        console.error('Error checking session:', error);
        return { isAuthenticated: false };
      }
    }

  useEffect(() => {
    async function handleSessionChecker () {
      const sessionStatus = await sessionChecker();
      if (sessionStatus.isAuthenticated) {
        setAuthenticated(true);
        setId(sessionStatus.id);
        setUsername(sessionStatus.username);
        setEmail(sessionStatus.email);
      }
      setSessionChecked(true);
    }

    // handleSessionChecker();
    setDummySession();
  })

  function setDummySession () {
    setAuthenticated(true);
    setId(100);
    setUsername('Jesus');
    setEmail('jesus@gmail.com');
    setSessionChecked(true);
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
            !sessionChecked ?
              <p>Loading</p> :
              isAuthenticated ?
                <Dashboard username={username} email={email} userId={userId}/> :
                <Navigate replace to={'/auth/login'}/>
          }/>
          <Route path='/market/:symbol' element= {
            !sessionChecked ?
              <p>Loading</p> :
              isAuthenticated ?
                <MarketItem username={username} email={email} userId={userId}/> :
                <Navigate replace to={'/auth/login'}/>
          }/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;