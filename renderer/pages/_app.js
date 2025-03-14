import "../styles/globals.css"; // ✅ Ensure Tailwind is imported globally

export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}