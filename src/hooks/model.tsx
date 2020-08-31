export type Unpromise<T extends Promise<any>> = T extends Promise<infer U>
  ? U
  : never;

export interface State<T> {
  error: any;
  result: T | undefined;
  standby: boolean;
  pending: boolean;
}
