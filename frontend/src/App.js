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
import ConsultancyProjectsPage from './pages/viewconsultant';
import EditSeedMoney from './pages/editseedmoney';
import ProposalForm from './pages/addproposal';
import ViewProposals from './pages/viewproposals';
import Editscholars from './pages/editscholars';
import CorSeedMoney from './pages/depcorviewseed';
import CorFundedProjects from './pages/depcorviewprojects';
import DepConsultancyProjectsPage from './pages/depcorviewconsltancy';
import CorViewScholars from './pages/depcorviewscholars';
import CorViewProposals from './pages/depcorviewproposals';
import InstSeedMoney from './pages/instviewseedmoney';
import InstFundedProjects from './pages/instviewprojects';
import InstViewConsultancy from './pages/instviewconsultancy';
import InstViewScholars from './pages/instviewscholars';
import InstViewProposals from './pages/instviewproposals';
import EditFundedProjectPage from './pages/editexternal';
import EditConsultancyProject from './pages/editconsultancy';
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
          <Route path="/viewconsultants" element={<ConsultancyProjectsPage/>}/>
          <Route path="/editseedmoney" element={<EditSeedMoney/>}/>
          <Route path="/addproposal" element={<ProposalForm/>}/>
          <Route path="/viewproposals" element={<ViewProposals/>}/>
          <Route path="/editscholar" element ={<Editscholars/>}/>
          <Route path="/corviewseedmoney" element={<CorSeedMoney/>}/>
          <Route path="/corviewprojects" element={<CorFundedProjects/>}/>
          <Route path="/corviewconsultants" element={<DepConsultancyProjectsPage/>}/>
          <Route path="/corviewscholars" element={<CorViewScholars/>}/>
          <Route path="/corviewproposals" element={<CorViewProposals/>}/>
          <Route path="/instcorviewseedmoney" element={<InstSeedMoney/>}/>
          <Route path="/instcorviewprojects" element={<InstFundedProjects/>}/>
          <Route path="/instcorviewconsultants" element={<InstViewConsultancy/>}/>
          <Route path="/instcorviewscholars" element={<InstViewScholars/>}/>
          <Route path="/instcorviewproposals" element={<InstViewProposals/>}/>
          <Route path="/editexternal" element={<EditFundedProjectPage/>}/>
          <Route path="/editconsultancy" element={<EditConsultancyProject/>}/>
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
