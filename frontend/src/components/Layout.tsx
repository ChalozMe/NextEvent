import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', backgroundColor: '#F8FAFC' }}>
      <Sidebar />
      <main style={{ flex: 1, overflowY: 'auto', backgroundColor: '#F8FAFC' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
