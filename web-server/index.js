import express from "express";
import { initializeApp as initializeFirebaseApp } from "firebase/app";
import { getDatabase, ref, get, update } from "firebase/database";
import { initializeApp as initializeAdminApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import bodyParser from "body-parser";
import cors from "cors";
import nodemailer from "nodemailer";
// Firebase Realtime Database Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDAGxRZC-StIXj5O75N4wTU7Xr0kNLXUfY",
  authDomain: "iotfirebase-cbc07.firebaseapp.com",
  databaseURL:
    "https://iotfirebase-cbc07-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "iotfirebase-cbc07",
  storageBucket: "iotfirebase-cbc07.firebasestorage.app",
  messagingSenderId: "955902559692",
  appId: "1:955902559692:web:1131917a463653c0828969",
  measurementId: "G-X2XNFH1K9H",
};

// Firebase Admin SDK Service Account (update with your credentials)
const serviceAccount = {
  type: "service_account",
  project_id: "iotfirebase-cbc07",
  private_key_id: "492b73ab63aca7457c19a85da8e9852beaa80097",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC4lnREBllSFB+S\nlTLkwDvlJUz0rBp+odR/dfC8iwe38Ovwk3sP0aPXQxp3o9Bf/D+JFNOeSjy/MlVT\nsI7GjYbQC4z4iqOMuEGW8vQ1VtgZgpN3S6CGMQk3bFHTkWZr7qA8YBg4Llx58dlX\nbWYW0YG6t3ZsmrxP6YQQ9LIIfMj/tuV+j/Nfvf3Kf+Pzfh2W9UvvK1YxAXhfpWfu\n4qoON4EcXu3TWn1ib0j48SGPK6kC0oB/LZ/AJxnHStHnsf24YNgULVn3DO3AZGhm\npzxu7NconScc21eaNwQx42FgNvTFP9ryFzAqNvQ5kpZlBplh06IR2D8HnDWQi6PF\nl/1z3cAjAgMBAAECggEAVuw2vO/WcQHb6k2LBVCHA/2gMxm2ckpnxEv4PPklfdec\na5Ivob/hbRWC6bMBBapGCxn9Gy2vVIPxzXK3kUWFJgRCcqnqoXIFJP2sxU9rfPvR\n0JwS8A44XlqKX9w5BHt/Bl9kGFSwpJYgeHyiVf17nz8Uq8jkA6ed0tQ/4CJPDqc2\nff/1tFyGz8Pc9KHqQn2IhFKjVROQKzAU7kq46qAIyUm2p/On0JfsvPDkU1qyDku2\n7SV/h9RmtMsnGbqP14XjW52A0jdL4rvojCQQsQ5a0G33RPGApOX7DnJR9Pt0w/3Q\n43SlSUneQHCtCBDrJKD4xbRpxEnb8BoPr9yaaO9QZQKBgQDzMQ9pXqz4TWoLDbw3\noHVp8Va++967FdetS4eC7vZu8/UkTZ0kPpY22LtK4bAxA3UaDV/YmeoC+cIoa35N\nwO9XWpkqIOhWoyZdqOSCHK3rqK3sn55r75EyQ3fcCs6KuWYlehHtgLTDnHjkyRcp\nWeJCHxTyIvBS5MDOvK74xBbqZwKBgQDCTz2GdJDeXctwKtxsP9JmAndTyHMfDGSK\nr17K6zxhejHjBj/Q3IuSIyZcoBPDipJGjhpvlEQHE+1sfwmY6emAR/YwrTfL+6Lo\niTB6VOh7TTpsENbT3VNlWlcxxjn3wJm71DVIc+M4xxUk5quvedRwJa9kbdJtRk48\nq6utgSoe5QKBgATiI1EWWZrS0yJNsE3dpv3tnrRPEnXnRmFwdtQmQESSGYYVGOa1\nawbG61vhlEwnqZ5QTnBnBs/we/mbzvl4ulWiuBikeIXk2Mxgq9YBBW0KAhQSUHgS\nY3QC7tE4VlVqy6ZNATcnsnmLFtJhR1nJOEXjoeQK15CSj1yXZVwRc/RZAoGBAJKf\nUrDb0tlI85NfdFbmzfAV2k9Jib0bD98quB/s4/I2T+CcvZjwYw1SIsdwL5m1Pe2p\nmz8pJTAmFFlzfx15HK6lHpvaiakN5/8KTp9w5MDuJLCZAFJ8x0pKolM33lQabKc0\nWUSj1gjpCQaAXXsbNnetqCzjRg8ZJz5W2EQjnFIVAoGAJoCzkI7dtCImAUsz4Qhb\nQAHIA06YEYTmsUfEbRVipgqJ/EJQjOaL5tGErm0K9xKNbQXvXwvJ7IHqY7rWaoe/\nHHwXpQuI5ps7hH3EPRjxskUPbpFrhbspRuP0/Fh5cSlMZfTj36MK6WSGBC8D3jXE\ngJXdyFOv5Kk07jy+Qvbmr00=\n-----END PRIVATE KEY-----\n",
  client_email:
    "firebase-adminsdk-zizyl@iotfirebase-cbc07.iam.gserviceaccount.com",
  client_id: "116642549945176437735",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-zizyl%40iotfirebase-cbc07.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
};
//Nodemailer configuration
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "nn5724735@gmail.com",
    pass: "ynpp esos qwjd mbtd",
  },
});
// Initialize Firebase Realtime Database
const app = initializeFirebaseApp(firebaseConfig);
const db = getDatabase(app);

