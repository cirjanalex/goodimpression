import { Symbols } from "./symbols";

declare type SymbolString = keyof typeof Symbols;
export class Order {
  date: Date;
  symbol: Symbols;
  side: string;
  quantity: number;
  price: number;


  constructor(date: Date, symbol: string, side: string, quantity: number, price: number) {
    this.date = date;
    this.symbol = Symbols[symbol as SymbolString];
    this.side = side;
    this.quantity = quantity;
    this.price = price;
  }

  static parse(d: any): Order {
    var date = new Date(d.date+'+0000');
    return new Order(date, d.symbol, d.side, d.quantity, d.price);
  }
}