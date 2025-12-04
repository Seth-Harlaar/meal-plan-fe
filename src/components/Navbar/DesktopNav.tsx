



export default function DesktopNav({userLoggedIn} : {userLoggedIn: boolean}){

  return <div className="desktop-only">
    <div className="bar">
      <div className="left">
        <a href="/"><span>Meal Planner</span></a>
        <a href="/mealplan/list"><span className='link'>Plans</span></a>
        <a href="/recipes"><span className='link'>Recipes</span></a>
        <a href="/foods"><span className='link'>Foods</span></a>
      </div>
      <div className="flex-spacer"></div>
      <div className="right">
        {userLoggedIn 
          ? <a href='/api/logout'><span className='button'>Logout</span></a>
          : <a href='/api/login'><span className='button'>Login</span></a>
        }
      </div>
    </div>
  </div>
}