'use server'

import PageTitle from "@/components/PageTitle";
import MealPlanEditView from "../MealPlanEditView";
import LogInMessage from "@/components/LogInMessage";
import { GetCurrentUser } from "@/auth/auth";
import { MealPlan, MealPlanSearchCriteria } from "@/models/MealPlan";
import { Meal, MealSearchCriteria } from "@/models/Meal";
import { MealResultType } from "@/db/db";

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

  const mealPlan = (await MealPlan.GetMealPlans(Object.assign(new MealPlanSearchCriteria, {
    MealPLanIdList: [MealPlanId],
  })))[0];

  if(mealPlan == null || mealPlan.UserId != user.UserId){
    return <>Invalid meal plan ID.</>
  }

  const meals = await Meal.GetMeals(Object.assign(new MealSearchCriteria(), {
    MealPLanIdList: [MealPlanId],
  }));

  const mealData: MealResultType[] = meals.map(m => {
    return {
      id: m.MealId,
      meal_plan_id: m.MealPlanId,
      day_for: m.DayFor,
      time_for: m.TimeFor,
      recipe_id: m.RecipeId,
    };
  });

  return (
    <>
      <PageTitle titleText="Meal Plan"/>
      <PageTitle titleText={MealPlan.genericMealPlanName()}/>
      <MealPlanEditView mealDataList={mealData} />
    </>
  );
}