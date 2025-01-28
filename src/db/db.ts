import { createPool, DatabasePool, sql } from 'slonik';
import { z } from 'zod';
import { Meal } from '../models/Meal';

export class Database {
  private static pool: DatabasePool;

  static async getPool() {
    if (!Database.pool) {
      Database.pool = await createPool(`postgresql://${process.env.DB_USER}:${process.env.DB_PASS}@localhost:5432/mealPlanner`);
    }
    return Database.pool;
  }
}


// zod type definitions
export class Zods {

  // full_meals
  static fullMealObj = z.object({
    id: z.number(),
    name: z.string(),
    prep_time: z.number(),
    food_id: z.number(),
  });
  
  // partial_meals
  static partialMealObj = z.object({
    id: z.number(),
    food_serial: z.string(),
  });

  // foods
  static foodObj = z.object({
    id: z.number(),
    type: z.number(),
    name: z.string(),
    prep_time: z.number(),
  });

  // meal_plans
  static mealPlan = z.object({
    id: z.number(),
    name: z.string(),
  });

  // meal_plan_meals
  static mealPlanMeal = z.object({
    id: z.number(),
    meal_plan_id: z.number(),
    meal_id: z.number(),
    is_full_meal: z.boolean(),
  });

  // meal_plan_meals right join meal_plans
  static mealPlanMealsRJMealPlans = z.object({
    id: z.number(),
    meal_plan_id: z.number(),
    meal_id: z.number(),
    is_full_meal: z.boolean(),
    day_for: z.number(),
    time_for: z.number(),
    mplan_id: z.number(),
    user_id: z.number(),
    name: z.string(),
  });

  // users
  static userObj = z.object({
    id: z.number(),
    first_name: z.string(),
    last_name: z.string(),
    email: z.string(),
    google_id: z.string(),
  })
}



// queries
export class queries {

  static getRandomFoodQuery (isPartialMeal: boolean, Meals: Meal[]) {
    return sql.type(Zods.foodObj)
      `SELECT * FROM foods
          WHERE type NOT IN (10, 20, 30)
            ${Meals.length > 0 ? sql.unsafe`AND id NOT IN (${sql.join(Meals.map(x => x.mealId), sql.fragment`, `)})` : sql.unsafe``}
          ORDER BY RANDOM()
          LIMIT 1;`
  }
}