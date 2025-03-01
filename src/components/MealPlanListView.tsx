'use client'
import MealPlanListItem from "@/components/MealPlanListItem";
import { MealResultType, RecipeResultType } from "@/db/db";
import { useEffect, useState, useTransition } from "react";
import { DaysOfWeek } from "@/models/enums/DaysOfTheWeek";

export default function MealPlanListView(
  {mealDataList, recipeDataList}: 
  {mealDataList: MealResultType[], recipeDataList: RecipeResultType[]}
){
  return (
    <>
      {Object.keys(DaysOfWeek)
        .filter((key) => isNaN(Number(key)))
        .map((day, dayIndex) => {
          const dayValue = DaysOfWeek[day as keyof typeof DaysOfWeek];
          return <div className="day" key={dayIndex}>
            <h1>{day}</h1>
            {mealDataList.filter(m => m?.day_for == dayValue).map((mealData, index) => {
              let mealRecipe = recipeDataList.find(rd => rd.id == mealData.recipe_id) ?? {id: 0, name: "", instructions: "", prep_time: 0};
              return <MealPlanListItem mealData={mealData} recipeData={mealRecipe} rerollFunction={null} editFunction={null} key={index}/>
            })}
          </div>
        })
      }
    </>
  )
}