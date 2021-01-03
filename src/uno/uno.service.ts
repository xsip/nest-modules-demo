import { Injectable } from '@nestjs/common';
import {
  CardColors,
  DeckCard,
  SpecialCards,
  totalColors,
} from './uno.interfaces';

@Injectable()
export class UnoService {
  getNewDeck() {
    const deck = [];
    for (let i = 0; i < totalColors; i++) {
      deck.push(this.getCard(true, SpecialCards.Reverse, i));
      deck.push(this.getCard(true, SpecialCards.TakeTwo, i));
      deck.push(this.getCard(true, SpecialCards.Skip, i));
      deck.push(this.getCard(true, SpecialCards.Reverse, i));
      deck.push(this.getCard(true, SpecialCards.TakeTwo, i));
      deck.push(this.getCard(true, SpecialCards.Skip, i));
      const cardZero = this.getCard(false, undefined, i, 0);
      deck.push(cardZero);
      const cardOne = this.getCard(false, undefined, i, 1);
      deck.push(cardOne);
      deck.push(cardOne);
      const cardTwo = this.getCard(false, undefined, i, 2);
      deck.push(cardTwo);
      deck.push(cardTwo);
      const cardThree = this.getCard(false, undefined, i, 3);
      deck.push(cardThree);
      deck.push(cardThree);
      const cardFour = this.getCard(false, undefined, i, 4);
      deck.push(cardFour);
      deck.push(cardFour);
      const cardFive = this.getCard(false, undefined, i, 5);
      deck.push(cardFive);
      deck.push(cardFive);
      const cardSix = this.getCard(false, undefined, i, 6);
      deck.push(cardSix);
      deck.push(cardSix);
      const cardSeven = this.getCard(false, undefined, i, 7);
      deck.push(cardSeven);
      deck.push(cardSeven);
      const cardEight = this.getCard(false, undefined, i, 8);
      deck.push(cardEight);
      deck.push(cardEight);
      const cardNine = this.getCard(false, undefined, i, 9);
      deck.push(cardNine);
      deck.push(cardNine);
    }
    for (let ii = 0; ii < 4; ii++) {
      const cardWild = this.getCard(true, SpecialCards.Wild);
      const cardWildTakeFour = this.getCard(true, SpecialCards.Wild);
      deck.push(cardWild);
      deck.push(cardWildTakeFour);
    }
    return this.shuffle(deck);
  }

  getCard(
    isSpecialCard?: boolean,
    specialCardName?: SpecialCards,
    color?: number,
    num?: number,
  ): DeckCard {
    return {
      isSpecialCard,
      specialCardName,
      color,
      num,
    };
  }

  shuffle(a: DeckCard[]) {
    let j;
    let x;
    for (let i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = a[i];
      a[i] = a[j];
      a[j] = x;
    }
    return a;
  }
}
