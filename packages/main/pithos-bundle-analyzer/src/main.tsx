import { render } from "preact";
import "./main.css";
import { App } from "./components/App";

const appElement = document.getElementById("app");
if (appElement) {
  render(<App />, appElement);
} else {
  throw new Error("Root element 'app' not found");
}
