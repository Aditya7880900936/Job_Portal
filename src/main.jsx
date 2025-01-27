import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ClerkProvider } from "@clerk/clerk-react";
import { dark, shadesOfPurple } from "@clerk/themes";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const shadesofPurple = {
  // Define your custom theme here
  colors: {
    primary: '#7A288A',
    secondary: '#C7B8EA',
  },
};


if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ClerkProvider
      appearance={{ baseTheme: shadesOfPurple}}
      publishableKey={PUBLISHABLE_KEY}
      afterSignOutUrl="/"
    >
      <App />
    </ClerkProvider>
  </StrictMode>
);
