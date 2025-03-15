'use server'

import { RecipeResultType } from "@/db/db"

export default async function RecipeDetailsPopup(
  {recipeData}:
  {recipeData: RecipeResultType}
){
  return (
    <>{recipeData.name}</>
  )
}