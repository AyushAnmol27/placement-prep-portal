import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/common/ProtectedRoute';
import AdminRoute from '../components/common/AdminRoute';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';

import Landing from '../pages/Landing';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Dashboard from '../pages/Dashboard';
import Programming from '../pages/Programming';
import Aptitude from '../pages/Aptitude';
import CompanyPrep from '../pages/CompanyPrep';
import MockTests from '../pages/MockTests';
import Notes from '../pages/Notes';
import Blog from '../pages/Blog';
import Analytics from '../pages/Analytics';
import Leaderboard from '../pages/Leaderboard';
import Profile from '../pages/Profile';
import Roadmap from '../pages/Roadmap';
import AdminPanel from '../pages/AdminPanel';
import Games from '../pages/Games';
import DSAProblems from '../pages/DSAProblems';
import CodeIDE from '../pages/CodeIDE';

const Layout = ({ children }) => (
  <>
    <Navbar />
    <div className="layout" style={{ paddingTop: 'var(--navbar-height)' }}>
      <Sidebar />
      <main className="main-content animate-fade">{children}</main>
    </div>
  </>
);

const P = ({ children }) => <ProtectedRoute><Layout>{children}</Layout></ProtectedRoute>;
const A = ({ children }) => <AdminRoute><Layout>{children}</Layout></AdminRoute>;

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Landing />} />
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />

    <Route path="/dashboard"   element={<P><Dashboard /></P>} />
    <Route path="/programming" element={<P><Programming /></P>} />
    <Route path="/aptitude"    element={<P><Aptitude /></P>} />
    <Route path="/companies"   element={<P><CompanyPrep /></P>} />
    <Route path="/tests"       element={<P><MockTests /></P>} />
    <Route path="/notes"       element={<P><Notes /></P>} />
    <Route path="/blog"        element={<P><Blog /></P>} />
    <Route path="/analytics"   element={<P><Analytics /></P>} />
    <Route path="/leaderboard" element={<P><Leaderboard /></P>} />
    <Route path="/profile"     element={<P><Profile /></P>} />
    <Route path="/roadmap"     element={<P><Roadmap /></P>} />
    <Route path="/games"       element={<P><Games /></P>} />
    <Route path="/dsa"         element={<P><DSAProblems /></P>} />
    <Route path="/ide"         element={<P><CodeIDE /></P>} />
    <Route path="/admin"       element={<A><AdminPanel /></A>} />

    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default AppRoutes;