// Initialize Firestore
initializeAdminApp({ credential: cert(serviceAccount) });
const firestore = getFirestore();

// Create an Express application
const server = express();
server.use(express.json());
server.use(bodyParser.json());
server.use(cors());
const addNotifications = async (message) => {
  try {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    const dateString = `${day}-${month}-${year}`;

    const docRef = firestore.collection("notifications").doc(dateString);

    const docSnapshot = await docRef.get();

    const hours = String(today.getHours()).padStart(2, "0");
    const minutes = String(today.getMinutes()).padStart(2, "0");
    const timeString = `${hours}:${minutes}`;

    if (!docSnapshot.exists) {
      await docRef.set({
        notifications: [message],
        timestamps: [timeString],
      });
      console.log(
        `Created Firestore document for ${dateString} with initial notification.`
      );
    } else {
      const existingData = docSnapshot.data();
      const existingNotifications = existingData.notifications || [];
      const existingTimestamps = existingData.timestamps || [];

      const updatedNotifications = [...existingNotifications, message];
      const updatedTimestamps = [...existingTimestamps, timeString];

      await docRef.update({
        notifications: updatedNotifications,
        timestamps: updatedTimestamps,
      });
      console.log(
        `Updated Firestore document for ${dateString} with new notification.`
      );
    }
  } catch (error) {
    console.error("Error adding notification:", error);
  }
};

const updateData = async () => {
  try {
    // Fetch temperature from /temp
    const tempSnapshot = await get(ref(db, "/temp"));
    const temp = tempSnapshot.val();

    // Fetch humidity from /humid
    const humidSnapshot = await get(ref(db, "/humid"));
    const humid = humidSnapshot.val();

    if (temp == null || humid == null) {
      console.error("Temperature or Humidity data not found!");
      return;
    }
    if (temp > 60) {
      addNotifications("Fire risk: Temperature is dangerously high!");
    }
    if (humid < 20) {
      addNotifications("Fire risk: Humidity is critically low!");
    }
    console.log(`Updated Realtime Database: Temp=${temp}, Humid=${humid}`);

    // Get today's date in "dd/mm/yyyy" format
    const today = new Date();
    const minute = today.getMinutes();
    if (minute % 30 == 0) {
      const day = String(today.getDate()).padStart(2, "0"); // Format day as 2 digits
      const month = String(today.getMonth() + 1).padStart(2, "0"); // Format month as 2 digits
      const year = today.getFullYear();
      const dateString = `${day}-${month}-${year}`;

      // Reference to the document for today's date in "sensor_logs"
      const docRef = firestore.collection("sensor_logs").doc(dateString);

      // Fetch the document for today
      const docSnapshot = await docRef.get();

      // If the document doesn't exist, create it with initial data
      if (!docSnapshot.exists) {
        await docRef.set({
          humidities: [humid],
          temperatures: [temp],
        });
        console.log(
          `Created Firestore document for ${dateString} with initial data.`
        );
      } else {
        // If the document exists, update the arrays
        const existingData = docSnapshot.data();
        const firestoreHumidities = existingData.humidities || [];
        const firestoreTemperatures = existingData.temperatures || [];

        // Append new data to the existing arrays
        const updatedFirestoreHumidities = [...firestoreHumidities, humid];
        const updatedFirestoreTemperatures = [...firestoreTemperatures, temp];

        await docRef.update({
          humidities: updatedFirestoreHumidities,
          temperatures: updatedFirestoreTemperatures,
        });
        console.log(`Updated Firestore document for ${dateString}.`);
      }
    }
  } catch (error) {
    console.error("Error updating data:", error);
  }
};

