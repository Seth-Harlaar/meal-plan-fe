import React from "react";

import { GetCurrentUser } from "@/auth/auth";
import LogInMessage from "@/components/LogInMessage";
import PageTitle from "@/components/PageTitle";
import { MealPlan, MealPlanSearchCriteria } from "@/models/MealPlan";
import { Meal, MealSearchCriteria } from "@/models/Meal";

export default async function Home() {
  const user = await GetCurrentUser();


  // MealPlan.GetMealPlans(
  //   Object.assign(new MealPlanSearchCriteria(), {
  //     Name: 'Week'
  //   })
  // );

  const meals = await Meal.GetMeals(
    Object.assign(new MealSearchCriteria(), {
      MealPLanIdList: [18],
      MealIdList: [392, 10, 466]
    })
  );

  console.log(meals);

  if(user){
    return (
      <>
        <PageTitle titleText="New Meal Plan"/>
      </>
    );
  } else {

    return (
      <LogInMessage/>
    );
  }
}

