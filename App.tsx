import React, { useState, useEffect } from 'react';
import type { Recipe } from './types';
import { generateRecipe } from './services/geminiService';
import { SearchBar } from './components/SearchBar';
import { RecipeDisplay } from './components/RecipeDisplay';
import { Footer } from './components/Footer';
import { MoonIcon, SunIcon } from './components/icons';

const App: React.FC = () => {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Effect for initializing and updating the theme
  useEffect(() => {
    // Check for saved theme in localStorage or user's system preference
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
        setTheme(savedTheme);
    } else {
        setTheme(systemPrefersDark ? 'dark' : 'light');
    }
  }, []);

  useEffect(() => {
    // Apply theme class to the root element and save preference
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const dishName = urlParams.get('dish');
    if (dishName) {
      handleSearch(decodeURIComponent(dishName));
    }
  }, []); // Runs once on initial load

  const handleSearch = async (query: string) => {
    if (!query) return;
    setIsLoading(true);
    setError(null);
    setRecipe(null);
    try {
      const result = await generateRecipe(query);
      setRecipe(result);
      // Update URL to be shareable, but only if not in a blob context
      if (window.location.protocol !== 'blob:') {
        const url = new URL(window.location.href);
        url.searchParams.set('dish', encodeURIComponent(query));
        window.history.pushState({ path: url.href }, '', url.href);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
       // Clear URL param on error
       if (window.location.protocol !== 'blob:') {
        const url = new URL(window.location.href);
        url.searchParams.delete('dish');
        window.history.pushState({ path: url.href }, '', url.href);
       }
    } finally {
      setIsLoading(false);
    }
  };

  const InitialState: React.FC = () => (
    <div className="text-center text-gray-500 dark:text-gray-400 mt-24 animate-fade-in">
        <h2 className="text-[2.2rem] font-semibold">What are we cooking today?</h2>
        <p className="mt-2 text-[1.6rem]">Search for a dish to get started.</p>
    </div>
  );

  const ErrorState: React.FC<{ message: string }> = ({ message }) => (
    <div className="text-center text-red-500 bg-red-100 border border-red-400 p-6 mt-8">
        <h3 className="font-bold text-[1.6rem]">Oops! Something went wrong.</h3>
        <p className="mt-2 text-[1.2rem]">{message}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col transition-colors duration-300">
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex justify-between items-center">
            <div className="flex-1"></div> {/* Spacer */}
            <h1 className="text-[2.2rem] md:text-[2.4rem] font-bold tracking-tight">
              One Cookbook to Rule them All • (OCRA)
            </h1>
            <div className="flex-1 flex justify-end">
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 focus:ring-offset-gray-50 dark:focus:ring-offset-gray-900 transition-colors"
                  aria-label="Toggle theme"
                >
                  {theme === 'light' ? (
                    <MoonIcon className="w-6 h-6" />
                  ) : (
                    <SunIcon className="w-6 h-6" />
                  )}
                </button>
            </div>
          </div>
          <p className="mt-4 text-[1.4rem] text-gray-600 dark:text-gray-400">
            Your personal AI chef. <br /> Instantly generate any recipe you can imagine.
          </p>
        </div>
        
        <div className="max-w-7xl mx-auto mt-8 sticky top-4 z-10 bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-sm p-2">
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        </div>

        <div className="max-w-7xl mx-auto mt-8">
          {isLoading && (
            <div className="flex justify-center items-center space-x-3 text-[1.4rem] font-medium text-gray-600 dark:text-gray-400">
              <svg className="animate-spin h-8 w-8 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Generating your masterpiece...</span>
            </div>
          )}
          {error && <ErrorState message={error} />}
          {recipe && <RecipeDisplay recipe={recipe} />}
          {!isLoading && !error && !recipe && <InitialState />}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;