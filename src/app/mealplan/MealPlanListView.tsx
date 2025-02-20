'use client'
import MealPlanListItem from "@/components/MealPlanListItem";
import { MealResultType } from "@/db/db";
import { useEffect, useState, useTransition } from "react";
import { GetRandomMeal, saveMealPlan } from "./new/action";
import { DaysOfWeek } from "@/models/enums/DaysOfTheWeek";

export default function MealPlanListView({mealDataList}: {mealDataList: MealResultType[]}){
  const [meals, setMeals] = useState<(MealResultType|null)[]>(mealDataList);
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
    <>
      <>
        {Object.keys(DaysOfWeek)
          .filter((key) => isNaN(Number(key)))
          .map((day, index) => {
            const dayValue = DaysOfWeek[day as keyof typeof DaysOfWeek];
            return <div className="day" key={index}>
              <h1>{day}</h1>
              {meals.filter(m => m?.day_for == dayValue).map((mealData, index) => {
                return <MealPlanListItem mealData={mealData} rerollFunction={() => rerollItem(index)} key={index}/>
              })}
            </div>
          })
        }
      </>

      <div className="meal-plan-days">
      </div>
      <button onClick={() => saveMealPlan(meals.filter(m => m != null))} >Save Changes</button>
    </>
  )
}