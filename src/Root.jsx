import { useState, useEffect } from 'react'
import './Root.css'
import { Outlet, useNavigate } from "react-router-dom"
import { Stack } from '@mui/system';
import { auth } from "./firebase"
import { onAuthStateChanged } from 'firebase/auth';
import MenuBar from './MenuBar';

function Root() {
  const [authorized, setAuthorized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = (
      onAuthStateChanged(auth, (user) => {
        setAuthorized(Boolean(user));

        const state = { userId: user?.uid };
        if (user) navigate("/home", { state });
        else navigate("/signin", { state });
      })
    );

    return () => unsubscribe();
  }, [ authorized ]);
  
  return (
    <>
      <MenuBar />
      <Stack className="Root">
        
        <main className="Main">
          <Outlet />
        </main>
      </Stack>
    </>
  )
}

export default Root
