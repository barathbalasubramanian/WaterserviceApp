
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// firestore database
// import { getFirestore ,collection , doc , setDoc } from "firebase/firestore";

// Realtime database
import { getDatabase, ref, set } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCQfXwEcY6NP1Jai395oQ84xr-4WlNB7wQ",
  authDomain: "water-service-management.firebaseapp.com",
  databaseURL : "https://water-service-management-default-rtdb.firebaseio.com",
  projectId: "water-service-management",
  storageBucket: "water-service-management.appspot.com",
  messagingSenderId: "848275900890",
  appId: "1:848275900890:web:0342b6f00897d3e35e98e3",
  measurementId: "G-Y2ZM1WLWE0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();

// Realtime database
export const db = getDatabase(app);
export const dbref = ref(getDatabase());

// firestore database
// export const db = getFirestore(app)

// export const insert_message = (data) => {
//   try
//   {
      
//       let date = Date.now()
//       setDoc(doc(db, "message", date.toString()), data)    
//       document.querySelector('.input').value = ''        
//   }
//   catch(err)
//   {   
//       alert(err)
//       console.log(err)
//   }
// }