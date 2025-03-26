import { GetCurrentUser } from "@/auth/auth";
import { Database, MealPlanShareResultType, Zods } from "@/db/db";
import { sql } from "slonik";
import { z } from "zod";





export class MealPlanShare {
  MealPlanShareId: number = 0;
  MealPlanId: number = 0;
  OwnerUserId: number = 0;
  ShareeUserId: number = 0;


  // * * * * * * * * * * * * * * * * * * * * * *
  // * * *          Searching              * * * 
  // * * * * * * * * * * * * * * * * * * * * * *

  static async GetMealPlans(InputCriteria: Partial<MealPlanShareSearchCriteria>): Promise<MealPlanShare[]>{
    const DefaultCriteria = new MealPlanShareSearchCriteria();
    const Criteria = {...DefaultCriteria, ...InputCriteria };
    const pool = await Database.getPool();
    
    let query = sql.type(Zods.mealPlanShare)`
      SELECT *
      FROM public.mealplan_shares
      WHERE 1=1
  
      ${ // sharee
        (Criteria.ShareeUserId != 0)
        ? sql.fragment`AND sharee_user_id = ${Criteria.ShareeUserId} `
        : sql.fragment`` }

      ORDER BY id;
    `;

    try {
      const results = await pool.any(query);
      const mealPlanShares = results.map(r => MealPlanShare.Deserialize(r));
      return mealPlanShares;
    } catch (error) {
      console.log('Error while searching for meal plans', error);
      return [];
    }
  }



  // * * * * * * * * * * * * * * * * * * * * * *
  // * * *            Saving               * * * 
  // * * * * * * * * * * * * * * * * * * * * * *

  public async SaveChanges(): Promise<void> {
    const pool = await Database.getPool();
    const User = await GetCurrentUser();
    
    // save meal plan to db
    if(User == null){
      console.log('User could not be authenticated');
      return;
    }

    if(this.MealPlanShareId <= 0){
      let Results = await pool.one(sql.type(z.object({id: z.number()}))`
        INSERT INTO mealplan_shares (meal_plan_id, owner_user_id, sharee_user_id)
          VALUES (${this.MealPlanId}, ${this.OwnerUserId}, ${this.ShareeUserId})
        RETURNING id;
      `);
      this.MealPlanId = Results.id;

    } else {
      let Results = await pool.one(sql.type(z.object({id: z.number()}))`
        UPDATE mealplan_shares
          SET meal_plan_id = ${this.MealPlanId},
          owner_user_id = ${this.OwnerUserId},
          sharee_user_id = ${this.ShareeUserId}
        WHERE id = ${this.MealPlanShareId}
        RETURNING id;
      `);
    }
  }



  // * * * * * * * * * * * * * * * * * * * * * *
  // * * *            Utility              * * * 
  // * * * * * * * * * * * * * * * * * * * * * *

  public static Deserialize(share: MealPlanShareResultType): MealPlanShare {
    return Object.assign(new MealPlanShare(), {
      MealPlanShareId: share.id,
      MealPlanId: share.meal_plan_id,
      OwnerUserId: share.owner_user_id,
      ShareeUserId: share.sharee_user_id,
    });
  }

  public static Serialize(share: MealPlanShare): MealPlanShareResultType{
    return {
      id: share.MealPlanShareId,
      meal_plan_id: share.MealPlanId,
      owner_user_id: share.OwnerUserId,
      sharee_user_id: share.ShareeUserId,
    }
  }
}




export class MealPlanShareSearchCriteria {
  ShareeUserId: number = 0;

  constructor(init?: Partial<MealPlanShareSearchCriteria>) {
    Object.assign(this, init);
  }
}