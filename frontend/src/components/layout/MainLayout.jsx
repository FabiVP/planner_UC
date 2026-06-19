import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import './MainLayout.css';

export default function MainLayout() {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="app-main" role="region" aria-label="Contenido principal de la aplicación">
        <Header />
        <main id="main-content" className="page-content" tabIndex={-1}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
