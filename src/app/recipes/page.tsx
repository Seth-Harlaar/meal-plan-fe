import { GetCurrentUser } from "@/auth/auth";
import LogInMessage from "@/components/LogInMessage";
import Recipe, { RecipeSearchCriteria } from "@/models/Recipe";
import RecipeListing from "./RecipeListing";


export default async function Page(){
  const user = await GetCurrentUser();
  if(!user){
    return (
      <LogInMessage/>
    );
  }

  const recipes = await Recipe.Search(new RecipeSearchCriteria());
  
  return (
    <>
      <RecipeListing RecipeData={recipes.map(r => r.Serialize())}/>
    </>
  )
}