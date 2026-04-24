import "@/styles/globals.css";
import { AdminProvider } from "@/components/AdminContext";

export default function App({ Component, pageProps }) {
  return (
    <AdminProvider>
      <Component {...pageProps} />
    </AdminProvider>
  );
}
