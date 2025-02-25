"use server";
import { GetCurrentUser } from "@/auth/auth";
import { FoodResultType, MealResultType, RecipeResultType, Zods } from "@/db/db";
import { Food } from "@/models/Food";
import { Meal, MealSearchCriteria } from "@/models/Meal";
import { MealPlan } from "@/models/MealPlan";
import Recipe, { RecipeSearchCriteria } from "@/models/Recipe";
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
      let meal = Object.assign(new Meal(), {
        MealId: mealData.id,
        MealPlanId: newMealPlan.MealPlanId,
        DayFor: mealData.day_for,
        TimeFor: mealData.time_for,
        RecipeId: mealData.recipe_id,
      });
      meal.SaveChanges();
    });

  } catch (e) {
    console.log('Error while trying to save meal plan: ', e);
  }
}

export async function GetMeal(mealId: number){
  const meal = (await Meal.GetMeals(Object.assign(new MealSearchCriteria(), {
    MealIdList: mealId,
  })))[0];

  return meal;
}

export async function GetRandomMeal(MealPlanId: number): Promise<RecipeResultType | null> {
  const recipe = await Recipe.GetRandomRecipe(MealPlanId);
  const recipeData: RecipeResultType = {
    id: recipe.RecipeId,
    name: recipe.Name,
    instructions: recipe.Instructions,
    prep_time: recipe.PrepTime,
  };
  return recipeData;
}

export async function GetRecipe(RecipeId: number): Promise<RecipeResultType | null> {
  if(RecipeId == -1){
    return null;
  }

  const RecipeResult = (await Recipe.Search(Object.assign(new RecipeSearchCriteria(), {
    RecipeIdList: [RecipeId],
  })))[0];
  if(RecipeResult == null){
    return null;
  }

  return Recipe.Serialize(RecipeResult);
};