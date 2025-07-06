// src/components/Register.js
import React, { useState, useEffect } from 'react';
import './Register.css';
import { useNavigate } from 'react-router-dom';
import person_img from './person.png';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Add a specific class to the body for Register page
    document.body.classList.add('register-body');

    // Cleanup function to remove class on component unmount
    return () => {
      document.body.classList.remove('register-body');
    };
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:8000/api/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Registration successful, token:', data.token);
        localStorage.setItem('token', data.token);
        navigate('/home');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Registration failed');
      }
    } catch (error) {
      console.error('An error occurred:', error);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="register-container">
      <div className="register-left">
        <h1>สมัครสมาชิก<br />ลงทะเบียนเพื่อดูรูปภาพและข้อมูลสัตว์</h1>
        <p>มีบัญชีผู้ใช้แล้วใช่ไหม?<br /> <a href="/login">เข้าสู่ระบบ!</a></p>
      </div>
      <div className="register-right">
        <div className="image-container">
          <img src={person_img} alt="Person" />
        </div>
        <form className="register-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="กรอกอีเมล"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="********"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">ลงทะเบียน</button>
        </form>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default Register;
