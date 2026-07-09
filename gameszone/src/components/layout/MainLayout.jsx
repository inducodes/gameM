import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import './MainLayout.css';

export default function MainLayout() {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="layout-container">
      <Sidebar isCollapsed={isSidebarCollapsed} />
      
      <div className={`main-wrapper ${isSidebarCollapsed ? 'collapsed-sidebar' : ''}`}>
        <TopNav />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
