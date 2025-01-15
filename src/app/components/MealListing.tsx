'use client'

import { useContext } from "react";
import { ModalContext } from "../providers/ModalProvider";
import { MealTime } from "../models/enums/MealTime";



export default function MealListing({mealTitle, mealTime}: {mealTitle: string, mealTime: MealTime}){
  const mealTimes: string[] = ["Breakfast", "Lunch", "Dinner", "Snack", "Other"];
  // get modal context
  const modalData = useContext(ModalContext);

  return <div className="meal">
    <img className="meal-preview" src='https://www.onceuponachef.com/images/2024/01/Grilled-Cheese-6-1200x1800.jpg'/>
    <div className="desc">
      <h2 className="title">{mealTitle}</h2>
      <h3>{mealTimes[parseInt(mealTime.toString())]}</h3>
    </div>
    <div className="flex-spacer"></div>
    <img className="icon refresh-button" src="/icons/refresh.svg" onClick={() => {modalData.openModal({component: <>asdf</>});}}/>
  </div>
}