import React from "react";
import PageTitle from "./components/PageTitle";
import MealListing from "./components/MealListing";
import { MealPlan } from "./models/MealPlan";

import './page.css'

export default async function Home() {
  const daysOfWeek: string[] = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const mealPlans = await MealPlan.GetMealPlans([5]);

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
              {Array.from(day.Meals.entries()).map(([mealTime, mealData], index) => {
                return <MealListing mealTitle={mealData.name} mealTime={mealTime} key={index}/>
              })}
            </div>
          })}
        </div>
        {/* Right side */}
        <div id="meal-plans" className="right">
          <h1>Meal Plans</h1>
          <div className="meal-plan-list">
            {mealPlans.map((mealPlan, index) => {
              return <React.Fragment key={index}>
                <div className="meal-plan">
                  <h2>{mealPlan.Name}</h2>
                  <h3>asdf</h3>
                </div>
                <hr/>
              </React.Fragment>
            })}
            <div id="new-meal-plan-button">
              <div></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

