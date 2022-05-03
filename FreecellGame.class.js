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
    let src = this.getPile(srcPile.type);
    let dest = this.getPile(destPile.type);
    let pile =  dest[destPile.index]; 
    let lastCard = pile[pile.length -1];

    if (this.isValidMove(srcPile, destPile)   
      && srcPile.cardIndex < src.length
      && this.isBuild(srcPile.index, srcPile.cardIndex)
      && FreecellGame._isStackable(
        lastCard,
        src[srcPile.index][srcPile.cardIndex])) {
      for (let i = srcPile.cardIndex; i > src.length; i++) {
        dest[destPile.index].push(src[srcPile.index][i]);
      }
      src[srcPile.index].splice(srcPile.cardIndex);
    }

  }



  // attempt to stick the given card on either a foundation or an open
  // by finding whatever foundation pile is valid, or the first open pile.
  // return true if success, false if no automatic move available
  // mutates the game state if a move is available.
  attemptAutoMove(srcPile) {

  }

  // return index of first valid foundation destination for the given card,
  // or anything else if there is no valid foundation destination
  getValidFoundation(srcPile) {

  }
  // return index of first empty open pile
  // or anything else if no empty open pile
  getFirstAvailableOpen() {
    return 0;
  }

  // return true if in the given cascade pile, starting from given index, there is a valid "build"
  isBuild(pileIdx, cardIdx) {
    let src = this.getPile("cascade");
    let sublist = src[pileIdx].slice(cardIdx);
    return this.validBuild(sublist);
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
    if (srcPile.index < 0 || srcPile.index >= this.getPile(srcPile.type).length) {
      throw "Invalid source pile number!";
    } else if (destPile.index < 0 || destPile.index >= this.getPile(destPile.type).length) {
      throw "Invalid destination pile number";
    } else {
      return true;
    }
  }

  validBuild(sublist) {
    if (sublist.length > 1) {
      for (let i = sublist.length - 1; i > 1; i--) {
        if (!FreecellGame._isStackable(sublist[i - 1], sublist[i])) {
          return false;
        }
      }
      return true;
    } else {
      return true;
    }

  }

  getPile(type) {
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
