import { Account } from "../Accounts/model";

export interface CreditCard {
  id: string;
  name: string;
  account?: Account;
}
