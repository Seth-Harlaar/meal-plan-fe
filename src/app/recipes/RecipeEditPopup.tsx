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
      <h2>Editting Recipe:</h2>
      <h1>{recipeData.name}</h1>
      
      <div className="input-container">
        <div className="label">Name:</div>
        <input value={recipeName} type="text" onChange={(e) => {setRecipeName(e.target.value); setChangesMade(true)}} className="input" />
      </div>
      
      Prep Time:
      <input value={prepTime} type="text" onChange={(e) => {setPrepTime(e.target.value); setChangesMade(true)}} />
      
      <h2> Ingredients </h2>
      <h4>Nothing here yet</h4>
      
      <h2> Instructions </h2>
      <textarea value={recipeInstructions} onChange={(e) => {setRecipeInstructions(e.target.value); setChangesMade(true)}} rows={5} />
      
      {changesMade && 
        <div className="content-right">
          <span className="button" onClick={submitRecipe}>Save Changes</span>
        </div>
      }
    </div>
  )
}
