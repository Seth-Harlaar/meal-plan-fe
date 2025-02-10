'use client'
import { signIn } from 'next-auth/react'
import './styles/Navbar.css'



export default function Navbar(){
  return <nav>
    <div className="left">
      <span>Meal Planner</span>
      <a href='/'><span className='link'>Plans</span></a>
      <span className='link'>Meals</span>
      <span className='link'>Foods</span>
    </div>
    <div className="flex-spacer"></div>
    <div className="right">
      <span className='button' onClick={() => signIn('google')}>Login</span>
    </div>
  </nav>
}