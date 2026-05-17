import { NavLink, Route, Routes } from 'react-router-dom';
import AboutPage from './pages/AboutPage';
import HomePage from './pages/HomePage';
import PersonDetailsPanel from './pages/PersonDetailsPanel';
import NotFoundPage from './pages/NotFoundPage';
import './App.css';

function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <nav className="app-nav" aria-label="Main navigation">
          <NavLink to="/" end className="app-nav__link">
            Search
          </NavLink>
          <NavLink to="/about" className="app-nav__link">
            About
          </NavLink>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<HomePage />}>
          <Route element={<PersonDetailsPanel />} />
        </Route>
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App;
