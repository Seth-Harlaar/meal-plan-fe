'use server'
import React from "react";
import { MealPlan, MealPlanSearchCriteria } from "../models/MealPlan";
import { GetCurrentUser } from "@/auth/auth";
import LogInMessage from "@/components/LogInMessage";
import { Meal, MealSearchCriteria } from "@/models/Meal";
import MealPlanEditView from "./mealplan/MealPlanEditView";
import Recipe, { RecipeSearchCriteria } from "@/models/Recipe";

import './page.css'
import MealPlanListView from "@/components/MealPlanListView";

export default async function Home() {
  const user = await GetCurrentUser();
  if(!user){
    return (
      <LogInMessage/>
    );
  }

  const mealPlans = await MealPlan.GetMealPlans(new MealPlanSearchCriteria({
    CreatedByUserIdList: [user.UserId]
  }));
  
  let mealList: Meal[] = [];
  const primaryMealPlan = mealPlans.find(m => m.MealPlanId == user.CurrentMealplanID) || mealPlans[0];

  if(primaryMealPlan){
    mealList = await Meal.GetMeals(Object.assign(new MealSearchCriteria(), {
      MealPlanIdList: [primaryMealPlan.MealPlanId],
    }));
  }

  let recipes: Recipe[] = [];
  if(mealList.length > 0){
    recipes = await Recipe.Search(Object.assign(new RecipeSearchCriteria(), {
      RecipeIdList: mealList.map(mp => mp.RecipeId),
    }));
  }

  return (
    <>
      <div className="page-splitter">
        {/* Left side */}
        <div id="meal-plan-days" className="left">
          <h3>Your current selected meal plan:</h3>
          <h2>{primaryMealPlan.Name}</h2>
          {mealPlans.length > 0 
            ? <MealPlanListView mealDataList={mealList.map(m => Meal.Serialize(m))} recipeDataList={recipes.map(r => Recipe.Serialize(r))}/>
            : <div className="no-plan-message">
                  <h2>You do not have any meal plans.</h2>
                  <h2>Try creating one <a href="/mealplan/new" className="button">here</a></h2>
              </div>
          }
        </div>

        {/* Right side */}
        <div id="meal-plans" className="right">
          <h1>Meal Plans</h1>
          <div className="meal-plan-list">
            {mealPlans.map((mealPlan, index) => {
              return <a key={index} href={`/mealplan/${mealPlan.MealPlanId}`}>
                <div className="meal-plan">
                  <h2>{mealPlan.Name}</h2>
                  <h3>asdf</h3>
                </div>
                {index != (mealPlans.length - 1) && <hr/>}
              </a>
            })}
            <a id="new-meal-plan-button" href="/mealplan/new">
              <div>New Meal Plan</div>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

