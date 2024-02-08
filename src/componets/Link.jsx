import { Link } from "react-router-dom";
import { authentication } from "../configuration/firebase";
import { useAuthState} from 'react-firebase-hooks/auth';
import { signOut } from "firebase/auth";
import { useState } from "react";

export const NavigationBar = () => {
  // Uses react firebase hooks authentication to manage user data
  const [user,error] = useAuthState(authentication);
  const [dropdown,setDropdown] = useState(false);

  const handleDrop = () => {
    setDropdown(!dropdown);
  }

  const userSignout = async () => {
    await signOut(authentication);
  }  
  return(
  <div className="navigationbar">
      <div className="links">
          <Link className="link" to='/'>Home</Link>
          {!user 
          ? <Link className="link" to='/login'> Login</Link> 
          : <Link className="link" to='/post'>Post</Link> }
      </div>
    {user &&
    <div id="userdata">
      <button onClick={ handleDrop }>
        <img id='profile' src={user?.photoURL || ""}  alt=""/>
      </button>
      {dropdown 
        ? (
          <ul className="menu">
            <li className="menu-item">
              <p className="username">{ !error && user?.displayName }</p>
            </li>
            <li className="menu-item">
              <button id="logout" onClick={userSignout}>Logout</button>
            </li>
          </ul>
        )
        : <div className="close">
          </div> 
    }
  </div>
}
</div>
  )
}