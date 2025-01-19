
import './styles/Navbar.css'



export default function Navbar(){
  return <nav>
    <div className="left">
      <span>Meal Planner</span>
      <span className='link'>Plans</span>
      <span className='link'>Meals</span>
      <span className='link'>Foods</span>
    </div>
    <div className="flex-spacer"></div>
    <div className="right">
      <a href='/login'><span className='button'>Login</span></a>
    </div>
  </nav>
}