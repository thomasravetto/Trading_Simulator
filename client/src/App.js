import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, } from "react-router-dom";

import './App.css';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/auth/login' element= {
            <LoginForm/>
          }/>
          <Route path='/auth/register' element= {
            <RegisterForm/>
          }/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;