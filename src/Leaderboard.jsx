import { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableFooter from '@mui/material/TableFooter';
import Paper from '@mui/material/Paper';
import { Typography, IconButton, Collapse } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

function createData(name, calories, fat) {
  return { name, calories, fat };
}

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

export default function Leaderboard() {
  const [ expanded, setExpanded ] = useState(false);

  const handleClick = () => setExpanded((prev) => !prev);

  return (
    <Paper variant="outlined" style={{width: '100%', padding: '0.5rem', boxSizing: 'border-box'}}>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <Typography style={{fontWeight: 'bold'}}>Leaderboard Title</Typography>
        <IconButton
          aria-label={expanded ? 'Collapse leaderboard' : 'Expand leaderboard'}
          size='small'
          onClick={handleClick}
        >
          { expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </div>
      <Collapse in={expanded}>
        <TableContainer component="div">
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
          </Table>
        </TableContainer>
      </Collapse>
    </Paper>
  );
}