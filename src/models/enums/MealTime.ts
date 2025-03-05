// stored in suggested_food_times
export enum MealTime {
  BREAKFAST = 10,
  LUNCH = 20,
  DINNER = 30,
  SNACK = 40,
  EXTRA = 50,
}

export function MealTimeAsString(time: MealTime){
  switch(time){
    case 10:
      return "Breakfast";
    case 20:
      return "Lunch";
    case 30:
      return "Dinner";
    case 40:
      return "Snack";
    case 50:
      return "Other";
    default:
      return "";
  }
}