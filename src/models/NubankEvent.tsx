import { Moment } from "moment";

interface NubankDetailsCharges {
  amount: number;
  count: number;
}

interface NubankDetails {
  charges?: NubankDetailsCharges;
}

export interface NubankEvent {
  id: string;
  amount: number;
  category: string;
  description: string;
  details?: NubankDetails;
  time: Moment;
}
