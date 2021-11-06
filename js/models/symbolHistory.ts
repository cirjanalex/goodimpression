export class SymbolHistory {

  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;

  constructor(date: Date, open: number, high: number, low: number, close: number) {
    this.date = date;
    this.open = open;
    this.high = high;
    this.low = low;
    this.close = close;
  }

  static parse(data: any): SymbolHistory {
    return new SymbolHistory(new Date(data[0]), data[1], data[2], data[3], data[4]);
  }
}