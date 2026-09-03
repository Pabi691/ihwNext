// Retired. The redesigned homepage now lives behind the theme-preview routes:
//   /theme-preview        — list of saved festival themes
//   /theme-preview/<slug> — one theme, forced on
export const getServerSideProps = async () => ({
  redirect: { destination: "/theme-preview", permanent: false },
});

export default function TestHomeRedirect() {
  return null;
}
