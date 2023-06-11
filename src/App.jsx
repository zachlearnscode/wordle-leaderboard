import { useState, useEffect } from 'react'
import './App.css'
import Welcome from './Welcome';
import Home from './Home';
import CircularProgress from '@mui/material/CircularProgress';
import { auth } from "./firebase"
import { onAuthStateChanged } from 'firebase/auth';

function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  onAuthStateChanged(auth, (user) => {
    setUser(user);
    setLoading(false);
  });
  
  return (
    <div className="App">
      {
        (() => {
          if (loading) return <CircularProgress />
          else if (user) return <Home user={user} />
          else return <Welcome />
        })()
      }
    </div>
  )
}

export default App
