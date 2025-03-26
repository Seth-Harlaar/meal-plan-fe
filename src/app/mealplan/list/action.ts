'use server'

import { GetCurrentUser } from "@/auth/auth";
import { MealPlan } from "@/models/MealPlan";
import { MealPlanShare } from "@/models/MealPlanShare";
import { MealPlanResultType } from "@/db/db";
import { User, UserSearchCriteria } from "@/models/User";


// actions
export async function SetCurrenMealPlan(MealPlanID: number){
  const user = await GetCurrentUser();
  if(user){
    user.CurrentMealplanID = MealPlanID;
    user.SaveUser();
    return;
  }
  console.log('Failed to save current meal plan selection - User is not logged in');
}



export async function DeleteMealPlan(MealPlanID: number){
  const user = await GetCurrentUser();
  if(user){
    if(!(await MealPlan.Delete([MealPlanID]))){
      console.log('(Action) failed to delete meal plan with id' + MealPlanID);
      return false;
    }
    return true;
  }

  console.log('Failed to delete  meal plan - User is not logged in');
  return false;
}



export async function ShareMealPlan(mealPlanData: MealPlanResultType, userEmail: string){
  const user = await GetCurrentUser();
  if(!user){
    console.log('Failed to share meal plan becuase user is not logged in');
    return;
  }

  // get other user
  var shareeUser = await User.GetUser(new UserSearchCriteria({Email: userEmail}));
  if(!shareeUser)
    return;

  var share = Object.assign(new MealPlanShare, {
    MealPlanId: mealPlanData.id,
    OwnerUserId: user.UserId,
    ShareeUserId: shareeUser.UserId,
  });
  share.SaveChanges();
}