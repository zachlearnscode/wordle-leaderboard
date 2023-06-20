import { useState, useEffect, useContext } from "react";
import { UserContext } from "./Root";
import { doc, getDoc, addDoc, setDoc, updateDoc, collection as coll } from "firebase/firestore";
import { db } from "./firebase";
import { Button } from '@mui/material';
import { Stack } from "@mui/system";
import Leaderboard from "./Leaderboard";

let date = new Date().toJSON();
date = date.slice(0, date.indexOf('T'));

export default function Home() {
  const user = useContext(UserContext);
  
  const handleCreateClick = async () => {
    try {
      const leaderboardData = {
        nickname: 'My New Leaderboard',
        participants: [ user.ref ],
        manager: user.data.id
      }
      
      const leaderboardDocRef = await addDoc(coll(db, "leaderboards"), leaderboardData);

      await updateDoc(user.ref, {
        leaderboards: [
          ...user.data.leaderboards,
          leaderboardDocRef
        ]
      });
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
        Object.keys(user?.data?.leaderboards).length ?
        <Stack
          direction="column"
          alignItems="center"
          justifyContent="start"
          spacing={1}
          style={{ width: '100%', overflow: 'auto'}}
        >
          {
            Object.entries(user?.data?.leaderboards)?.map(([id, meta]) => {
            return (
              <Leaderboard
                key={id}
                leaderboardId={id}
                meta={meta}
                date={date}
              />)
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