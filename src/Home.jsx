import { useState, useEffect } from "react";
import { useLocation, Outlet, useNavigate } from 'react-router-dom';
import { doc, getDoc, addDoc, updateDoc, arrayUnion, collection as coll, query, where, getDocs, documentId as docId } from "firebase/firestore";
import { db } from "./firebase";
import { TextField, Button } from '@mui/material'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from "@mui/material/Grid";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import CreateLeaderboardForm from "./CreateLeaderboardForm";

export default function Home() {
  const [user, setUser] = useState(null);
  const [leaderboards, setLeaderboards] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [nickname, setNickname] = useState("");
  const [isPublic, setIsPublic] = useState(false);

  const { state } = useLocation(), { userId } = state;
  
  useEffect(() => {
    const getUser = async () => {
      const userDocRef = doc(db, "users", userId);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        console.log(userDocSnap)
        setUser(userData);
      }
    }

    getUser();
  }, [])

  useEffect(() => {
    const getLeaderboards = async () => {
      if (user?.leaderboards.length) {
        const q = query(coll(db, "leaderboards"), where(docId(), "in", user.leaderboards));

        const leaderboardDocSnaps = await getDocs(q);

        const leaderboardsData = [];
        leaderboardDocSnaps
          .forEach((doc) => (
            leaderboardsData.push(doc.data()))
          );

        setLeaderboards(leaderboardsData);
      }
    }

    getLeaderboards()
  }, [user])

  const handleCreateClick = async () => {
    setLoading(true)

    try {
      const leaderboardDocRef = await addDoc(coll(db, "leaderboards"), {
        nickname: 'Zach test',
        public: false,
        // participants: [
        //   user.uid
        // ]
      })

      const { id: leaderboardId } = leaderboardDocRef;

      // console.log(user)
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        leaderboards: arrayUnion(leaderboardId)
      })

    } finally { setLoading(false) }
  }

  if (leaderboards.length) return <div>Leaderboard List</div>
  else return (
    <div style={{fontSize: '1rem'}}>
      You haven't joined any leaderboards.
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        margin: '1rem'
      }}>
        <Button variant="outlined" size="small" onClick={() => setOpen(true)}>Create a leaderboard</Button>
        {/* <Button variant="outlined" size="small">Find a leaderboard</Button> */}
      </div>
      {/* <form>
          <Grid
            container
            spacing={1.5}
          >
            <Grid
              item
              xs={12}
            >
              <TextField
                autoFocus
                label="Leaderboard Name"
                variant="outlined"
                size="small"
                fullWidth
              />
            </Grid>
          </Grid>
          <FormControl>
            <FormLabel id="demo-radio-buttons-group-label">Leaderboard Visibility</FormLabel>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue={isPublic}
              name="radio-buttons-group"
            >
              <FormControlLabel value={false} control={<Radio />} label="Private" />
              <FormControlLabel value={true} control={<Radio />} label="Public" />
            </RadioGroup>
          </FormControl>
        </form> */}
      {/* <Dialog
        fullScreen
        open={open}
        onClose={() => setOpen(false)}
      >
        <DialogTitle>Create New Leaderboard</DialogTitle>
        <DialogContent dividers={scroll === 'paper'}>
          <form>
            <Grid
              container
              spacing={1.5}
            >
              <Grid
                item
                xs={12}
              >
                <TextField
                  autoFocus
                  label="Leaderboard Name"
                  variant="outlined"
                  size="small"
                  fullWidth
                />
              </Grid>
            </Grid>
            <FormControl>
              <FormLabel id="demo-radio-buttons-group-label">Leaderboard Visibility</FormLabel>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue={isPublic}
                name="radio-buttons-group"
              >
                <FormControlLabel value={false} control={<Radio />} label="Private" />
                <FormControlLabel value={true} control={<Radio />} label="Public" />
              </RadioGroup>
            </FormControl>
          </form>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" size="small" onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            size="small"
            onClick={handleCreateClick}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog> */}
    </div>
  )
}