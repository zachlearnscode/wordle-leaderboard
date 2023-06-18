import { useState } from 'react'
import { createUserWithEmailAndPassword as createUser } from "firebase/auth";
import { TextField, Button } from '@mui/material'
import Grid from "@mui/material/Grid";
import { db, auth } from './firebase'
import { doc, setDoc } from 'firebase/firestore';

export default function CreateAccountForm() {
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

    try {
      const { user } = await createUser(auth, email, password);
      await setDoc(doc(db, "users", user.uid), { email: user.email, leaderboards: {}, id: user.uid });
    } catch (err) { console.log(err) }
  }

  return (
    <form
      id="create_account"
      onSubmit={handleSubmit}
    >
      <h2>Create an account</h2>
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
        <TextField
          id="display_name"
          label="Display Name"
          variant="outlined"
          size="small"
          fullWidth
          onChange={handleChange}
        />
        <Button
          type="submit"
          form="create_account"
          variant="contained"
        >
          Create Account
        </Button>
      </div>
    </form>
  )
}