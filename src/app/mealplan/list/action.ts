'use server'

import { GetCurrentUser } from "@/auth/auth";


// actions
export async function SetCurrenMealPlan(MealPlanID: number){
  const user = await GetCurrentUser();
  if(user){
    user.CurrentMealplanID = MealPlanID;
    user.SaveUser();
    return;
  }
  console.log('Failed to save current meal plan selection - User is not logged in');
}
