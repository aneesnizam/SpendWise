import { useEffect, useState } from "react";
import "./Nav.css";
import { GiHamburgerMenu } from "react-icons/gi";
import { FiDownload } from "react-icons/fi";
import dp from "../assets/dp.jpg";
import userlogindata from "./Authstore";
import Menu from "./Menu";
import Profile from "./Profile";
import Logo from "../assets/sw5.png";
import Inbox from "./Inbox/Inbox";
export default function Nav() {
  const { showMenu, setShowMenu, setViewProfile, viewProfile } =
    userlogindata();
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleDownloadClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();

      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the install prompt");
        } else {
          console.log("User dismissed the install prompt");
        }
        setDeferredPrompt(null);
      });
    } else {
      alert("App is not installable yet.");
    }
  };
  
  return (
    <>
      <section id="nav">
        <div className="left">
          <button onClick={() => setShowMenu(true)}>
            <GiHamburgerMenu />
          </button>
          {showMenu && <Menu />}
        </div>
        <div className="middle">
          {" "}
          <img src={Logo} alt="" />
        </div>
        <div className="right">
          {deferredPrompt && (
            <button className="dwnld-btn" onClick={handleDownloadClick}>
              <FiDownload />
            </button>
          )}

          <Inbox />
          <span className="DpImage"
            onClick={() => {
              setViewProfile(true);
            }}
          >
            <img src={dp} alt="" />
          </span>
        </div>
        {viewProfile && <Profile />}
      </section>
    </>
  );
}
