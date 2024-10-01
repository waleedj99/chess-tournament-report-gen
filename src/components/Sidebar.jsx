import React from 'react';
import { ChessIcon, LayoutDashboardIcon, TrophyIcon, NewspaperIcon, SettingsIcon, LogOutIcon } from 'lucide-react';

const Sidebar = () => {
  return (
    <div className="bg-gray-900 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform -translate-x-full md:relative md:translate-x-0 transition duration-200 ease-in-out">
      <div className="flex items-center space-x-2 px-4">
        <ChessIcon className="h-8 w-8 text-green-400" />
        <span className="text-2xl font-extrabold">ChessInsights</span>
      </div>
      <nav>
        <a href="#" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white">
          <LayoutDashboardIcon className="inline-block mr-2" /> Dashboard
        </a>
        <a href="#" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white">
          <TrophyIcon className="inline-block mr-2" /> Tournaments
        </a>
        <a href="#" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white">
          <NewspaperIcon className="inline-block mr-2" /> News
        </a>
        <a href="#" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white">
          <SettingsIcon className="inline-block mr-2" /> Settings
        </a>
      </nav>
      <div className="absolute bottom-0 w-full">
        <a href="#" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white">
          <LogOutIcon className="inline-block mr-2" /> Log out
        </a>
      </div>
    </div>
  );
};

export default Sidebar;