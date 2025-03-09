'use client'
import { MealPlanResultType, MealResultType, RecipeResultType, UserResultType } from "@/db/db";
import { SetCurrenMealPlan } from "./action";
import { useState } from "react";

import './page.css';
import { ArrowIcon, IconButton, LinkWrapper, StarIcon, XIcon } from "@/components/Icons";

export default function MealPlanListing(
  { mealPlanDataList, mealDataList, recipeDataList, primaryMealPlanId } :
  { mealPlanDataList: MealPlanResultType[], mealDataList: MealResultType[],
    recipeDataList: RecipeResultType[], primaryMealPlanId: number,
  }
){
  const [primaryMealPlanIDState, setPrimaryMealPlanIDState] = useState<number>(primaryMealPlanId);

  function handleMealCardClick(mealPlanId: number){
    SetCurrenMealPlan(mealPlanId);
    setPrimaryMealPlanIDState(mealPlanId);
  }

  return (
    <>
      {mealPlanDataList.map((mealplan, index) => {
        const isPrimary = mealplan.id == primaryMealPlanIDState;
        const mealPlanMeals = mealDataList.filter(md => md.meal_plan_id == mealplan.id);
        const recipes = recipeDataList.filter(rd => mealPlanMeals.map(md => md.recipe_id).includes(rd.id));
        const recipeString = `${recipes.map(r => r.name).join(', ')}`;

        return <div className="card mealplan-card" key={index}>
            <div className="card-title">
              <h1>{mealplan.name}</h1>
              {isPrimary && 
                <StarIcon />
              }
            </div>
            <h3 className="card-subtitle">Meals: {recipeString}</h3>
            <hr />
            <div className="card-buttons">
              <IconButton onClick={() => {}}>
                <XIcon />
              </IconButton>
              <IconButton onClick={() => handleMealCardClick(mealplan.id)}>
                <StarIcon />
              </IconButton>
              <LinkWrapper href={`/mealplan/${mealplan.id}`}>
                <ArrowIcon />
              </LinkWrapper>
            </div>
          </div>
      })}
    </>
  );
}
