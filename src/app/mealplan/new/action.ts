"use server";
import { GetCurrentUser } from "@/auth/auth";
import { FoodResultType, MealResultType, RecipeResultType, Zods } from "@/db/db";
import { Meal, MealSearchCriteria } from "@/models/Meal";
import { MealPlan } from "@/models/MealPlan";
import Recipe, { RecipeSearchCriteria } from "@/models/Recipe";


export async function saveRecipe(newRecipeData: RecipeResultType){
  const user = await GetCurrentUser();
  if(!user){
    console.log('User not logged in.');
    return null;
  }

  const NewRecipe = Recipe.Deserialize(newRecipeData);
  await NewRecipe.SaveChanges();
  return NewRecipe.Serialize();
}

export async function saveMealPlan(newMealData: MealResultType[]) {
  const user = await GetCurrentUser();
  if(!user){
    console.log('User not logged in.');
    return false;
  }

  const mealPlanId = newMealData[0].meal_plan_id;

  const newMealPlan = Object.assign(new MealPlan(), {
    MealPlanId: mealPlanId,
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
    return false;
  }
  return true;
}

export async function GetMeal(mealId: number){
  const meal = (await Meal.GetMeals(Object.assign(new MealSearchCriteria(), {
    MealIdList: mealId,
  })))[0];

  return meal;
}

export async function GetRandomRecipe(MealPlanId: number): Promise<RecipeResultType | null> {
  const recipe = await Recipe.GetRandomRecipe(MealPlanId);
  const recipeData: RecipeResultType = {
    id: recipe.RecipeId,
    name: recipe.Name,
    instructions: recipe.Instructions,
    prep_time: recipe.PrepTime,
  };
  return recipeData;
}

export async function GetRecipes(Criteria: object): Promise<RecipeResultType[]> {
  const RecipeCriteria = new RecipeSearchCriteria(Criteria);
  const Results = await Recipe.Search(RecipeCriteria);
  return Results.map(r => r.Serialize());
};