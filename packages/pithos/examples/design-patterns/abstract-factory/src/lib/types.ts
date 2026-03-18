export type Platform = "ios" | "android" | "web";

export interface ButtonStyle {
  container: string;
  text: string;
  secondaryContainer: string;
  secondaryText: string;
  radius: string;
}

export interface InputStyle {
  container: string;
  text: string;
  placeholder: string;
  focus: string;
  radius: string;
}

export interface ModalStyle {
  backdrop: string;
  panel: string;
  title: string;
  message: string;
  button: string;
}

export interface NavStyle {
  container: string;
  title: string;
  backButton: string;
  statusBar: string;
}

export interface PlatformTheme {
  name: string;
  fontFamily: string;
  bg: string;
  cardBg: string;
  accent: string;
}

export type UIKit = {
  button: () => ButtonStyle;
  input: () => InputStyle;
  modal: () => ModalStyle;
  nav: () => NavStyle;
  theme: () => PlatformTheme;
};
