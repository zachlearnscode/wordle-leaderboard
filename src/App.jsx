import { useState, useEffect } from 'react'
import logo from './logo.svg'
import './App.css'
import MyChild from './Child'
import { auth } from './firebase'
import { createUserWithEmailAndPassword } from "firebase/auth";
import { TextField } from '@mui/material'
import { Button } from "@mui/material"
import Grid from "@mui/material/Grid";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");

  const handleChange = ({ target }) => {
    const { id: inputId, value } = target;

    if (inputId === 'email') setEmail(value);
    if (inputId === 'password') setPassword(value);
    if (inputId === 'display_name') setDisplayName(value);
  }

  const handleSubmit = async (evt) => {
    evt.preventDefault();

    const createUser = async (auth, email, password) => {
      const userCredential = (
        await createUserWithEmailAndPassword(auth, email, password)
      );

      console.log(userCredential)
    }

    await createUser(auth, email, password);
  }


  return (
    <div className="App">
      <h2>Create an account</h2>
      <form
        id="create_account"
        onSubmit={handleSubmit}
      >
        <Grid
          container
          spacing={1.5}
        >
          <Grid
            item
            xs={12}
          >
            <TextField
              id="email"
              label="Email"
              variant="outlined"
              size="small"
              onChange={handleChange}
            />
          </Grid>
          <Grid
            item
            xs={12}
          >
            <TextField
              id="password"
              label="Password"
              variant="outlined"
              size="small"
              onChange={handleChange}
            />
          </Grid>
          <Grid
            item
            xs={12}
          >
            <TextField
              id="display_name"
              label="Display Name"
              variant="outlined"
              size="small"
              onChange={handleChange}
            />
          </Grid>
          <Grid
            item
            xs={12}
          >
            <Button
              type="submit"
              form="create_account"
              variant="contained"
            >
              Create Account
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  )
}

export default App
