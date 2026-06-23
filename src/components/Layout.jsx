import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import MobileBottomNav from './MobileBottomNav';

const Layout = () => {
  return (
    <div className="flex h-screen overflow-hidden text-white bg-[#0b1120]">
      <Sidebar />
      <div className="flex-1 md:ml-64 flex flex-col h-screen overflow-hidden">
        <Header />
        <main className="flex-1 p-6 md:p-8 pb-24 md:pb-8 overflow-y-auto relative z-0">
          <Outlet />
        </main>
        <MobileBottomNav />
      </div>
    </div>
  );
};

export default Layout;
