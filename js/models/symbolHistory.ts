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
    return new SymbolHistory(new Date(data[0]), Number(data[1]), Number(data[2]), Number(data[3]), Number(data[4]));
  }
}