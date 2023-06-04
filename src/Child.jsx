import { useState, useEffect } from 'react'
import { db } from './firebase'
import { doc, getDoc } from "firebase/firestore" 

function MyChild() {
  const [test, setTest] = useState(null)

  useEffect(() => {
    const testFn = async () => {
      const docRef = doc(db, "leaderboards", "SooJK0tw2eGMLsYTY7Dq");
      const docSnap = await getDoc(docRef);

      console.log(docSnap)
    }

    testFn()
  }, [])

  return (
    <div>Hello from Child.jsx</div>
  )
}

export default MyChild