import React, { useEffect, useState } from "react";
import styles from "./index.module.scss";
import hangingIcon from "../../../assets/images/dashboard-hangings.svg";
import {
  formatDateTimeWithHiphens,
  calculateTimeForMeeting,
} from "../../../utils/commonFunctions";
import { Button } from "../Button";
import { useNavigate } from "react-router-dom";
interface MeetingDetailsCardProps {
  meetingDate: string;
}

const MeetingDetailsCard: React.FC<MeetingDetailsCardProps> = ({
  meetingDate,
}) => {
  //   const timeRemaining = calculateTimeForMeeting(meetingDate);
  const navigate = useNavigate();
  const [timeRemaining, setTimeRemaining] = useState<string | null>(
    calculateTimeForMeeting(meetingDate),
  );

  /**
   * Using this useeffect to update the time remaining every second
   */
  useEffect(() => {
    const intervalId = setInterval(() => {
      const remainingTime = calculateTimeForMeeting(meetingDate);
      setTimeRemaining(remainingTime);

      if (remainingTime === null) {
        clearInterval(intervalId);
      }
    }, 1000);

    return () => clearInterval(intervalId); // Clear interval on component unmount
  }, [meetingDate]);

  return (
    <div className={styles.detailsCard}>
      <div className={styles.hangingIcons}>
        <img src={hangingIcon} alt="" />
        <img src={hangingIcon} alt="" />
      </div>
      {timeRemaining ? (
        <div className={styles.cardContainer}>
          <div className={styles.headingText}>
            Registration will be closed in
          </div>
          <span className={styles.daysText} data-testid="meeting-time">
            {timeRemaining}
          </span>
          <span className={styles.headingText} data-testid="meeting-date">
            {formatDateTimeWithHiphens(meetingDate, false)}
          </span>
        </div>
      ) : (
        <div className={styles.cardContainer}>
          <div className={styles.headingText}>It’s time to connect</div>
          <Button
            type="button"
            buttonClassName={styles.buttonClass}
            onClick={() => navigate("/admin/zoom")}
            datatestid="start-meeting-button"
          >
            start session
          </Button>
        </div>
      )}
    </div>
  );
};

export default MeetingDetailsCard;
