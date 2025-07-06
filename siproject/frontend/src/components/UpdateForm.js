import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UpdateForm = ({ animal, onAnimalUpdated }) => {
  const [formData, setFormData] = useState({
    name: animal.name || '',
    scientific_name: animal.scientific_name || '',
    photo: null,
    interest: animal.interest || '',
    habitat: animal.habitat || '',
    food: animal.food || '',
    behavior: animal.behavior || '',
    age: animal.age || '',
    reproductive_age: animal.reproductive_age || '',
    size_weight: animal.size_weight || '',
    category: animal.category || '',  // เพิ่ม category ที่นี่
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Reset form data when the animal prop changes
    setFormData({
      name: animal.name || '',
      scientific_name: animal.scientific_name || '',
      photo: null,
      interest: animal.interest || '',
      habitat: animal.habitat || '',
      food: animal.food || '',
      behavior: animal.behavior || '',
      age: animal.age || '',
      reproductive_age: animal.reproductive_age || '',
      size_weight: animal.size_weight || '',
      category: animal.category || '',  // รีเซ็ต category เมื่อ animal เปลี่ยนแปลง
    });
  }, [animal]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'photo') {
      setFormData({ ...formData, photo: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const updatedFormData = new FormData();
    for (const key in formData) {
      if (formData[key]) {
        updatedFormData.append(key, formData[key]);
      }
    }

    try {
      const response = await axios.put(
        `http://localhost:8000/api/animals/update/${animal.name}/`,
        updatedFormData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      console.log('Animal updated:', response.data);
      onAnimalUpdated(response.data);
    } catch (error) {
      console.error('Error updating animal:', error);
      setError('Failed to update the animal. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="ชื่อสัตว์"
        required
        disabled
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

      {/* เพิ่มฟิลด์เลือกประเภทสัตว์ */}
      <select
        name="category"
        value={formData.category}
        onChange={handleChange}
        required
      >
        <option value="" disabled>เลือกประเภทสัตว์</option>
        <option value="mammal">สัตว์เลี้ยงลูกด้วยนม</option>
        <option value="reptile">สัตว์เลื้อยคลาน</option>
        <option value="bird">สัตว์ปีก</option>
        <option value="aquatic">สัตว์น้ำ</option>
        <option value="amphibian">สะเทินน้ำสะเทินบก</option>
      </select>

      <button type="submit" disabled={loading}>
        {loading ? 'Updating...' : 'อัปเดตข้อมูลสัตว์'}
      </button>
      {error && <p className="error">{error}</p>}
    </form>
  );
};

export default UpdateForm;