let lastCheckedTime = null;
let continuousHighTime = 0;

const monitorServoStatus = async () => {
  try {
    const snapshot = await get(ref(db, "/servo"));
    const servoValue = snapshot.val();

    if (servoValue > 0) {
      if (lastCheckedTime !== null) {
        const currentTime = Date.now();
        continuousHighTime += (currentTime - lastCheckedTime) / 1000;
      }
      lastCheckedTime = Date.now();

      if (continuousHighTime >= 1800) {
        addNotifications("The gas has been running for over 30 minutes.");
      }
    } else {
      continuousHighTime = 0;
      lastCheckedTime = null;
    }
  } catch (error) {
    console.error("Error checking servo status:", error);
  }
};

const startDataCollection = () => {
  const executeTask = () => updateData();
  setInterval(executeTask, 60 * 1000);
};

const sendEmail = async () => {
  const today = new Date();
  const formattedDate = `${today.getDate().toString().padStart(2, "0")}-${(
    today.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}-${today.getFullYear()}`;
  const doc = firestore.collection("notifications").doc(formattedDate);
  const snap = await doc.get();

  if (snap.exists) {
    const data = snap.data();
    const notifications = data.notifications || [];
    const timestamps = data.timestamps || [];

    let emailContent = "Here are the notifications for today:\n\n";
    notifications.forEach((notification, index) => {
      const timestamp = timestamps[index] ? ` (${timestamps[index]})` : "";
      emailContent += `- ${notification}${timestamp}\n`;
    });
    const snapshot = await firestore.collection("users").get();
    const emails = [];

    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data.email) {
        emails.push(data.email);
      }
    });
    for (const email of emails) {
      const mailOptions = {
        from: "nn5724735@gmail.com",
        to: email,
        subject: "Daily IoT System Notifications",
        text: emailContent,
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent successfully to ${email}`);
      } catch (error) {
        console.error(`Error sending email to ${email}:`, error);
      }
    }
  }
};

const checkTimeAndSendEmail = () => {
  setInterval(() => {
    const now = new Date();
    if (now.getHours() === 21) {
      sendEmail();
    }
  }, 60 * 60000);
};
server.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const userDoc = await firestore.collection("users").doc(email).get();
    if (userDoc.exists) {
      return res.status(400).json({ error: "User already exists" });
    }

    await firestore.collection("users").doc(email).set({
      username,
      email,
      password,
    });

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

server.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const userSnapshot = await firestore
      .collection("users")
      .where("username", "==", username)
      .get();

    if (userSnapshot.empty) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const user = userSnapshot.docs[0].data();

    if (user.password !== password) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

server.get("/sensor", async (req, res) => {
  const today = new Date();
  const formattedDate = `${today.getDate().toString().padStart(2, "0")}-${(
    today.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}-${today.getFullYear()}`;

  try {
    const docRef = firestore.collection("sensor_logs").doc(formattedDate);
    const docSnap = await docRef.get();

    if (docSnap.exists) {
      const data = docSnap.data();
      const response = {
        humidities: data.humidities || [],
        temperatures: data.temperatures || [],
      };
      res.status(200).json(response);
    } else {
      const response = { humidities: [], temperatures: [] };
      res.status(200).json({ response });
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

server.post("/notifications", async (req, res) => {
  const { date } = req.body;
  const formattedDate = date.split("-").reverse().join("-");
  try {
    const docRef = firestore.collection("notifications").doc(formattedDate);
    const docSnap = await docRef.get();

    if (docSnap.exists) {
      const data = docSnap.data();
      const response = {
        notifications: data.notifications || [],
        timestamps: data.timestamps || [],
      };
      res.status(200).json(response);
    } else {
      res.status(200).json({ notifications: [], timestamps: [] });
    }
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

setInterval(monitorServoStatus, 30000);
startDataCollection();
checkTimeAndSendEmail();
server.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
