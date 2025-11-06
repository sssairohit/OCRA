import React, { useState } from 'react';
import type { Recipe } from '../types';
import { ClockIcon, UsersIcon, ClipboardIcon, ListIcon, StarIcon, PrinterIcon, ShareIcon, CheckIcon } from './icons';

interface RecipeDisplayProps {
  recipe: Recipe;
}

const InfoCard: React.FC<{ icon: React.ReactNode; label: string; value?: string }> = ({ icon, label, value }) => {
    if (!value) return null;
    return (
        <div className="flex flex-col items-center justify-center bg-orange-50 p-4 text-center">
            <div className="text-orange-500">{icon}</div>
            <span className="mt-2 text-[1.2rem] font-semibold text-gray-700">{label}</span>
            <span className="text-gray-600">{value}</span>
        </div>
    );
};

export const RecipeDisplay: React.FC<RecipeDisplayProps> = ({ recipe }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
    });
  };

  return (
    <div id="recipe-content" className="bg-white border border-gray-200 p-6 sm:p-8 md:p-10 animate-fade-in-up relative">
      <div className="print-button absolute top-6 right-6 flex items-center space-x-2">
        <button
          onClick={handleShare}
          className={`flex items-center px-4 py-2 font-semibold text-[1.2rem] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            isCopied 
              ? 'bg-green-500 text-white hover:bg-green-600 focus:ring-green-400' 
              : 'bg-orange-500 text-white hover:bg-orange-600 focus:ring-orange-400'
          }`}
          aria-label="Share Recipe"
          disabled={isCopied}
        >
          {isCopied ? (
            <>
              <CheckIcon className="w-5 h-5 mr-2" />
              Copied!
            </>
          ) : (
            <>
              <ShareIcon className="w-5 h-5 mr-2" />
              Share
            </>
          )}
        </button>
        <button
          onClick={handlePrint}
          className="flex items-center px-4 py-2 bg-gray-600 text-white font-semibold text-[1.2rem] hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          aria-label="Print Recipe"
        >
          <PrinterIcon className="w-5 h-5 mr-2" />
          Print
        </button>
      </div>


      <header className="text-center border-b pb-6 mb-6">
        <h2 className="text-[2rem] sm:text-[2.2rem] font-bold text-gray-800">{recipe.dishName}</h2>
        <p className="mt-3 text-[1.4rem] text-gray-600 max-w-6xl mx-auto">{recipe.description}</p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 my-8">
        <InfoCard icon={<ClockIcon className="h-8 w-8"/>} label="Prep Time" value={recipe.prepTime} />
        <InfoCard icon={<ClockIcon className="h-8 w-8"/>} label="Cook Time" value={recipe.cookTime} />
        <InfoCard icon={<UsersIcon className="h-8 w-8"/>} label="Servings" value={recipe.servings} />
      </div>

      <div className="grid md:grid-cols-5 gap-8">
        <section className="md:col-span-2">
            <h3 className="flex items-center text-[1.8rem] font-semibold mb-4 text-gray-800">
                <ClipboardIcon className="h-7 w-7 mr-3 text-orange-500" />
                Ingredients
            </h3>
            <ul className="space-y-3 list-none text-gray-700 text-[1.2rem]">
                {recipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-start">
                        <span className="bg-orange-400 w-2.5 h-2.5 mt-1.5 mr-3 flex-shrink-0"></span>
                        <span>{ingredient}</span>
                    </li>
                ))}
            </ul>
        </section>

        <section className="md:col-span-3">
            <h3 className="flex items-center text-[1.8rem] font-semibold mb-4 text-gray-800">
                <ListIcon className="h-7 w-7 mr-3 text-orange-500" />
                Instructions
            </h3>
            <ol className="space-y-4 text-gray-700 text-[1.2rem]">
                {recipe.instructions.map((step, index) => (
                    <li key={index} className="flex">
                        <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 mr-4 bg-orange-500 text-white font-bold">{index + 1}</span>
                        <p className="leading-relaxed">{step}</p>
                    </li>
                ))}
            </ol>
        </section>
      </div>

      {recipe.notes && (
          <section className="mt-10 pt-6 border-t">
              <h3 className="flex items-center text-[1.8rem] font-semibold mb-4 text-gray-800">
                  <StarIcon className="h-7 w-7 mr-3 text-orange-500" />
                  Chef's Notes
              </h3>
              <p className="text-gray-700 bg-gray-100 p-4 italic text-[1.2rem]">{recipe.notes}</p>
          </section>
      )}
    </div>
  );
};