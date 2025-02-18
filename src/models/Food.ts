import { Database, Zods } from "@/db/db";
import { MealTime } from "./enums/MealTime";
import { sql } from "slonik";

export class Food {
  id: number = 0;
  type: FoodType = FoodType.MAIN;
  name: string = "";
  prepTime: number = 0;

  static async GetFullMealFood(FullMealId: number){
    const pool = await Database.getPool();
    
    const query = sql.type(Zods.foodObj)`
      SELECT food_id, foods.* from public.full_meals
        LEFT JOIN public.foods on (food_id = public.foods.id)
        WHERE public.full_meals.id = ${FullMealId}
    `;
    try {
      const FoodResult = await pool.one(query);
      return Object.assign(new Food(), {
        id: FoodResult.id,
        type: FoodResult.type,
        name: FoodResult.name,
        prepTime: FoodResult.prep_time,
      });

    } catch(e) {
      console.log(`There was an error finding the food for full meal ${FullMealId}: `, e);
      return null;
    }
  }
}


export enum FoodType {
  MAIN = 10,
  VEGETABLE = 20,
  SIDE = 30,
  CASSEROLE = 40,
  ONE_POT = 50,
  SOUP = 60,
  PIZZA = 70,
  SANDWICH = 80,
  DESSERT = 90,
}




