import React from 'react';
import type { Recipe } from '../types';
import { ClockIcon, UsersIcon, ListIcon, ClipboardIcon, StarIcon, PrinterIcon, ShareIcon, CheckIcon } from './icons';

interface RecipeDisplayProps {
  recipe: Recipe;
}

export const RecipeDisplay: React.FC<RecipeDisplayProps> = ({ recipe }) => {
    const [copied, setCopied] = React.useState(false);

    const handleCopy = () => {
        const recipeText = `
Recipe: ${recipe.name}
${recipe.description}

Prep Time: ${recipe.prepTime}
Cook Time: ${recipe.cookTime}
Servings: ${recipe.servings}

Ingredients:
${recipe.ingredients.join('\n')}

Instructions:
${recipe.instructions.map((step, index) => `${index + 1}. ${step}`).join('\n')}

${recipe.tips ? `Tips:\n${recipe.tips.join('\n')}` : ''}
        `.trim();

        navigator.clipboard.writeText(recipeText).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const handlePrint = () => {
        window.print();
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: recipe.name,
                    text: `Check out this recipe for ${recipe.name}!`,
                    url: window.location.href,
                });
            } catch (error) {
                console.error('Error sharing:', error);
            }
        } else {
            // Fallback for browsers that don't support Web Share API
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };


    return (
        <article className="bg-white p-6 md:p-10 shadow-lg animate-fade-in-up">
            <header className="border-b pb-6 mb-6">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800">{recipe.name}</h1>
                <p className="mt-3 text-lg text-gray-600">{recipe.description}</p>
                
                <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-gray-700">
                    <div className="flex items-center gap-2">
                        <ClockIcon className="w-5 h-5 text-orange-500" />
                        <span>Prep: {recipe.prepTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <ClockIcon className="w-5 h-5 text-orange-500" />
                        <span>Cook: {recipe.cookTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <UsersIcon className="w-5 h-5 text-orange-500" />
                        <span>Serves: {recipe.servings}</span>
                    </div>
                </div>
            </header>

            <div className="flex flex-col md:flex-row gap-8 md:gap-12">
                <section className="md:w-1/3">
                    <h2 className="flex items-center gap-3 text-2xl font-semibold text-gray-800 mb-4">
                        <ListIcon className="w-6 h-6 text-orange-500" />
                        Ingredients
                    </h2>
                    <ul className="space-y-3 list-disc list-inside text-gray-700">
                        {recipe.ingredients.map((ingredient, index) => (
                            <li key={index}>{ingredient}</li>
                        ))}
                    </ul>
                </section>
                
                <section className="md:w-2/3">
                    <h2 className="flex items-center gap-3 text-2xl font-semibold text-gray-800 mb-4">
                        <ClipboardIcon className="w-6 h-6 text-orange-500" />
                        Instructions
                    </h2>
                    <ol className="space-y-4 text-gray-700">
                        {recipe.instructions.map((step, index) => (
                            <li key={index} className="flex gap-3">
                                <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">{index + 1}</div>
                                <p className="flex-1 pt-1">{step}</p>
                            </li>
                        ))}
                    </ol>
                </section>
            </div>

            {recipe.tips && recipe.tips.length > 0 && (
                <section className="mt-8 border-t pt-6">
                    <h2 className="flex items-center gap-3 text-2xl font-semibold text-gray-800 mb-4">
                        <StarIcon className="w-6 h-6 text-orange-500" />
                        Chef's Tips
                    </h2>
                    <ul className="space-y-3 list-disc list-inside text-gray-600">
                        {recipe.tips.map((tip, index) => (
                            <li key={index}>{tip}</li>
                        ))}
                    </ul>
                </section>
            )}

            <div className="mt-10 border-t pt-6 flex items-center justify-end gap-3">
                <button onClick={handleCopy} className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400">
                    {copied ? <CheckIcon className="w-5 h-5 text-green-500" /> : <ClipboardIcon className="w-5 h-5" />}
                    {copied ? 'Copied!' : 'Copy'}
                </button>
                <button onClick={handleShare} className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400">
                    <ShareIcon className="w-5 h-5" />
                    Share
                </button>
                 <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400">
                    <PrinterIcon className="w-5 h-5" />
                    Print
                </button>
            </div>

        </article>
    );
};
