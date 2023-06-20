import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { query, collection, where, getDocs, setDoc, doc } from "firebase/firestore";
import { db } from "./firebase"

const localStorage = chrome.storage.local;
const runtime = chrome.runtime;

chrome.webRequest.onCompleted.addListener(
  async ({ url }) => {
    const dateInUrl = (() => {
      const dateStart = url.lastIndexOf('/') + 1,
            dateEnd = url.lastIndexOf('.');

      return url.slice(dateStart, dateEnd);
    })();

    const puzzlesRef = collection(db, "puzzles");
    const q = query(puzzlesRef, where("date", "==", dateInUrl));

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      try {
        const response = await fetch(url);
        const { id, solution, print_date: date, days_since_launch: puzzleNumber } = await response.json();

        await setDoc(doc(db, "puzzles", String(id)), { solution, date, puzzleNumber });
      }
      catch (err) { console.log('There was an error fetching today\'s Wordle puzzle data', err); }
    }
  },
  { urls: ["https://www.nytimes.com/svc/wordle/v2/*"] }
);

runtime.onMessage.addListener(
  async (request, sender, sendReponse) => {
    // if (request.gameState) {
    //   console.log(request.gameState) // TODO: send results to Firebase DB
    //   sendReponse('received that shit.s')
    // }

    if (request === 'getUser') {
      const user = await localStorage.get(["user"]);
      unsubscribeFromAuthObserver = onAuthStateChanged(auth, authObserverCallback)
      console.log(user)
    }
  }
)