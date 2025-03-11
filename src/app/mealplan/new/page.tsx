'use server'
import React from "react";
import { GetCurrentUser } from "@/auth/auth";
import LogInMessage from "@/components/LogInMessage";
import PageTitle from "@/components/PageTitle";
import { MealPlan } from "@/models/MealPlan";
import { Meal } from "@/models/Meal";
import MealPlanEditView from "../../../components/MealPlanView/MealPlanEditView";
import { MealResultType, Zods } from "@/db/db";
import Recipe, { RecipeSearchCriteria } from "@/models/Recipe";
import { DaysOfWeek } from "@/models/enums/DaysOfTheWeek";
import { MealTime } from "@/models/enums/MealTime";

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
    const randomRecipe = await Recipe.GetRandomRecipe(0);
    const newMealData: MealResultType = {
      id: 0,
      meal_plan_id: 0,
      day_for: i as DaysOfWeek,
      time_for: MealTime.DINNER,
      recipe_id: randomRecipe.RecipeId,
    };
    newMeals.push(newMealData);
  }

  let recipes: Recipe[] = [];
  if(newMeals.length > 0){
    recipes = await Recipe.Search(new RecipeSearchCriteria());
  }

  return (
    <div id="meal-plan-days">
      <PageTitle titleText="New Meal Plan"/>
      <PageTitle titleText={MealPlan.genericMealPlanName()}/>
      <MealPlanEditView mealDataList={newMeals} recipeDataList={recipes.map(r => Recipe.Serialize(r))} isNew={true} />
    </div>
  );
}