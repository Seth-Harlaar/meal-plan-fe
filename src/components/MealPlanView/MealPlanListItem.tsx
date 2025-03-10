'use client'
import { MealTime, MealTimeAsString } from "@/models/enums/MealTime";
import { EditIcon, IconButton, PlusIcon, RefreshIcon } from "../Icons";
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
        <RefreshIcon />
      </div>
    </div>
  }
  return <div className="meal">
    <img className="meal-preview" src='https://potatorolls.com/wp-content/uploads/2020/10/Big-Tex_med.jpg'/>
    <div className="desc">
      <h2 className="title">{recipeData?.name}</h2>
      <h3>{mealData == null ? "" : MealTimeAsString(mealData.time_for)}</h3>
    </div>
    <div className="flex-spacer"></div>
    {editFunction && 
      <IconButton onClick={editFunction} >
        <EditIcon />
      </IconButton>
    }
    {addMealFunction &&
      <IconButton onClick={addMealFunction}>
        <PlusIcon />
      </IconButton>
    }
    {rerollFunction && 
      <IconButton onClick={rerollFunction}>
        <RefreshIcon/>
      </IconButton>
    }
  </div>
}