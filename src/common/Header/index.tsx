import rahatriaLogo from "../../assets/images/rahatria.svg";
import { Outlet, useNavigate } from "react-router-dom";
import styles from "./index.module.scss";
import { Avatar } from "@mui/material";
import defaultProfileIcon from "../../assets/images/default-profile.svg";
import {
  getItemInLocalStorage,
  setItemInLocalStorage,
} from "../../services/localStorage";
// import infinitheism from "../../assets/images/infinitheism-logo.svg";
import mahatriaDotsMobile from "../../assets/images/mahatria-dots-mobile.svg";
import HamburgerSideNav from "../components/HambergurSideNav";
import { getCall } from "../../services/apiService";
import { endPoints } from "../../constants/urlConstants";
import Loader from "../components/Loader";
import { useState } from "react";
import infinitheismLogoTwo from "../../assets/images/infinitheism-logo-2.webp";

// import hamburgerIcon from "../../assets/images/hamburger-icon.svg";

const Header = () => {
  const [loading, setLoading] = useState(false);
  const token = getItemInLocalStorage("idToken");
  const navigate = useNavigate();
  const activeTab = window?.location?.pathname;
  const seekerDetails = getItemInLocalStorage("seekerDetails") || {};

  const handleLogoOnclick = () => {
    navigate("/infinipath/myspace");
  };

  /**
   * @description: This function is used to get the user details once profile picture is updated
   */
  const getUserDetails = () => {
    // const getUserPayload = {
    //   phone_number: seekerData?.phone_number,
    //   app_type: "infinipath",
    // };
    setLoading(true);
    getCall(`${endPoints.users}/${seekerDetails?.id}?appType=infinipath`)
      .then((res) => {
        if (res?.data?.statusCode === 200) {
          setLoading(false);
          setItemInLocalStorage("seekerDetails", res?.data?.data);
          navigate("/infinipath/profile");
        } else {
          setLoading(false);
          navigate("/infinipath/profile");
        }
      })
      .catch((err) => {
        console.log(err, "ERR");
        setLoading(false);
        setTimeout(() => {
          navigate("/infinipath/profile");
        }, 2000);
      });
  };

  const handleProfileIconClick = () => {
    getUserDetails();
  };

  return (
    <>
      {loading && <Loader type="large" data-testid="loader-large" />}
      <div className={styles.header} data-testid="header">
        <div className={styles.appIconSection} data-testid="app-icon-section">
          <img
            src={infinitheismLogoTwo}
            alt="inifinipath"
            className={styles.appIcon}
            onClick={handleLogoOnclick}
            data-testid="app-icon"
          />
          {token && token?.length > 0 && (
            <HamburgerSideNav data-testid="hamburger-side-nav" />
          )}
        </div>
        <div className={styles.mahatriaDots} data-testid="mahatria-dots">
          <img
            src={rahatriaLogo}
            alt="logo"
            className={styles.mahatriaDotsLogo}
            data-testid="mahatria-logo"
          />
          <img
            src={mahatriaDotsMobile}
            alt="logo"
            className={styles.mahatriaDotsLogoMobile}
            data-testid="mahatria-logo-mobile"
          />
        </div>
        <div className={styles.logOut} data-testid="logout-container">
          {window?.location?.pathname?.length > 1 &&
            !window?.location?.href?.includes("login") && (
              <>
                <div className={styles.tabs} data-testid="tabs">
                  <div
                    className={`${styles.tab} ${activeTab?.includes("profile") ? styles.activeTab : ""}`}
                    onClick={() => handleProfileIconClick()}
                    data-testid="profile-tab"
                  >
                    <Avatar
                      alt="Remy Sharp"
                      src={
                        seekerDetails?.profileUrl?.length > 0
                          ? `${seekerDetails?.profileUrl}?timestamp=${new Date().getTime()}` // To avoid caching
                          : defaultProfileIcon
                      }
                      sx={{
                        width: 48,
                        height: 48,
                        border: "1px solid #DDDDDD",
                        "@media (max-width: 780px)": {
                          width: 35, // Avatar size for screens below 700px
                          height: 35,
                        },
                      }}
                      data-testid="profile-avatar"
                    />
                  </div>
                  {/* <div
                    className={styles.separator}
                    data-testid="separator"
                  ></div>
                  <div data-testid="hamburger-icon-container"> // As there is no functionality for this hamburger icon, it is commented
                    <img
                      src={hamburgerIcon}
                      alt="hamburger"
                      data-testid="hamburger-icon"
                    />
                  </div> */}
                </div>
              </>
            )}
        </div>
      </div>
      <Outlet />
    </>
  );
};

export default Header;
