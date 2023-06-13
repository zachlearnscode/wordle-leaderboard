import { useState, useEffect } from "react";
import { useLocation, Outlet, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection as coll, query, where, getDocs, documentId as docId } from "firebase/firestore";
import { db } from "./firebase";
import { TextField, Button } from '@mui/material'

export default function Home() {
  const [user, setUser] = useState(null);
  const [leaderboards, setLeaderboards] = useState([]);

  const { state } = useLocation(), { userId } = state;
  
  useEffect(() => {
    const getUser = async () => {
      const userDocRef = doc(db, "users", userId);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        setUser(userData);
      }
    }

    getUser();
  }, [])

  useEffect(() => {
    const getLeaderboards = async () => {
      if (user?.leaderboards) {
        const q = query(coll(db, "leaderboards"), where(docId(), "in", user.leaderboards));

        const leaderboardDocSnaps = await getDocs(q);

        const leaderboardsData = [];
        leaderboardDocSnaps.forEach((doc) => leaderboardsData.push(doc.data()));

        setLeaderboards(leaderboardsData);
      }
    }

    getLeaderboards()
  }, [user])

  if (leaderboards.length) return <div>Leaderboard List</div>
  else return (
    <div>
      You haven't joined any leaderboards. If you want to join an existing leaderboard, its manager must email you an invitation. Otherwise, create a new leaderboard below.
      <div style={{
        display: 'flex',
        'flex-direction': 'column',
        gap: '1rem',
        margin: '1rem'
      }}>
        <Button variant="outlined" size="small">Create a leaderboard</Button>
        {/* <Button variant="outlined" size="small">Find a leaderboard</Button> */}
      </div>
    </div>
  )
}