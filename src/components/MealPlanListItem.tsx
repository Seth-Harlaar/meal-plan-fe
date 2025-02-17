'use client'
import { RefreshButton } from "./Buttons";
import './styles/MealListing.css';
import { mealPlanMealType } from "@/db/db";

export default function MealPlanListItem({mealData, rerollFunction}: {mealData: mealPlanMealType | null, rerollFunction: () => void}){
  const mealTimes: string[] = ["Breakfast", "Lunch", "Dinner", "Snack", "Other"];

  if(true){
    return <div className="meal">
      <img className="meal-preview" src='https://www.onceuponachef.com/images/2024/01/Grilled-Cheese-6-1200x1800.jpg'/>
      <div className="desc">
        <h2 className="title">{mealData?.meal_id}</h2>
        <h3>{mealData == null ? "" : mealTimes[(mealData.time_for)/10]}</h3>
      </div>
      <div className="flex-spacer"></div>
      <div onClick={rerollFunction}>
        <RefreshButton />
      </div>
    </div>
  } else {
    return <div className="meal">
      Could not find this meal
    </div>
  }
}