import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Create from './Create';
import AnimalForm from './Addpost';
import UpdateForm from './UpdateForm';

const AnimalPage = () => {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingAnimal, setEditingAnimal] = useState(null);

  useEffect(() => {
    fetchAnimals();
  }, []);

  const fetchAnimals = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/animals/');
      setAnimals(response.data);
      setLoading(false);
    } catch (err) {
      setError('Error fetching animals');
      setLoading(false);
    }
  };

  const handleAnimalAdded = (newAnimal) => {
    setAnimals((prevAnimals) => [...prevAnimals, newAnimal]);
  };

  const handleAnimalUpdated = (updatedAnimal) => {
    setAnimals((prevAnimals) =>
      prevAnimals.map(animal =>
        animal.name === updatedAnimal.name ? updatedAnimal : animal
      )
    );
    setEditingAnimal(null); // Close the edit form
  };

  const handleAnimalDeleted = (animalName) => {
    setAnimals((prevAnimals) => prevAnimals.filter(animal => animal.name !== animalName));
  };

  const handleEditButtonClick = (animal) => {
    setEditingAnimal(animal);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="animal-page">
      <h1>Animal Information</h1>
      {editingAnimal ? (
        <AnimalForm
          initialData={editingAnimal}
          onAnimalAdded={handleAnimalUpdated}
          isEditing={true}
        />
      ) : (
        // Uncomment this line to use the AnimalForm component for adding
        // <AnimalForm onAnimalAdded={handleAnimalAdded} />
        null
      )}
      <div className="animal-list">
        {animals.map(animal => (
          <div key={animal.id || animal.name}>
            <Create animal={animal} />
            <EditButton animal={animal} onEdit={() => handleEditButtonClick(animal)} />
            <DeleteButton animal={animal} onAnimalDeleted={handleAnimalDeleted} />
          </div>
        ))}
      </div>
    </div>
  );
};

const DeleteButton = ({ animal, onAnimalDeleted }) => {
  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${animal.name}?`)) {
      try {
        await axios.delete(`http://localhost:8000/api/animals/delete/${animal.name}/`);
        console.log('Animal deleted:', animal.name);
        onAnimalDeleted(animal.name);
      } catch (error) {
        console.error('Error deleting animal:', error);
      }
    }
  };

  return <button onClick={handleDelete}>Delete Animal</button>;
};

const EditButton = ({ animal, onEdit }) => {
  return <button onClick={onEdit}>Edit Animal</button>;
};

export default AnimalPage;
