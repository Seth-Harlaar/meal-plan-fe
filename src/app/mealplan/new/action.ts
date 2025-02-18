"use server";
import { FoodResultType, MealPlanMealResultType, Zods } from "@/db/db";
import { Food } from "@/models/Food";
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

export async function GetRandomMeal(MealPlanId: number): Promise<MealPlanMealResultType | null> {
  const meal = await Meal.GetRandomMeal(MealPlanId);
  const mealData: MealPlanMealResultType = {
    id: meal.MealId,
    meal_plan_id: meal.MealPlanId,
    meal_id: meal.MealSubId,
    is_full_meal: meal.IsFullMeal,
    day_for: meal.DayFor,
    time_for: meal.TimeFor,
  };
  return mealData;
}

export async function GetFullMealFoods(FullMealId: number): Promise<FoodResultType | null> {
  if(FullMealId == -1){
    return null;
  }

  const FoodResult = await Food.GetFullMealFood(FullMealId);
  if(FoodResult == null){
    return null;
  }

  const FoodData: FoodResultType = {
    id: FoodResult.id,
    type: FoodResult.type,
    name: FoodResult.name,
    prep_time: FoodResult.prepTime,
  };
  return FoodData;
};