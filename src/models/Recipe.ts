import { Database, Zods } from "@/db/db";
import { MealSearchCriteria, ScheduledMeal } from "./Meal";
import { sql } from "slonik";
import { DaysOfWeek } from "./enums/DaysOfTheWeek";
import { MealTime } from "./enums/MealTime";




class Recipe {
  RecipeId: number = 0;
  Name: string = "";
  Instructions: string = "";
  PrepTime: number = 0;

  // function that takes in list of food ids
  // and gets random meal that don't already have
  static async GetRandomRecipe(MealPlanId: number): Promise<Recipe> {
    const pool = await Database.getPool();

    // const Meals = MealPlan.Days.flatMap(d => Array.from(d.Meals.values()));
    const Meals = MealPlanId > 0 ? await ScheduledMeal.GetMeals(Object.assign(new MealSearchCriteria(), {
      MealIdList: [MealPlanId],
    }))
    : [];

    if(true){
      const query = sql.type(Zods.recipeResult)`SELECT * FROM recipes
          ${Meals.length > 0 ?  sql.unsafe`WHERE id NOT IN (${sql.join(Meals.map(x => x.ScheduledMealID), sql.fragment`, `)})` : sql.unsafe``}
        ORDER BY RANDOM()
        LIMIT 1;
      `;
      const randomRecipe = await pool.one(query);

      return Object.assign(new Recipe(), {
        RecipeId: randomRecipe.id,
        Name: randomRecipe.name,
        Instructins: randomRecipe.instructions,
        PrepTime: randomRecipe.prep_time,
      });
    }
  }
}





function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}