import { useState } from "react";
import SignInForm from "./SignInForm";
import CreateAccountForm from "./CreateAccountForm";

export default function Welcome() {
  const [activeForm, setActiveForm] = useState(0);

  if (activeForm === 1) return <CreateAccountForm />
  else if (activeForm === 0) return <SignInForm/>

}