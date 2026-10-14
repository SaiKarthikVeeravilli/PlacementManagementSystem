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
import EditProfile from './components/EditProfile';
import EditCompany from './components/EditCompany';
import EditJob from './components/EditJob';
import AdminDashboard from './components/AdminDashBoard';

import AdminAnalytics from './Pages/AdminAnalytics';
import Reports from './Pages/Reports';
import AdminCalendar from './Pages/AdminCalender';
import StudentCalendar from './Pages/StudentCalender';
import ResetPassword from './Pages/ResetPassword';
import ForgotPassword from './Pages/ForgotPassword';
import Settings from './Pages/Settings';
import ResumeAnalyzer from './Pages/ResumeAnalyzer';
import ResumeBuilder from './Pages/ResumeBuilder';
import PlacementResources from './Pages/PlacementResources';

import About from './components/About';
import Contact from './components/Contact';

import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <div>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Public job listing */}
        <Route path="/jobs" element={<JobsView />} />

        {/* Public password recovery routes */}
        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />
        <Route
          path="/reset-password/:token"
          element={<ResetPassword />}
        />

        {/* Authenticated routes */}
        <Route element={<ProtectedRoute />}>
          {/* Student routes */}
          <Route path="/profile" element={<StudentForm />} />
          <Route path="/editprofile/:id" element={<EditProfile />} />
          <Route path="/dashboard" element={<DashBoard />} />
          <Route path="/profile-view" element={<ProfileView />} />

          <Route path="/applications" element={<MyApplications />} />
          <Route path="/student/calendar" element={<StudentCalendar />} />

          <Route path="/settings" element={<Settings />} />

          <Route
            path="/resume-analyzer/:jobId"
            element={<ResumeAnalyzer />}
          />
          <Route
            path="/resume-builder"
            element={<ResumeBuilder />}
          />
          <Route
            path="/resources"
            element={<PlacementResources />}
          />
        </Route>

        {/* Admin-only routes */}
        <Route element={<ProtectedRoute adminOnly={true} />}>
          <Route path="/addcompany" element={<CompanyForm />} />
          <Route path="/editcompany/:id" element={<EditCompany />} />

          <Route path="/addjob" element={<JobForm />} />
          <Route path="/editjob/:id" element={<EditJob />} />

          <Route path="/companies" element={<ViewCompanies />} />

          <Route
            path="/admin-applications"
            element={<AdminApplications />}
          />
          <Route
            path="/Admin-dashboard"
            element={<AdminDashboard />}
          />
          <Route
            path="/admin/analytics"
            element={<AdminAnalytics />}
          />
          <Route path="/reports" element={<Reports />} />
          <Route
            path="/admin/calendar"
            element={<AdminCalendar />}
          />
        </Route>
      </Routes>
    </div>
  );
}

export default App;