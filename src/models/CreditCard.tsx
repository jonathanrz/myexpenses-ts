import { Account } from "./Account";

export interface CreditCard {
  id: string;
  name: string;
  account?: Account;
}
