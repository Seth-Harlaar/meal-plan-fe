'use client'
import { MealPlanResultType, UserResultType } from "@/db/db";
import { SetCurrenMealPlan } from "./action";
import { StarIcon } from "@/components/Icons";
import { useState } from "react";

import './MealPlanListing.css';

export default function MealPlanListing(
  {mealPlanDataList, primaryMealPlanId} :
  {mealPlanDataList: MealPlanResultType[], primaryMealPlanId: number}
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
        return <div className="card mealplan-card" key={index} onClick={() => handleMealCardClick(mealplan.id)}>
            {mealplan.name}
            {isPrimary && 
              <StarIcon />
            }
          </div>
      })}
    </>
  );
}
