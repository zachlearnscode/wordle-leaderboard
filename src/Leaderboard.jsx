import { useState, useEffect } from 'react';

import { doc, getDoc, getDocs, collection, query, where } from "firebase/firestore";
import { db } from './firebase';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableFooter from '@mui/material/TableFooter';
import Paper from '@mui/material/Paper';
import { Typography, IconButton, Collapse, CircularProgress } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const rows = [
  {position: 1, user: 'Zach', numAttempts: 1},
  {position: 2, user: 'Zach', numAttempts: 1},
  {position: 3, user: 'Zach', numAttempts: 1},
  {position: 4, user: 'Zach', numAttempts: 1},
  {position: 5, user: 'Zach', numAttempts: 1},
  {position: 6, user: 'Zach', numAttempts: 1}
];

const getPosition = (position) => {
  switch (position) {
    case 1:
      return '🥇';
    case 2:
      return '🥈'
    case 3:
      return '🥉'
    default:
      return position
  }
}

export default function Leaderboard({ leaderboardId, meta, date }) {
  const [loading, setLoading] = useState(false);
  const [leaderboard, setLeaderboard] = useState(null);
  const [contest, setContest] = useState(null);
  const [expanded, setExpanded] = useState(meta.pinned);

  useEffect(() => {
    if (expanded) {
      const getLeaderboard = async () => {
        try {
          setLoading(true);
          
          const leaderboardDocRef = doc(db, `leaderboards/${leaderboardId}`);
          const leaderboardDocSnap = await getDoc(leaderboardDocRef);
          
          if (leaderboardDocSnap.exists) {
            setLeaderboard(leaderboardDocSnap.data());

            const contestDocRef = doc(leaderboardDocSnap.ref, `contests/${date}`);
            const contestDocSnap = await getDoc(contestDocRef);

            if (contestDocSnap.exists) setContest(contestDocSnap.data());
          }
        } finally { setLoading(false) }
      }

      getLeaderboard();     
    }
  }, [expanded])

  const handleClick = () => setExpanded((prev) => !prev);

  const rows = (() => {
    const finished = contest?.standings || [];
    const unfinished = leaderboard?.participants
      .filter((userId) => !finished.map(({ id }) => id).includes(userId)) || [];

      console.log([...finished, ...unfinished])
    return [...finished, ...unfinished];

  })();

  return (
    <Paper
      variant="outlined"
      style={{
        width: '100%',
        padding: '0.5rem',
        boxSizing: 'border-box'
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent:
          'space-between'
        }}
      >
        <Typography style={{fontWeight: 'bold'}}>
          {meta.nickname}
        </Typography>
        <IconButton
          aria-label={expanded ? 'Collapse leaderboard' : 'Expand leaderboard'}
          size='small'
          onClick={handleClick}
        >
          { expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </div>
      <Collapse in={expanded}>
        {
          loading
            ? <CircularProgress style={{margin: '1rem'}} />
            : <TableContainer component="div">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell style={{fontWeight: 'bold'}}>Pos.</TableCell>
                    <TableCell style={{fontWeight: 'bold'}}>User</TableCell>
                    <TableCell style={{fontWeight: 'bold'}}>Tries</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow
                      key={row.position}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell>{getPosition(row.position)}</TableCell>
                      <TableCell>{row.user}</TableCell>
                      <TableCell>{row.numAttempts}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <div style={{display: 'flex', gap: '0.25rem', text: 'lightgrey'}}>
                    <span>Date:</span>
                    <span>Solution:</span>
                  </div>
                </TableFooter>
              </Table>
            </TableContainer>
        }
      </Collapse>
    </Paper>
  );
}