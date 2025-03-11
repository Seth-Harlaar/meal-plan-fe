'use client'
import MealPlanListItem from "./MealPlanListItem";
import { MealResultType, RecipeResultType } from "@/db/db";
import { useEffect, useState, useTransition } from "react";
import { DaysOfWeek } from "@/models/enums/DaysOfTheWeek";

import './MealListing.css';

export default function MealPlanListView(
  {mealDataList, recipeDataList}: 
  {mealDataList: MealResultType[], recipeDataList: RecipeResultType[]}
){

  // get the current date - shift days
  const today: number = new Date().getDay();

  const days = Object.keys(DaysOfWeek).filter((key) => isNaN(Number(key)));
  const shiftedDays = [...days.slice(today), ...days.slice(0, today)];

  return (
    <>
      {shiftedDays
        .map((day, dayIndex) => {
          const dayValue = DaysOfWeek[day as keyof typeof DaysOfWeek];
          const dayPassed = today > days.indexOf(day);
          return <div className={`day ${dayPassed ? "passed" : ""}`} key={dayIndex}>
            <hr/>
            <h1>{day}</h1>
            {mealDataList.filter(m => m?.day_for == dayValue).map((mealData, index) => {
              let mealRecipe = recipeDataList.find(rd => rd.id == mealData.recipe_id) ?? {id: 0, name: "", instructions: "", prep_time: 0};
              return <MealPlanListItem mealData={mealData} recipeData={mealRecipe} rerollFunction={null} editFunction={null} addMealFunction={null} key={index}/>
            })}
          </div>
        })
      }
    </>
  )
}