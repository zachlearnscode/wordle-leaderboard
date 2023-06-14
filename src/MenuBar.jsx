import { useState } from "react";
import { signOut } from "@firebase/auth";

import { auth } from "./firebase";

import { AppBar, Toolbar, IconButton, Typography, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

export default function MenuBar() {
  const [anchorEl, setAnchorEl] = useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const handleMenuClick = ({ currentTarget: cT }) => setAnchorEl(cT);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogoutClick = async () => {
    await signOut(auth);
    handleMenuClose();
  }

  return (
    <>
      <AppBar
        elevation={0}
        position="static"
      >
        <Toolbar
          variant="dense"
          style={{justifyContent: 'space-between'}}
        >
          <Typography
            variant="h6"
            component="h1"
          >
            Wordle Leaderboard
          </Typography>
          <IconButton
            size="small"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleMenuClick}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={isMenuOpen}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>My Boards</MenuItem>
        <MenuItem onClick={handleMenuClose}>Account</MenuItem>
        <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
      </Menu>
    </>
  )
}