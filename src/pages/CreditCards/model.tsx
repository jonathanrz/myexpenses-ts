import { Account } from "../../models/Account";

export interface CreditCard {
  id: string;
  name: string;
  account?: Account;
}
