import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import ClassManagement from './pages/ClassManagement';
import ActivityManagement from './pages/ActivityManagement';
import SignupManagement from './pages/SignupManagement';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="classes" element={<ClassManagement />} />
          <Route path="activities" element={<ActivityManagement />} />
          <Route path="signups" element={<SignupManagement />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

