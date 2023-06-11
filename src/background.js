import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

const localStorage = chrome.storage.local;
const runtime = chrome.runtime;

let puzzleRequestInProgress = false;
chrome.webRequest.onCompleted.addListener(
  async ({ url }) => {
    const receivedPuzzleDate = (() => {
      const dateStart = url.lastIndexOf('/') + 1,
            dateEnd = url.lastIndexOf('.');

      return url.slice(dateStart, dateEnd);
    })();

    const storedPuzzleDate = await localStorage.get(["date"]);

    if (storedPuzzleDate.date !== receivedPuzzleDate) {
      if (puzzleRequestInProgress === false) {
        try {
          puzzleRequestInProgress = true;

          const response = await fetch(url);
          const { id, print_date: date, solution } = await response.json();

          await localStorage.set({ id, date, solution });
        }
        catch (err) { console.log('There was an error fetching today\'s Wordle puzzle data', err); }
        finally { puzzleRequestInProgress = false; }
      }
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