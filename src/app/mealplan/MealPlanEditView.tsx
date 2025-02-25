'use client'
import MealPlanListItem from "@/components/MealPlanListItem";
import { MealResultType, RecipeResultType } from "@/db/db";
import { useEffect, useState, useTransition } from "react";
import { GetRandomMeal, saveMealPlan } from "./new/action";
import { DaysOfWeek } from "@/models/enums/DaysOfTheWeek";

export default function MealPlanEditView(
  {mealDataList, recipeDataList}: 
  {mealDataList: MealResultType[], recipeDataList: RecipeResultType[]}
){
  const [meals, setMeals] = useState<(MealResultType)[]>(mealDataList);
  const [isPending, startTransition] = useTransition();

  function rerollItem(index: number) {
    console.log(meals);
    let mealPlanId = meals[index]?.meal_plan_id;
    let newMealList = [...meals];
    newMealList[index].recipe_id = 0;
    setMeals(newMealList);
    
    startTransition(async () => {
      newMealList = [...meals];
      const newRecipe = await GetRandomMeal(mealPlanId ?? 0);
      console.log(newRecipe);
      newMealList[index].recipe_id = newRecipe?.id ?? 0;
      setMeals(newMealList);
    });
  }

  return (
    <>
      <>
        {Object.keys(DaysOfWeek)
          .filter((key) => isNaN(Number(key)))
          .map((day, dayIndex) => {
            const dayValue = DaysOfWeek[day as keyof typeof DaysOfWeek];
            return <div className="day" key={dayIndex}>
              <h1>{day}</h1>
              {meals.filter(m => m?.day_for == dayValue).map((mealData, index) => {
                let mealRecipe = recipeDataList.find(rd => rd.id == mealData.recipe_id) ?? {id: 0, name: "", instructions: "", prep_time: 0};
                return <MealPlanListItem mealData={mealData} recipeDataFirst={mealRecipe} rerollFunction={() => rerollItem(index)} key={index}/>
              })}
            </div>
          })
        }
      </>

      <div className="meal-plan-days">
      </div>
      <button onClick={() => saveMealPlan(meals.filter(m => m != null))}>Save Changes</button>
    </>
  )
}