
import { useContext, useState } from 'react';
import { MealPlanResultType } from '@/db/db';
import './popup-styles.css'
import { SaveMealPlanDetails } from '@/app/mealplan/action';
import { ModalContext } from '@/providers/ModalProvider';

export default function EditMealPlanPopup(
  {mealPlan}: 
  {mealPlan: MealPlanResultType}
){
  const {setModalError, closeModal} = useContext(ModalContext);
  const [changesMade, setChangesMade] = useState(false);
  const [newMealPlanName, setNewMealPlanName] = useState(mealPlan.name);

  async function HandleSaveChangesClick(){
    var mealPlanToSave = mealPlan;
    mealPlanToSave.name = newMealPlanName;
    
    if(await SaveMealPlanDetails(mealPlanToSave)){
      closeModal();
    } else {
      setModalError('There was an error saving your changes.');
    }
  }

  return (
    <div id='edit-mealplan-popup'>
      <div className="title">
        <h1>{mealPlan.name}</h1>
      </div>

      {changesMade && 
        <div className="content-right">
          <span className="button" onClick={HandleSaveChangesClick}>Save Changes</span>
        </div>
      }
      
      <div className="input-container">
        <div className="label">Name:</div>
        <input value={newMealPlanName} type="text" onChange={(e) => {setNewMealPlanName(e.target.value); setChangesMade(true)}} className="input" />
      </div>
    </div>
  )
}