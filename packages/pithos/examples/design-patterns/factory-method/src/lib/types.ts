export type ChannelKey = "email" | "sms" | "push" | "slack";

export interface AppNotification {
  id: string;
  channel: ChannelKey;
  title: string;
  fields: { label: string; value: string }[];
  sentAt: number;
}

export interface ChannelDef {
  label: string;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
  buttonColor: string;
}
