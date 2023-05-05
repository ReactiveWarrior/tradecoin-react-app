import { Coin } from './Coin';

export interface User {
  id: string,
  name: string,
  email: string,
  coins: (Coin & {coinAmount: number})[]
}