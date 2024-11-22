import LoginForm from './Components/Form/LoginForm';
import Dashboard from './Components/Dashboard/Main';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} /> 
        <Route path="/dashboard/*" element={<Dashboard />} /> 
      </Routes>
    </Router>
  );
}

export default App;
