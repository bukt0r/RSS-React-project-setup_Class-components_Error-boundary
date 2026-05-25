import { useCallback } from 'react';
import { NavLink, Route, Routes } from 'react-router-dom';
import SelectionFlyout from './components/SelectionFlyout';
import ThemeSwitcher from './components/ThemeSwitcher';
import AboutPage from './pages/AboutPage';
import HomePage from './pages/HomePage';
import PersonDetailsPanel from './pages/PersonDetailsPanel';
import NotFoundPage from './pages/NotFoundPage';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { downloadSelectedItemsCsv } from './services/selectedItemsCsv';
import {
  selectSelectedItems,
  selectSelectedItemsCount,
} from './store/selectedItemsSelectors';
import { clearSelectedItems } from './store/selectedItemsSlice';
import './App.css';

function App() {
  const dispatch = useAppDispatch();
  const selectedCount = useAppSelector(selectSelectedItemsCount);
  const selectedItems = useAppSelector(selectSelectedItems);

  const handleUnselectAll = useCallback((): void => {
    dispatch(clearSelectedItems());
  }, [dispatch]);

  const handleDownload = useCallback((): void => {
    downloadSelectedItemsCsv(selectedItems);
  }, [selectedItems]);

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
        <ThemeSwitcher />
      </header>

      <Routes>
        <Route path="/" element={<HomePage />}>
          <Route index element={<PersonDetailsPanel />} />
        </Route>
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <SelectionFlyout
        selectedCount={selectedCount}
        onUnselectAll={handleUnselectAll}
        onDownload={handleDownload}
      />
    </div>
  );
}

export default App;
