'use client'

import { RecipeResultType } from "@/db/db"
import { useContext, useState } from "react";
import { ModalContext } from "@/providers/ModalProvider";
import { saveRecipe } from "../mealplan/new/action";

import './popup-styles.css';

export default function RecipeEditPopup(
  {recipeData}:
  {recipeData: RecipeResultType}
){
  const {setModalError, clearModalErrors, closeModal} = useContext(ModalContext);

  const [changesMade, setChangesMade] = useState(false);
  const [recipeName, setRecipeName] = useState(recipeData.name);
  const [prepTime, setPrepTime] = useState(`${recipeData.prep_time}`);
  const [recipeInstructions, setRecipeInstructions] = useState(recipeData.instructions);

  function submitRecipe(){
    const newPrepTime = parseInt(prepTime);
    if(isNaN(newPrepTime)){
      setModalError("Invaild prep time entry");
      return;
    } else {
      clearModalErrors();
    }

    const editedRecipeData = Object.assign(recipeData, {
      name: recipeName,
      prep_time: newPrepTime,
      instructions: recipeInstructions,
    });

    const result = saveRecipe(editedRecipeData);
    if(!result){
      setModalError('There was an error saving your changes');
    } else {
      closeModal();
    }
    return;
  }

  return (
    <div className="recipe-details">
      <div className="title">
        <h1>{recipeData.name}</h1>
      </div>
      
      <div className="input-container">
        <div className="label">Name:</div>
        <input value={recipeName} type="text" onChange={(e) => {setRecipeName(e.target.value); setChangesMade(true)}} className="input" />
      </div>
      
      <div className="input-container">
        <div className="label">Prep Time:</div>
        <input value={prepTime} type="text" onChange={(e) => {setPrepTime(e.target.value); setChangesMade(true)}} />
      </div>
      
      <div className="input-container">
        <div className="label">Ingredients:</div>
        <div className="coming-soon">Coming soon</div>
      </div>
      
      <div className="input-container">
        <div className="label">Instructions:</div>
        <textarea value={recipeInstructions} onChange={(e) => {setRecipeInstructions(e.target.value); setChangesMade(true)}} rows={5} />
      </div>
      
      {changesMade && 
        <div className="content-right">
          <span className="button" onClick={submitRecipe}>Save Changes</span>
        </div>
      }
    </div>
  )
}
