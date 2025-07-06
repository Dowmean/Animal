import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Removed Switch
import Navbar from './components/Navbar';
import Login from './components/Login';
import Home from './components/Home';
import Register from './components/Register';
import Create from './components/Create';
import Page from './components/page';  
import Addpost from './components/Addpost';
import AnimalPage from './components/Detail'; 
import UpdateForm from './components/UpdateForm'; // Import Update component
import AnimalDetail from './components/AnimalDetail'; // Make sure this is the correct component for detail view
import PrivateRoute from './components/PrivateRoute';
import KebabMenu from './components/KebabMenu'

function App() {
    return (
        <Router>
            <div>
                <Navbar />
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/detail" element={<AnimalPage />} />
                    <Route path="/" element={<Home />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/admin/create" element={<Create />} />
                    <Route path="/addpost" element={<Addpost />} />
                    <Route path="/update" element={<UpdateForm />} />
                    <Route path="/KebabMenu" element={<KebabMenu />} />
                    <Route path="/animal/:name" element={<AnimalDetail />} />

                    {/* เส้นทางที่ต้องล็อกอินถึงจะเข้าได้ */}
                    <Route element={<PrivateRoute />}>
                        <Route path="/page" element={<Page />} />
                    </Route>
                </Routes>
            </div>
        </Router>
    );
}

export default App;
