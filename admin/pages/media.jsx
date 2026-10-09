import Head from "next/head";
import { useAdmin } from "@/components/AdminContext";
import { useAuthGuard } from "@/components/useAuthGuard";
import AdminLayout from "@/components/AdminLayout";
import { MediaBrowser } from "@/components/MediaLibrary";

export default function Media() {
  const { ready } = useAuthGuard();
  const { api } = useAdmin();

  if (!ready) return null;

  return (
    <AdminLayout title="Media">
      <Head><title>Media — IHW Admin</title></Head>
      <MediaBrowser api={api} mode="manage" pageKey="media" />
    </AdminLayout>
  );
}
