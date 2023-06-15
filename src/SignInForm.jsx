import { useState } from 'react'
import { signInWithEmailAndPassword as signIn } from "firebase/auth";
import { TextField, Button, Link } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom';
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
    <form
      id="sign_in"
      onSubmit={handleSubmit}
    >
      <h2>Sign in to your account</h2>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}
      >
        <TextField
          id="email"
          label="Email"
          variant="outlined"
          size="small"
          fullWidth
          onChange={handleChange}
        />
        <TextField
          id="password"
          type="password"
          label="Password"
          variant="outlined"
          size="small"
          fullWidth
          onChange={handleChange}
        />
        <Button
          type="submit"
          form="sign_in"
          variant="contained"
        >
          Sign In
        </Button>
        <Link
          component={RouterLink}
          to="/signup"
        >
          Create an Account
        </Link>
      </div>
    </form>
  )
}