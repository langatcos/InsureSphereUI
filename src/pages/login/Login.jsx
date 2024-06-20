import { Button } from '@mui/material'
import React, { useState } from 'react'
import './login.scss'
import { useNavigate } from 'react-router-dom'
const Login = () => {
    const [error, setError] = useState(false);
    const [blank,setBlank]=useState(false)
    const [username,setUsername]=useState("")
    const [password,setPassword]=useState("")
    const navigate=useNavigate()
    const handlelogin=(e)=>{
        e.preventDefault()
        
        if(username===""|| password ===""){
            setBlank(true)
            window.alert("Username or Password cannot be blank")
        }
        else{
            setBlank(false)
            navigate("/")
        }
        
    }

  return (
    <div className='login'>
        <div className="loginpage" onSubmit={handlelogin}>
            <form className='loginform'>
                <input type="text" placeholder='Username' onChange={(e)=>setUsername(e.target.value)} />
                <input type="passsword" placeholder='Password' onChange={(e)=>setPassword(e.target.value)}/>
                <Button type="submit">Submit</Button>
                {error &&<span className='wrongcredentials'>Wrong Credentials</span>}
                {blank &&<span className='wrongcredentials'>Enter Username and Passsword</span>}

            </form>
        </div>
      
    </div>
  )
}

export default Login
