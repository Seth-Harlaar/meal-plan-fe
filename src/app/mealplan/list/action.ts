'use server'

import { GetCurrentUser } from "@/auth/auth";
import { MealPlan } from "@/models/MealPlan";


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



export async function DeleteMealPlan(MealPlanID: number){
  const user = await GetCurrentUser();
  if(user){
    if(!MealPlan.Delete([MealPlanID])){
      console.log('(Action) failed to delete meal plan with id' + MealPlanID);
    }

    return;
  }
  console.log('Failed to delete  meal plan - User is not logged in');
}