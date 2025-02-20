"use server";
import { GetCurrentUser } from "@/auth/auth";
import { FoodResultType, MealResultType, Zods } from "@/db/db";
import { Food } from "@/models/Food";
import { ScheduledMeal, MealSearchCriteria } from "@/models/Meal";
import { MealPlan } from "@/models/MealPlan";
import { z } from "zod";

export async function saveMealPlan(newMealData: MealResultType[]) {
  const user = await GetCurrentUser();
  if(!user){
    console.log('User not logged in.');
    return null;
  }

  const newMealPlan = Object.assign(new MealPlan(), {
    UserId: user.UserId,
    Name: MealPlan.genericMealPlanName(),
  });

  try {
    await newMealPlan.SaveChanges();

    // save each meal
    newMealData.forEach(mealData => {
      let meal = Object.assign(new ScheduledMeal(), {
        MealId: mealData.id,
        MealPlanId: newMealPlan.MealPlanId,
        MealSubId: mealData.meal_id,
        IsFullMeal: mealData.is_full_meal,
        DayFor: mealData.day_for,
        TimeFor: mealData.time_for,
      });
      meal.SaveChanges();
    });

  } catch (e) {
    console.log('Error while trying to save meal plan: ', e);
  }
}

export async function GetMeal(mealId: number){
  const meal = (await ScheduledMeal.GetMeals(Object.assign(new MealSearchCriteria(), {
    MealIdList: mealId,
  })))[0];

  return meal;
}

export async function GetRandomMeal(MealPlanId: number): Promise<MealResultType | null> {
  const meal = await ScheduledMeal.GetRandomRecipe(MealPlanId);
  const mealData: MealResultType = {
    id: meal.ScheduledMealID,
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