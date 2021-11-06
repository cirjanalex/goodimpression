import axios from "axios";
import { Price } from "./models/price";
import { SymbolHistory } from "./models/symbolHistory";
import { Account } from "./models/account"

export class Api {
    apiUrl: string;

    constructor(apiKey: any, apiUrl: any) {
        axios.defaults.headers.common['key'] = apiKey;
        this.apiUrl = apiUrl;
    }

    //{symbol:'BTC', interval:'1M'}
    async symbolHistory(params: any): Promise<Array<SymbolHistory>> {
        return this.get('/trading/symbolHistory', { params })
            .then((response: any) => response.data.map((d: any) => SymbolHistory.parse(d)));
    }

    // {symbol:'BTC'}
    async price(params: any): Promise<Price> {
        return this.get('/trading/price', { params })
            .then((response) => response.data as Price);
    }

    async prices(): Promise<Array<Price>> {
        return this.get('/trading/prices')
            .then((response) => response.data as Array<Price>);
    }

    async accountHistory() {
        return this.get('/trading/accountHistory')
            .then((response) => response.data);
    }

    async account(): Promise<Account> {
        return this.get('/trading/account')
            .then((response) => response.data as Account);
    }

    async orderHistory() {
        return this.get('/trading/orderHistory')
            .then((response) => response.data);
    }

    async reset(params: any) {
        return this.post('/trading/reset', params)
            .then((response) => response.data);
    }

    async order(params: any) {
        return this.post('/trading/order', params)
            .then((response) => response.data);
    }

    async get(path: string, data: any = undefined) {
        return axios
            .get(`${this.apiUrl}${path}`, data)
            .then((response) => response)
            .catch((error) => {
                console.log(error.response);
                return Promise.resolve({ data: "Error! Check the browser's console!" });
            });
    }

    async post(path: string, data: any) {
        return axios
            .post(`${this.apiUrl}${path}`, data)
            .then((response) => response)
            .catch((error) => {
                console.log(error.response);
                return Promise.resolve({ data: "Error! Check the browser's console!" });
            });
    }
}
