'use server'
import React from "react";
import { GetCurrentUser } from "@/auth/auth";
import LogInMessage from "@/components/LogInMessage";
import PageTitle from "@/components/PageTitle";
import { MealPlan } from "@/models/MealPlan";
import { ScheduledMeal } from "@/models/Meal";
import MealPlanListView from "../MealPlanListView";
import { MealResultType, Zods } from "@/db/db";

export default async function Home() {
  const user = await GetCurrentUser();
  if(!user){
    return (
      <LogInMessage/>
    );
  }

  // meals
  const newMeals: MealResultType[] = [];
  for(let i = 0; i < 7; i++){
    const randomMeal = await ScheduledMeal.GetRandomRecipe(0);
    const newMealData: MealResultType = {
      id: randomMeal.ScheduledMealID,
      meal_plan_id: 0,
      meal_id: randomMeal.MealSubId,
      is_full_meal: randomMeal.IsFullMeal,
      day_for: i,
      time_for: randomMeal.TimeFor,
    };
    newMeals.push(newMealData);
  }

  return (
    <>
      <PageTitle titleText="New Meal Plan"/>
      <PageTitle titleText={MealPlan.genericMealPlanName()}/>
      <MealPlanListView mealDataList={newMeals} />
    </>
  );
}