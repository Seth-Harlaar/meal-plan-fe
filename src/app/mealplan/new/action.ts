"use server";
import { mealPlanMealType, Zods } from "@/db/db";
import { Meal, MealSearchCriteria } from "@/models/Meal";
import { z } from "zod";

export async function saveMealPlan(newMealData: z.infer<typeof Zods.mealPlanMeal>[]) {
  
  // create new mealplan


  // create new meals

  try {
    const newMeal = Object.assign(new Meal(), newMealData);
    await newMeal.SaveChanges();
    return { success: true };
  } catch (error) {
    console.error("Error saving meal:", error);
  }
}

export async function GetMeal(mealId: number){
  const meal = (await Meal.GetMeals(Object.assign(new MealSearchCriteria(), {
    MealIdList: mealId,
  })))[0];

  return meal;
}

export async function GetRandomMeal(MealPlanId: number): Promise<mealPlanMealType | null> {
  const meal = await Meal.GetRandomMeal(MealPlanId);
  const mealData: mealPlanMealType = {
    id: meal.MealId,
    meal_plan_id: meal.MealPlanId,
    meal_id: meal.MealSubId,
    is_full_meal: meal.IsFullMeal,
    day_for: meal.DayFor,
    time_for: meal.TimeFor,
  };
  return mealData;
}