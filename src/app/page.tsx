import Navbar from "@/components/Navbar";
import PublicHome from "@/components/PublicHome";
import Footer from "@/components/Footer";
import { auth } from "@/auth";
import PartnerDashboard from "@/components/PartnerDashboard";
import connectDb from "@/lib/db";
import User from "@/models/user.model";
import AdminDashboard from "@/components/AdminDashboard";
import GeoUpdater from "@/components/GeoUpdater";


export default async function Home() {

  const session = await auth();
  let user = null;
  if (session?.user?.email) {
    await connectDb();
    user = await User.findOne({ email: session.user.email });
  }


  return (
    <main className="w-full min-h-screen bg-white">
      {user?._id && <GeoUpdater userId={user._id.toString()} />}
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

