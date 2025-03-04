'use client'
import MealPlanListItem from "@/components/MealPlanListItem";
import { MealResultType, RecipeResultType } from "@/db/db";
import { useContext, useEffect, useState, useTransition } from "react";
import { GetRandomRecipe, saveMealPlan } from "./new/action";
import { DaysOfWeek } from "@/models/enums/DaysOfTheWeek";
import { ModalContext } from "@/providers/ModalProvider";
import EditMealPopup from "./EditMealPopup";
import { MealTime } from "@/models/enums/MealTime";

export default function MealPlanEditView(
  {mealDataList, recipeDataList}:
  {mealDataList: MealResultType[], recipeDataList: RecipeResultType[]}
){
  const [meals, setMeals] = useState<MealResultType[]>(mealDataList);
  const {openModal} = useContext(ModalContext);
  const [isPending, startTransition] = useTransition();

  function addMealToPlan(mealData: MealResultType){
    setMeals(mealList => [...mealList, mealData]);
  }

  function replaceRecipe(mealData: MealResultType, recipeId: number){
    let mealIndex = meals.indexOf(mealData);
    let newMealList = [...meals];
    newMealList[mealIndex].recipe_id = recipeId;
    setMeals(newMealList);
  }

  function rerollRecipe(mealData: MealResultType) {
    replaceRecipe(mealData, 0);
    
    startTransition(async () => {
      const newRecipe = await GetRandomRecipe(mealData.meal_plan_id);
      replaceRecipe(mealData, newRecipe?.id ?? 0);
    });
  }

  function openEditMealModal(mealData: MealResultType){
    openModal(<EditMealPopup mealData={mealData} recipeDataList={recipeDataList} replaceRecipe={replaceRecipe}/>);
  }

  function addRandomMealToDay(dayOfWeek: number){
    const randomRecipe = recipeDataList[Math.floor(Math.random() * recipeDataList.length) + 1];
    const mealPlanId = mealDataList[0].meal_plan_id;
    const newMealData: MealResultType = {
      id: 0,
      meal_plan_id: mealPlanId,
      day_for: dayOfWeek as DaysOfWeek,
      time_for: MealTime.DINNER,
      recipe_id: randomRecipe.id,
    };
    addMealToPlan(newMealData);
  }

  return (
    <>
      <>
        {Object.keys(DaysOfWeek)
          .filter((key) => isNaN(Number(key)))
          .map((day, dayIndex) => {
            const dayValue = DaysOfWeek[day as keyof typeof DaysOfWeek];
            return <div className="day" key={dayIndex}>
              <h1>{day}</h1>
              {meals.filter(m => m?.day_for == dayValue).map((mealData, index) => {
                let mealRecipe = recipeDataList.find(rd => rd.id == mealData.recipe_id) ?? {id: 0, name: "", instructions: "", prep_time: 0};
                return <MealPlanListItem mealData={mealData} recipeData={mealRecipe} key={index}
                  rerollFunction={() => rerollRecipe(mealData)} editFunction={() => openEditMealModal(mealData)} 
                  addMealFunction={() => addRandomMealToDay(dayValue)}
                  />
              })}
            </div>
          })
        }
      </>

      <div className="meal-plan-days">
      </div>
      <button onClick={() => saveMealPlan(meals.filter(m => m != null))}>Save Changes</button>
    </>
  )
}