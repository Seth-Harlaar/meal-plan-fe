'use client'
import MealPlanListItem from "@/components/MealPlanListItem";
import { mealPlanMealType } from "@/db/db";
import { useState, useTransition } from "react";
import { GetRandomMeal } from "./new/action";



export default function MealPlanListView({mealDataList}: {mealDataList: mealPlanMealType[]}){
  const [meals, setMeals] = useState(mealDataList);
  const [isPending, startTransition] = useTransition();

  function rerollItem(index: number) {
    startTransition(async () => {
      const newMeal = await GetRandomMeal(meals[0].meal_plan_id);
      let newMealList = meals;
      newMealList[index] = newMeal;
    });
  }

  return (
    <>
    {mealDataList.map((mealData, index) => {
      return <MealPlanListItem mealData={mealData} rerollClick={rerollItem} key={index}/>
    })}
    </>
  )
}