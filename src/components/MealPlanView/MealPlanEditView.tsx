'use client'
import MealPlanListItem from ".//MealPlanListItem";
import { MealPlanResultType, MealResultType, RecipeResultType } from "@/db/db";
import { useContext, useEffect, useState, useTransition } from "react";
import { GetRandomRecipe, saveMealPlan } from "../../app/mealplan/new/action";
import { DaysOfWeek } from "@/models/enums/DaysOfTheWeek";
import { ModalContext } from "@/providers/ModalProvider";
import EditMealPopup from "../../app/mealplan/EditMealPopup";
import { MealTime } from "@/models/enums/MealTime";

import './MealListing.css';
import EditMealPlanPopup from "./EditMealPlanPopup";

export default function MealPlanEditView(
  {mealPlanData, mealDataList, recipeDataList, isNew = false}:
  {mealPlanData: MealPlanResultType , mealDataList: MealResultType[], recipeDataList: RecipeResultType[]
    isNew?:boolean,
  }
){
  const {openModal} = useContext(ModalContext);
  const [meals, setMeals] = useState<MealResultType[]>(mealDataList);
  const [recipes, setRecipes] = useState<RecipeResultType[]>(recipeDataList);
  const [changesMade, setChangesMade] = useState(isNew);
  const [waiting, setWaiting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  function addMealToPlan(mealData: MealResultType){
    setMeals(mealList => [...mealList, mealData]);
    setChangesMade(true);
  }

  function addRecipe(recipeData: RecipeResultType){
    setRecipes(recipeList => [...recipeList, recipeData]);
  }

  function replaceRecipe(mealData: MealResultType, recipeId: number){
    let mealIndex = meals.indexOf(mealData);
    let newMealList = [...meals];
    newMealList[mealIndex].recipe_id = recipeId;
    setMeals(newMealList);
    setChangesMade(true);
  }

  function rerollRecipe(mealData: MealResultType) {
    const randomRecipe = recipes[Math.floor(Math.random() * recipes.length) + 1];
    replaceRecipe(mealData, randomRecipe.id);
    setChangesMade(true);
  }

  function openEditMealModal(mealData: MealResultType){
    openModal(<EditMealPopup mealData={mealData} recipeDataList={recipes} 
      replaceRecipe={replaceRecipe} addRecipeToData={addRecipe}/>);
  }

  function openEditDetailsModal(){
    openModal(<EditMealPlanPopup mealPlan={mealPlanData}/>);
  }

  function addRandomMealToDay(dayOfWeek: number){
    const randomRecipe = recipes[Math.floor(Math.random() * recipes.length) + 1];
    const mealPlanId = mealDataList[0].meal_plan_id;
    const newMealData: MealResultType = {
      id: 0,
      meal_plan_id: mealPlanId,
      day_for: dayOfWeek as DaysOfWeek,
      time_for: MealTime.DINNER,
      recipe_id: randomRecipe.id,
    };
    addMealToPlan(newMealData);
    setChangesMade(true);
  }

  async function handleSaveChangesClick(){
    setWaiting(true);
    if(await saveMealPlan(meals.filter(m => m != null))){
      setChangesMade(false);
      setStatusMessage("Changes saved successfully.");
    } else {
      setStatusMessage("Changes could not be saved.");
    }

    setWaiting(false);
  }

  return (
    <>
      {statusMessage}
      <div className="button-row">
        <div className="button" onClick={openEditDetailsModal}>Edit Details</div>
        {changesMade && 
          <div className="content-right">
            <span className={`button ${waiting ? "disabled" : ""}`} onClick={handleSaveChangesClick}>Save Changes</span>
          </div>
        }
      </div>
      {Object.keys(DaysOfWeek)
        .filter((key) => isNaN(Number(key)))
        .map((day, dayIndex) => {
          const dayValue = DaysOfWeek[day as keyof typeof DaysOfWeek];
          return <div className="day" key={dayIndex}>
            <hr/>
            <h1>{day}</h1>
            {meals.filter(m => m?.day_for == dayValue).map((mealData, index) => {
              let mealRecipe = recipes.find(rd => rd.id == mealData.recipe_id) ?? {id: 0, name: "", instructions: "", prep_time: 0};
              return <MealPlanListItem mealData={mealData} recipeData={mealRecipe} key={index}
                rerollFunction={() => rerollRecipe(mealData)} editFunction={() => openEditMealModal(mealData)} 
                addMealFunction={() => addRandomMealToDay(dayValue)}
                />
            })}
          </div>
        })
      }
    </>
  )
}