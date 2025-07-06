// KebabMenu.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import './KebabMenu.css';

const KebabMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false); // State to control confirm dialog
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    const accessToken = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refresh_token');
  
    console.log('Access Token:', accessToken);
    console.log('Refresh Token:', refreshToken);
  
    if (!accessToken || !refreshToken) {
      console.error('Tokens not found');
      closeConfirmLogout(); // ปิด modal เมื่อไม่พบ token
      return;
    }
  
    try {
      const response = await fetch('http://localhost:8000/api/logout/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refresh_token: refreshToken
        }),
      });
  
      if (response.ok) {
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        closeConfirmLogout(); // ปิด modal หลัง logout สำเร็จ
        navigate('/Login');
      } else {
        const data = await response.json();
        console.error('Error logging out:', data);
        closeConfirmLogout(); // ปิด modal เมื่อเกิด error
      }
    } catch (error) {
      console.error('Logout failed:', error);
      closeConfirmLogout(); // ปิด modal เมื่อเกิด error
    }
  };

  const openConfirmLogout = () => {
    setIsConfirmOpen(true);
    setIsMenuOpen(false);
  };

  const closeConfirmLogout = () => {
    setIsConfirmOpen(false);
  };

  return (
    <div className="kebab-menu-container">
      <button className="kebab-menu-btn" onClick={toggleMenu}>
        <FontAwesomeIcon icon={faEllipsisV} />
      </button>

      {isMenuOpen && (
        <div className="kebab-menu-dropdown">
          <button className="kebab-menu-item" onClick={openConfirmLogout}>
            <FontAwesomeIcon icon={faSignOutAlt} /> ออกจากระบบ
          </button>
        </div>
      )}

      {isConfirmOpen && (
        <div className="confirm-logout-backdrop">
          <div className="confirm-logout-modal">
            <p>คุณต้องการออกจากระบบหรือไม่?</p>
            <div className="confirm-logout-buttons">
              <button onClick={handleLogout} className="confirm-btn">
                ยืนยัน
              </button>
              <button onClick={closeConfirmLogout} className="cancel-btn">
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default KebabMenu;
