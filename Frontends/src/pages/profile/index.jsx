import React, { useState, useEffect } from 'react'
import UserLayout from '@/layout/userLayout'
import DashboardLayout from "@/layout/DashboardLayout"
import { getAboutUser } from '@/config/redux/action/authAction'

import styles from "./index.module.css"
import { BASE_URL, clientServer } from '@/config'
import { useDispatch, useSelector } from 'react-redux'
import { getAllPosts } from '@/config/redux/action/postAction'

export default function ProfilePage() {

  const authState = useSelector((state) => state.auth)


  const postState = useSelector((state) => state.post);

  const [userProfile, setUserProfile] = useState({})

  const [userPosts, setUserPosts] = useState([])



  const dispatch = useDispatch();

  //const [isModalOpen, setIsModalOpen] = useState(false);
  const [openModalType, setOpenModalType] = useState(null);  // can be "education" or "work"


  const [inputData, setInputData] = useState({ company: '', position: '', years: '' });
  const [input, setInput] = useState({ school: '', degree: '', fieldOfStudy: '' });

  const handleWorkInputChange = (e) => {

    const { name, value } = e.target;

    setInput({ ...input, [name]: value })

  }

  const handleWorkInputChange1 = (e) => {

    const { name, value } = e.target;
    setInputData({ ...inputData, [name]: value })


  }

  useEffect(() => {
    dispatch(getAboutUser({ token: localStorage.getItem("token") }))
    dispatch(getAllPosts())
  }, [])



  useEffect(() => {
    if (authState.user !== undefined) {
      setUserProfile(authState.user);

      let posts = postState.posts.filter(
        (post) => post.userId.username === authState.user.userId.username
      );
      setUserPosts(posts);
    }
  }, [authState.user, postState.posts]);



  const updateProfilePicture = async (file) => {

    const formData = new FormData();
    formData.append("profilePicture", file);
    formData.append("token", localStorage.getItem("token"));

    const response = clientServer.post("/upload_profile_picture", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    dispatch(getAboutUser({ token: localStorage.getItem("token") }));

  }


  const updateProfileData = async () => {
    const request = await clientServer.post("/user_update", {
      token: localStorage.getItem("token"),
      name: userProfile.userId.name,
    })

    const response = await clientServer.post("/update_profile_data", {
      token: localStorage.getItem("token"),
      bio: userProfile.bio,
      currentPost: userProfile.currentPost,
      pastWork: userProfile.pastWork,
      education: userProfile.education
    });

    dispatch(getAboutUser({ token: localStorage.getItem("token") }))

  }





  return (
    <UserLayout>
      <DashboardLayout>
        {authState.user && userProfile.userId &&
          <div className={styles.container}>
            <div className={styles.backDropContainer}>

              <label htmlFor='profilePictureUpload' className={styles.backdrop__overlay}>
                <p>
                  Edit
                </p>
              </label>
              <input onChange={(e) => {
                updateProfilePicture(e.target.files[0])
              }} hidden type="file" id='profilePictureUpload' />
              <img src={`${BASE_URL}/${userProfile.userId.profilePicture}`} alt='backdrop' />
            </div>


            <div className={styles.profileContainer_details}>

              <div style={{ display: "flex", gap: "0.7rem" }}>

                <div style={{ flex: "0.8" }}>

                  <div style={{ display: "flex", width: "fit-content", alignItems: "center", gap: "1.2rem" }}>
                    <input className={styles.nameEdit} type="text" value={userProfile.userId.name} onChange={(e) => {
                      setUserProfile({ ...userProfile, userId: { ...userProfile.userId, name: e.target.value } })

                    }} />
                    <p style={{ color: "gray" }}>@{userProfile.userId.username}</p>

                  </div>






                  <div>
                    <textarea
                      value={userProfile.bio}
                      onChange={(e) => {
                        setUserProfile({ ...userProfile, bio: e.target.value });
                      }}
                      rows={Math.max(3, Math.ceil(userProfile.bio.length / 80))}
                      style={{ width: "100%" }}
                    />


                  </div>



                </div>


                <div style={{ flex: "0.2" }}>
                  <h1>Recent Activity</h1>
                  {userPosts.map((post) => {
                    return (
                      <div key={post._id} className={styles.postCard}>
                        <div className={styles.card}>
                          <div className={styles.card_profileContainer}>

                            {post.media !== "" ? <img src={`${BASE_URL}/${post.media}`} alt='' />
                              :
                              <div style={{ width: "3.4rem", height: "3.4rem" }}> </div>
                            }


                          </div>

                          <p>{post.body}</p>


                        </div>



                      </div>
                    )
                  })}

                </div>

              </div>

            </div>

            <div className="workHistory">
              <h4>Education History</h4>

              <div className={styles.workHistoryContainer}>
                {(userProfile.education || []).map((edu, index) => {
                  return (
                    <div key={index} className={styles.workHistoryCard}>
                      <p style={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: "0.8rem" }}>
                        {edu.school} - {edu.degree}
                      </p>
                      <p>{edu.fieldOfStudy}</p>
                    </div>
                  );
                })}
                <button className={styles.addWorkButton} onClick={() => setOpenModalType("education")}>
                  Add Education
                </button>
              </div>
            </div>




            <div className="workHistory">
              <h4>Work History</h4>


              <div className={styles.workHistoryContainer}>
                {
                  userProfile.pastWork.map((work, index) => {
                    return (
                      <div key={index} className={styles.workHistoryCard}>
                        <p style={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: "0.8rem" }}>{work.company} - {work.position}</p>
                        <p>{work.years}+</p>
                      </div>
                    )
                  })
                }

                <button className={styles.addWorkButton} onClick={() => setOpenModalType("work")}>Add Work</button>
              </div>

            </div>

            {userProfile != authState.user &&

              <div onClick={() => {
                updateProfileData()

              }} className={styles.updateProfileBtn}>
                Update Profile
              </div>

            }




          </div>
        }



        {openModalType === "education" && (
          <div onClick={() => setOpenModalType(null)} className={styles.commentsContainer}>
            <div onClick={(e) => e.stopPropagation()} className={styles.allCommentsContainer}>
              <input onChange={handleWorkInputChange} name='school' type="text" placeholder="Enter School" className={styles.inputField} />
              <input onChange={handleWorkInputChange} name='degree' type="text" placeholder="Enter Degree" className={styles.inputField} />
              <input onChange={handleWorkInputChange} name='fieldOfStudy' type="text" placeholder="Enter Field of Study" className={styles.inputField} />
              <div onClick={() => {
                setUserProfile({
                  ...userProfile,
                  education: [...(userProfile.education || []), input]
                });

                setOpenModalType(null);
              }} className={styles.updateProfileBtn}>
                Add Education
              </div>
            </div>
          </div>
        )}

        {openModalType === "work" && (
          <div onClick={() => setOpenModalType(null)} className={styles.commentsContainer}>
            <div onClick={(e) => e.stopPropagation()} className={styles.allCommentsContainer}>
              <input onChange={handleWorkInputChange1} name='company' type="text" placeholder="Enter Company" className={styles.inputField} />
              <input onChange={handleWorkInputChange1} name='position' type="text" placeholder="Enter Position" className={styles.inputField} />
              <input onChange={handleWorkInputChange1} name='years' type="number" placeholder="Years" className={styles.inputField} />
              <div onClick={() => {
                setUserProfile({ ...userProfile, pastWork: [...userProfile.pastWork, inputData] });
                setOpenModalType(null);
              }} className={styles.updateProfileBtn}>
                Add Work
              </div>
            </div>
          </div>
        )}

      </DashboardLayout>

    </UserLayout>
  )
}
