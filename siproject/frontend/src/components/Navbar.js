import React, { useState, useEffect } from 'react';
import './Navbar.css'; // Import the CSS file
import KebabMenu from './KebabMenu'; // Import the KebabMenu component

const Navbar = () => {
  const [isAdmin, setIsAdmin] = useState(false); // สถานะตรวจสอบว่าเป็นแอดมินหรือไม่
  const [isLoggedIn, setIsLoggedIn] = useState(false); // สถานะตรวจสอบว่าล็อกอินแล้วหรือยัง

  useEffect(() => {
    const token = localStorage.getItem('token'); // ดึง token จาก localStorage

    if (token) {
      setIsLoggedIn(true); // ถ้ามี token แสดงว่าล็อกอินแล้ว
      checkAdminAccess(token); // ตรวจสอบสิทธิ์การเป็นแอดมิน
    } else {
      setIsLoggedIn(false); // ถ้าไม่มี token แสดงว่ายังไม่ล็อกอิน
    }
  }, []);

  const checkAdminAccess = async (token) => {
    try {
      const response = await fetch('http://localhost:8000/api/check-admin/', {
        headers: {
          Authorization: `Bearer ${token}`, // ส่ง token ไปตรวจสอบที่ backend
        },
      });
      const data = await response.json();
      if (data.is_admin) {
        setIsAdmin(true); // ถ้าเป็นแอดมินก็เซ็ตค่าเป็น true
      }
    } catch (error) {
      console.error('Error checking admin access:', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <a href="/" className="nav-link">หน้าหลัก</a>
      </div>
      <div className="navbar-right">
        <a href="/Page" className="nav-link">สารานุกรมสัตว์</a>

        {isAdmin && <a href="/Detail" className="nav-link">ผู้ดูแลระบบ</a>} {/* แสดงลิงก์ Admin ถ้าเป็นแอดมิน */}

        {!isLoggedIn && (
          <>
            <a href="/Login" className="nav-link">เข้าสู่ระบบ</a> {/* ซ่อนถ้าล็อกอินแล้ว */}
            <a href="/register" className="nav-register-button">ลงทะเบียน</a> {/* ซ่อนถ้าล็อกอินแล้ว */}
          </>
        )}

        {isLoggedIn && <KebabMenu />} {/* แสดง KebabMenu เมื่อผู้ใช้ล็อกอินแล้ว */}
      </div>
    </nav>
  );
};

export default Navbar;
