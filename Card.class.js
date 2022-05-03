class Card {
  constructor(value, suit) {
    if(value.value) { // allow for copy constructor
      suit = value.suit;
      value = value.value;
    }
    if(value == 'J' || value == 11) {
      [this.value, this.disp] = [11, 'J'];
    } else if(value == 'Q' || value == 12) {
      [this.value, this.disp] = [12, 'Q'];
    } else if(value == 'K' || value == 13) {
      [this.value, this.disp] = [13, 'K'];
    } else if(value == 'A' || value == 1) {
      [this.value, this.disp] = [1, 'A'];
    } else if(parseInt(value, 10) && value > 1 && value <= 10){
      this.value = this.disp = value;
    } else {
      throw "Invalid value: " + value;
    }
    if(suit == "spades" || suit == "&spades;" || suit == '♠') {
      this.suit = '&spades;';
    } else if(suit == "clubs" || suit == "&clubs;" || suit == '♣') {
      this.suit = '&clubs;';
    } else if(suit == "diamonds" || suit == "&diams;" || suit == '♦') {
      this.suit = '&diams;';
    } else if(suit == "hearts" || suit == "&hearts;" || suit == '♥') {
      this.suit = '&hearts;';
    } else {
      throw "Invalid suit: " + suit;
    }
    this.isBlk = (this.suit == '&spades;' || this.suit == '&clubs;');
  }
  getValue() {
    return this.value;
  }
  getSuit() {
    return this.suit;
  }
  isBlack() {
    return this.isBlk;
  }
  toString() {
    return '<span style="color:' + (this.isBlk ? "black" : "red") + '">'
            + this.disp + this.suit + "</span>";
  }
}
