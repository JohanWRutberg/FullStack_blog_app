import Loading from "@/components/Loading";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { IoSettingsOutline } from "react-icons/io5";
import { MdOutlineAccountCircle } from "react-icons/md";

export default function Settings() {
  const { data: session, status } = useSession();

  const router = useRouter();
  // check if there is no active session and redirect to login page
  useEffect(() => {
    // check if there is no active session and redirect to login page
    if (!session) {
      router.push("/login");
    }
  }, [session, router]);

  if (status === "loading") {
    // loading state, loader or any other indicator
    return (
      <div className="loadingdata flex flex-col flex-center wh_100">
        <Loading />
        <h2>Loading...</h2>
      </div>
    );
  }

  async function logout() {
    await signOut();
    await router.push("/login");
  }

  if (session) {
    return (
      <>
        <div className="settingpage">
          {/* title admin */}
          <div className="titledashboard flex flex-sb">
            <div data-aos="fade-right">
              <h2>
                Admin <span>Inställningar</span>
              </h2>
              <h3>ADMIN PANEL</h3>
            </div>
            <div className="breadcrumb" data-aos="fade-left">
              <IoSettingsOutline /> <span>/</span> <span>Inställningar</span>
            </div>
          </div>

          <div className="profilesettings">
            <div className="leftprofile_details flex" data-aos="fade-up">
              <Image src="/img/Beat_Master.png" alt="coder" width={100} height={100} />
              <div className="w-100">
                <div className="flex flex-sb flex-left mt-2">
                  <h2>Min Profil:</h2>
                  <h3>Lite text</h3>
                </div>
                <div className="flex flex-sb mt-2">
                  <h3>Phone:</h3>
                  <input type="text" defaultValue="+46-12345678" />
                </div>
                <div className="mt-2">
                  <input type="email" defaultValue="beatmastermind.aff@gmail.com" />
                </div>
                <div className="flex flex-center w-100 mt-2">
                  <button>Save</button>
                </div>
              </div>
            </div>
            <div className="rightlogoutsec" data-aos="fade-up">
              <div className="topaccountbox">
                <h2 className="flex flex-sb">
                  Mitt konto <MdOutlineAccountCircle />
                </h2>
                <hr />
                <div className="flex flex-sb mt-1">
                  <h3>
                    Aktivt konto <br /> <span>E-post</span>
                  </h3>
                  <button onClick={logout}>Logga ut</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
