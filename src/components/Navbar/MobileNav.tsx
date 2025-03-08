'use client'
import { useState } from "react"
import { HamburgerMenuButton, XButton } from "../Buttons";

export default function MobileNav({userLoggedIn} : {userLoggedIn: boolean}){

  const [isOpen, setIsOpen] = useState(false);

  const openMenu = () => setIsOpen(true);
  const closeMenu = () => setIsOpen(false);

  return <>
  {/* the bar at the top */}
    <div className="mobile-only">
      <div className="left">
        <span onClick={openMenu}><HamburgerMenuButton /></span>
      </div>
      <div>
        <a href="/"><span>Meal Planner</span></a>
      </div>
      <div className="flex-spacer"></div>
      <div className="right">
        {userLoggedIn 
          ? <a href='/api/logout'><span className='button'>Logout</span></a>
          : <a href='/api/login'><span className='button'>Login</span></a>
        }
      </div>
    </div>

    {/* the openning/closing menu */}
    <div className={"nav-slider " + (isOpen ? "" : "closed")}>
      <div className="exit" onClick={closeMenu}>
        <XButton />
      </div>

      <div className="nav-menu">
        <div>
          <a href="/"><h1 className="title">Meal Planner</h1></a>
        </div>
        <a href="/mealplan/list"><span className='link'>Plans</span></a>
        <a href="/recipes"><span className='link'>Recipes</span></a>
        <a href="/foods"><span className='link'>Foods</span></a>

        {userLoggedIn 
          ? <a href='/api/logout'><span className='link'>Logout</span></a>
          : <a href='/api/login'><span className='link'>Login</span></a>
        }
      </div>
    </div>
  </>
}