import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../../common/components/Loader";
import styles from "./index.module.scss";
// import { getCall } from "../../services/apiService";
// import { endPoints } from "../../constants/urlConstants";
// import { getItemInLocalStorage } from "../../services/localStorage";
// import { Button } from "../../common/components/Button";
// import { formatDateTimeWithHiphens } from "../../utils/commonFunctions";
// import AnimationBanner from "../../common/components/AnimationBanner";
import { HomePageCards } from "../../common/components/HomePageCards";
import addCircle from "../../assets/images/add-circle-admin.svg";
import { RegistrationsCard } from "../../common/components/RegistrationsCard";
import trackRegistrations from "../../assets/images/track-registrations.svg";
import analytics from "../../assets/images/analytics.svg";
import { FetchMeetingDetails } from "../../utils/commonFunctions";
// import infinipathLogo from "../../assets/images/infinipath-name.svg";
// import expand from "../../assets/images/expand.svg";

function Admin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  // const [errorMsg, setErrorMsg] = useState("");
  // const userData = getItemInLocalStorage("seekerDetails");
  const [adminMeetingData, setAdminMeetingData] = useState<unknown>(null);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  /**
   * @description Fetch admin meeting data
   */
  const getAdminMeetingData = () => {
    FetchMeetingDetails(setLoading, setAdminMeetingData);
  };

  /**
   * @description Fetch admin meeting data on component mount
   */
  useEffect(() => {
    getAdminMeetingData();
    console.log(adminMeetingData, "responsee");
  }, []);

  /**
   *
   * @description cardName HandleCard to card to navigate to respective pages
   */
  const handleCardClick = (cardName: string) => {
    setSelectedCard(cardName);
    if (cardName === "create new infinipath") {
      navigate("/admin/createinfinipath");
    } else if (cardName === "track & manage registrations") {
      // alert("Work in progress");
      navigate("/admin/sessions");
    } else if (cardName === "view analytics") {
      alert("Work in progress");
      // navigate("/admin/viewanalytics");
    }
  };

  // const handleTrackAndManageRegistrations = () => {
  //   // navigate(`/admin/seekerslist?meetingId=${meetingId}`);
  //   console.log("meeting id from the seeker", meetingId);
  //   navigate(`/admin/seekerslist`, {
  //     state: {
  //       meetingId: meetingId,
  //       meetingDate: "2024-12-16T19:16:00",
  //     },
  //   });
  // };
  return loading ? (
    <Loader type="large" />
  ) : (
    <div className={styles.userStatusContainer}>
      {/* <div className={styles.animationBannerContainer}>
        <AnimationBanner />
        <div className={styles.titleImage}>
          <img src={infinipathLogo} alt="" />
          <span className={styles.logoText}>
            growth sessions with{" "}
            <span className={styles.mahatriaText}> Mahatria</span>
          </span>
        </div>
      </div> */}
      <div className={styles.customSubheaderContainer}>infinipath</div>
      <div className={styles.contentContainer}>
        <div className={styles.cardContent}>
          <span className={styles.titleStyle}>
            What do you want to do Today?
          </span>
          <div className={styles.cardsDiv}>
            <HomePageCards
              imgsrc={addCircle}
              text="create new infinipath"
              isClicked={selectedCard === "create new infinipath"}
              setIsClicked={() => handleCardClick("create new infinipath")}
              data-testid="create-new-infinipath"
            />
            <HomePageCards
              imgsrc={trackRegistrations}
              text="track & manage sessions"
              isClicked={selectedCard === "track & manage registrations"}
              setIsClicked={() =>
                handleCardClick("track & manage registrations")
              }
              data-testid="track-manage-registrations"
            />
            <HomePageCards
              imgsrc={analytics}
              text="view analytics"
              diffStyle={true}
              isClicked={selectedCard === "view analytics"}
              setIsClicked={() => handleCardClick("view analytics")}
              data-testid="view-analytics"
            />
          </div>
        </div>
        <div className={styles.MeetingCard}>
          {adminMeetingData?.startDate && (
            <RegistrationsCard
              formattedMeetingStart={adminMeetingData?.startDate}
              duration={adminMeetingData?.duration}
              isButtons={
                adminMeetingData?.meetingStatus?.includes("START MEETING") ||
                adminMeetingData?.meetingStatus?.includes("CREATED")
              }
              meetingId={adminMeetingData?.meetingId}
              title={
                adminMeetingData?.title
                  ? adminMeetingData?.title
                  : "Weekly Growth Session"
              }
              regEndsAt={adminMeetingData?.registrationEndsAt}
              data-testid={`meeting-card-${adminMeetingData?.title}`}
            />
          )}
          {/* <div className={styles.sessionsDiv}>
            <span className={styles.sessionsText}>view all sessions</span>
            <img src={expand} alt="expand"/>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default Admin;
