'use server'
import React from "react";
import { GetCurrentUser } from "@/auth/auth";
import LogInMessage from "@/components/LogInMessage";
import { MealPlan, MealPlanSearchCriteria } from "@/models/MealPlan";

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
  
  if(mealPlans.length == 0){
    return <>none</>
  }

  return (
    <div className="card-listing cards-medium">
      {mealPlans.map((mealplan, index) => {
        return <div className="card mealplan-card" key={index}>
            {mealplan.Name}
          </div>
      })}
    </div>
  )
}