import { Nullable } from "../common";

export interface ViewportValues {
  initialScale: Nullable<number>;
  minimumScale: Nullable<number>;
  maximumScale: Nullable<number>;
  userScalable: Nullable<boolean>;
}
