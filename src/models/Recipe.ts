import { Database, RecipeResultType, Zods } from "@/db/db";
import { MealSearchCriteria, Meal } from "./Meal";
import { sql } from "slonik";


export default class Recipe {
  RecipeId: number = 0;
  Name: string = "";
  Instructions: string = "";
  PrepTime: number = 0;

  static async Search(InputCriteria: RecipeSearchCriteria){
    const Criteria = Object.assign(new RecipeSearchCriteria(), InputCriteria);
    const pool = await Database.getPool();
    
    let query = sql.type(Zods.recipeResult)`
      SELECT *
      FROM public.recipes
      WHERE 1=1
 
      ${ // meal plan ids
        (Array.isArray(Criteria.RecipeIdList) && Criteria.RecipeIdList.length > 0)
        ? sql.fragment`AND id IN (${sql.join(Criteria.RecipeIdList, sql.fragment`, `)})`
        : sql.fragment``}
      
      ${ // name
        (Criteria.Name.length > 0)
        ? sql.fragment`AND name LIKE ${'%' + Criteria.Name + '%'}`
        : sql.fragment`` }

      ORDER BY id;
    `;

    try {
      const results = await pool.any(query);
      return results.map(recipe => Recipe.Deserialize(recipe));

    } catch (error) {
      console.log('Error while searching for meal plans', error);
      return [];
    }
  }


  // function that takes in list of food ids
  // and gets random meal that don't already have
  static async GetRandomRecipe(MealPlanId: number): Promise<Recipe> {
    const pool = await Database.getPool();

    // const Meals = MealPlan.Days.flatMap(d => Array.from(d.Meals.values()));
    const Meals = MealPlanId > 0 ? await Meal.GetMeals(Object.assign(new MealSearchCriteria(), {
      MealIdList: [MealPlanId],
    }))
    : [];

    const query = sql.type(Zods.recipeResult)`SELECT * FROM public.recipes
        ${Meals.length > 0 ?  sql.unsafe`WHERE id NOT IN (${sql.join(Meals.map(x => x.RecipeId), sql.fragment`, `)})` : sql.unsafe``}
      ORDER BY RANDOM()
      LIMIT 1;
    `;

    try {
      const randomRecipe = await pool.one(query);
      return Recipe.Deserialize(randomRecipe);
    } catch (e) {
      console.log('Error while retrieving random recipe', e);
      return new Recipe();
    }
  }

  static Serialize(InputRecipe: Recipe): RecipeResultType {
    return {
      id: InputRecipe.RecipeId,
      name: InputRecipe.Name,
      instructions: InputRecipe.Instructions,
      prep_time: InputRecipe.PrepTime,
    }
  }

  public Serialize(): RecipeResultType {
    return {
      id: this.RecipeId,
      name: this.Name,
      instructions: this.Instructions,
      prep_time: this.PrepTime,
    }
  }

  static Deserialize(RecipeData: RecipeResultType): Recipe {
    return Object.assign(new Recipe(), {
      RecipeId: RecipeData.id,
      Name: RecipeData.name,
      Instructions: RecipeData.instructions,
      PrepTime: RecipeData.prep_time,
    });
  }

}

export class RecipeSearchCriteria {
  RecipeIdList: number[] = [];
  Name: string = "";
  PrepTimeGreaterThan: number = 0;
  PrepTimeLessThan: number = 0;

  constructor(data?: Record<string, any>) {
    if (data) {
      Object.keys(data).forEach((key) => {
        if (key in this) {
          (this as any)[key] = data[key];
        }
      });
    }
  }
}



function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}




