import React, { useState, useEffect } from 'react';
import './Form.css';
import { FaUser } from 'react-icons/fa';
import { FaLock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
      const token = localStorage.getItem('token');
      if (token) {
        fetchUser();
        navigate('/dashboard'); 
      } else {
        navigate('/');
      }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault(); 
    setIsLoading(true);
    setErrorMessage(null);
    
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    try {
        const response = await fetch('http://127.0.0.1:8000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: trimmedEmail,
                password: trimmedPassword
            })
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.token); 
            navigate('/dashboard'); 
        } else {
            const errorData = await response.json();
            setErrorMessage(errorData.message || 'Something went wrong.');
        }

      } catch (error) {
          setErrorMessage('Something went wrong. Please try again later.');
      } finally {
          setIsLoading(false);
      }
  };

  const fetchUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        setErrorMessage('No token found. Please log in.');
        return;
    }

    try {
        const response = await fetch('http://127.0.0.1:8000/api/user', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });

        if (response.ok) {
            const userData = await response.json();
            console.log('User data:', userData);
            // Handle user data (e.g., set it in state)
        } else {
            const errorData = await response.json();
            setErrorMessage(errorData.message || 'Failed to fetch user data.');
        }

      } catch (error) {
          setErrorMessage('Something went wrong. Please try again later.');
      }
  };


  return (
    <div className='loginform'>
      <div className='wrapper'>
      <form onSubmit={handleLogin}>
        <h1>Login</h1>

        {errorMessage && <p className="error_form">{errorMessage}</p>} 

        <div className="input-box">
          <input
            type="text"
            placeholder="Email"
            required
            value={email}
            onChange={(e) =>{
                setEmail(e.target.value); 
                setErrorMessage('');
            }}
          />
          <FaUser className="icon" />
        </div>

        <div className="input-box">
          <input
            type="password"
            placeholder="Password"
            required
            value={password}                                
            onChange={(e) => {
              setPassword(e.target.value);
              setErrorMessage('');
            }}
          />
          <FaLock className="icon" />
        </div>

        <button className='btn btn-primary mt-3 form-control' type="submit" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
        
        </form>
      </div>
    </div>
    
  );
};

export default LoginForm;
