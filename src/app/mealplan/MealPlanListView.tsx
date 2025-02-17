'use client'
import MealPlanListItem from "@/components/MealPlanListItem";
import { mealPlanMealType } from "@/db/db";
import { useState, useTransition } from "react";
import { GetRandomMeal } from "./new/action";



export default function MealPlanListView({mealDataList}: {mealDataList: mealPlanMealType[]}){
  const [meals, setMeals] = useState<(mealPlanMealType|null)[]>(mealDataList);
  const [isPending, startTransition] = useTransition();

  function rerollItem(index: number) {
    console.log(meals);
    let mealPlanId = meals[index]?.meal_plan_id;
    console.log('reroll', mealPlanId);
    let newMealList = [...meals];
    newMealList[index] = null;
    setMeals(newMealList);
    
    startTransition(async () => {
      newMealList = [...meals];
      console.log('transition', mealPlanId);
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