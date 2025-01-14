import React from "react";
import PageTitle from "./components/PageTitle";
import MealListing from "./components/MealListing";

// css
import './page.css'

export default async function Home() {
  const data = await fetch('http://localhost:3001/mealplan/5');
  const mealPlans: MealPlan[] = await data.json();
  const daysOfWeek: string[] = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  console.log(mealPlans[0]);

  return (
    <>
      <PageTitle titleText={mealPlans[0].Name}/>
      <div className="page-splitter">
        {/* Left side */}
        <div id="meal-plan-days" className="left">
          <select id="meal-plan-selector">
            {mealPlans.map((mealPlan, index) => {
              return <option key={index} value={index}>
                {mealPlan.Name}
              </option>
            })}
          </select>

          {mealPlans[0].Days.map((day, index) => {
            return <div key={index} className="day">

              <h1>{daysOfWeek[index]}</h1>
              {Object.entries(day.Meals).map(([meal, mealData], index) => {
                return <MealListing mealTitle={mealData.name} mealTime={meal} key={index}/>
              })}
            </div>
          })}
        </div>
        {/* Right side */}
        <div id="meal-plans" className="right">
          <h1>Meal Plans</h1>
          {/* <div className="meal-plan-list">
            {mealPlans.map((mealPlan, index) => {
              return <React.Fragment key={index}>
                <div className="meal-plan"key={index}>
                  <h2>{mealPlan.weekFor}</h2>
                  <h3>{mealPlan.mealTypes.join(" · ")}</h3>
                </div>
                <hr/>
              </React.Fragment>
            })}
            <div id="new-meal-plan-button">
              <div></div>
            </div>
          </div> */}
        </div>
      </div>
    </>
  );
}


// data fetch (mealplans)
type MealPlan = {
  MealPlanId: number,
  Name: string,
  Days: Day[],
}

type Day = {
  Day: number,
  Meals: Map<string, Meal>,
}

type Meal = {
  name: string,
  prepTime: number,
  mealId: number,
  foodList: Food[],
}

type Food = {
  name: string,
  prepTime: number,
  SuggestedMealTime: number,
}
