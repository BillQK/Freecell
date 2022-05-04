class FreecellGame {
  constructor(numOpen, numCascade) {
    if (numCascade < 4 || !numCascade === Number) {
      throw "Invalid number of cascade piles";
    }
    if (numOpen < 1 || !numOpen === Number) {
      throw "Invalid number of open piles";
    }
    //TODO: validate inputs
    this.foundation = [];
    for (let k = 0; k < 4; k++) {
      this.foundation.push([]);
    }
    this.open = [];
    for (let k = 0; k < numOpen; k++) {
      this.open.push([]);
    }
    var deck = getDeck();
    this.cascade = [];
    for (let k = 0; k < numCascade; k++) {
      this.cascade.push([]);
    }
    for (let i = 0; i < deck.length; i++) {
      this.cascade[i % numCascade].push(deck[i]);
    }


  }

  getNumCascade() {
    return this.cascade.length;
  }
  getNumOpen() {
    return this.open.length;
  }
  getFoundation() {
    return this.foundation.map(p => p.slice());
  }
  getOpen() {
    return this.open.map(p => p.slice());
  }
  getCascade() {
    return this.cascade.map(p => p.slice());
  }

  // execute a move from srcPile, e.g. {type:"cascade", index: 0, cardIndex, 5}
  // to destPile, e.g. {type:"open", index: 3}
  // mutates the game state.
  executeMove(srcPile, destPile) {
    this._addCard(destPile, srcPile);
    this._removeCard(srcPile);

  }

  _removeCard(srcPile) {
    let src = null;
    let srcSeq = null;
    switch (srcPile.type) {
      case "cascade":
        src = this._getPile("cascade")[srcPile.index];
        srcSeq = src.slice(srcPile.cardIndex);
        for (let card in srcSeq) {
          src.pop();
        }
        break;
      case "open":
        src = this._getPile("open")[srcPile.index];
        srcSeq = new Array(src[0]);
        src.pop();
        break;
      case "foundation":
        return;
      default:
        return;
    }
  }

  _addCard(destPile, srcPile) {
    let dest = null;
    let srcCards = this._getPile(srcPile.type)[srcPile.index].slice(srcPile.cardIndex);
    switch (destPile.type) {
      case "cascade":
        dest = this._getPile("cascade")[destPile.index];
        for (let i = 0; i < srcCards.length; i++) {
          dest.push(new Card(srcCards[i]));
        }
        break;
      case "open":
        dest = this._getPile("open")[destPile.index];
        dest.push(srcCards[0]);
        break;
      case "foundation":
        dest = this._getPile("foundation")[destPile.index];
        dest.push(srcCards[0]);
        break;
      default:
        break;
    }
  }



  // attempt to stick the given card on either a foundation or an open
  // by finding whatever foundation pile is valid, or the first open pile.
  // return true if success, false if no automatic move available
  // mutates the game state if a move is available.
  attemptAutoMove(srcPile) {
    let src = null;
    let cPile = null;
    switch (srcPile.type) {
      case "cascade":
        cPile = this.cascade[srcPile.index];
        src = cPile[srcPile.cardIndex];
        break;
      case "open":
        cPile = this.open[srcPile.index];
        src = cPile[0];
        break;
      case "foundation":
        cPile = this.foundation[srcPile.index];
        src = cPile[srcPile.cardIndex];
        break;
      default:
        break;
    }
    let foundationIndex = this.getValidFoundation(srcPile);
    if (foundationIndex !== null) {
      this.foundation[foundationIndex].push(src);
      cPile.pop();
      return true;
    }
    let openIndex = this.getFirstAvailableOpen();
    if (openIndex !== null) {
      if (srcPile.type != "open") {
        this.open[openIndex].push(src);
        cPile.pop();
        return true;
      }
    }
    return false;
  }

  // return index of first valid foundation destination for the given card,
  // or anything else if there is no valid foundation destination
  getValidFoundation(srcPile) {
    let src = null;
    // get src Card
    switch (srcPile.type) {
      case "cascade":
        src = this._getPile("cascade")[srcPile.index][srcPile.cardIndex];
        break;
      case "open":
        src = this._getPile("open")[0];
        break;
      case "foundation":
        return null;
      default:
        return null;
    }
    // return index of first valid foundation 
    let fPile = null;
    for (let i = 0; i < this.foundation.length; i++) {
      fPile = this._getPile("foundation")[i];
      if (fPile.length != 0) {
        if (fPile[fPile.length - 1].value == src.value - 1 && fPile[fPile.length - 1].getSuit() == src.getSuit()) {
          return i;
        }
      } else {
        if (src.value == 1) {
          return i;
        }
      }

    }
    return null;

  }
  // return index of first empty open pile
  // or anything else if no empty open pile
  getFirstAvailableOpen() {
    for (let a = 0; a < this.getNumOpen(); a++) {
      let aPile = this.getOpen();
      if (aPile[a].length == 0) {
        return a;
      }
    }
    return null;
  }

  // return true if in the given cascade pile, starting from given index, there is a valid "build"
  isBuild(pileIdx, cardIdx) {
    let src = this._getPile("cascade");
    let sublist = src[pileIdx].slice(cardIdx);
    return this._validBuild(sublist);
  }

  // return true if the move from srcPile to destPile would be valid, false otherwise.
  // does NOT mutate the model.
  isValidMove(srcPile, destPile) {
    if (!srcPile || !destPile
      || (srcPile.type == destPile.type && srcPile.index == destPile.index)
      || srcPile.type == "foundation") {
      return false;
    }

    // all the rules for moves in freecell:
    let src = null;
    let sSeq = null;
    // Get
    switch (srcPile.type) {
      case "cascade":
        src = this.getCascade()[srcPile.index];
        sSeq = src.slice(srcPile.cardIndex);
        if (!this.isBuild(srcPile.index, srcPile.cardIndex)) {
          return false;
        }
        break;
      case "open":
        src = this.getOpen()[srcPile.index];
        sSeq = new Array(src[0]);
        break;
      case "foundation":
        return false;
      default:
        return false;
    }

    if (sSeq.length > this._numCanMove(destPile)) {
      return false;
    }

    // Add
    let dest = null;
    switch (destPile.type) {
      case "cascade":
        dest = this.getCascade()[destPile.index];
        if (dest.length != 0) {
          let lastCard = dest[dest.length - 1];
          let firstCard = sSeq[0];
          if (!FreecellGame._isStackable(firstCard, lastCard)) {
            return false;
          }
        }
        break;
      case "open":
        dest = this.getOpen()[destPile.index];
        if (dest.length != 0) {
          return false;
        }
        if (sSeq.length != 1) {
          return false;
        }
        break;
      case "foundation":
        if (destPile.index == -1) {
          return false;
        }
        dest = this.getFoundation()[destPile.index];
        if (sSeq.length != 1) {
          return false;
        }
        if (dest.length > 13) {
          return false;
        }
        break;
      default:
        return false;
    }
    return true;
  }

  _validBuild(sublist) {
    let lastCard = sublist[0]
    if (sublist.length > 1) {
      for (let i = 1; i < sublist.length; i++) {
        if (!FreecellGame._isStackable(sublist[i], lastCard)) {
          return false;
        }
        lastCard = sublist[i];

      }
      return true;
    } else {
      return true;
    }

  }

  // return the actual list, not a copy
  _getPile(type) {
    switch (type) {
      case "foundation":
        return this.foundation;
      case "cascade":
        return this.cascade;
      case "open":
        return this.open;
      default:
        throw "Invalid type";
    }
  }

  // suggested private methods
  _numCanMove(destPileIndex) {
    // computer number of open piles, number of empty cascade piles
    // apply the formula from Assignment 3
    // computer number of open piles, number of empty cascade piles
    // apply the formula from Assignment 3
    let n = 0;
    let k = 0;
    for (let i = 0; i < this.getNumOpen(); i++) {
      let pile = this.getOpen()[i];
      if (pile.length == 0) {
        n += 1;
      }
    }
    for (let i = 0; i < this.getNumCascade(); i++) {
      let pile = this.getCascade()[i];
      if (pile.length == 0) {
        k += 1;
      }
    }
    if (destPileIndex.type == "cascade") {
      if (this.getCascade()[destPileIndex.index].length == 0) {
        if (n != 0) {
          n -= 1;
        }
      }
    }
    return (n + 1) * Math.pow(2, k);

    // why do we need destPileIndex? if the destination cascade pile is empty, it doesn't count as an empty cascade in the formula.

  }

  // is overCard stackable on top of underCard, according to solitaire red-black rules
  static _isStackable(underCard, overCard) {
    return overCard.value == underCard.value + 1 && overCard.isBlack() != underCard.isBlack();
  }
}

// generate and return a shuffled deck (array) of Cards.
function getDeck() {
  let deck = [];
  let suits = ["spades", "clubs", "diamonds", "hearts"];
  for (let v = 13; v >= 1; v--) {
    for (let s of suits) {
      deck.push(new Card(v, s));
    }
  }
  shuffle(deck);    // comment out this line to not shuffle
  return deck;
}

// shuffle an array: mutate the given array to put its values in random order
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    // Pick a remaining element...
    let j = Math.floor(Math.random() * (i + 1));
    // And swap it with the current element.
    [array[i], array[j]] = [array[j], array[i]];
  }
}
