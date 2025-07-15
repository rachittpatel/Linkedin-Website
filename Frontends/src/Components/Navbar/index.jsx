import React, { useEffect } from 'react';
import styles from './styles.module.css';
import { useRouter } from 'next/router';

import { useSelector, useDispatch } from 'react-redux';
import { reset, setTokenIsNotThere } from '@/config/redux/reducer/authReducer';
import { getAllUsers } from '@/config/redux/action/authAction';



export default function NavBarComponent() {
  const router = useRouter();
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const allUsers = authState.all_users;
  const allProfilesFetched = authState.all_profiles_fetched;
  const isLoadingAllUsers = authState.isLoading;


  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(reset());
    dispatch(setTokenIsNotThere());
    router.push("/login");
  };


return (
  <div className={styles.container}>
    <nav className={styles.navBar}>
      <h1 style={{ cursor: "pointer" }} onClick={() => router.push("/")}>
        <img style={{height: "70px", width: "130px", display: "flex"}} src=" https://tse2.mm.bing.net/th/id/OIP.umYnpmYCA0mfrgoetiaoqwHaEK?pid=Api&P=0&h=220" alt="" />
      </h1>

      <div className={styles.navBarOptionContainer}>
        {authState.profileFetched && authState.user?.userId?.name ? (
          <div style={{ display: "flex", gap: "2.2rem", alignItems: "center"}}>
            {/* <p>Hey, {authState.user?.userId?.name}</p> */}
            <p onClick={() => {
              router.push("/profile")
            }}
              style={{ fontWeight: "bold", fontSize: "20px", cursor: "pointer" }}
             
            >
              Profile
            </p>
            <p
              style={{ fontWeight: "bold", fontSize: "20px", cursor: "pointer" }}
              onClick={handleLogout}
            >
              Logout
            </p>
          </div>
        ) : (
          !authState.isTokenThere && (
            <div
              onClick={() => router.push("/login")}
              className={styles.buttonJoin}
            >
              <p>Be a part</p>
            </div>
          )
        )}
      </div>
    </nav>
  </div>
);
}


