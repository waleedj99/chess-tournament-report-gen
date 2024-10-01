import React from 'react';
import { SearchIcon, BellIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Header = () => {
  return (
    <header className="bg-gray-800 text-white shadow-md">
      <div className="flex items-center justify-between px-6 py-4">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search"
              className="pl-10 pr-4 py-2 rounded-full bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
          <BellIcon className="h-6 w-6 text-gray-400 cursor-pointer" />
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};

export default Header;