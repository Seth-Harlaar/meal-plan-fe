"use server"

import { GetCurrentUser } from "@/auth/auth";
import { MealPlanResultType } from "@/db/db";
import { MealPlan } from "@/models/MealPlan";



export async function SaveMealPlanDetails(MealPlanData: MealPlanResultType): Promise<boolean>{
  const user = await GetCurrentUser();
  if(!user){
    console.log('User not logged in.');
    return false;
  }

  const mealPlan = MealPlan.Deserialize(MealPlanData);
  try {
    await mealPlan.SaveChanges();

  } catch (e){
    console.log('Erorr while saving meal plan, ' + e);
    return false;
  }

  return true;
}