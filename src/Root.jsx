import { useState, useEffect, createContext } from 'react'
import './Root.css'
import { Outlet, useNavigate } from "react-router-dom"
import { Stack } from '@mui/system';
import { auth, db } from "./firebase"
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import MenuBar from './MenuBar';

export const UserContext = createContext(null);

function Root() {
  const [uid, setUid] = useState("");
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    console.log('in onAuthState effect')
    const unsubscribe = (
      onAuthStateChanged(auth, (user) => {
        const isAuthorized = Boolean(user);
        isAuthorized ? setUid(user.uid) : setUid("");
      })
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const getUser = () => {
      let unsubscribe = () => {};

      if (uid) {
        unsubscribe = onSnapshot(
          doc(db, "users", uid),
          (doc) => {
            const userData = doc.data();
            if (userData) {
              setUser(userData);
              navigate("/home");
            }
          }
        )
      }

      navigate("/signin");
      return unsubscribe;
    }

    const unsubscribe = getUser();
    return () => unsubscribe();    
  }, [uid])

  const navigate = useNavigate();
  
  return (
    <div className="Root">
      <UserContext.Provider value={user}>
        <MenuBar />  
        <main>
          <Outlet />
        </main>
      </UserContext.Provider>
    </div>
  )
}

export default Root
