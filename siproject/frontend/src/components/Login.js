import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Import the CSS file

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Add a specific class to the body for Register page
    document.body.classList.add('login-body');

    // Cleanup function to remove class on component unmount
    return () => {
      document.body.classList.remove('login-body');
    };
  }, []);

  // Check if the user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // navigate('/home'); // Redirect to home if already logged in
    }
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const response = await fetch('http://localhost:8000/api/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
  
    if (response.ok) {
      const data = await response.json();
      console.log('Access Token:', data.access_token);
      console.log('Refresh Token:', data.refresh_token);
  
      // เก็บ Access Token และ Refresh Token ลง localStorage
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
  
      // นำทางไปที่หน้า Home หลังล็อกอินสำเร็จ
      navigate('/');
    } else {
      setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง โปรดลองอีกครั้ง"); 
    }
  };
  
  return (
    <div className="login-container">
      <div className="login-box">
        <h2>เข้าสู่ระบบ</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>อีเมล</label>
            <input
              type="text"
              placeholder="อีเมล"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>รหัสผ่าน</label>
            <input
              type="password"
              placeholder="รหัสผ่าน"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">เข้าสู่ระบบ</button>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <p>
          ยังไม่มีบัญชีใช่หรือไม่? <a href="/register">สมัครสมาชิกฟรี!</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
