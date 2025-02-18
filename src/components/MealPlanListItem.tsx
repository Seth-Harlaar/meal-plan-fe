'use client'
import { useEffect, useState, useTransition } from "react";
import { RefreshButton } from "./Buttons";
import './styles/MealListing.css';
import { FoodResultType, MealPlanMealResultType } from "@/db/db";
import { GetFullMealFoods } from "@/app/mealplan/new/action";

export default function MealPlanListItem({mealData, rerollFunction}: {mealData: MealPlanMealResultType | null, rerollFunction: () => void}){
  const mealTimes: string[] = ["Breakfast", "Lunch", "Dinner", "Snack", "Other"];
  const [foodData, setFoodData] = useState<FoodResultType | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const foodDataResult = await GetFullMealFoods(mealData?.meal_id ?? -1);
      setFoodData(foodDataResult);
    });
  }, [mealData?.meal_id]);

  if(!foodData || !mealData || isPending){
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
      <h2 className="title">{foodData?.name}</h2>
      <h3>{mealData == null ? "" : mealTimes[(mealData.time_for)/10]}</h3>
    </div>
    <div className="flex-spacer"></div>
    <div onClick={rerollFunction}>
      <RefreshButton />
    </div>
  </div>
}