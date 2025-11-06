import React, { useState } from 'react';
import type { Recipe } from '../types';
import { ClockIcon, UsersIcon, ListIcon, ClipboardIcon, StarIcon, PrinterIcon, ShareIcon, CheckIcon, HeartIcon } from './icons';

interface RecipeDisplayProps {
  recipe: Recipe;
}

export const RecipeDisplay: React.FC<RecipeDisplayProps> = ({ recipe }) => {
    const [copied, setCopied] = useState(false);
    const [unitSystem, setUnitSystem] = useState<'imperial' | 'metric'>('imperial');

    const handleCopy = () => {
        const ingredientsText = recipe.ingredients.map(ingredient => {
            const quantity = unitSystem === 'imperial' ? ingredient.imperial : ingredient.metric;
            return `${quantity} ${ingredient.name}`;
        }).join('\n');

        const recipeText = `
Recipe: ${recipe.name}
${recipe.description}

Prep Time: ${recipe.prepTime}
Cook Time: ${recipe.cookTime}
Servings: ${recipe.servings}

Ingredients:
${ingredientsText}

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
        <article className="bg-white shadow-lg animate-fade-in-up overflow-hidden">
            {recipe.imageUrl && (
                <img 
                    src={recipe.imageUrl} 
                    alt={`A delicious plate of ${recipe.name}`}
                    className="w-full h-56 sm:h-72 md:h-96 object-cover"
                />
            )}
            <div className="p-6 md:p-10">
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

                    {recipe.nutritionalInfo && (
                        <div className="mt-6 border-t pt-6">
                            <h3 className="flex items-center gap-3 text-xl font-semibold text-gray-800 mb-3">
                                <HeartIcon className="w-6 h-6 text-orange-500" />
                                Nutritional Info (per serving)
                            </h3>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                                <div className="bg-orange-50 p-3">
                                    <p className="text-[1.2rem] font-medium text-gray-500">Calories</p>
                                    <p className="text-[1.6rem] font-bold text-orange-600">{recipe.nutritionalInfo.calories}</p>
                                </div>
                                <div className="bg-orange-50 p-3">
                                    <p className="text-[1.2rem] font-medium text-gray-500">Protein</p>
                                    <p className="text-[1.6rem] font-bold text-orange-600">{recipe.nutritionalInfo.protein}</p>
                                </div>
                                <div className="bg-orange-50 p-3">
                                    <p className="text-[1.2rem] font-medium text-gray-500">Fat</p>
                                    <p className="text-[1.6rem] font-bold text-orange-600">{recipe.nutritionalInfo.fat}</p>
                                </div>
                                <div className="bg-orange-50 p-3">
                                    <p className="text-[1.2rem] font-medium text-gray-500">Carbs</p>
                                    <p className="text-[1.6rem] font-bold text-orange-600">{recipe.nutritionalInfo.carbs}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </header>

                <div className="flex flex-col md:flex-row gap-8 md:gap-12">
                    <section className="md:w-1/3">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="flex items-center gap-3 text-2xl font-semibold text-gray-800">
                                <ListIcon className="w-6 h-6 text-orange-500" />
                                Ingredients
                            </h2>
                            <div className="flex items-center gap-1 p-0.5 bg-gray-100 rounded-md">
                                <button 
                                    onClick={() => setUnitSystem('imperial')}
                                    className={`px-3 py-1 text-[1.1rem] font-medium transition-colors duration-200 rounded-md ${unitSystem === 'imperial' ? 'bg-white shadow-sm text-orange-600' : 'bg-transparent text-gray-500 hover:text-gray-800'}`}
                                >
                                    Imperial
                                </button>
                                <button 
                                    onClick={() => setUnitSystem('metric')}
                                    className={`px-3 py-1 text-[1.1rem] font-medium transition-colors duration-200 rounded-md ${unitSystem === 'metric' ? 'bg-white shadow-sm text-orange-600' : 'bg-transparent text-gray-500 hover:text-gray-800'}`}
                                >
                                    Metric
                                </button>
                            </div>
                        </div>

                        <ul className="space-y-3 text-gray-700 text-[1.4rem]">
                            {recipe.ingredients.map((ingredient, index) => (
                                <li key={index} className="flex gap-3 items-baseline">
                                    <span className="font-semibold text-orange-600 w-24 flex-shrink-0 text-right pr-2">
                                        {unitSystem === 'imperial' ? ingredient.imperial : ingredient.metric}
                                    </span>
                                    <span>{ingredient.name}</span>
                                </li>
                            ))}
                        </ul>
                    </section>
                    
                    <section className="md:w-2/3">
                        <h2 className="flex items-center gap-3 text-2xl font-semibold text-gray-800 mb-4">
                            <ClipboardIcon className="w-6 h-6 text-orange-500" />
                            Instructions
                        </h2>
                        <ol className="space-y-4 text-gray-700 text-[1.4rem]">
                            {recipe.instructions.map((step, index) => (
                                <li key={index} className="flex gap-3">
                                    <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-[1.2rem]">{index + 1}</div>
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
                        <ul className="space-y-3 list-disc list-inside text-gray-600 text-[1.4rem]">
                            {recipe.tips.map((tip, index) => (
                                <li key={index}>{tip}</li>
                            ))}
                        </ul>
                    </section>
                )}

                <div className="mt-10 border-t pt-6 flex items-center justify-end gap-3">
                    <button onClick={handleCopy} className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400 text-[1.2rem]">
                        {copied ? <CheckIcon className="w-5 h-5 text-green-500" /> : <ClipboardIcon className="w-5 h-5" />}
                        {copied ? 'Copied!' : 'Copy'}
                    </button>
                    <button onClick={handleShare} className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400 text-[1.2rem]">
                        <ShareIcon className="w-5 h-5" />
                        Share
                    </button>
                     <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400 text-[1.2rem]">
                        <PrinterIcon className="w-5 h-5" />
                        Print
                    </button>
                </div>
            </div>
        </article>
    );
};
