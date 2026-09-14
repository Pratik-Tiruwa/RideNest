import Navbar from "@/components/Navbar";
import PublicHome from "@/components/PublicHome";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <PublicHome />
      <Footer />
    </main>
  );
}

