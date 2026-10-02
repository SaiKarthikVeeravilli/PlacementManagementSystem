import './App.css';
import { Routes, Route } from 'react-router-dom';

import HomePage from './components/HomePage';
import Signup from './components/Signup';
import Login from './components/Login';
import StudentForm from './components/StudentForm';
import DashBoard from './components/DashBoard';
import ProfileView from './components/ProfileView';
import CompanyForm from './components/CompanyForm';
import ViewCompanies from './components/ViewCompanies';
import JobForm from './components/JobForm';
import JobsView from './components/JobsView';
import MyApplications from './components/MyApplications';
import AdminApplications from './components/AdminApplications';
import EditProfile from "./components/EditProfile";
import EditCompany from "./components/EditCompany";
import EditJob from "./components/EditJob";
import AdminDashboard from './components/AdminDashBoard';
import AdminAnalytics from "./Pages/AdminAnalytics";
import Reports from "./Pages/Reports";
import AdminCalendar from "./Pages/AdminCalender";
import StudentCalendar from './Pages/StudentCalender';
import ResetPassword from "./Pages/ResetPassword";
import ForgotPassword from './Pages/ForgotPassword'
import Settings from "./Pages/Settings";
import ResumeAnalyzer from "./Pages/ResumeAnalyzer";
import About from "./components/About";
import Contact from "./components/Contact";
import ResumeBuilder from "./Pages/ResumeBuilder";
import PlacementResources from "./Pages/PlacementResources";
function App() {
  return (
    <div>
      <Routes>

        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        

        <Route path="/signup" element={<Signup />} />

        <Route path="/login" element={<Login />} />

        {/* Student */}
        <Route path="/profile" element={<StudentForm />} />
        <Route path="/editprofile/:id" element={<EditProfile />}/>

        <Route path="/dashboard" element={<DashBoard />} />

        <Route path="/profile-view" element={<ProfileView />} />

        {/* Admin */}
        <Route path="/addcompany" element={<CompanyForm />} />

        <Route path="/companies" element={<ViewCompanies />} />

        <Route path="/addjob" element={<JobForm />} />

        {/* Everyone can view jobs */}
        <Route path="/jobs" element={<JobsView />} />

        {/* Student applications */}
        <Route
          path="/applications"
          element={<MyApplications />}
        />

        {/* Admin applications */}
        <Route
          path="/admin-applications"
          element={<AdminApplications />}
        />
        <Route
  path="/editcompany/:id"
  element={<EditCompany />}/>
  <Route
  path="/editjob/:id"
  element={<EditJob />}
/>
<Route path='Admin-dashboard' element={<AdminDashboard/>}/>

<Route path="/admin/analytics"  element={<AdminAnalytics />}/>
<Route
  path="/reports" element={<Reports/>}/>

  <Route
  path="/admin/calendar"  element={<AdminCalendar />}/>
   
    <Route
  path="/student/calendar"  element={<StudentCalendar />}/>
 <Route
    path="/forgot-password"
    element={<ForgotPassword />}
/>

<Route
    path="/reset-password/:token"
    element={<ResetPassword />}/>
 <Route
  path="/settings"
  element={<Settings />}/>   
 <Route
  path="/resume-analyzer/:jobId"
  element={<ResumeAnalyzer />}
/>
<Route path="/resume-builder" element={<ResumeBuilder />} />
<Route path="/resources" element={<PlacementResources />} />
      </Routes>
    </div>
  );
}

export default App;