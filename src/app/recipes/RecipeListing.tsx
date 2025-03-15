'use client'

import { RecipeResultType } from "@/db/db"
import { ModalContext } from "@/providers/ModalProvider";
import { useContext, useEffect, useState } from "react";
import RecipeDetailsPopup from "./RecipeDetailsPopup";

export default function RecipeListing(
  {RecipeData}:
  {RecipeData: RecipeResultType[]}
){
  const [searchText, setSearchText] = useState("");
  const [recipes, setRecipes] = useState<RecipeResultType[]>(RecipeData);
  const {openModal, closeModal} = useContext(ModalContext);

  useEffect(() => {
    console.log(searchText);
    setRecipes(RecipeData.filter(r => r.name.toLowerCase().includes(searchText))
    )
  }, [searchText]);

  function OpenRecipeDetails(recipeData: RecipeResultType){
    openModal(<RecipeDetailsPopup recipeData={recipeData} />);
  }

  return (
    <>
      <div onClick={closeModal}>Open sesame</div>
      <input type="text" onChange={e => setSearchText(e.target.value)} />

      <div className="cards-box cards-small">
        {recipes.map((recipe, index) => {
          return <div className="card" key={index} onClick={() => {OpenRecipeDetails(recipe)}}>
              {recipe.name}
            </div>
        })}
      </div>
    </>
  )
}