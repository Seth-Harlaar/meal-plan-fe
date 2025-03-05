'use client'
import { MealTime, MealTimeAsString } from "@/models/enums/MealTime";
import { EditButton, PlusButton, RefreshButton } from "./Buttons";
import './styles/MealListing.css';
import { FoodResultType, MealResultType, RecipeResultType } from "@/db/db";

export default function MealPlanListItem(
  {mealData, recipeData, rerollFunction, editFunction, addMealFunction}: 
  {mealData: MealResultType, recipeData: RecipeResultType, 
    rerollFunction: (() => void) | null, editFunction: (() => void) | null,
    addMealFunction: (() => void) | null
  }
){
  const mealTimes: string[] = ["Breakfast", "Lunch", "Dinner", "Snack", "Other"];

  if(!recipeData || !mealData ){
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
      <h3>{mealData == null ? "" : MealTimeAsString(mealData.time_for)}</h3>
    </div>
    <div className="flex-spacer"></div>
    {editFunction && 
      <div onClick={editFunction}>
        <EditButton />
      </div>
    }
    {addMealFunction &&
      <div onClick={addMealFunction}>
        <PlusButton />
      </div>
    }
    {rerollFunction && 
      <div onClick={rerollFunction}>
        <RefreshButton />
      </div>
    }
  </div>
}