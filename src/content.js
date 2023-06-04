const boardSelector = { selector: 'Board-module_board_', partial: true },
      rowSelector = { selector: 'Row-module_row', partial: true },
      tileSelector = { selector: 'Tile-module_tile', partial: true },
      overlaySelector = { selector: 'Modal-module_modalOverlay', partial: true },
      menuRightSelector = { selector: 'AppHeader-module_menuRight', partial: true },
      menuRightIconSelector = { selector: 'AppHeader-module_icon', partial: true };

const queryNodes = (selectorObj) => {
  const { selector, partial } = selectorObj;

  const requestedNodes = (()=> {
    if (!partial) return document.querySelectorAll(selector);
    else return document.querySelectorAll(`div[class^='${selector}']`);
  })();

  // Update partial selector
  if (requestedNodes.length) {
    const { classList } = requestedNodes[0];
    const fullSelector = classList.value.split(' ')
      ?.find((className) => className.includes(selector));

    if (fullSelector) {
      selectorObj.partial = false;
      selectorObj.selector = `.${fullSelector}`
    }
  }

  return requestedNodes;
}

(() => {
  // Poll while waiting for board to mount
  const interval = setInterval(async () => {
    const boardNode = queryNodes(boardSelector)[0];

    if (boardNode) {
      clearInterval(interval);

      const gameState = (
        evaluateGameState()
          .then((state) => {
            switch (state) {
              case "win": {
                console.log('win');
                sendGameResultMessage(state)
                break;
              }
              case "loss":
                console.log('loser');
                break;
              case "ongoing": {
                console.log("ongoing")
                const rows = queryNodes(rowSelector);
                observeRows(rows);
                break;
              }
            }
          })
        );

      gameState.catch((err) => console.log('ABORT!: ', err));
    }
  }, 250)

  const evaluateGameState = () => {
    const tiles = Array.from(queryNodes(tileSelector));

    const tilesByRow = [];
    for (let i = 0; i < tiles.length; i += 5) {
      tilesByRow.push(tiles.slice(i, i + 5));
    }
    
    const evaluateState = new Promise((resolve, reject) => {
      // Using setTimeout to accomodate 400ms animation for tile entrance
      setTimeout(() => {
        let gameState;

        for (const row of tilesByRow) {
          const rowIdx = tilesByRow.indexOf(row);
          const tileData = row.map(({ dataset }) => dataset);

          if (tileData.every(({ state }) => state === 'empty')) gameState = 'ongoing';
          if (tileData.every(({ state }) => state === 'correct')) gameState = 'win';
          if (rowIdx === 5 && !tileData.some(({ state }) => state === 'empty')) gameState = 'loss';

          if (gameState) break;
        }

        if (gameState) resolve(gameState);
        else reject(new Error('There was an error evaulating game state.'));
      }, 750)
    })
    
    return evaluateState;
  };

  const observeRows = (rowNodes) => {
    const observers = [],
          config = { subtree: true, attributeFilter: ['data-state']};

    rowNodes.forEach((rowNode, i) => {
      const handleMutation = (records, observer) => {
        // Disconnect observers from completed rows
        const observerIdx = observers.indexOf(observer);
        observers.forEach((observer, i) => {
          if (i < observerIdx) observer.disconnect();
        })

        // Evaluate game state for each mutation that's received
        records.forEach((record) => {
          const { target, type, attributeName } = record;
          if (type === 'attributes' && attributeName === 'data-state') {
            const { dataset } = target;
            // tbd and empty states received before user commits guess.
            // We only care about post-guess tile states: correct, present, absent
            if (!['tbd', 'empty'].includes(dataset.state)) {
              evaluateGameState()
                .then(sendGameResultMessage) //TODO: When game is won or lost, send message to background.js, where it will post to leaderboards
                .catch((err) => console.log('Error caught in handleMutation: ', err))
            }
          }
        })
      };
      
      observers.push(new MutationObserver(handleMutation));
      observers[i].observe(rowNode, config);
    })
  }

  const sendGameResultMessage = async (gameState) => {
    const response = await chrome.runtime.sendMessage({ gameState });

    console.log(response)
  }
})();