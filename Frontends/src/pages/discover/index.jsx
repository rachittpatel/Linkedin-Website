import React, {useEffect} from 'react'
import UserLayout from '@/layout/userLayout'
import DashboardLayout from '@/layout/DashboardLayout'
import { getAllPosts } from '@/config/redux/action/postAction'
import { getAllUsers } from '@/config/redux/action/authAction'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { BASE_URL } from '@/config'
import styles from "./index.module.css"


export default function Discoverpage() {

 const authState = useSelector((state) => state.auth)

 const dispatch = useDispatch();

   useEffect(() => {
      if (!authState.all_profiles_fetched)  {
           dispatch(getAllUsers());
      }
   }, [])

   const router = useRouter();


  return (
   
     <UserLayout>
   
        <DashboardLayout>
          <div>
            <h1>Discover</h1>

            <div className={styles.allUserProfile}>

              {authState.all_profiles_fetched && authState.all_users.map((user) => {
                return (
                  <div onClick={() => {
                      router.push(`/view_profile/${user.userId.username}`)

                  }} key={user._id} className={styles.userCard}>
                    <img className={styles.userCard_image} src={`${BASE_URL}/${user.userId.profilePicture}`} alt="/profile" />
                    <div>
                    <h1>{user.userId.name}</h1>
                    <p>@{user.userId.username}</p>
                    </div>

                  </div>
                )
              })}

            </div>
          
          </div>

        </DashboardLayout>


    </UserLayout>
  )
}
