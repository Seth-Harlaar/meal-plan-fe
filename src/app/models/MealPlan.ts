import { sql } from "slonik";
import { FullMeal, Meal, PartialMeal } from "./Meal";
import { z } from 'zod';
import { DaysOfWeek } from "./enums/DaysOfTheWeek";
import { MealTime } from "./enums/MealTime";
import { Database, Zods } from "../../db/db";



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
  Name: string = "";
  Days: Day[] = [];



  // * * * * * * * * * * * * * * * * * * * * * *
  // * * *              Get                * * *
  // * * * * * * * * * * * * * * * * * * * * * *

  static async GetMealPlans(MealPlanIdList: number[]): Promise<MealPlan[]>{
    const pool = await Database.getPool();
    
    let MealPlans = [];

    if(MealPlanIdList.length <= 0){
      console.log('GetMealPlan: Ids required to get meal plans');
      return [];
    }

    // get the meal plans
    try {
      //
      //  FUTURE - add a check for user id to match only to cur user
      // 
      let mealPlanDatas;
      try {
        mealPlanDatas = await pool.many(
          sql.type(Zods.mealPlanMealsRJMealPlans)`
            SELECT
              meals.*,
              mplans.id AS mplan_id,
              mplans.user_id,
              mplans.name
            FROM public.meal_plan_meals AS meals
            RIGHT JOIN meal_plans AS mplans
              ON meals.meal_plan_id = mplans.id
            WHERE meals.id IS NOT NULL
            AND mplans.id IN (${sql.join(MealPlanIdList, sql.fragment`, `)})
            ORDER BY mplan_id ASC
          `);

      } catch (error){
        console.log('Error while retrieving meal plan data:', error);
        throw new Error("");
      }

      if(!mealPlanDatas || mealPlanDatas.length == 0){
        return [];
      }
      
      // get unique ids
      let mealPlanIds = Array.from(new Set(mealPlanDatas.map(m => m.mplan_id)));

      for(let i = 0; i < mealPlanIds.length; i++){
        let currentMealDatas = mealPlanDatas.filter(d => d.mplan_id == mealPlanIds[i]);
        let NewMealPlan = new MealPlan();
        NewMealPlan.MealPlanId = mealPlanIds[i];
        NewMealPlan.Name = currentMealDatas[0].name;

        // get meal data
        // let FullMealIds = currentMeals.filter(m => m.is_full_meal).map(m => m.meal_id);
        // let PartialMealIds = currentMeals.filter(m => !m.is_full_meal).map(m => m.meal_id);

        // loop through each day
        for(let j = 0; j < 7; j++){
          let newDay: Day = new Day(j);

          // add the meals that are in the list that match this day
          for (const mealData of currentMealDatas.filter(m => m.day_for === j)){
            const meal = mealData.is_full_meal 
              ? (await FullMeal.GetMeals([mealData.meal_id]))[0] ?? null 
              : (await PartialMeal.GetMeals([mealData.meal_id]))[0] ?? null
            
            newDay.setMeal(mealData.time_for, meal);
          }
          NewMealPlan.Days.push(newDay);
        }

        MealPlans.push(NewMealPlan);
      }

      return MealPlans;
      
    } catch(error) {
      console.log('Error while retrieving mealplans: ', error);
      return [];
    }
  }

  public static async GenerateMealPlan(): Promise<MealPlan> {
    const pool = await Database.getPool();
    let NewMealPlan: MealPlan = new MealPlan();

    // meal for each day - dinners only right now
    for(let i = 0; i < 7; i++){
      let newDay = new Day(i as DaysOfWeek);
      let newMeal = await Meal.GetRandomMeal(NewMealPlan);
      newDay.setMeal(30 as MealTime, newMeal);
      NewMealPlan.Days.push(newDay);
    }

    // get this or use user input
    const mealPlanName = MealPlan.genericMealPlanName();

    // save meal plan to db
    let Results = await pool.one(sql.type(z.object({id: z.number()}))`
      INSERT INTO meal_plans (user_id, name)
        VALUES (1, ${mealPlanName})
      RETURNING id;
    `);

    NewMealPlan.MealPlanId = Results.id;
    
    if(NewMealPlan.MealPlanId == 0){
      throw new Error('Could not generate new mealplan');
    }

    const colTypes = ['int4','int4', 'bool', 'int4', 'int4'];

    // create the rows
    const MealValues = NewMealPlan.Days.flatMap(d => {
      return Array.from(d.Meals.entries()).map(([mealTime, meal]) => {
        return [NewMealPlan.MealPlanId, meal?.mealId, meal instanceof FullMeal, d.Day, mealTime];
      });
    });

    let query = sql.unsafe`
      INSERT INTO meal_plan_meals (meal_plan_id, meal_id, is_full_meal, day_for, time_for)
      SELECT * FROM
        ${sql.unnest(MealValues, colTypes)}
      RETURNING *
    `;

    try {
      await pool.query(query);
    } catch (error) {
      console.log('Error while inserting into meal_plan_meals', error);
    }

    return NewMealPlan;
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