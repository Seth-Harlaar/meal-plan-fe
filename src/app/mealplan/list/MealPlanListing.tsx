'use client'
import { MealPlanResultType, UserResultType } from "@/db/db";
import { SetCurrenMealPlan } from "./action";
import { StarIcon } from "@/components/Icons";
import { useState } from "react";

import './MealPlanListing.css';
import { MealTime } from "@/models/enums/MealTime";

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
            <h1>{mealplan.name}</h1>
            {isPrimary && 
              <StarIcon />
            }
            <h3>Meals: </h3>
          </div>
      })}
    </>
  );
}
