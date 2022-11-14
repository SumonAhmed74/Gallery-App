import React, { useState } from 'react'
import {Alert} from '@mui/material'
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate,Link } from 'react-router-dom';

const LogIn = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [email,setEmail]= useState('')
  const [password,setPassword]= useState('')
  const [emailErr,setEmailErr]= useState('')
  const [passwordErr,setPasswordErr]= useState('')
  const [lengthErr,setLengthErr]= useState('')
  const [usersErr,setUsersErr] = useState('')
  const [wrongPasswordErr,setWrongPasswordErr] = useState('')
  const [open,setOpen]= useState(false)
 

  const signUpBtnHandler =()=>{
    if(!email){
      setEmailErr("Please enter your email!")
    }
    else if(!password){
      setPasswordErr("Please enter your password!")
      setEmailErr('')
    }
    else if(password.length<8){
      setLengthErr("Password must be 8 Character!")
      setPasswordErr('')
    }
    else{
      setLengthErr('')
      signInWithEmailAndPassword(auth,email,password).then((users)=>{
        console.log("LogIn Successful!")
        navigate('/home')
     }).catch((error) => {
      const errorMessage = error.message;
      if(errorMessage.includes('user')){
        setUsersErr("Email Not Found Please Try Another!")
        setOpen(true)
      }else if(errorMessage.includes('password')){
        setWrongPasswordErr("Incorrect Password !")
        setOpen(true)
      }
    });
    }
  }


  return (
    <div className='Registration-part logIN-part'>
      <div className='box'>
      <h1>Gallery App Login</h1>
      <h3>{emailErr?emailErr:passwordErr?passwordErr:lengthErr?lengthErr:''}</h3>
      {open &&
        <Alert 
        className='alert'
        variant="filled"
        severity="warning">
         {usersErr?usersErr:wrongPasswordErr?wrongPasswordErr:''}
       </Alert>
      }
      <div className='inputBox'>
      <input type="email" placeholder='Email' onChange={(e)=> setEmail(e.target.value)}/>
      <input type="password" placeholder='Password' onChange={(e)=> setPassword(e.target.value)}/>
      <button className='btn' onClick={signUpBtnHandler}>Sign In</button>
      </div>
      <h4>Don't have an account? <span><Link to='/'>SignUp</Link></span></h4>
      </div>
    </div>
  )
}

export default LogIn
