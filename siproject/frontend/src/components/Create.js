//Create.js โชว์ Detail
import React from 'react';
import './Create.css';

const Create = ({ animal }) => {
  return (
    <div className="create-card">
      
      <div className="left-section">
      <div className="basic-info">
          <h2>{animal.name} / {animal.scientific_name}</h2>
        </div>
        <img src={animal.photo} alt={animal.name} className="animal-image" />

      </div>

        </div>
  );
};

export default Create;
