import Navbar from "@/components/Navbar";
import PublicHome from "@/components/PublicHome";
import Footer from "@/components/Footer";
import { auth } from "@/auth";
import PartnerDashboard from "@/components/PartnerDashboard";


export default async function Home() {

  const session = await auth();

  return (
    <main className="w-full min-h-screen bg-white">
      <Navbar />
      {session?.user?.role == "partner"
        ? <PartnerDashboard />
        : <PublicHome />
      }
      <Footer />
    </main>
  );
}

