import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './page.css';

const HomePage = () => {
  const [selectedOption, setSelectedOption] = useState('');
  const [animals, setAnimals] = useState([]); // จัดการข้อมูลสัตว์
  const [loading, setLoading] = useState(true); // จัดการสถานะ loading
  const [error, setError] = useState(null); // จัดการสถานะ error
  const [currentPage, setCurrentPage] = useState(1); // หน้าปัจจุบัน
  const [animalsPerPage] = useState(9); // จำนวนสัตว์ที่จะแสดงต่อหน้า
  const navigate = useNavigate();

  // ฟังก์ชันดึงข้อมูลสัตว์
  const fetchAnimals = async (filter = '') => {
    try {
      const response = await axios.get(`http://localhost:8000/api/animalsc/${filter}`);
      setAnimals(response.data); // เก็บข้อมูลสัตว์ใน state
      setLoading(false); // หยุดแสดง loading
    } catch (error) {
      console.error('Error fetching animals:', error);
      setError('Failed to load animals.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnimals();
  }, []);

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchAnimals(selectedOption);
  };

  const handleAnimalClick = (animal) => {
    navigate(`/animal/${animal.name}`);
  };

  // ฟังก์ชันเปลี่ยนหน้า
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // การคำนวณข้อมูลสัตว์ที่จะแสดงในหน้าปัจจุบัน
  const indexOfLastAnimal = currentPage * animalsPerPage;
  const indexOfFirstAnimal = indexOfLastAnimal - animalsPerPage;
  const currentAnimals = animals.slice(indexOfFirstAnimal, indexOfLastAnimal); // สัตว์ที่จะแสดงในหน้านี้

  // การแสดง Loading
  if (loading) {
    return <div>Loading...</div>;
  }

  // การแสดง Error
  if (error) {
    return <div>{error}</div>;
  }

  // จำนวนหน้าทั้งหมด
  const totalPages = Math.ceil(animals.length / animalsPerPage);

  return (
    <div className="home-page">
      <header></header>

      <main>
        <div className="dropdown-container">
          <form onSubmit={handleSubmit} className="Page-form">
            <select value={selectedOption} onChange={handleOptionChange}>
              <option value="" disabled>เลือกประเภทสัตว์</option>
              <option value="mammal">สัตว์เลี้ยงลูกด้วยนม</option>
              <option value="reptile">สัตว์เลื้อยคลาน</option>
              <option value="bird">สัตว์ปีก</option>
              <option value="aquatic">สัตว์น้ำ</option>
              <option value="amphibian">สะเทินน้ำสะเทินบก</option>
            </select>
            <button type="submit" className="btnsubmit">ค้นหา</button>
          </form>
        </div>

        <div className="card-container">
          {currentAnimals && currentAnimals.length > 0 ? (
            currentAnimals.map((animal, index) => (
              <div key={index} className="card" onClick={() => handleAnimalClick(animal)}>
                <img src={animal.photo} alt={animal.name} className="animal-image" />
                <h3>{animal.name}</h3>
                <p>{animal.scientific_name}</p>
              </div>
            ))
          ) : (
            <p>No animals found.</p>
          )}
        </div>

        {/* Pagination */}
        <div className="pagination">
  <button
    className={`page-button ${currentPage === 1 ? 'disabled' : ''}`}
    onClick={() => handlePageChange(currentPage - 1)}
    disabled={currentPage === 1}
  >
    &lt;
  </button>

  {currentPage > 1 && (
    <>
      <button onClick={() => handlePageChange(1)} className="page-number">
        1
      </button>
      {currentPage > 2 && <span className="page-ellipsis">...</span>}
    </>
  )}

  <button className="page-number active">{currentPage}</button>

  {currentPage < totalPages && (
    <>
      {currentPage < totalPages - 1 && <span className="page-ellipsis">...</span>}
      <button onClick={() => handlePageChange(totalPages)} className="page-number">
        {totalPages}
      </button>
    </>
  )}

  <button
    className={`page-button ${currentPage === totalPages ? 'disabled' : ''}`}
    onClick={() => handlePageChange(currentPage + 1)}
    disabled={currentPage === totalPages}
  >
    &gt;
  </button>
</div>

      </main>
    </div>
  );
};

export default HomePage;
