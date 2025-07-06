import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Create from './Create';
import UpdateForm from './UpdateForm';
import Addpost from './Addpost'; // Import Addpost for the popup
import './Modal.css';
import './Detail.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom'; // For redirect

const AnimalPage = () => {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingAnimal, setEditingAnimal] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddPostOpen, setIsAddPostOpen] = useState(false); // State to control Addpost modal
  const navigate = useNavigate(); // Used for navigating between pages

  // Check for admin access when the component mounts
  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const token = localStorage.getItem('token'); // Check if token exists in localStorage
        if (!token) {
          navigate('/login'); // Redirect to login if token doesn't exist
          return;
        }

        // Make a request to check if the user is an admin
        const response = await axios.get('http://localhost:8000/api/check-admin/', {
          headers: {
            Authorization: `Bearer ${token}`, // Send token to backend
          },
        });

        if (!response.data.is_admin) {
          navigate('/'); // Redirect if the user is not an admin
        }
      } catch (error) {
        console.error('Error checking admin access:', error);
        navigate('/home'); // Redirect to home if error occurs
      }
    };

    checkAdminAccess();
  }, [navigate]);

  // Fetch animals when the component mounts
  useEffect(() => {
    fetchAnimals();
  }, []);

  const fetchAnimals = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/animals/');
      console.log('API Response:', response.data.results); // Log the results to check the data
      setAnimals(response.data.results);  // Access 'results' in the API response
      setLoading(false);
    } catch (err) {
      setError('Error fetching animals');
      setLoading(false);
    }
  };
  

  const handleAnimalDeleted = async (animalName) => {
    const confirmed = window.confirm('คุณต้องการลบสัตว์ตัวนี้หรือไม่?');
    if (confirmed) {
      try {
        const url = `http://localhost:8000/api/animals/delete/${animalName}/`;
        await axios.delete(url);
        console.log('Animal deleted successfully');
        fetchAnimals(); // Refresh the list after deletion
      } catch (error) {
        console.error('Error deleting animal:', error);
      }
    } else {
      console.log('ยกเลิกการลบ');
    }
  };

  const openEditModal = (animal) => {
    setEditingAnimal(animal);
    setIsModalOpen(true);
  };

  const closeEditModal = () => {
    setEditingAnimal(null);
    setIsModalOpen(false);
  };

  // Function to open the Addpost popup
  const openAddPostModal = () => {
    setIsAddPostOpen(true);
  };

  // Function to close the Addpost popup
  const closeAddPostModal = () => {
    setIsAddPostOpen(false);
  };

  // Handle loading and error states
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="animal-page">
      <h1>Animal Information</h1>

      {/* Button to open Addpost modal */}
      <div className="post-button">
        <button onClick={openAddPostModal} className="add-post-btn">
          <FontAwesomeIcon icon={faPlus} /> โพสต์
        </button>
      </div>

      {/* Addpost Modal */}
      {isAddPostOpen && (
        <Modal onClose={closeAddPostModal}>
          <Addpost onAnimalAdded={fetchAnimals} />
        </Modal>
      )}

      {/* Update Modal */}
      {isModalOpen && (
        <Modal onClose={closeEditModal}>
          <UpdateForm animal={editingAnimal} onAnimalUpdated={fetchAnimals} />
        </Modal>
      )}

      {/* Render the animal list if animals are available */}
      <div className="animal-list">
        {animals.length > 0 ? (
          animals.map((animal) => (
            <div key={animal.id || animal.name} className="create-card">
              <div className="left-section">
                <Create animal={animal} />
              </div>
              <div className="info-section">
                <div className="info-item">
                  <button onClick={() => openEditModal(animal)} className="edit-btn">
                    <FontAwesomeIcon icon={faEdit} /> แก้ไข
                  </button>
                  <button onClick={() => handleAnimalDeleted(animal.name)} className="delete-btn">
                    <FontAwesomeIcon icon={faTrashAlt} /> ลบ
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No animals available.</p> // Message when no animals are present
        )}
      </div>
    </div>
  );
};

const Modal = ({ children, onClose }) => {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default AnimalPage;
