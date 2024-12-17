// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/landing';
import SignupPage from './pages/signup'; // Example Signup page
import LoginPage from './pages/login'; // Example Login page
import Layout from './pages/layout'; // Layout component with Navbar
import HomePage from './pages/home';
import Patent from './pages/addpatent';
import External from './pages/addexternal';
import PublicationPage from './pages/addpublication';
import  SeedMoneyPage from './pages/addseedmoney';
import PublicationsPage from './pages/viewpublications';
import PatentForm from './pages/viewpatents';
import LoginCorPage from './pages/depcorlogin';
import CorWelcome from './pages/corwelcome';
import Corsidebar from './pages/corsidebar';
import CorViewPublications from './pages/depcorpubview';
const App = () => {
  return (
    <Router>
      <Layout> {/* This ensures Navbar is applied to all pages */}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/home" element={<HomePage />}/>
          <Route path="/addpatent" element={<Patent/>}/>
          <Route path ="/addexternalproject" element={<External/>}/>
          <Route path="/addpublication" element={<PublicationPage/>}/>
          <Route path="/addseedmoney" element={<SeedMoneyPage/>}/>
          <Route path="/viewpublications" element={<PublicationsPage/>}/>
          <Route path="/viewpatents" element={<PatentForm/>}/>
          <Route path="/coordinatorlogin" element={<LoginCorPage/>}/>
          <Route path="/coordinatorwelcome" element={<CorWelcome/>}/>
          <Route path="/coordinatorsidebar" element={<Corsidebar/>}/>
          <Route path="/corviewpublications" element={<CorViewPublications/>}/>
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
