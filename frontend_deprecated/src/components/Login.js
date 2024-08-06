import React, { useState } from 'react';
import Navbar from './Navbar';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import './styles/Login.css'

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();


  const handleLogin = async () => {


    console.log('Logging in with:', { username, password });

    const apiEndpoint = 'http://localhost:8080/user/login';


    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Origin': 'http://localhost:3000/',
          'Credentials': 'include',
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      if (!response.ok) {
        var unauth = false;
        if (response.status === 401) {
          console.log('Unauthorized, status:', response.status);
          unauth = true;
        } else {
          throw new Error(`Error: ${response.status}`);
        }
      }

      const data = await response.json();
      // Store the token in a cookie named 'token'
      Cookies.set('token', data.token, {sameSite: 'None'});

      console.log('Login successful: ', data);

      navigate('/home')
    } catch (error) {
      // Handle errors
      console.log('Error during login: ', error);

      if (unauth) {
        console.log('Unauthorized')
      }

    }
  };





  return (
    <div>
      <Navbar />
      <h2>Login</h2>
      <form>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <br />
        <button type="button" onClick={handleLogin}>
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
