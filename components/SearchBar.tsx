import React, { useState } from 'react';
import { SearchIcon } from './icons';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex w-full bg-white border-2 border-gray-200 focus-within:ring-2 focus-within:ring-orange-400 focus-within:border-orange-400 transition-all duration-300">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g., 'Spaghetti Carbonara', 'Vegan Chocolate Cake'..."
          className="w-full pl-5 pr-4 py-4 text-[1.4rem] text-gray-700 bg-transparent outline-none"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !query}
          className="flex-shrink-0 flex items-center justify-center px-6 font-semibold text-white bg-orange-500 hover:bg-orange-600 focus:outline-none disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300 text-[1.2rem]"
        >
          {isLoading ? (
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <SearchIcon className="w-6 h-6" />
          )}
          <span className="ml-2 hidden sm:inline">
            {isLoading ? 'Cooking...' : 'Search'}
          </span>
        </button>
      </div>
    </form>
  );
};