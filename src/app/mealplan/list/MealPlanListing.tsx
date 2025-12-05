'use client'
import { MealPlanResultType, MealResultType, RecipeResultType, UserResultType } from "@/db/db";
import { DeleteMealPlan, SetCurrenMealPlan } from "./action";
import { useContext, useState } from "react";

import './page.css';
import { ArrowIcon, IconButton, LinkWrapper, ShareIcon, StarIcon, XIcon } from "@/components/Icons";
import { ModalContext } from "@/providers/ModalProvider";
import ShareMealPlanPopup from "./ShareMealPlanPopup";

export default function MealPlanListing(
  { mealPlanDataList, mealDataList, recipeDataList, primaryMealPlanId } :
  { mealPlanDataList: MealPlanResultType[], mealDataList: MealResultType[],
    recipeDataList: RecipeResultType[], primaryMealPlanId: number,
  }
){
  const {openModal} = useContext(ModalContext);
  const [primaryMealPlanIDState, setPrimaryMealPlanIDState] = useState<number>(primaryMealPlanId);
  const [mealPlans, setMealPlans] = useState<MealPlanResultType[]>(mealPlanDataList);

  function handleMealCardClick(mealPlanId: number){
    SetCurrenMealPlan(mealPlanId);
    setPrimaryMealPlanIDState(mealPlanId);
  }

  async function handleDeleteClick(mealPlanId: number){
    const confirmed = window.confirm("Are you sure you want to delete this meal plan?");
    if(confirmed){
      if(await DeleteMealPlan(mealPlanId)){
        setMealPlans(prevMealPlans => prevMealPlans.filter(mp => mp.id != mealPlanId));
      }
    }
  }

  function handleShareClick(mealPlanData: MealPlanResultType){
    openModal(<ShareMealPlanPopup mealPlanData={mealPlanData}/>)
  }

  return (
    <>
      {mealPlans.map((mealplan, index) => {
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
          <div className="flex-spacer" />
          <hr />
          <div className="card-buttons">
            <IconButton onClick={() => {handleDeleteClick(mealplan.id)}}>
              <XIcon />
            </IconButton>
            <IconButton onClick={() => handleMealCardClick(mealplan.id)}>
              <StarIcon />
            </IconButton>
            <IconButton onClick={() => handleShareClick(mealplan)}>
              <ShareIcon/>
            </IconButton>
            <LinkWrapper href={`/mealplan/${mealplan.id}`}>
              <ArrowIcon />
            </LinkWrapper>
          </div>
        </div>
      })}
      <a id="new-meal-plan-button" className="card" href="/mealplan/new">
        <div>New Meal Plan</div>
      </a>
    </>
  );
}
