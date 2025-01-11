import { RiBarChartHorizontalLine } from "react-icons/ri";
import { GoScreenFull } from "react-icons/go";
import { BiExitFullscreen } from "react-icons/bi";
import { useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";

export default function Header() {
  const { data: session } = useSession();
  const [isFullscreen, setisFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setisFullscreen(true);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => {
          setisFullscreen(false);
        });
      }
    }
  };

  return (
    <>
      <header className="header flex flex-sb">
        <div className="logo flex gap-2">
          <h1>ADMIN</h1>
          <div className="headerham flex flex-center">
            <RiBarChartHorizontalLine />
          </div>
        </div>
        <div className="rightnav flex gap-2">
          <div onClick={toggleFullscreen}>{isFullscreen ? <BiExitFullscreen /> : <GoScreenFull />}</div>
          {/* <div className="notification">
            <Image src="/img/push-notifications.svg" alt="notification" width={50} height={50} />
          </div> */}
          <div className="profilenav">
            {session ? (
              <Image src={session.user.image} alt="user" width={50} height={50} />
            ) : (
              <Image src="/img/user.svg" alt="user" width={50} height={50} />
            )}
          </div>
        </div>
      </header>
    </>
  );
}
