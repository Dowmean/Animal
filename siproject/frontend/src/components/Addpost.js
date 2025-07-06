import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Addpost.css';

const AnimalForm = ({ onAnimalAdded, initialData = {}, isEditing = false }) => {
  const ANIMAL_TYPE_CHOICES = [
    { value: 'mammal', label: 'สัตว์เลี้ยงลูกด้วยนม' },
    { value: 'reptile', label: 'สัตว์เลื้อยคลาน' },
    { value: 'bird', label: 'สัตว์ปีก' },
    { value: 'aquatic', label: 'สัตว์น้ำ' },
    { value: 'amphibian', label: 'สะเทินน้ำสะเทินบก' },
  ];
  // ฟังก์ชันเพื่อขยาย textarea

  const [formData, setFormData] = useState({
    name: '',
    scientific_name: '',
    photo: null,
    interest: '',
    habitat: '',
    food: '',
    behavior: '',
    age: '',
    reproductive_age: '',
    size_weight: '',
    category: ANIMAL_TYPE_CHOICES[0].value,
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Only update formData when initialData changes
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData((prevData) => ({
        ...prevData,
        ...initialData,
      }));
    }
  }, [initialData]);

  const handleChange = (e) => {
    if (e.target.name === 'photo') {
      setFormData({ ...formData, [e.target.name]: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    const form = new FormData();
    for (const key in formData) {
      form.append(key, formData[key]);
    }

    try {
      const url = isEditing
        ? `http://localhost:8000/api/animals/update/${formData.name}/`
        : 'http://localhost:8000/api/animals/';
      const method = isEditing ? 'put' : 'post';

      const response = await axios({
        method,
        url,
        data: form,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Animal saved:', response.data);
      onAnimalAdded(response.data);

      if (!isEditing) {
        setFormData({
          name: '',
          scientific_name: '',
          photo: null,
          interest: '',
          habitat: '',
          food: '',
          behavior: '',
          age: '',
          reproductive_age: '',
          size_weight: '',
          category: ANIMAL_TYPE_CHOICES[0].value,
        });
      }

      setSuccess(true);

    } catch (error) {
      console.error('Error saving animal:', error);
      setError('เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง');
    }
  };

  return (
    <div className="wrap">
      <h1 className="main-header">{isEditing ? 'แก้ไขข้อมูลสัตว์' : 'เพิ่มข้อมูลสัตว์'}</h1>

      {error && <p className="error">{error}</p>}
      {success && <p className="success">บันทึกข้อมูลสำเร็จ!</p>}

      <form onSubmit={handleSubmit} className='Addpost-form'>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="ชื่อสัตว์"
          required
          disabled={isEditing}
        />
        <input
          type="text"
          name="scientific_name"
          value={formData.scientific_name}
          onChange={handleChange}
          placeholder="ชื่อวิทยาศาสตร์"
          required
        />
        <input type="file" name="photo" onChange={handleChange} />
        <textarea
          name="interest"
          value={formData.interest}
          onChange={handleChange}
          placeholder="สิ่งที่น่าสนใจ"
          required
        />
        <input
          type="text"
          name="habitat"
          value={formData.habitat}
          onChange={handleChange}
          placeholder="ถิ่นอาศัย"
          required
        />
        <input
          type="text"
          name="food"
          value={formData.food}
          onChange={handleChange}
          placeholder="อาหาร"
          required
        />
        <textarea
          name="behavior"
          value={formData.behavior}
          onChange={handleChange}
          placeholder="พฤติกรรม"
          required
        />
        <input
          type="text"
          name="age"
          value={formData.age}
          onChange={handleChange}
          placeholder="อายุเฉลี่ย"
          required
        />
        <input
          type="text"
          name="reproductive_age"
          value={formData.reproductive_age}
          onChange={handleChange}
          placeholder="วัยเจริญพันธุ์"
          required
        />
        <input
          type="text"
          name="size_weight"
          value={formData.size_weight}
          onChange={handleChange}
          placeholder="ขนาดและน้ำหนัก"
          required
        />
        <select name="category" value={formData.category} onChange={handleChange} required>
          {ANIMAL_TYPE_CHOICES.map((choice) => (
            <option key={choice.value} value={choice.value}>
              {choice.label}
            </option>
          ))}
        </select>      
        <button type="submit">
          {isEditing ? 'อัปเดตข้อมูล' : 'เพิ่มสัตว์'}
        </button>
      </form>
    </div>
  );
};

export default AnimalForm;
