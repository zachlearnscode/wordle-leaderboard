import { useState } from "react";
import Collapse from '@mui/material/Collapse';

export default function Leaderboards() {
  const [collapsed, setCollapsed] = useState(true)
  return (
    <>
      <div onClick={(prev) => setCollapsed(!prev)}>LEADERBOARDS GO HERE</div>
      <Collapse in={!collapsed}>{icon}</Collapse>
    </>
  )
}