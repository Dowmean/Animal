import React, { useState, useEffect } from 'react'; 
import './Home.css';
import WelcomeImg from './welcome.png';
import SecondImg from './Tiger.jpg';
import BearImg from './Bear.jpg';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

function Home() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const slides = [SecondImg, BearImg]; // Original static slides for carousel

    // New state for animals fetched from API for Section 2
    const [animals, setAnimals] = useState([]);
    const [selectedOption, setSelectedOption] = useState(''); // Store selected animal category
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate(); // Create navigate instance for routing

    // Fetch animal images for Section 2, limited to 9
    useEffect(() => {
        fetchAnimals();
    }, []);

    const fetchAnimals = async (filter = '') => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:8000/api/animalsc/${filter}`);
            const limitedAnimals = response.data.slice(0, 9); // Limit to 9 animals
            setAnimals(limitedAnimals); // Store fetched animals in state
        } catch (error) {
            console.error('Error fetching animals:', error);
        }
        setLoading(false);
    };

    // Handle the filter form submit
    const handleSubmit = (e) => {
        e.preventDefault();
        fetchAnimals(selectedOption); // Fetch animals based on selected category
    };

    const handleOptionChange = (e) => {
        setSelectedOption(e.target.value); // Update selected category
    };

    // Carousel logic for Section 1
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
        }, 3000);

        return () => clearInterval(timer);
    }, [slides.length]);

    const handleIndicatorClick = (index) => {
        setCurrentSlide(index); // Change slide when indicator is clicked
    };

    // Function to handle clicks on Section 2 to navigate to the login page
    const handleSection2Click = () => {
        navigate('/Login'); // Navigate to the login page when clicked
    };

    // Handle "See All" button click
    const handleSeeAllClick = () => {
        const token = localStorage.getItem('token'); // Check if token exists in localStorage
        if (token) {
            navigate('/page'); // If logged in, navigate to the Page.js
        } else {
            navigate('/Login'); // If not logged in, navigate to the Login.js
        }
    };

    return (
        <div className="Home">
            {/* Section 1 */}
            <section id="section1">
                <div className="container">
                    {/* Welcome Image */}
                    <div className="welcome-image">
                        <img src={WelcomeImg} alt="Welcome" />
                    </div>

                    {/* Carousel */}
                    <div className="carousel-container">
                        <div className="carousel">
                            {slides.map((slide, index) => (
                                <img
                                    key={index}
                                    src={slide}
                                    alt={`Slide ${index + 1}`}
                                    className={index === currentSlide ? 'active' : ''}
                                />
                            ))}
                        </div>

                        {/* Carousel Indicators */}
                        <div className="carousel-indicators">
                            {slides.map((_, index) => (
                                <span
                                    key={index}
                                    className={`indicator ${index === currentSlide ? 'active' : ''}`}
                                    onClick={() => handleIndicatorClick(index)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 2 */}
            <section id="section2">
                <h1></h1>
                
                {/* Dropdown filter form */}
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

                <div className="container">
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <div className="card-container">
                            {animals.length > 0 ? (
                                animals.map((animal, index) => (
                                    <div key={index} className="card">
                                        <img src={animal.photo} alt={animal.name} className="animal-image" />
                                        <h3>{animal.name}</h3>
                                        <p>{animal.scientific_name}</p>
                                    </div>
                                ))
                            ) : (
                                <p>No animals found.</p>
                            )}
                        </div>
                    )}

                    {/* "See All" Button */}
                    <div className="see-all-button-container">
                        <button className="see-all-btn" onClick={handleSeeAllClick}>See All</button>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Home;
