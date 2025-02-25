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

  const mealPlans = await MealPlan.GetMealPlans(Object.assign(new MealPlanSearchCriteria(), {
    UserIdList: [user.UserId]
  }));
  
  let mealList: Meal[] = [];

  if(mealPlans[0]){
    mealList = await Meal.GetMeals(Object.assign(new MealSearchCriteria(), {
      mealPlanIdList: [mealPlans[0].MealPlanId],
    }));
  }

  let recipes: Recipe[] = [];
  if(mealList.length > 0){
    recipes = await Recipe.Search(Object.assign(new RecipeSearchCriteria(), {
      RecipeIdList: mealList.map(mp => mp.RecipeId),
    }));
  }

  const daysOfWeek: string[] = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  if(user){
    return (
      <>
        <div className="page-splitter">
          {/* Left side */}
          <div id="meal-plan-days" className="left">
            <select id="meal-plan-selector">
              {/* {mealPlans.map((mealPlan, index) => {
                return <option key={index} value={index}>
                  {mealPlan.Name}
                </option>
              })} */}
            </select>

            <MealPlanListView mealDataList={mealList.map(m => Meal.Serialize(m))} recipeDataList={recipes.map(r => Recipe.Serialize(r))}/>
          </div>

          {/* Right side */}
          <div id="meal-plans" className="right">
            <h1>Meal Plans</h1>
            <div className="meal-plan-list">
              {/* {mealPlans.map((mealPlan, index) => {
                return <React.Fragment key={index}>
                  <div className="meal-plan">
                    <h2>{mealPlan.Name}</h2>
                    <h3>asdf</h3>
                  </div>
                  <hr/>
                </React.Fragment>
              })} */}
              <a id="new-meal-plan-button" href="/mealplan/new">
                <div>New Meal Plan</div>
              </a>
            </div>
          </div>
        </div>
      </>
    );
  } else {

    return (
      <>not logged in</>
    );
  }
}

