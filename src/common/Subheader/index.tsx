import React, { useState, useEffect } from "react";
import styles from "./index.module.scss";
import { useLocation, useNavigate } from "react-router-dom";
// import { getItemInLocalStorage } from "../../services/localStorage";
import mySpace from "../../assets/images/my-space.svg";
import familyAndFriends from "../../assets/images/family-friends-icon.svg";
import CustomPopup from "../components/CustomPopup";
import ArrowIcon from "../../assets/images/arrow-left.svg";
import HomeIcon from "../../assets/images/home-icon.svg";
import AnalyticsIcon from "../../assets/images/analytics-icon.svg";
import { Button } from "../components/Button";
import trackRegistrations from "../../assets/images/track-registrations.svg";
interface SubheaderProps {
  appType: string;
}

const Subheader: React.FC<SubheaderProps> = ({ appType }) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const navigate = useNavigate();
  const pathname = location?.pathname;
  const noBorderBottom = pathname?.includes("home");
  const backgroundReq = pathname?.includes("sessions");
  // const apptype = pathname?.split("/")[1];
  // const seekerDetails = getItemInLocalStorage("seekerDetails") || {};
  const [showPopup, setShowPopup] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(
    null,
  );
  const friendsAndFamily = queryParams?.get("friendsAndFamily");
  const [hideSubHeader, setHideSubHeader] = useState(false);

  const getHideSubHeader = () => {
    if (
      (pathname?.includes("createinfinipath") && appType === "admin") ||
      pathname?.includes("redirect") ||
      pathname?.includes("home")
    ) {
      setHideSubHeader(true);
    } else {
      setHideSubHeader(false);
    }
  };

  useEffect(() => {
    getHideSubHeader();
  }, [pathname]);

  // It will navigate to home page if the user is mahatria else it will navigate to myspace page
  const handleMySpaceOnclick = () => {
    navigate("/infinipath/myspace");
  };

  // It will display the popup when user is in joinwithothers page and try to navigate to friendsandfamily page
  const handleNavigation = (path: string) => {
    if (pathname === "/infinipath/joinwithothers" && pathname !== path) {
      setPendingNavigation(path);
      setShowPopup(true);
    } else {
      navigate(path);
    }
  };

  // It will confirm the navigation when user click on yes button in popup
  const confirmNavigation = () => {
    if (pendingNavigation) {
      navigate(pendingNavigation);
    }
    closePopup();
  };

  // It will close the popup when user click on no button in popup
  const closePopup = () => {
    setShowPopup(false);
    setPendingNavigation(null);
  };

  //getTabs function to return tabs based on the appType
  const getTabs = () => {
    if (
      (pathname?.includes("home") || pathname?.includes("createinfinipath")) &&
      appType === "admin"
    ) {
      return null;
    }
    if (appType === "infinipath") {
      return (
        <div className={styles.tabs} data-testid="tabs">
          <div
            className={`${styles.tab} ${pathname?.includes("myspace") ? styles.activeTab : ""}`}
            onClick={() => handleMySpaceOnclick()}
            data-testid="tab-myspace"
          >
            <img
              src={mySpace}
              alt="myspace"
              className={styles.mySpaceIcon}
              data-testid="icon-myspace"
            />
            <p data-testid="text-myspace">my space</p>
          </div>
          <div className={styles.separator} data-testid="tabs-separator"></div>
          <div
            className={`${styles.tab} ${pathname?.includes("friendsandfamily") || friendsAndFamily ? styles.activeTab : ""}`}
            onClick={() => handleNavigation("/infinipath/friendsandfamily")}
            data-testid="tab-friendsandfamily"
          >
            <img
              src={familyAndFriends}
              alt="familyAndFriends"
              className={styles.mySpaceIcon}
              data-testid="icon-friendsandfamily"
            />
            <p data-testid="text-friendsandfamily">my group</p>
          </div>
        </div>
      );
    } else if (appType === "admin") {
      return (
        <div className={styles.tabs} data-testid="tabs">
          <div
            className={`${styles.tab} ${pathname?.includes("home") ? styles.activeTab : ""}`}
            onClick={() => handleMySpaceOnclick()}
            data-testid="tab-home"
          >
            <img
              src={HomeIcon}
              alt="home"
              className={styles.adminIcon}
              data-testid="icon-home"
            />
            <p data-testid="text-home">home</p>
          </div>
          <div
            className={`${styles.tab} ${pathname?.includes("sessions") ? styles.activeTab : ""}`}
            onClick={() => {
              navigate("/admin/sessions");
            }}
            data-testid="tab-programmes"
          >
            <img
              src={trackRegistrations}
              alt="sessions"
              className={styles.adminIcon}
              data-testid="icon-session"
            />
            <p data-testid="text-programmes">sessions</p>
          </div>
          <div
            className={`${styles.tab}`}
            onClick={() => alert("Work in progress")}
            data-testid="tab-analytics"
          >
            <img
              src={AnalyticsIcon}
              alt="analytics"
              className={styles.adminIcon}
              data-testid="icon-analytics"
            />
            <p data-testid="text-analytics">analytics</p>
          </div>
          <div className={`${styles.tab}`} data-testid="tab-createinfinipath">
            <Button
              buttonClassName={styles.buttonCreateInfinipath}
              onClick={() => {
                navigate("/admin/createinfinipath");
              }}
              datatestid="create-infinipath"
              datatestidText="create-infinipath-text"
            >
              create infinipath
            </Button>
          </div>
        </div>
      );
    }
  };

  /**To show the breadcurmb and back button or app title */
  const showBreadCurmb = () => {
    if (
      window?.location?.pathname?.includes("joinwithothers") ||
      window?.location?.pathname?.includes("newseeker") ||
      window?.location?.pathname?.includes("verifyphonenumber")
    ) {
      return true;
    }
  };

  /** Get breadcrumb tabs based on page */
  const getBreadCrumbTabs = () => {
    if (window?.location?.pathname?.includes("joinwithothers")) {
      return (
        <div className={styles.breadcrumbs} data-testid="breadcrumbs">
          <div
            className={styles.backArrow}
            onClick={() => {
              navigate("/infinipath/myspace");
            }}
            data-testid="back-icon-container"
          >
            <img src={ArrowIcon} alt="back" data-testid="back-icon" />
          </div>
          <div
            className={styles.nonActive}
            data-testid="breadcrumb-nonactive-myspace"
          >
            my space
          </div>
          <div className={styles.nonActive} data-testid="breadcrumb-separator">
            /
          </div>
          <div
            className={styles.active}
            data-testid="breadcrumb-active-session"
          >
            Weekly Growth Session
          </div>
        </div>
      );
    } else if (
      window?.location?.pathname?.includes("newseeker") ||
      window?.location?.pathname?.includes("verifyphonenumber")
    ) {
      return (
        <div className={styles.breadcrumbs} data-testid="breadcrumbs">
          <div
            className={styles.backArrow}
            onClick={() => {
              navigate(-1); // Navigate to the previous page
            }}
            data-testid="back-icon-container"
          >
            <img src={ArrowIcon} alt="back" data-testid="back-icon" />
          </div>
          {!friendsAndFamily && (
            <>
              <div
                className={styles.nonActive}
                data-testid="breadcrumb-nonactive-myspace"
              >
                my space
              </div>
              <div
                className={styles.nonActive}
                data-testid="breadcrumb-separator"
              >
                /
              </div>
              <div
                className={styles.nonActive}
                data-testid="breadcrumb-active-session"
              >
                Weekly Growth Session
              </div>
              <div
                className={styles.nonActive}
                data-testid="breadcrumb-separator"
              >
                /
              </div>
              <div
                className={styles.active}
                data-testid="breadcrumb-add-memebers"
              >
                add member
              </div>
            </>
          )}
        </div>
      );
    }
  };

  return hideSubHeader ? (
    <></>
  ) : (
    <div
      className={`${styles.container} ${noBorderBottom ? styles.noBorder : ""} ${backgroundReq ? styles.containerBackgroundReq : ""}`}
      data-testid="subheader-container"
    >
      {showBreadCurmb() ? (
        getBreadCrumbTabs()
      ) : (
        <p className={styles.appTitle} data-testid="app-title">
          {/* {appType?.includes("admin") ? "" : appType} */}
        </p>
      )}
      <div data-testid="tabs-container">{getTabs()}</div>
      {showPopup && (
        <CustomPopup
          open={showPopup}
          onclose={closePopup}
          title="Please confirm"
          description="Are you sure you want to switch to the Friends & Family"
          onConfirm={confirmNavigation}
          onCancel={closePopup}
          confirmText="yes"
          cancelText="no"
          data-testid="custom-popup"
        />
      )}
    </div>
  );
};

export default Subheader;
