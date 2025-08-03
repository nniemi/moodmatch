import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { store } from "../app/store";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "../utils/ThemeContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </Provider>
  );
}
