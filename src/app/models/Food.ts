import { MealTime } from "./enums/MealTime";

export class Food {
  id: number;
  type: FoodType;
  name: string = "";
  prepTime: number = 0;
  SuggestedMealTime: MealTime = 30;

  constructor(type: FoodType, id: number, name: string = "", prepTime: number = 0){
    this.type = type;
    this.id = id;
    this.name = name;
    this.prepTime = prepTime;
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




