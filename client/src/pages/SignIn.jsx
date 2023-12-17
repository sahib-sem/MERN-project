// eslint-disable-next-line no-unused-vars
import {useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {signInStart, signInFailure, signInSuccess} from '../redux/user/user.slice';

import {Link, useNavigate} from 'react-router-dom';

export default function SignIn() {

  const [formData, setFormData] = useState({});
  const {loading, error} = useSelector(state => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleSubmit = async (e) => {

    e.preventDefault();
    dispatch(signInStart());
    const res = await fetch('/api/auth/signin', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(formData)
    });
    const data = await res.json();

    if (!data.success) {
      dispatch(signInFailure(data.message));
      return;
    }

    dispatch(signInSuccess(data.user));
    navigate('/');
    
    
    
  }

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value})
    
  }


  return (
    <div className='max-w-lg mx-auto p-3'>

      <h1 className='text-3xl py-7 text-center font-semibold'>Sign In</h1>

      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>

        
        <input type="email" name = 'email' placeholder='email'  className='border p-3 rounded-lg'onChange={handleChange}/>
        <input type="password" name = 'password' placeholder='password'  className='border p-3 rounded-lg'onChange={handleChange}/>

        <button disabled = {loading} className='bg-slate-700 rounded-lg text-white p-3 uppercase hover:opacity-95 disabled:opacity-80'>Sign In</button>
      </form>

      <div className='flex gap-2'>
        Dont have an Account?
        <Link to={'/signup'}><span className='text-blue-700'>sign up</span></Link>
      </div>

      <div>
        {error && <div className='text-red-600'>{error}</div>}
      </div>
    </div>
  )
}
