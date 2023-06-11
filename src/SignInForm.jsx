import { useState } from 'react'
import { signInWithEmailAndPassword as signIn } from "firebase/auth";
import { TextField, Button, Link } from '@mui/material'
import Grid from "@mui/material/Grid";
import { auth } from './firebase'

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleChange = ({ target }) => {
    const { id: inputId, value } = target;

    if (inputId === 'email') setEmail(value);
    if (inputId === 'password') setPassword(value);
  }

  const handleSubmit = async (evt) => {
    evt.preventDefault();

    try {
      const userCredential = (
        await signIn(auth, email, password)
      );

      console.log(userCredential)
    } catch (err) { console.log(err) }
  }

  return (
    <div>
      <h2>Sign in to your account</h2>
      <form
        id="sign_in"
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
              type="password"
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
            <Button
              type="submit"
              form="sign_in"
              variant="contained"
            >
              Sign In
            </Button>
          </Grid>
          <Grid
            item
            xs={12}
          >
            <Link>
              Create Account
            </Link>
          </Grid>
        </Grid>
      </form>
    </div>
  )
}