import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { useRouter } from "next/router";
import UserLayout from "@/layout/userLayout";
import React from "react";
import { BASE_URL } from "@/config";



const inter = Inter({subsets: ["latin"]});


export default function Home() {

  const router = useRouter();
 
  return (
    <UserLayout>
      
   <div className={styles.container}>

    <div className={styles.mainContainer}>

      <div className={styles.mainContainer_left}>
       <p>Connect with friends without Exaggeration </p>

      <p> A True social media platform, with stories no bulfs !</p>

      <div onClick={() => {
        router.push("/login")
      }} className={styles.buttonJoin}>
        <p>Join Now</p>
      </div>

      </div>

      <div className={styles.mainContainer_right}> 
        <img src="/images/th.jpg" alt="" />
      </div>
    </div>
   </div>
     
    </UserLayout>
  );
}
