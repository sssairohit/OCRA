
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
      <div className="container mx-auto px-6 py-4 text-center text-gray-500 dark:text-gray-400">
        <p>
          <a href="https://www.linkedin.com/in/sssairohit/" target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-gray-700 dark:hover:text-gray-200 transition-colors">Sai Rohit</a> 
          &nbsp;&bull;&nbsp; &copy; {new Date().getFullYear()} One Cookbook to Rule them All (OCRA) &nbsp;&bull;&nbsp; Powered by AI
        </p>
      </div>
    </footer>
  );
};