'use client'




export default function CurrentMealPlanSelector(){
  return <>
    <select id="meal-plan-selector">
      {mealPlans.map((mealPlan, index) => {
        return <option key={index} value={index}>
          {mealPlan.Name}
        </option>
      })}
    </select>
  </>
}