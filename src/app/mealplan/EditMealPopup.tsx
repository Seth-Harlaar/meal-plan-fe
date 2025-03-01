'use client'
import { useContext, useEffect, useState, useTransition } from "react";
import { GetRecipes } from "./new/action";
import { MealResultType, RecipeResultType } from "@/db/db";
import { ModalContext } from "@/providers/ModalProvider";

export default function EditMealPopup(
  {mealData, replaceRecipe}: 
  {
    mealData: MealResultType,
    replaceRecipe: (mealData: MealResultType, recipeId: number) => void
  }
){
  const {closeModal} = useContext(ModalContext);
  const [isPending, startTransition] = useTransition();
  const emptyRecipes: RecipeResultType[] = [];
  const [recipes, setRecipes] = useState(emptyRecipes);
  const [selectedRecipeId, setSelectedRecipeId] = useState(-1);
  
  // get all the recipes
  useEffect(() => {
    startTransition(async () => {
      let recipes = await GetRecipes({});
      setRecipes(recipes);
    });
  }, []);

  function save(){
    if(selectedRecipeId == -1){
      // set error
      return;
    }
    replaceRecipe(mealData, selectedRecipeId);
    closeModal();
  }

  return <>
    <h1>Select a new meal</h1>
    <div>
      <select disabled={isPending} onChange={(e) => setSelectedRecipeId(Number(e.target.value))}>
        <option value="-1">Select a recipe</option>
        {recipes.map(r => {
          return <option value={r.id}>{r.name}</option>
        })}
      </select>
    </div>
    <h2>Or</h2>
    <h1>Createa  new one</h1>
    <div>
      inputs here
    </div>

    <div onClick={save}>Save</div>
  </>
}