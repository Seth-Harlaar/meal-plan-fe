import { sql } from "slonik";
import { Food, FoodType } from "./Food";
import { MealPlan } from "./MealPlan";
import { Database, MealResultType, Zods } from "../db/db";
import { DaysOfWeek } from "./enums/DaysOfTheWeek";
import { MealTime } from "./enums/MealTime";
import { GetCurrentUser } from "@/auth/auth";
import { z } from "zod";

// The basis of the meal
export class Meal {
  MealPlanId: number = 0;
  MealId: number = 0;
  DayFor: DaysOfWeek = DaysOfWeek.Sunday;
  TimeFor: MealTime = MealTime.DINNER;
  RecipeId: number = 0;

  static async GetMeals(InputCriteria: MealSearchCriteria): Promise<Meal[]>{
    const DefaultCriteria = new MealSearchCriteria();
    const Criteria = {...DefaultCriteria, ...InputCriteria };
    const pool = await Database.getPool();
    
    let query = sql.type(Zods.mealResult)`
      SELECT *
      FROM public.meals
      WHERE 1=1
 
      ${ // meal plan ids
        (Criteria.MealPLanIdList.length > 0) 
        ? sql.fragment`AND meal_plan_id IN (${sql.join(Criteria.MealPLanIdList, sql.fragment`, `)})`
        : sql.fragment``}

      ${ // user ids
        (Criteria.MealIdList.length > 0)
        ? sql.fragment`AND meal_id IN (${sql.join(Criteria.MealIdList, sql.fragment`, `)})`
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


  // save meal plan
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
  // * * *          Generating             * * *
  // * * * * * * * * * * * * * * * * * * * * * *

  


  // * * * * * * * * * * * * * * * * * * * * * *
  // * * *            Utility              * * * 
  // * * * * * * * * * * * * * * * * * * * * * *
  private static GenerateFoodSerial(FoodList: Food[]): string {
    // mains - sides - veggies - other
    // grouped in order according to id (ascending)
    var idList: number[] = [];
    idList.push(...FoodList.filter(x => x.type == 10).map(x => x.id).sort()); 
    idList.push(...FoodList.filter(x => x.type == 20).map(x => x.id).sort()); 
    idList.push(...FoodList.filter(x => x.type == 30).map(x => x.id).sort()); 
    idList.push(...FoodList.filter(x => x.type != 10 && x.type != 20 && x.type != 30).map(x => x.id).sort()); 

    return idList.join('-');
  }

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



//   foodList: Food[] = [];

//   constructor(mealId: number, mealSubId:number, name: string, prepTime: number, foodList: Food[]) {
//     super(mealId, mealSubId, name, prepTime);
//     this.foodList = foodList;
//   }

//     if(MealIds.length <= 0){
//       return [];
//     }

//     const pool = await Database.getPool();


//     for(let i = 0; i < MealIds.length; i++){
//       const foods = await pool.many(
//         sql.type(Zods.foodObj)`
//           SELECT 
//             partial_meals_foods.partial_meal_id, food_id,
//             food_type, name, prep_time
//           FROM public.partial_meals_foods
//           RIGHT JOIN foods ON partial_meals_foods.food_id = foods.id
//             WHERE partial_meals_foods.id IS NOT NULL
//             AND partial_meal_id = ${MealIds[i]}
//           ORDER BY partial_meals_foods.id ASC;
//         `
//       );
  
//       var FoodList: Food[] = foods.map(f => new Food(f.id, f.type, f.name, f.prep_time));
//       const prepTime = FoodList.map(x => x.prepTime).reduce((prev, cur) => prev + cur);
//       const name = FoodList.map(f => f.name).join(', ');

//       Meals.push(new PartialMeal(MealIds[i], 1, name, prepTime, FoodList));
//     }

//     return Meals;
//   }
// }


//   foodId: number = 0;

//     if(MealIds.length <= 0){
//       return [];
//     }

//     const pool = await Database.getPool();

//     const mealObjs = await pool.any(
//       sql.type(Zods.fullMealObj)`
//         SELECT * FROM full_meals
//           WHERE id IN (${sql.join(MealIds, sql.fragment`, `)})
//       `
//     );

//     return mealObjs.map(o => new FullMeal(o.id, o.name, o.prep_time, o.food_id));
//   }

//   static async GetFullMealInfo()
// }









export class MealSearchCriteria {
  MealPLanIdList: number[] = [];
  MealIdList: number[] = [];
}