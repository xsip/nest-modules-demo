import { ApiProperty } from '@nestjs/swagger';

export const totalDeckCards = 108;

export const totalColors = 4;
export const skipCardsPerColor = 2;
export const drawTwoCardsPerColor = 2;
export const reverseCardsPerColor = 2;
export const zerosPerColor = 1;
export const onesPerColor = 2;
export const twosPerColor = 2;
export const threesPerColor = 2;
export const foursPerColor = 2;
export const fivesPerColor = 2;
export const sixesPerColor = 2;
export const sevensPerColor = 2;
export const eightsPerColor = 2;
export const ninesPerColor = 2;

export const wildCards = 4;
export const wildDrawFourCards = 4;

export enum CardColors {
  Red,
  Yellow,
  Blue,
  Green,
}
export enum SpecialCards {
  TakeTwo = 'TAKE_TWO',
  Skip = 'SKIP',
  Reverse = 'Reverse',
  WildTakeFour = 'WILD_TAKE_FOUR',
  Wild = 'WILD',
}
export class DeckCard {
  @ApiProperty()
  color?: number;
  @ApiProperty()
  num?: number;
  @ApiProperty()
  isSpecialCard?: boolean;
  @ApiProperty()
  specialCardName?: SpecialCards;
}
