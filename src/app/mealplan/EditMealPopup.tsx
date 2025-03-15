'use client'
import { startTransition, useContext, useEffect, useState, useTransition } from "react";
import { MealResultType, RecipeResultType } from "@/db/db";
import { ModalContext } from "@/providers/ModalProvider";
import { saveRecipe } from "./new/action";

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
  const [selectedRecipeId, setSelectedRecipeId] = useState(-1);
  const [recipeTitle, setRecipeTitle] = useState("");
  const [recipeInstructions, setRecipeInstructions] = useState("");
  const [newRecipeTransitionPending, newRecipeTransition] = useTransition();

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
    <h1>Change meal</h1>
    <div>
      <select onChange={(e) => setSelectedRecipeId(Number(e.target.value))}>
        <option value="-1">Select a recipe</option>
        {recipeDataList.map((r, index) => {
          return <option value={r.id} key={index}>{r.name}</option>
        })}
      </select>
    </div>
    <div className="button" onClick={saveSelection}>Save Selection</div>

    <h4>Or</h4>
    <h1>Create a new one</h1>
    <div>
      <h3>Recipe Name:</h3>
      <input type="text" onChange={(e) => setRecipeTitle(e.target.value)}/>
      <h3>Recipe instructions:</h3>
      <input type="text" onChange={(e) => setRecipeInstructions(e.target.value)}/>
    </div>
    <div className="button" onClick={saveNewRecipeClick}>Save New Recipe</div>
  </div>
}