import UserLayout from "@/layout/userLayout";
import React, {useEffect, useState} from "react"
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import styles from "./style.module.css";
import { useDispatch } from "react-redux";
import { loginUser, registerUser } from "@/config/redux/action/authAction";
import { emptyMessage } from "@/config/redux/reducer/authReducer";



function LoginComponent() {



const authState = useSelector((state) => state.auth)

const router = useRouter();

const dispath = useDispatch();

const [userLoginMethod, setUserLoginMethod] = useState(false);

const [email, setEmailAddress] = useState("");
const [password, setPassword] = useState("");
const [username, setUsername] = useState("");
const [name, setName] = useState("");


useEffect(() => {
  if (authState.loggedIn) {
    router.push("/dashboard")
  }
}, [authState.loggedIn])

useEffect(() => {
  dispath(emptyMessage())
}, [userLoginMethod])

const handleRegister = () => {
  console.log("Registering user");
  dispath(registerUser({username, password, email, name}))
}

const handleLogin = () => {
  console.log("Logging in user");
  dispath(loginUser({email, password}))
}




  return (
    <UserLayout>


      <div className={styles.container}>

   <div className={styles.cardContainer}>

    
      <div className={styles.cardContainer_left}>

      <p className={styles.cardleft_heading}> {userLoginMethod ? "Sign In" : "Sign Up" }</p>
      <p style={{color: authState.isError ? "red" : "green"}}> {authState.message.message} </p>
 
      <div className={styles.inputContainers}>

        {!userLoginMethod && <div className={styles.inputRow}>
          <input onChange={(e) => setUsername(e.target.value)} type="text" placeholder="Username" className={styles.inputField} />
          <input onChange={(e) => setName(e.target.value)} type="text" placeholder="Name" className={styles.inputField} />

         </div> }
         
            <input onChange={(e) => setEmailAddress(e.target.value)} type="text" placeholder="Email" className={styles.inputField} />
            <input onChange={(e) => setPassword(e.target.value)} type="text" placeholder="Password" className={styles.inputField} />
         
         
        <div onClick={ () => {
          if (userLoginMethod) {
           handleLogin();
          }
          else {
           handleRegister();
          }
        }} className={styles.buttonWithOutline}>
        <p>{userLoginMethod ? "Sign In" : "Sign Up" }</p> 
        </div>
      

      </div>

      

      </div>

      <div className={styles.cardContainer_right}>
      
          {userLoginMethod ? <p>Don't Have an Account</p>: 
        <p>Already Have an Account?</p>}
        <div onClick={ () => {
          setUserLoginMethod(!userLoginMethod);
        }} style={{color: "black", textAlign: "center"}} className={styles.buttonWithOutline}>
        <p>{userLoginMethod ? "Sign Up" : "Sign In" }</p> 
     

      </div>
    
    </div>  
     </div>
</div>


    </UserLayout>
   
  )
}
export default LoginComponent;