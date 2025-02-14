import { sql } from "slonik";
import { FullMeal, Meal, PartialMeal } from "./Meal";
import { z } from 'zod';
import { DaysOfWeek } from "./enums/DaysOfTheWeek";
import { MealTime } from "./enums/MealTime";
import { Database, Zods } from "../db/db";
import { GetCurrentUser } from "@/auth/auth";



export class Day {
  Day: DaysOfWeek = DaysOfWeek.Sunday;
  Meals = new Map<MealTime, Meal>();

  public setMeal(MealTime: MealTime, Meal: Meal | null): void {
    if(Meal){
      this.Meals.set(MealTime, Meal);
    }
  }

  constructor(Day: DaysOfWeek){
    this.Day = Day;
  }

  toJSON() {
    return {
      Day: this.Day,
      Meals: Object.fromEntries(this.Meals),
    };
  }
}



export class MealPlan {
  MealPlanId: number = 0;
  UserId: number = 0;
  Name: string = "";


  // * * * * * * * * * * * * * * * * * * * * * *
  // * * *              Get                * * *
  // * * * * * * * * * * * * * * * * * * * * * *

  static async GetMealPlans(MealPlanIdList: number[]): Promise<MealPlan[]>{
    const pool = await Database.getPool();
    
    let MealPlans: MealPlan[] = [];

    if(MealPlanIdList.length <= 0){
      console.log('GetMealPlan: Ids required to get meal plans');
      return [];
    }

    return MealPlans;
      
  }

  public static async GenerateMealPlan(): Promise<MealPlan> {
    let NewMealPlan: MealPlan = new MealPlan();

    // meal for each day - dinners only right now
    for(let i = 0; i < 7; i++){
      let newDay = new Day(i as DaysOfWeek);
      let newMeal = await Meal.GetRandomMeal(NewMealPlan);
      newDay.setMeal(30 as MealTime, newMeal);
    }

    // get this or use user input
    const mealPlanName = MealPlan.genericMealPlanName();

    return NewMealPlan;
  }

  // save meal plan
  public async SaveChanges(): Promise<void> {
    const pool = await Database.getPool();
    const User = await GetCurrentUser();
    
    // save meal plan to db
    if(User == null){
      console.log('Could not save mealplan.', this);
      return;
    }

    if(this.MealPlanId > 0){
      let Results = await pool.one(sql.type(z.object({id: z.number()}))`
        INSERT INTO meal_plans (user_id, name)
          VALUES (${User.UserId}, ${this.Name})
        RETURNING id;
      `);
      this.MealPlanId = Results.id;

    } else {
      await pool.one(sql.type(z.object({id: z.number()}))`
        UPDATE meal_plans
          SET user_id = ${User.UserId},
          name = ${this.Name}
        RETURNING id;
      `);
    }
  }




  // * * * * * * * * * * * * * * * * * * * * * *
  // * * *              Set                * * *
  // * * * * * * * * * * * * * * * * * * * * * *

  public async ReplaceMealRandom(Day: DaysOfWeek, Time: MealTime): Promise<MealPlan> {
    const pool = await Database.getPool();

    const newMeal = await Meal.GetRandomMeal(this);

    const query = sql.type(z.object({id: z.number()}))`
      UPDATE meal_plan_meals
        SET meal_id = ${newMeal.mealId},
          is_full_meal = ${newMeal instanceof FullMeal}
      WHERE meal_plan_id = ${this.MealPlanId}
      AND day_for = ${Day}
      AND time_for = ${Time}
    `;

    try {
      await pool.query(query);
    } catch (error) {
      console.log('Error while inserting into meal_plan_meals', error);
      return new MealPlan();
    }

    return this;
  }


  public async ReplaceMealCustom(Day: DaysOfWeek, Time: MealTime, MealId: number, IsFullMeal: boolean): Promise<MealPlan> {
    const pool = await Database.getPool();

    const query = sql.type(z.object({id: z.number()}))`
      UPDATE meal_plan_meals
        SET meal_id = ${MealId},
          is_full_meal = ${IsFullMeal}
      WHERE meal_plan_id = ${this.MealPlanId}
      AND day_for = ${Day}
      AND time_for = ${Time}
    `;

    try {
      await pool.query(query);
    } catch (error) {
      console.log('Error while inserting into meal_plan_meals', error);
      return new MealPlan();
    }

    return new MealPlan();
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