import Navbar from "@/components/Navbar";
import PublicHome from "@/components/PublicHome";
import Footer from "@/components/Footer";
import { auth } from "@/auth";
import PartnerDashboard from "@/components/PartnerDashboard";
import connectDb from "@/lib/db";
import User from "@/models/user.model";
import AdminDashboard from "@/components/AdminDashboard";


export default async function Home() {

  const session = await auth();
  await connectDb();
  const user = await User.findOne({ email: session?.user?.email })


  return (
    <main className="w-full min-h-screen bg-white">

      {user?.role == "partner"
        ?
        <>
          <Navbar />
          <PartnerDashboard />
        </>
        : (
          user?.role == "admin"
            ? <AdminDashboard />
            :
            <>
              <Navbar />
              <PublicHome />
            </>
        )
      }
      <Footer />
    </main>
  );
}

