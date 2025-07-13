import User from "../models/user.model.js";
import Profile from "../models/profile.model.js";
import crypto from "crypto";
import ConnectionRequest from "../models/connections.model.js";


import bcrypt from "bcrypt";
import PDFDocument from "pdfkit";
import fs from "fs";



const convertUserDataToPDF = async (userData) => {
  const doc = new PDFDocument();

  const outputPath = crypto.randomBytes(32).toString("hex") + ".pdf";
  const stream = fs.createWriteStream("uploads/" + outputPath);

  doc.pipe(stream);

  doc.image(`uploads/${userData.userId.profilePicture}`, {
    align: 'center', width: 100 })
  doc.fontSize(14).text(`Name: ${userData.userId.name}` );
  doc.fontSize(14).text(`Username: ${userData.userId.username}` );
  doc.fontSize(14).text(`Email: ${userData.userId.email}` );
  doc.fontSize(14).text(`Bio: ${userData.bio}` );
  doc.fontSize(14).text(`Current Position: ${userData.currentPost}` );

  doc.fontSize(14).text("Past Work: " )
  userData.pastWork.forEach((work) => {
    doc.fontSize(14).text(`Company: ${work.company}` );
    doc.fontSize(14).text(`Position: ${work.position}` );
    doc.fontSize(14).text(`Years: ${work.years}` );
  });

  doc.end();

  return outputPath;


}


export const register = async (req, res) => {
  
  try {

    const { name, email, password, username } = req.body;
     if (!name || !email || !password || !username)
      return res.status(400).json({ message: "All fields are required" })

     
     const user = await User.findOne({
         email
        });
     
        if (user) return res.status(400).json({ message: "User already exists" });


      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        username
      });

      await newUser.save();

      const profile = new Profile({ userId: newUser._id })

      await profile.save();

      return res.json({ message: "User Created"})

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }


}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const user = await User.findOne({
      email
    });

    if (!user) return res.status(404).json({ message: "User not exist" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = crypto.randomBytes(32).toString("hex");

    await User.updateOne({ _id: user._id }, { token });

    return res.json({ token: token })
    
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}


export const uploadProfilePicture = async (req, res) => {
  const { token } = req.body;

  try {
   
    const user = await User.findOne({ token: token });

    if (!user) {
       return res.status(404).json({ message: "User not found" });
    }

    user.profilePicture = req.file.filename;

    await user.save();

    return res.json({ message: "Profile picture uploaded " });


  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}




export const updateUserProfile = async (req, res) => {
 // const { token, name, email, username } = req.body;

  try {
    const {token, ...newUserData} = req.body;

    const user = await User.findOne({ token: token });

    if (!user) {
       return res.status(404).json({ message: "User not found" });
    }

    const { username, email} = newUserData;

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if ( existingUser ) {
      if (existingUser || String(existingUser._id) !== String(user._id)) {
      return res.status(400).json({ message: "Username already exists" });
    }
  }    

  Object.assign(user, newUserData);

    await user.save();

    return res.json({ message: "User updated" });

  }catch (error) {
    return res.status(500).json({ message: error.message });
  }

}



export const getUserAndProfile = async (req, res) => {
  try {
    console.log("Request Query Parameters:", req.query); 
    const { token } = req.query; 
    console.log("Received token:", token); 

    if (!token) { 
        return res.status(400).json({ message: "Token is required" });
    }

    const user = await User.findOne({ token: token });
    console.log("User found:", user); 

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // This line was likely causing the 500 error if 'user' was null
    const userProfile = await Profile.findOne({ userId: user._id })
      .populate("userId", "name email username profilePicture");
   // console.log("UserProfile found:", userProfile);

    return res.json(userProfile);

   

  } catch (error) {
    console.error("Error in getUserAndProfile:", error); 
    return res.status(500).json({ message: error.message });
  }
};


export const updateProfileData = async (req, res) => {

  try {
    const { token, ...newProfileData } = req.body;

 
   
    const userProfile = await User.findOne({ token: token });

    if (!userProfile) {
       return res.status(404).json({ message: "User not found" });
    }
    const profile_to_update = await Profile.findOne({ userId: userProfile._id });

    Object.assign(profile_to_update, newProfileData);

    await profile_to_update.save();

    return res.json({ message: "Profile updated" });


  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}



export const getAllUserProfile = async (req, res) => {
  try {
    const profiles = await Profile.find().populate("userId", "name email username profilePicture");

   
    return res.json({ profiles: profiles });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}


export const downloadProfile = async (req, res) => {

  const user_id = req.query.id;
  console.log(user_id)
 // return res.json({ "message": "not implemented"});

  const userProfile = await Profile.findOne({ userId: user_id })
  .populate("userId", "name email username profilePicture");

  let outputPath = await convertUserDataToPDF(userProfile);

  return res.json({ "message": outputPath });

}



export const sendConnectionRequest = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Token missing" });

    const user = await User.findOne({ token });
    if (!user) return res.status(404).json({ message: "User not found" });

    const { connectionId } = req.body;

    const connectionUser = await User.findById(connectionId);
    if (!connectionUser) return res.status(404).json({ message: "Connection user not found" });

    const existingRequest = await ConnectionRequest.findOne({
      userId: user._id,
      connectionId: connectionUser._id,
    });

    if (existingRequest) {
      return res.status(400).json({ message: "Request already sent" });
    }

    const request = new ConnectionRequest({
      userId: user._id,
      connectionId: connectionUser._id,
    });

    await request.save();

    return res.status(200).json({ message: "Connection request sent successfully" });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};



  export const getMyConnectionsRequest = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Token missing" });

    const user = await User.findOne({ token });
    if (!user) return res.status(404).json({ message: "User not found" });

    const connections = await ConnectionRequest.find({ userId: user._id })
      .populate("userId", "name email username profilePicture");

    return res.json({ connections });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};



    export const whatAreMyConnections = async (req, res) => {
      const { token } = req.query;

      try {
        const user = await User.findOne({ token });

        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        const connections = await ConnectionRequest.find({ connectionId: user._id })
        .populate("userId", "name email username profilePicture");

        return res.json( connections );

      } catch (error) {
        return res.status(500).json({ message: error.message });
      }
    }



    export const acceptConnectionRequest = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Token missing" });

    const user = await User.findOne({ token });
    if (!user) return res.status(404).json({ message: "User not found" });

    const { requestId, action_type } = req.body;

    const connection = await ConnectionRequest.findById(requestId);
    if (!connection) {
      return res.status(404).json({ message: "Connection request not found" });
    }

    if (action_type === "accept") {
      connection.status_accepted = true;
    } else {
      connection.status_accepted = false;
    }

    await connection.save();

    return res.json({ message: "Request updated successfully" });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
 




    export const getUserProfileAndUserBasedOnUsername = async(req, res) => {
       
      const { username } = req.query;

      try {

        const user = await User.findOne({
          username
        });

        if(!user) {
          return res.status(404).json({message: "User not found"})
        }
      

      const userProfile = await Profile.findOne({ userId: user._id}).populate('userId', 'name username email profilePicture');

      return res.json({ "profile": userProfile})

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

  }