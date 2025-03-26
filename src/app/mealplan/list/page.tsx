'use server'
import React from "react";
import { GetCurrentUser } from "@/auth/auth";
import LogInMessage from "@/components/LogInMessage";
import { MealPlan, MealPlanSearchCriteria } from "@/models/MealPlan";
import MealPlanListing from "./MealPlanListing";
import { Meal, MealSearchCriteria } from "@/models/Meal";
import Recipe, { RecipeSearchCriteria } from "@/models/Recipe";
import { RecipeResultType } from "@/db/db";

export default async function Page(){

  const user = await GetCurrentUser();
  if(!user){
    return (
      <LogInMessage/>
    );
  }

  const mealPlans = await MealPlan.GetMealPlans(new MealPlanSearchCriteria({
    CreatedByUserIdList: [user.UserId]
  }));

  const primaryMealPlan = mealPlans.filter(mp => mp.MealPlanId == user.CurrentMealplanID)[0] ?? null;
  if(primaryMealPlan){
    mealPlans.splice(mealPlans.indexOf(primaryMealPlan), 1);
    mealPlans.unshift(primaryMealPlan);
  }

  if(mealPlans.length == 0){
    return <>none</>
  }

  const mealDataList = await Meal.GetMeals(new MealSearchCriteria ({
    MealPlanIdList: mealPlans.map(mp => mp.MealPlanId),
  }));

  var recipeDataList:Recipe[] = [];
  if(mealDataList.length > 0){
    recipeDataList = await Recipe.Search(new RecipeSearchCriteria({
      RecipeIdList: mealDataList.map(md => md.RecipeId),
    }));
  }

  return (
    <div className="cards-box cards-medium">
      <MealPlanListing mealPlanDataList={mealPlans.map(mp => MealPlan.Serialize(mp))} 
        mealDataList={mealDataList.map(m => Meal.Serialize(m))} recipeDataList={recipeDataList.map(r => r.Serialize())}
        primaryMealPlanId={primaryMealPlan?.MealPlanId ?? 0} 
      />
    </div>
  )
}