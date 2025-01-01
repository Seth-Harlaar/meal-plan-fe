import Image from "next/image";
import React from "react";
import PageTitle from "./components/PageTitle";

// css
import './page.css'

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
    }
  ];

  const meals: MealPlan[] = [
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

  return (
    <>
      <PageTitle titleText="Homepage - Meal plans list"/>
      <div className="page-splitter">
        {/* Left side */}
        <div id="meal-plan-days left">
          {days.map((day, index) => {
            return <div key={index} className='day'>
              <h1>{day.day}</h1>
              {Object.keys(day.meals).map((meal, index2) => {
                return <div key={index2} className="meal">
                  <img src='https://www.onceuponachef.com/images/2024/01/Grilled-Cheese-6-1200x1800.jpg'/>
                  <div className="desc">
                    <h2 className="title">{meal}</h2>
                    <div>{day.meals[meal]}</div>
                  </div>
                </div>
                })}
            </div>
          })}
        </div>
        {/* Right side */}
        <div className="right">
          <div>
            <h2>Meal Plans</h2>            
          </div>
        </div>
      </div>
    </>
  );
}
