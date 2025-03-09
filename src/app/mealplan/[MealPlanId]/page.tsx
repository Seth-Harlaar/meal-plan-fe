'use server'

import PageTitle from "@/components/PageTitle";
import MealPlanEditView from "../MealPlanEditView";
import LogInMessage from "@/components/LogInMessage";
import { GetCurrentUser } from "@/auth/auth";
import { MealPlan, MealPlanSearchCriteria } from "@/models/MealPlan";
import { Meal, MealSearchCriteria } from "@/models/Meal";
import { MealResultType } from "@/db/db";
import Recipe, { RecipeSearchCriteria } from "@/models/Recipe";

export default async function Page({params}: {params: Promise<{ MealPlanId: number }>}) {
  const MealPlanId = (await params).MealPlanId;
  const user = await GetCurrentUser();
  if(!user){
    return (
      <LogInMessage/>
    );
  }

  if(!MealPlanId){
    return <>Invalid meal plan ID.</>
  }

  const mealPlan = (await MealPlan.GetMealPlans(new MealPlanSearchCriteria({
    MealPLanIdList: [MealPlanId],
  })))[0];

  if(mealPlan == null || mealPlan.CreatedByUserId != user.UserId){
    return <>Invalid meal plan ID.</>
  }

  const meals = await Meal.GetMeals(Object.assign(new MealSearchCriteria(), {
    MealPlanIdList: [MealPlanId],
  }));

  const mealData: MealResultType[] = meals.map(m => m.Serialize());

  let recipes: Recipe[] = [];
  if(meals.length > 0){
    recipes = await Recipe.Search(new RecipeSearchCriteria());
  }

  return (
    <>
      <PageTitle titleText="Meal Plan"/>
      <PageTitle titleText={mealPlan.Name}/>
      <MealPlanEditView mealDataList={mealData} recipeDataList={recipes.map(r => r.Serialize())} />
    </>
  );
}