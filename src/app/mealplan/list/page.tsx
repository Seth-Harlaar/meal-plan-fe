'use server'
import React from "react";
import { GetCurrentUser } from "@/auth/auth";
import LogInMessage from "@/components/LogInMessage";
import { MealPlan, MealPlanSearchCriteria } from "@/models/MealPlan";
import MealPlanListing from "./MealPlanListing";

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
    console.log(mealPlans);
  }

  if(mealPlans.length == 0){
    return <>none</>
  }

  return (
    <div className="cards-box cards-medium">
      <MealPlanListing mealPlanDataList={mealPlans.map(mp => MealPlan.Serialize(mp))} primaryMealPlanId={primaryMealPlan?.MealPlanId ?? 0} />
    </div>
  )
}