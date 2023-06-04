import { useState, useEffect } from 'react'
import logo from './logo.svg'
import './App.css'
import MyChild from './Child'

function App() {
  const [count, setCount] = useState(null)
  useEffect(() => {
    async function testFn() {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts/1')
      const postData = await response.json();

      setTimeout(() =>setCount(postData), 300)
    }

    testFn()
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Hello Vite + React!</p>
        <p>
          count is: {count?.title}
        </p>
        <p>
          Edit <code>App.jsx</code> and save to test HMR updates.
        </p>
        <p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          {' | '}
          <a
            className="App-link"
            href="https://vitejs.dev/guide/features.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            Vite Docs
          </a>
        </p>
      </header>
      <MyChild />
    </div>
  )
}

export default App
