import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { initAnalytics, trackPageView } from "./lib/analytics";

initAnalytics();
trackPageView("root");
createRoot(document.getElementById("root")!).render(<App />);
