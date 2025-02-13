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
import SeedmoneyForm from './pages/viewseedmoney';
import PublicationsPage from './pages/viewpublications';
import PatentForm from './pages/viewpatents';
import LoginCorPage from './pages/depcorlogin';
import CorWelcome from './pages/depcorwelcome';
import Corsidebar from './pages/depcorsidebar';
import CorViewPublications from './pages/deptcorviewpub';
import CorViewPatents from './pages/deptcorviewpatents';
import Editpub from './pages/editpublications';
import Editpat from './pages/editpatents';
import Viewexternal from './pages/viewexternal';
import LoginInstCoordinator from './pages/instcorlogin';
import InstCoSidebar from './pages/instcorsidebar';
import InstituteCorViewPublications from './pages/instviewpub';
import ConsultancyForm from './pages/addconsultant';
import InstCorViewPatents from './pages/instviewpatents';
import ResearchForm from './pages/addscholar';
import Viewscholars from './pages/viewscholar';
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
          <Route path ="/addproject" element={<External/>}/>
          <Route path="/viewprojects" element={<Viewexternal/>}/>
          <Route path="/addpublication" element={<PublicationPage/>}/>
          <Route path="/addseedmoney" element={<SeedMoneyPage/>}/>
          <Route path="/viewpublications" element={<PublicationsPage/>}/>
          <Route path="/viewpatents" element={<PatentForm/>}/>
          <Route path="/viewseedmoney" element={<SeedmoneyForm/>}/>
          <Route path="/coordinatorlogin" element={<LoginCorPage/>}/>
          <Route path="/coordinatorwelcome" element={<CorWelcome/>}/>
          <Route path="/coordinatorsidebar" element={<Corsidebar/>}/>
          <Route path="/corviewpublications" element={<CorViewPublications/>}/>
          <Route path="/corviewpatents" element={<CorViewPatents/>}/>
          <Route path="/editpublications" element={<Editpub/>}/>
          <Route path="/editpatents" element={<Editpat/>}/>
          <Route path="/instcorlogin" element={<LoginInstCoordinator/>}/>
          <Route path="/instcorsidebar" element={<InstCoSidebar/>}/>
          <Route path="/instcorviewpublications" element={<InstituteCorViewPublications/>}/>
          <Route path="/addconsultant" element={<ConsultancyForm/>}/>
          <Route path="/instcorviewpatents" element={<InstCorViewPatents/>}/>
          <Route path="/addscholar" element= {<ResearchForm/>}/>
          <Route path="/viewscholars" element={<Viewscholars/>}/>
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
