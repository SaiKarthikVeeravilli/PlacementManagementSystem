import React from 'react'
import { useState } from 'react'
import api from '../services/axios'
import './Signup.css'
import {Link} from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

function Signup() {
  const [user,setUser]=useState({
    name:'',
    email:'',
    password:''
  })
  const [errors,setErrors]=useState({
    name:'',
    email:'',
    password:''
  })
  const navigate=useNavigate();
  const SubmitHandler=async(e)=>{
    e.preventDefault();
    setErrors({
      name:'',
      email:'',password:''
    })
    try{
      const resp=await api.post('/signup',user);
      if(resp.data.success){
        alert('Registered SuccessFully');
        navigate('/');
        setUser({
          name:'',email:'',password:''
        })

      }
    }
   catch (err) {
  const message = err.response?.data?.message;

  if (typeof message === "object") {
    setErrors(message);
  } else {
    alert(message);
  }
}
  }
  return (
    <div className="formdiv">
  <form onSubmit={SubmitHandler} className="form">

    <h1>Signup</h1>

    <label>Name</label>
    <input
      type="text"
      value={user.name}
      onChange={(e) =>{
        setUser({ ...user, name: e.target.value })
        setErrors({ ...errors, name: "" })
      }
      }
   
    />
    <p className='error'>{errors.name}</p>

    <label>Email</label>
    <input
      type="email"
      value={user.email}
      onChange={(e) =>{

        setUser({ ...user, email: e.target.value })
         setErrors({ ...errors, email: "" });
      }
      }
    />
    <p className='error'>{errors.email}</p>

    <label>Password</label>
    <input
      type="password"
      value={user.password}
      onChange={(e) =>{

        setUser({ ...user, password: e.target.value })
         setErrors({ ...errors, password: "" });
      }
      }
    />
    <p className='error'>{errors.password}</p>

    <button type="submit" className='submitbtn'>
      Signup
    </button>
    <p className="loginText">
    Already have an account?
</p>

<Link to="/login">
    <button type="button" className="loginbtn">
        Login
    </button>
</Link>
    
  </form>
    
</div>
  )
}

export default Signup
