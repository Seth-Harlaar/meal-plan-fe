import { sql } from "slonik";
import { z } from 'zod';
import { DaysOfWeek } from "./enums/DaysOfTheWeek";
import { MealTime } from "./enums/MealTime";
import { Database, MealResultType, MealPlanResultType, Zods } from "../db/db";
import { GetCurrentUser } from "@/auth/auth";

export class MealPlan {
  MealPlanId: number = 0;
  CreatedByUserId: number = 0;
  Name: string = "";

  // * * * * * * * * * * * * * * * * * * * * * *
  // * * *              Get                * * *
  // * * * * * * * * * * * * * * * * * * * * * *

  static async GetMealPlans(InputCriteria: Partial<MealPlanSearchCriteria>): Promise<MealPlan[]>{
    const DefaultCriteria = new MealPlanSearchCriteria();
    const Criteria = {...DefaultCriteria, ...InputCriteria };
    const pool = await Database.getPool();
    
    let query = sql.type(Zods.mealPlan)`
      SELECT *
      FROM public.meal_plans
      WHERE 1=1
 
      ${ // meal plan ids
        (Criteria.MealPLanIdList.length > 0) 
        ? sql.fragment`AND id IN (${sql.join(Criteria.MealPLanIdList, sql.fragment`, `)})`
        : sql.fragment``}

      ${ // user ids
        (Criteria.CreatedByUserIdList.length > 0)
        ? sql.fragment`AND created_by_user_id IN (${sql.join(Criteria.CreatedByUserIdList, sql.fragment`, `)})`
        : sql.fragment``}

      ${ // name
        (Criteria.Name.length > 0)
        ? sql.fragment`AND name LIKE ${'%' + Criteria.Name + '%'}`
        : sql.fragment`` }

      ORDER BY id;
    `;

    try {
      const results = await pool.any(query);
      const mealPlans = results.map(r => MealPlan.Deserialize(r));
      return mealPlans;
    } catch (error) {
      console.log('Error while searching for meal plans', error);
      return [];
    }
  }


  // save meal plan
  public async SaveChanges(): Promise<void> {
    const pool = await Database.getPool();
    const User = await GetCurrentUser();
    
    // save meal plan to db
    if(User == null){
      console.log('User could not be authenticated');
      return;
    }

    if(this.MealPlanId <= 0){
      let Results = await pool.one(sql.type(z.object({id: z.number()}))`
        INSERT INTO meal_plans (created_by_user_id, name)
          VALUES (${User.UserId}, ${this.Name})
        RETURNING id;
      `);
      this.MealPlanId = Results.id;

    } else {
      let Results = await pool.one(sql.type(z.object({id: z.number()}))`
        UPDATE meal_plans
          SET created_by_user_id = ${User.UserId},
          name = ${this.Name}
        WHERE id = ${this.MealPlanId}
        RETURNING id;
      `);
      this.MealPlanId = Results.id
    }
  }


  public static Serialize(MealPlan: MealPlan): MealPlanResultType {
    return {
      id: MealPlan.MealPlanId,
      name: MealPlan.Name,
      created_by_user_id: MealPlan.CreatedByUserId,
    }
  }

  public static Deserialize(MealPlanData: MealPlanResultType): MealPlan {
    return Object.assign(new MealPlan(), {
      MealPlanId: MealPlanData.id,
      Name: MealPlanData.name,
      UserId: MealPlanData.created_by_user_id,
    });
  }

  static genericMealPlanName(): string{
    const now = new Date();
  
    // Calculate the date of the most recent Sunday
    const sunday = new Date(now);
    sunday.setDate(now.getDate() - now.getDay()); // `getDay()` returns 0 for Sunday, so it aligns perfectly
  
    // Format the Sunday date as YYYY-MM-DD
    const year = sunday.getFullYear();
    const month = sunday.toLocaleString('en-us', {month:'short'}); // Months are 0-indexed
    const day = sunday.getDate().toString().padStart(2, '0');
  
    return `Week of ${month} ${day}, ${year}`;
  }
}


export class MealPlanSearchCriteria {
  MealPLanIdList: number[] = [];
  CreatedByUserIdList: number[] = [];
  Name: string = "";

  constructor(init?: Partial<MealPlanSearchCriteria>) {
    Object.assign(this, init);
  }
}