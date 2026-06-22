import { Bell, LogOut, User } from 'lucide-react';

const Header = () => {
  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-end px-8 sticky top-0 z-10">
      <div className="flex items-center space-x-6">
        <button className="text-gray-400 hover:text-blue-500 transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        
        <div className="h-6 w-px bg-gray-200"></div>

        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-2 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <User className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium text-gray-700 hidden sm:block">Profilim</span>
          </button>
          
          <button 
            className="flex items-center space-x-2 text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors"
            onClick={() => alert("Chiqish funksiyasi hozircha ulanmagan")}
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium hidden sm:block">Chiqish</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
