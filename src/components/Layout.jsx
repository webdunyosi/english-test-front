import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = () => {
  return (
    <div className="flex h-screen overflow-hidden text-white">
      <Sidebar />
      <div className="flex-1 md:ml-64 flex flex-col h-screen overflow-hidden">
        <Header />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto relative z-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
