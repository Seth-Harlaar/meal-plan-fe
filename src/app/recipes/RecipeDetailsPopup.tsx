'use client'

import { RecipeResultType } from "@/db/db"
import { useState } from "react";

import './popup-styles.css';

export default function RecipeDetailsPopup(
  {recipeData}:
  {recipeData: RecipeResultType}
){

  return (
    <div className="recipe-details">
      <h1>
        {recipeData.name}
      </h1>
      <hr />
      
      Prep Time: {recipeData.prep_time}
      <hr />
      
      <h2> Ingredients </h2>
      Nothing here yet
      
      <h2> Instructions </h2>
      {recipeData.instructions}
    </div>
  )
}
