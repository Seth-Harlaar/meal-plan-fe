'use server'
import React from "react";
import { GetCurrentUser } from "@/auth/auth";
import LogInMessage from "@/components/LogInMessage";
import PageTitle from "@/components/PageTitle";
import { MealPlan, MealPlanSearchCriteria } from "@/models/MealPlan";
import { Meal, MealSearchCriteria } from "@/models/Meal";
import { DaysOfWeek } from "@/models/enums/DaysOfTheWeek";
import { MealTime } from "@/models/enums/MealTime";
import MealListing from "@/components/MealPlanListItem";
import MealPlanListView from "../MealPlanListView";
import { MealPlanMealResultType, Zods } from "@/db/db";

export default async function Home() {
  const user = await GetCurrentUser();
  if(!user){
    return (
      <LogInMessage/>
    );
  }

  // meal plan
  const newMealPlan = Object.assign(new MealPlan(), {
    UserId: user.UserId,
    Name: MealPlan.genericMealPlanName(),
  });

  // meals
  const newMeals: MealPlanMealResultType[] = [];
  for(let i = 0; i < 7; i++){
    const newMeal: MealPlanMealResultType = {
      id: 0,
      meal_plan_id: 0,
      meal_id: 1,
      is_full_meal: true,
      day_for: DaysOfWeek.Sunday,
      time_for: MealTime.DINNER,
    };
    newMeals.push(newMeal);
  }

  return (
    <>
      <PageTitle titleText="New Meal Plan"/>
      <PageTitle titleText={newMealPlan.Name}/>
      <MealPlanListView mealDataList={newMeals} />
    </>

  );
}

