import { GetCurrentUser } from '@/auth/auth'
import './styles/Navbar.css'

export default async function Navbar(){

  const user = await GetCurrentUser();

  return <nav>
    <div className="left">
      <a href="/"><span>Meal Planner</span></a>
      <a href="/mealplan/list"><span className='link'>Plans</span></a>
      <a href="/recipes"><span className='link'>Recipes</span></a>
      <a href="/foods"><span className='link'>Foods</span></a>
    </div>
    <div className="flex-spacer"></div>
    <div className="right">
      {user == null 
        ? <a href='/api/login'><span className='button'>Login</span></a>
        : <a href='/api/logout'><span className='button'>Logout</span></a>
      }
    </div>
  </nav>
}