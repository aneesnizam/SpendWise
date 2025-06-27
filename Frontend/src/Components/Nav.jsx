import { useEffect, useState } from "react";
import "./Nav.css";
import { GiHamburgerMenu } from "react-icons/gi";
import { FiDownload } from "react-icons/fi";
import dp from "../assets/dp.jpg";
import userlogindata from "../utilities/Authstore";
import Menu from "./Menu";
import Profile from "./Profile";
import Logo from "../assets/sw5.png";
import Inbox from "./Inbox/Inbox";
export default function Nav() {
  const { showMenu, setShowMenu, setViewProfile, viewProfile,user } =
    userlogindata();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
const name = user.name[0]

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
          <span
            className={`DpImage ${name.toUpperCase() || ''}`}
            onClick={() => {
              setViewProfile(true);
            }}
          >
            <h1>    {name? name.toUpperCase() : "U"}</h1>
      
          </span>
        </div>
        {viewProfile && <Profile />}
      </section>
    </>
  );
}
