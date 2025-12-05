'use client'
import { startTransition, useContext, useEffect, useMemo, useState, useTransition } from "react";
import { MealResultType, RecipeResultType } from "@/db/db";
import { ModalContext } from "@/providers/ModalProvider";
import { saveRecipe } from "./new/action";
import { DaysOfWeek } from "@/models/enums/DaysOfTheWeek";
import { MealTime, MealTimeAsString } from "@/models/enums/MealTime";

import './popup-styles.css';

export default function EditMealPopup(
  {mealData, mealIndex, recipeDataList, updateMeal, addRecipeToData}: 
  {
    mealData: MealResultType,
    mealIndex: number,
    recipeDataList: RecipeResultType[],
    updateMeal: (mealData: MealResultType, mealIndex: number) => void,
    addRecipeToData: (recipeData: RecipeResultType) => void,
  }
){
  const {closeModal, setModalError, clearModalErrors, addModalError} = useContext(ModalContext);
  // inputs
  const [selectedRecipeId, setSelectedRecipeId] = useState(mealData.recipe_id);
  const [recipeTitle, setRecipeTitle] = useState("");
  const [recipeInstructions, setRecipeInstructions] = useState("");
  const [mealDay, setMealDay] = useState(mealData.day_for);
  const [mealTime, setMealTime] = useState(mealData.time_for);

  const changesMade = useMemo(() => {
    return selectedRecipeId != -1
      || recipeTitle != ""
      || recipeInstructions != ""
      || mealDay != mealData.day_for
      || mealTime != mealData.time_for
  }, [recipeTitle, recipeInstructions, mealDay, mealTime, selectedRecipeId]);

  function handleSaveChangesClick(){
    clearModalErrors();
    // new recipe changes
    if((recipeTitle != "" || recipeInstructions != "") && selectedRecipeId != mealData.recipe_id){
      addModalError("Reset the recipe selection drop down or clear the new recipe fields. Cannot perform both actions at once.")
    }

    if(recipeTitle != "" || recipeInstructions != ""){
      startTransition(async () => {
        let newRecipe = await saveRecipe({
          id: 0,
          name: recipeTitle,
          instructions: recipeInstructions,
          prep_time: 15,
        });
        
        if(newRecipe){
          addRecipeToData(newRecipe);
          mealData.recipe_id = newRecipe.id;
          mealData.day_for = mealDay;
          mealData.time_for = mealTime;
          updateMeal(mealData, mealIndex);
          closeModal();
        }
      });
    } else {
      mealData.recipe_id = selectedRecipeId;
      mealData.day_for = mealDay;
      mealData.time_for = mealTime;
      updateMeal(mealData, mealIndex);
    }

    closeModal();
  }

  return <div id="edit-meal-popup">
    <div className="left">
      <h2 className="label">Recipe</h2>
      <div className="input-container">
        <div>
          <select onChange={(e) => setSelectedRecipeId(Number(e.target.value))} defaultValue={mealData.recipe_id}>
            <option value="-1">Select a recipe</option>
            {recipeDataList.map((r, index) => {
              return <option value={r.id} key={index}>{r.name}</option>
            })}
          </select>
        </div>
      </div>
      <h4>Or</h4>
      <div>
        <div className="input-container">
          <h3 className="label">New Recipe Name:</h3>
          <input type="text" onChange={(e) => setRecipeTitle(e.target.value)}/>
        </div>
        <div className="input-container">
          <h3 className="label">New Recipe instructions:</h3>
          <input type="text" onChange={(e) => setRecipeInstructions(e.target.value)}/>
        </div>
      </div>
    </div>

    <hr className="divider"/>

    <div className="right">
      <h2>Meal details</h2>
      <div className="input-container">
        <h3 className="label">Meal day:</h3>
        <select onChange={(e) => setMealDay(parseInt(e.target.value))} defaultValue={mealData.day_for}>
          {Object.keys(DaysOfWeek)
            .filter((key) => isNaN(Number(key)))
            .map((day, dayIndex) => {
              return <option value={dayIndex} key={dayIndex}>{day}</option>
            })
          }
        </select>
      </div>
      
      <div className="input-container">
        <h3 className="label">Time for:</h3>
        <select onChange={(e) => setMealTime(parseInt(e.target.value))} defaultValue={mealData.time_for}>
          {Object.entries(MealTime)
            .filter(([key, value]) => isNaN(Number(key))) // Ensure keys are valid strings
            .map(([time, timeIndex]) => (
              <option key={timeIndex} value={timeIndex}>
                {MealTimeAsString(Number(timeIndex))}
              </option>
            ))}
        </select>
      </div>
      <button className={`button`} disabled={!changesMade} onClick={() => handleSaveChangesClick()}>Save Changes</button>
    </div>
  </div>
}