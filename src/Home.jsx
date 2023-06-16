import { useState, useEffect, useContext } from "react";
import { UserContext } from "./Root";
import { doc, getDoc, addDoc, updateDoc, onSnapshot, arrayUnion, collection as coll, query, where, getDocs, documentId as docId } from "firebase/firestore";
import { db } from "./firebase";
import { Button } from '@mui/material';
import BasicTable from "./Leaderboard";
import { Stack } from "@mui/system";
import Leaderboard from "./Leaderboard";

export default function Home() {
  const user = useContext(UserContext);
  const [leaderboards, setLeaderboards] = useState([""]);
  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
    const getLeaderboards = () => {
        const leaderboardsColl = coll(db, "leaderboards");
        const whereClause = where(docId(), "in", user.leaderboards);
        const q = query(leaderboardsColl, whereClause);

        const unsubscribe = onSnapshot(q, (qSnapshot) => {
          const leaderboardsData = [];

          qSnapshot.forEach((doc) => (
              leaderboardsData.push(doc.data()))
            );
  
          setLeaderboards(leaderboardsData);
        });
  
        return unsubscribe;
    }

    const unsubscribe = getLeaderboards();
    return () => unsubscribe();
  }, [user])

  const handleCreateClick = async () => {
    try {
      setLoading(true);

      const leaderboardColl = coll(db, "leaderboards");
      const leaderboardData = {
        nickname: 'My New Leaderboard',
        participants: [ user.id ],
        manager: user.id
      }
      
      const { id: leaderboardDocId } = await addDoc(leaderboardColl, leaderboardData)

      const userDoc = doc(db, "users", user.id);
      const userLeaderboardsData = {
        leaderboards: arrayUnion(leaderboardDocId)
      };

      await updateDoc(userDoc, userLeaderboardsData);
    }
    catch (err) { console.log(err) }
    finally { setLoading(false) }
  }


  return (
    <Stack
      direction="column"
      alignItems="center"
      justifyContent="space-between"
      spacing={1}
      style={{maxHeight: '100%', width: '100%'}}
    >
      <Stack
        direction="column"
        alignItems="center"
        spacing={1}
        style={{ width: '100%', overflow: 'auto'}}
      >
        {
          leaderboards.map(({ nickname }, i) => <Leaderboard key={i}/>)
        }
      </Stack>
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