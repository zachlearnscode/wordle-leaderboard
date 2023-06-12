import React from 'react'
import ReactDOM from 'react-dom/client'
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import Welcome from './Welcome';
import SignInForm from './SignInForm';
import Root from './Root'
import CircularProgress from '@mui/material/CircularProgress';
import './index.css'

const router = createMemoryRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { index: true, element: <CircularProgress /> },
      { path: "signin", element: <SignInForm /> },
      { path: "home", element: <div>Welcome Home</div> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
