import { useState, useEffect, useContext } from "react";
import { UserContext } from "./Root";
import { doc, getDoc, setDoc, addDoc, updateDoc, onSnapshot, arrayUnion, collection as coll, query, where, getDocs, documentId as docId } from "firebase/firestore";
import { db } from "./firebase";
import { Button } from '@mui/material';
import BasicTable from "./Leaderboard";
import { Stack } from "@mui/system";
import Leaderboard from "./Leaderboard";

export default function Home() {
  const user = useContext(UserContext);
  
  const handleCreateClick = async () => {
    try {
      const leaderboardColl = coll(db, "leaderboards");
      const leaderboardDocRef = doc(leaderboardColl);
      const leaderboardData = {
        nickname: 'My New Leaderboard',
        participants: [ user.id ],
        manager: user.id,
        id: leaderboardDocRef.id
      }
      
      await setDoc(leaderboardDocRef, leaderboardData);

      const userDocRef = doc(db, "users", user.id);
      const newLeaderboardsData = {
        ...user.leaderboards,
        [leaderboardDocRef.id]: {
          nickname: leaderboardData.nickname,
          pinned: false
        }
      };

      await updateDoc(userDocRef, { leaderboards: newLeaderboardsData });
    }
    catch (err) { console.log(err) }
  }

  return (
    <Stack
      direction="column"
      alignItems="center"
      justifyContent="space-between"
      spacing={1}
      style={{height: '100%', width: '100%'}}
    >
      {
        Object.keys(user?.leaderboards).length ?
        <Stack
          direction="column"
          alignItems="center"
          justifyContent="start"
          spacing={1}
          style={{ width: '100%', overflow: 'auto'}}
        >
          {
            Object.entries(user?.leaderboards)?.map(([id, meta]) => {
            return <Leaderboard key={id} leaderboardId={id} meta={meta} />
            })
          }
        </Stack> :
        <div style={{
          margin: 'auto 0 auto 0'
        }}>
          You haven't joined any leaderboards
        </div>
      }
      <Button
        variant="outlined"
        size="small"
        style={{marginTop: '0.75rem'}}
        onClick={handleCreateClick}
      >
        Create a leaderboard
      </Button>

    </Stack>
  )
}