'use client'

import { MealPlanResultType } from "@/db/db"
import { useContext, useState } from "react";
import { ModalContext } from "@/providers/ModalProvider";

import './page.css'

export default function ShareMealPlanPopup(
  {mealPlanData}:
  {mealPlanData: MealPlanResultType}
){
  const {closeModal, setModalError} = useContext(ModalContext);
  const [emailInput, setEmailInput] = useState('');

  function handleShareClick(){
    
  }

  return (
    <div id="share-plan-popup">
      <h1>{mealPlanData.name}</h1>
      <h3>Enter the email of the user you would like to share this meal plan with:</h3>
      <input type="text" onChange={(e) => setEmailInput(e.target.value)} />
      <button onClick={handleShareClick}>Share</button>
    </div>
  )
}