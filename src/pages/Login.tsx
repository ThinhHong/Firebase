import {authentication, provider} from '../configuration/firebase';
import { signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

export const Login = () => {

    const redirect = useNavigate();

    // function is asynchonous and awaits for user to sign using their google account from the pop up
    const googleSignUp = async () => {
        const signInResult = await signInWithPopup(authentication, provider);
        console.log(signInResult);
        redirect("/")
    }

    
    return (
        <div className='sign'>
          <button className='login' type="button" onClick={googleSignUp}>Sign in with google!</button>
        </div>
    );
};