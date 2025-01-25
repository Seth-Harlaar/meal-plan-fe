import { sql } from "slonik";
import { Food, FoodType } from "./Food";
import { MealPlan } from "./MealPlan";
import { Database, Zods } from "../db/db";

// The basis of the meal
export class Meal {
  mealId: number;
  name: string = "";
  prepTime: number = 0;
  // recipe: string;

  constructor(mealId: number, name: string, prepTime: number){
    this.mealId = mealId;
    this.name = name;
    this.prepTime = prepTime;
  }


  // * * * * * * * * * * * * * * * * * * * * * *
  // * * *          Generating             * * *
  // * * * * * * * * * * * * * * * * * * * * * *

  // function that takes in list of food ids
  // and gets random meal that don't already have
  static async GetRandomMeal(MealPlan: MealPlan): Promise<Meal> {
    const pool = await Database.getPool();

    const Meals = MealPlan.Days.flatMap(d => Array.from(d.Meals.values()));

    const partialMeals = Meals.filter(x => x instanceof PartialMeal);
    const fullMeals = Meals.filter(x => x instanceof FullMeal);

    const makeFullMeal = getRandomInt(8) > 2;
    if(makeFullMeal){
      const randomMeal = await pool.one(
        sql.type(Zods.fullMealObj)`SELECT * FROM full_meals
            ${fullMeals.length > 0 ?  sql.unsafe`WHERE id NOT IN (${sql.join(fullMeals.map(x => x.mealId), sql.fragment`, `)})` : sql.unsafe``}
          ORDER BY RANDOM()
          LIMIT 1;
        `);

      return new FullMeal(randomMeal.id, randomMeal.name, randomMeal.prep_time, randomMeal.id);

    } else {
      // get random partial meal
      const randomMeal = await pool.one(
        sql.type(Zods.partialMealObj)`SELECT * FROM partial_meals
            ${partialMeals.length > 0 ?  sql.unsafe`WHERE id NOT IN (${sql.join(partialMeals.map(x => x.mealId), sql.fragment`, `)})` : sql.unsafe``}
          ORDER BY RANDOM()
          LIMIT 1;
        `);

      // get the food
      const foods = await pool.any(
        sql.type(Zods.foodObj)`
          SELECT 
            partial_meals_foods.partial_meal_id, food_id,
            food_type, name, prep_time
          FROM public.partial_meals_foods
          RIGHT JOIN foods ON partial_meals_foods.food_id = foods.id
            WHERE partial_meals_foods.id IS NOT NULL
            AND partial_meal_id = ${randomMeal.id}
          ORDER BY partial_meals_foods.id ASC;
        `);
        
      var FoodList: Food[] = foods.map(f => new Food(f.id, f.type, f.name, f.prep_time));
      const prepTime = FoodList.map(x => x.prepTime).reduce((prev, cur) => prev + cur);
      const name = FoodList.map(f => f.name).join(', ');

      return new PartialMeal(randomMeal.id, name, prepTime, FoodList);
    }
  }


  
  // creates a partial meal in the db w/ purely random picks 
  // of the parts of the meal
  static async CreatePartialMeal(): Promise<void> {
    const pool = await Database.getPool();

    // get all serial numbers
    const partialMealList = await pool.any(
      sql.type(Zods.partialMealObj)`SELECT * FROM partial_meals
          ORDER BY id ASC;
      `);

    const serials = partialMealList.map(x => x.food_serial);

    // make new one
    do {
      // get 3 random foods
      var randomMain = await pool.one(
          sql.type(Zods.foodObj)`SELECT * FROM foods
              WHERE food_type = 10
            ORDER BY RANDOM()
            LIMIT 1;
          `);
          
      var randomVeggie = await pool.one(
        sql.type(Zods.foodObj)`SELECT * FROM foods
            WHERE food_type = 20
          ORDER BY RANDOM()
          LIMIT 1;
        `);
        
      var randomSide = await pool.one(
        sql.type(Zods.foodObj)`SELECT * FROM foods
            WHERE food_type = 30
          ORDER BY RANDOM()
          LIMIT 1;
        `);

      // create food list and generate new serial number
      var Foods: Food[] = [
        Object.assign(new Food(FoodType.MAIN, randomMain.id), {name: randomMain.name, prepTime: randomMain.prep_time }),
        Object.assign(new Food(FoodType.SIDE, randomSide.id), {name: randomSide.name, prepTime: randomSide.prep_time }),
        Object.assign(new Food(FoodType.VEGETABLE, randomVeggie.id), {name: randomVeggie.name, prepTime: randomVeggie.prep_time }),
      ];

      var newSerial = Meal.GenerateFoodSerial(Foods);
    } while (serials.includes(newSerial))

    if(newSerial != ''){

      // insert new partial meal
      const newPartialMeal = await pool.one(sql.type(Zods.partialMealObj)`
          INSERT INTO partial_meals (food_serial)
          VALUES (${newSerial})
          RETURNING id, food_serial;
        `);

      // insert partial meal foods
      if(newPartialMeal && newPartialMeal.id){
        await pool.query(sql.unsafe`
            INSERT INTO partial_meals_foods (partial_meal_id, food_id)
            VALUES
              (${newPartialMeal.id}, ${randomMain.id}),
              (${newPartialMeal.id}, ${randomSide.id}),
              (${newPartialMeal.id}, ${randomVeggie.id});
          `);
      }

      console.log(`Inserted new partial meal with id of ${newPartialMeal.id} and serial of ${newSerial}`);
    }
  }



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
}



export class PartialMeal extends Meal {
  foodList: Food[] = [];

  constructor(mealId: number, name: string, prepTime: number, foodList: Food[]) {
    super(mealId, name, prepTime);
    this.foodList = foodList;
  }

  static async GetMeals(MealIds: number[]): Promise<Meal[]>{
    if(MealIds.length <= 0){
      return [];
    }

    const pool = await Database.getPool();

    let Meals: Meal[] = [];

    for(let i = 0; i < MealIds.length; i++){
      const foods = await pool.many(
        sql.type(Zods.foodObj)`
          SELECT 
            partial_meals_foods.partial_meal_id, food_id,
            food_type, name, prep_time
          FROM public.partial_meals_foods
          RIGHT JOIN foods ON partial_meals_foods.food_id = foods.id
            WHERE partial_meals_foods.id IS NOT NULL
            AND partial_meal_id = ${MealIds[i]}
          ORDER BY partial_meals_foods.id ASC;
        `
      );
  
      var FoodList: Food[] = foods.map(f => new Food(f.id, f.type, f.name, f.prep_time));
      const prepTime = FoodList.map(x => x.prepTime).reduce((prev, cur) => prev + cur);
      const name = FoodList.map(f => f.name).join(', ');

      Meals.push(new PartialMeal(MealIds[i], name, prepTime, FoodList));
    }

    return Meals;
  }
}


export class FullMeal extends Meal {
  foodId: number;

  constructor(mealId: number, name: string, prepTime: number, foodId: number) {
    super(mealId, name, prepTime);
    this.foodId = foodId;
  }

  static async GetMeals(MealIds: number[]): Promise<Meal[]>{
    if(MealIds.length <= 0){
      return [];
    }

    const pool = await Database.getPool();

    const mealObjs = await pool.any(
      sql.type(Zods.fullMealObj)`
        SELECT * FROM full_meals
          WHERE id IN (${sql.join(MealIds, sql.fragment`, `)})
      `
    );

    return mealObjs.map(o => new FullMeal(o.id, o.name, o.prep_time, o.food_id));
  }
}






function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

