import React, { useState } from 'react'
import {Alert} from '@mui/material'
import { getAuth, createUserWithEmailAndPassword,sendEmailVerification, updateProfile } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { getDatabase, ref, set } from "firebase/database"
import { Link } from 'react-router-dom';


const Registration = () => {
  const auth = getAuth();
  const db = getDatabase();
  const navigate = useNavigate();
  const [name,setName]=useState('')
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [nameErr,setNameErr]=useState('')
  const [emailErr,setEmailErr]=useState('')
  const [passwordErr,setPasswordErr]=useState('')
  const [lengthErr,setLengthErr]=useState('')
  const [userErr,setUserErr]=useState('')
  const [open,setOpen] = useState(false)
//   const [time,setTime]=useState('')

//  useEffect(()=>{
//   function addZero(i) {
//     if (i < 10) {i = "0" + i}
//     return i;
//   }

//   setTime(`${addZero(new Date().getDate())}/${addZero(new Date().getMonth()+1)}/${new Date().getFullYear()}`)
//  },[])


  const signUpBtnHandler =()=>{
    if(!name){
      setNameErr("Please enter your name!")
    }
    else if(!email){
      setEmailErr("Please enter your email!")
      setNameErr('')
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
      createUserWithEmailAndPassword(auth,email,password,name).then((users)=>{
        sendEmailVerification(auth.currentUser)
        .then(() => {
          updateProfile(auth.currentUser, {
            displayName: name,
          }).then(() => {
            set(ref(db, 'users/'+auth.currentUser.uid), {
              username: name,
              email: email,
            //   date: time,
            });
            navigate('/login')
          }).catch((error) => {
           console.log(error)
          });
         
        });
      }).catch((error)=>{
        const errorMessage = error.message;
        if(errorMessage.includes('email')){
          setUserErr("Email Already in Use Please Try Another!")
          setOpen(true)
        }
      })
    }
  }

  


  return (
      <div className='Registration-part'>
      <div className='box'>
      <h1>Gallery App SignUp</h1>
      <h3>{nameErr?nameErr:emailErr?emailErr:passwordErr?passwordErr:lengthErr?lengthErr:''}</h3>
      {open &&
        <Alert 
        className='alert'
        variant="filled"
        severity="warning">
         {userErr}
       </Alert>
      }
      <div className='inputBox'>
      <input type="text" placeholder='Name' onChange={(e)=> setName(e.target.value)}/>
      <input type="email" placeholder='Email' onChange={(e)=> setEmail(e.target.value)}/>
      <input type="password" placeholder='Password' onChange={(e)=> setPassword(e.target.value)}/>
      <button className='btn' onClick={signUpBtnHandler}>Sign up</button>
      </div>
      <h4>Already have an account? <span><Link to='/login'>Login</Link></span></h4>
      </div>
    </div>
  )
}

export default Registration
