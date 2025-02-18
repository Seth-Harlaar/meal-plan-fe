'use client'
import MealPlanListItem from "@/components/MealPlanListItem";
import { MealPlanMealResultType } from "@/db/db";
import { useState, useTransition } from "react";
import { GetRandomMeal } from "./new/action";



export default function MealPlanListView({mealDataList}: {mealDataList: MealPlanMealResultType[]}){
  const [meals, setMeals] = useState<(MealPlanMealResultType|null)[]>(mealDataList);
  const [isPending, startTransition] = useTransition();

  function rerollItem(index: number) {
    console.log(meals);
    let mealPlanId = meals[index]?.meal_plan_id;
    let newMealList = [...meals];
    newMealList[index] = null;
    setMeals(newMealList);
    
    startTransition(async () => {
      newMealList = [...meals];
      const newMeal = await GetRandomMeal(mealPlanId ?? 0);
      console.log(newMeal);
      newMealList[index] = newMeal;
      setMeals(newMealList);
    });
  }

  return (
    <div className="meal-plan-days">
      {meals.map((mealData, index) => {
        return <MealPlanListItem mealData={mealData} rerollFunction={() => rerollItem(index)} key={index}/>
      })}
    </div>
  )
}