'use client'
import { startTransition, useContext, useEffect, useMemo, useState, useTransition } from "react";
import { MealResultType, RecipeResultType } from "@/db/db";
import { ModalContext } from "@/providers/ModalProvider";
import { saveRecipe } from "./new/action";
import { DaysOfWeek } from "@/models/enums/DaysOfTheWeek";
import { MealTime, MealTimeAsString } from "@/models/enums/MealTime";

import './popup-styles.css';

export default function EditMealPopup(
  {mealData, recipeDataList, replaceRecipe, addRecipeToData}: 
  {
    mealData: MealResultType,
    recipeDataList: RecipeResultType[],
    replaceRecipe: (mealData: MealResultType, recipeId: number) => void,
    addRecipeToData: (recipeData: RecipeResultType) => void,
  }
){
  const {closeModal, setModalError} = useContext(ModalContext);
  // inputs
  const [selectedRecipeId, setSelectedRecipeId] = useState(-1);
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

  function saveSelection(){
    if(selectedRecipeId == -1){
      setModalError("Please select a recipe first, or create a new one");
      return;
    }
    replaceRecipe(mealData, selectedRecipeId);
    closeModal();
  }

  function saveNewRecipeClick(){
    if(recipeTitle == ""){
      setModalError("You must provide a name for the recipe");
      return;
    }
    saveNewRecipe();
  }

  function saveNewRecipe(){
    startTransition(async () => {
      let newRecipe = await saveRecipe({
        id: 0,
        name: recipeTitle,
        instructions: recipeInstructions,
        prep_time: 15,
      });
      
      if(newRecipe){
        addRecipeToData(newRecipe);
        replaceRecipe(mealData, newRecipe.id);
        closeModal();
      }
    });
  }

  return <div id="edit-meal-popup">
    <div className="left">
      <div className={`button ${changesMade ? "": "disabled"}`} onClick={saveSelection}>Save Changes</div>

      <h1>Change recipe</h1>
      <div>
        <select onChange={(e) => setSelectedRecipeId(Number(e.target.value))}>
          <option value="-1">Select a recipe</option>
          {recipeDataList.map((r, index) => {
            return <option value={r.id} key={index}>{r.name}</option>
          })}
        </select>
      </div>

      <h4>Or</h4>
      <h1>Create a new recipe</h1>
      <div>
        <h3>Recipe Name:</h3>
        <input type="text" onChange={(e) => setRecipeTitle(e.target.value)}/>
        <h3>Recipe instructions:</h3>
        <input type="text" onChange={(e) => setRecipeInstructions(e.target.value)}/>
      </div>
    </div>

    <hr className="divider"/>

    <div className="right">
      <h1>Edit meal details</h1>
      <div>
        <h3>Meal day:</h3>
        <select onChange={(e) => setMealDay(parseInt(e.target.value))}>
          {Object.keys(DaysOfWeek)
            .filter((key) => isNaN(Number(key)))
            .map((day, dayIndex) => {
              return <option value={dayIndex} selected={mealData.day_for == dayIndex}>{day}</option>
            })
          }
        </select>
      </div>
      
      <div>
        <h3>Time for:</h3>
        <select onChange={(e) => setMealTime(parseInt(e.target.value))}>
          {Object.entries(MealTime)
            .filter(([key, value]) => isNaN(Number(key))) // Ensure keys are valid strings
            .map(([time, timeIndex]) => (
              <option key={timeIndex} value={timeIndex} selected={mealData.time_for == timeIndex}>
                {MealTimeAsString(Number(timeIndex))}
              </option>
            ))}
        </select>
      </div>
    </div>
  </div>
}