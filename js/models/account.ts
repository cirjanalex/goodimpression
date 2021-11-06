export class AccountSymbol {
  name!: string;
  quantity!: number;
}

export class Account {
  symbols!: Array<AccountSymbol>;
  name!:string;
  ordersCount!:number;
  estimatedValue!:number;
}