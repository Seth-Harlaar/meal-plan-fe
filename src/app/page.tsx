'use client'

import React, { useContext } from "react";
import PageTitle from "./components/PageTitle";

// css
import './page.css'
import { ModalContext } from "./providers/ModalProvider";

export default function Home() {
  // DUMMY DATA ONLY
  type MealPlan = {
    title: string;
    weekFor: string;
    mealTypes: string[];
  }

  type Day = {
    day: string;
    meals: {
      [mealType: string]: string; 
    };
  };

  const days: Day[] = [
    {
      day: "Sunday",
      meals: {
        dinner: 'Chicken Pot Pie'
      }
    },
    {
      day: "Monday",
      meals: {
        lunch: 'Grilled Cheese',
        dinner: 'Pizza'
      }
    },
    {
      day: "Teusday",
      meals: {
        breakfast: 'Eggs',
        dinner: 'Lasagna'
      }
    },
    {
      day: "Wednesday",
      meals: {
        breakfast: 'Beans on Toast',
        dinner: 'Soup'
      }
    },
    {
      day: "Thursday",
      meals: {
        breakfast: 'Eggs',
        lunch: 'Pizza pockets'
      }
    }
  ];

  const mealPlans: MealPlan[] = [
    {
      title: "Meal Plan 1",
      weekFor: "01/01/25",
      mealTypes: ['Breakfast', 'Lunch']
    },
    {
      title: "Meal Plan 2",
      weekFor: "01/08/25",
      mealTypes: ['Lunch', 'Dinner']
    },
    {
      title: "Dinners",
      weekFor: "02/07/25",
      mealTypes: ['Dinner']
    },
  ];

  // get modal context
  const modalData = useContext(ModalContext);

  function handleRefreshClick(){
    modalData.openModal({component: <>asdf</>});
  }

  return (
    <>
      <PageTitle titleText="Homepage - Meal plans list"/>
      <div className="page-splitter">
        {/* Left side */}
        <div id="meal-plan-days" className="left">
          {days.map((day, index) => {
            return <div key={index} className='day'>
              <h1>{day.day}</h1>
              {Object.keys(day.meals).map((meal, index2) => {
                return <div key={index2} className="meal">
                  <img className="meal-preview" src='https://www.onceuponachef.com/images/2024/01/Grilled-Cheese-6-1200x1800.jpg'/>
                  <div className="desc">
                    <h2 className="title">{day.meals[meal]}</h2>
                    <h3>{meal}</h3>
                  </div>
                  <div className="flex-spacer"></div>
                  <img className="icon refresh-button" src="/icons/refresh.svg" onClick={handleRefreshClick}/>
                </div>
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
          </div>
        </div>
      </div>
    </>
  );
}
