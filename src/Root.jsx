import { useState, useEffect } from 'react'
import './Root.css'
import { Outlet, useNavigate } from "react-router-dom"
import { Stack } from '@mui/system';
import Welcome from './Welcome';
import Home from './Home';
import CircularProgress from '@mui/material/CircularProgress';
import { auth } from "./firebase"
import { onAuthStateChanged } from 'firebase/auth';

function Root() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  onAuthStateChanged(auth, setUser)
  useEffect(() => {
    if (user) navigate("/home");
    else navigate("/signin");
  }, [user]);
  
  return (
    <Stack className="Root">
      <h1>Wordle Leaderboard</h1>
      <main className="Main">
        <Outlet />
      </main>
      {/* {
        (() => {
          if (loading) return <CircularProgress />
          else if (user) return <Home user={user} />
          else return <Welcome />
        })()
      } */}
    </Stack>
  )
}

export default Root
