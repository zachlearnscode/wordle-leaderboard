import { useState, useEffect, createContext } from 'react'
import './Root.css'
import { Outlet, useNavigate } from "react-router-dom"
import { CircularProgress } from '@mui/material'
import { auth, db } from "./firebase"
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import MenuBar from './MenuBar';

export const UserContext = createContext(null);

function Root() {
  const [initializing, setInitializing] = useState(true);
  const [uid, setUid] = useState("");
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setInitializing(true);

      const hasAuth = Boolean(user);
      if (hasAuth) setUid(user.uid);
      else {
        setUid("");
        navigate("/signin");
        setInitializing(false);
      }
    });
  }, []);

  useEffect(() => {
    if (uid) {
      const userDocRef = doc(db, "users", uid);
      const unsubscribe = onSnapshot(userDocRef, (doc) => {
        setUser(doc.data());
        setInitializing(false);
      })

      navigate("/home");

      return () => unsubscribe()
    }
  }, [uid])

  const navigate = useNavigate();
  
  return (
    <div className="Root">
      <UserContext.Provider value={user}>
        <MenuBar />  
        <main>
          { initializing ? <CircularProgress /> : <Outlet /> }
        </main>
      </UserContext.Provider>
    </div>
  )
}

export default Root
