import { sql } from "slonik";
import { Food, FoodType } from "./Food";
import { MealPlan } from "./MealPlan";
import { Database, MealResultType, sqlAliases, Zods } from "../db/db";
import { DaysOfWeek } from "./enums/DaysOfTheWeek";
import { MealTime } from "./enums/MealTime";
import { GetCurrentUser } from "@/auth/auth";
import { z } from "zod";
import { GetMeal } from "@/app/mealplan/new/action";

// The basis of the meal
export class Meal {
  MealPlanId: number = 0;
  MealId: number = 0;
  DayFor: DaysOfWeek = DaysOfWeek.Sunday;
  TimeFor: MealTime = MealTime.DINNER;
  RecipeId: number = 0;

  
  // * * * * * * * * * * * * * * * * * * * * * *
  // * * *          Searching              * * * 
  // * * * * * * * * * * * * * * * * * * * * * *
  static async GetMeals(InputCriteria: MealSearchCriteria): Promise<Meal[]>{
    const DefaultCriteria = new MealSearchCriteria();
    const Criteria = {...DefaultCriteria, ...InputCriteria };
    const pool = await Database.getPool();
    
    let query = sql.type(Zods.mealResult)`
      SELECT *
      FROM public.meals
      WHERE 1=1
 
      ${ // meal plan ids
        (Criteria.MealPlanIdList.length > 0) 
        ? sql.fragment`AND meal_plan_id IN (${sql.join(Criteria.MealPlanIdList, sql.fragment`, `)})`
        : sql.fragment``}

      ${ // recipe ids
        (Criteria.MealIdList.length > 0)
        ? sql.fragment`AND recipe_id IN (${sql.join(Criteria.MealIdList, sql.fragment`, `)})`
        : sql.fragment``}

      ORDER BY id;
    `;

    try {
      const results = await pool.any(query);
      let Meals = results.map(meal => Object.assign(
        new Meal(),
        {
          MealId: meal.id,
          MealPlanId: meal.meal_plan_id,
          DayFor: meal.day_for as DaysOfWeek,
          TimeFor: meal.time_for as MealTime,
          RecipeId: meal.recipe_id,
        }
      ));
      return Meals;
      
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
      console.log('User could not be authenticated.');
      return;
    }

    try {
      if(this.MealId <= 0){
        let Results = await pool.one(sql.type(z.object({id: z.number()}))`
          INSERT INTO meals (meal_plan_id, day_for, time_for, recipe_id)
            VALUES (${this.MealPlanId}, ${this.DayFor}, ${this.TimeFor}, ${this.RecipeId})
          RETURNING id;
        `);
        this.MealPlanId = Results.id;

      } else {
        await pool.one(sql.type(z.object({id: z.number()}))`
          UPDATE meals
            SET meal_plan_id = ${this.MealPlanId},
            day_for = ${this.DayFor},
            time_for = ${this.TimeFor},
            recipe_id = ${this.RecipeId}
          WHERE id = ${this.MealId}
          RETURNING id;
        `);
      }
    } catch(e) {
      console.log(`There was an error saving changes to meal with id: ${this.MealId}`, e);
    }
  }


  // * * * * * * * * * * * * * * * * * * * * * *
  // * * *           Deleting              * * * 
  // * * * * * * * * * * * * * * * * * * * * * *

  public static async Delete(MealIDList: number[]): Promise<boolean> {
    const pool = await Database.getPool();
    const User = await GetCurrentUser();
    
    // save meal plan to db
    if(User == null){
      console.log('User could not be authenticated.');
      return false;
    }

    if(MealIDList.length == 0){
      console.log('Cannot delete no meals');
      return false;
    }

    let query = sqlAliases.typeAlias('void')`
      DELETE FROM meals
      WHERE 1=1

      ${ // meal plan ids
        (MealIDList.length > 0) 
        ? sql.fragment`AND id IN (${sql.join(MealIDList, sql.fragment`, `)})`
        : sql.fragment``}
    `;

    try {
      await pool.query(query);
      return true;
    } catch (error) {
      console.log('Error while deleting meals', error);
      return false;
    }
  }

  public static async DeleteMealsForPlans(MealPlanIDList: number[]): Promise<boolean> {
    const User = await GetCurrentUser();
    
    // save meal plan to db
    if(User == null){
      console.log('User could not be authenticated.');
      return false;
    }

    if(MealPlanIDList.length == 0){
      console.log('Cannot delete meals for no meals plans.');
      return false;
    }

    console.log('Deleting all meals for mealplan ' + MealPlanIDList.join(', '));

    const meals = await Meal.GetMeals( new MealSearchCriteria({
      MealPlanIdList: MealPlanIDList,
    }));

    if(meals.length != 0){
      return Meal.Delete(meals.map(m => m.MealId))
    }

    return true;
  }


  // * * * * * * * * * * * * * * * * * * * * * *
  // * * *            Utility              * * * 
  // * * * * * * * * * * * * * * * * * * * * * *

  public static Serialize(meal: Meal): MealResultType{
    return {
      id: meal.MealId,
      meal_plan_id: meal.MealPlanId,
      day_for: meal.DayFor,
      time_for: meal.TimeFor,
      recipe_id: meal.RecipeId,
    }
  }

  public Serialize(): MealResultType {
    return {
      id: this.MealId,
      meal_plan_id: this.MealPlanId,
      day_for: this.DayFor,
      time_for: this.TimeFor,
      recipe_id: this.RecipeId,
    }
  }
  
}


export class MealSearchCriteria {
  MealPlanIdList: number[] = [];
  MealIdList: number[] = [];

  constructor(init?: Partial<MealSearchCriteria>) {
    Object.assign(this, init);
  }
}