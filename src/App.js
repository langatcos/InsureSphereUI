import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/homepage/Home';
import Products from './pages/products/Products';
import Login from './pages/login/Login';
import SystemAttributes from './pages/systemattributes/SystemAttributes';
import Client from './pages/clients/Client';
import Underwriting from './pages/underwriting/Underwriting';

function App() {
  return (

    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="products">
          <Route index element={<Products />} />
        </Route>
        <Route path="system">
          <Route index element={<SystemAttributes />} />
        </Route>
        <Route path="clients">
          <Route index element={<Client/>}/>
        </Route>
        <Route path="underwriting">
          <Route index element={<Underwriting/>}/>
        </Route>
      </Routes>
    </Router>

  );
}

export default App;
