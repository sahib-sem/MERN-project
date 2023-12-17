import {GoogleAuthProvider, getAuth, signInWithPopup} from 'firebase/auth'; 
import {app} from '../firebase';
import {useDispatch} from 'react-redux';
import {signInSuccess} from '../redux/user/user.slice';

export default function OAuth() {


    const dispatch = useDispatch();
    const handleGoogleSignIn = async () => {

        try{

            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);

            const res = await signInWithPopup(auth, provider);

            const response = await fetch('/api/auth/google', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    name: res.user.displayName,
                    email: res.user.email,
                    photo: res.user.photoURL
                })
            });

            const data = await response.json();
            console.log(data)
            if (!data.success) {
                return;
            }

            dispatch(signInSuccess(data.user));
            
        }catch(err){
            console.log(err);
        }
    }
  return (
    <button
        onClick={handleGoogleSignIn}
      type="button"
      className="border text-white uppercase p-3 bg-red-500 rounded-lg hover:opacity-95 disabled:opacity-80"
    >
      Continue With Google
    </button>
  );
}
