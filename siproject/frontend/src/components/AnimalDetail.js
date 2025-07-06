import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './Create.css';

// Import icons from FontAwesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faTree, faUtensils, faPaw, faHourglass, faVenusMars, faRulerVertical } from '@fortawesome/free-solid-svg-icons';

const AnimalDetail = () => {
  const { name } = useParams(); // รับ id จาก URL
  const [animal, setAnimal] = useState(null);

  useEffect(() => {
    const fetchAnimalDetail = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/animals/${name}`);
        setAnimal(response.data);
      } catch (error) {
        console.error('Error fetching animal details:', error);
      }
    };

    fetchAnimalDetail();
  }, [name]);

  if (!animal) {
    return <div>Loading...</div>;
  }

  return (
    <div className="create-card">
      <div className="left-section">
        <div className="basic-info">
          <h2>{animal.name} / {animal.scientific_name}</h2>
        </div>
        <img src={animal.photo} alt={animal.name} className="animal-image" />
      </div>
      <div className="info-section">
        <div className="info-item">
          <h3><FontAwesomeIcon icon={faHeart} className="icon" /> สิ่งที่น่าสนใจ:</h3>
          <p>{animal.interest}</p>
        </div>
        <div className="info-item">
          <h3><FontAwesomeIcon icon={faTree} className="icon" /> ถิ่นอาศัย:</h3>
          <p>{animal.habitat}</p>
        </div>
        <div className="info-item">
          <h3><FontAwesomeIcon icon={faUtensils} className="icon" /> อาหาร:</h3>
          <p>{animal.food}</p>
        </div>
        <div className="info-item">
          <h3><FontAwesomeIcon icon={faPaw} className="icon" /> พฤติกรรม:</h3>
          <p>{animal.behavior}</p>
        </div>
        <div className="info-item">
          <h3><FontAwesomeIcon icon={faHourglass} className="icon" /> อายุเฉลี่ย:</h3>
          <p>{animal.age}</p>
        </div>
        <div className="info-item">
          <h3><FontAwesomeIcon icon={faVenusMars} className="icon" /> วัยเจริญพันธุ์:</h3>
          <p>{animal.reproductive_age}</p>
        </div>
        <div className="info-item">
          <h3><FontAwesomeIcon icon={faRulerVertical} className="icon" /> ขนาดและน้ำหนัก:</h3>
          <p>{animal.size_weight}</p>
        </div>
      </div>
    </div>
  );
};

export default AnimalDetail;
