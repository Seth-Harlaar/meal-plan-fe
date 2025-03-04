'use client'
import { useContext, useEffect, useState, useTransition } from "react";
import { MealResultType, RecipeResultType } from "@/db/db";
import { ModalContext } from "@/providers/ModalProvider";

export default function EditMealPopup(
  {mealData, recipeDataList, replaceRecipe}: 
  {
    mealData: MealResultType,
    recipeDataList: RecipeResultType[],
    replaceRecipe: (mealData: MealResultType, recipeId: number) => void
  }
){
  const {closeModal, addModalError} = useContext(ModalContext);
  const [isPending, startTransition] = useTransition();
  const [selectedRecipeId, setSelectedRecipeId] = useState(-1);

  function saveSelection(){
    if(selectedRecipeId == -1){
      addModalError("Please select a recipe first, or create a new one");
      return;
    }
    replaceRecipe(mealData, selectedRecipeId);
    closeModal();
  }

  return <>
    <h1>Change meal</h1>
    <div>
      <select disabled={isPending} onChange={(e) => setSelectedRecipeId(Number(e.target.value))}>
        <option value="-1">Select a recipe</option>
        {recipeDataList.map((r, index) => {
          return <option value={r.id} key={index}>{r.name}</option>
        })}
      </select>
    </div>
    <h2>Or</h2>
    <h1>Create a new one</h1>
    <div>
      inputs here
    </div>

    <div onClick={saveSelection}>Save Selection</div>
  </>
}