'use client'
import { useEffect, useState, useTransition } from "react";
import { RefreshButton } from "./Buttons";
import './styles/MealListing.css';
import { FoodResultType, MealResultType, RecipeResultType } from "@/db/db";
import { GetRecipe } from "@/app/mealplan/new/action";

export default function MealPlanListItem({mealData, rerollFunction}: {mealData: MealResultType, rerollFunction: () => void}){
  const mealTimes: string[] = ["Breakfast", "Lunch", "Dinner", "Snack", "Other"];
  const [recipeData, setRecipeData] = useState<RecipeResultType | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const foodDataResult = await GetRecipe(mealData.recipe_id);
      setRecipeData(foodDataResult);
    });
  }, [mealData.recipe_id]);

  if(!recipeData || !mealData || isPending){
    <div className="meal loading">
      <img className="meal-preview"/>
      <div className="desc">
        <h2 className="title">Loading meal data</h2>
        <h3></h3>
      </div>
      <div className="flex-spacer"></div>
      <div>
        <RefreshButton />
      </div>
    </div>
  }
  return <div className="meal">
    <img className="meal-preview" src='https://www.onceuponachef.com/images/2024/01/Grilled-Cheese-6-1200x1800.jpg'/>
    <div className="desc">
      <h2 className="title">{recipeData?.name}</h2>
      <h3>{mealData == null ? "" : mealTimes[(mealData.time_for)/10]}</h3>
    </div>
    <div className="flex-spacer"></div>
    <div onClick={rerollFunction}>
      <RefreshButton />
    </div>
  </div>
}