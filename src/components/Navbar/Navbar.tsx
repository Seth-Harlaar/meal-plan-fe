import { GetCurrentUser } from '@/auth/auth'
import './Navbar.css'
import DesktopNav from './DesktopNav';
import MobileNav from './MobileNav';

export default async function Navbar(){

  const user = await GetCurrentUser();

  return <nav>
    <DesktopNav userLoggedIn={user != null}/>
    <MobileNav userLoggedIn={user != null}/>
  </nav>
}