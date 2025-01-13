import React, { useEffect, useState } from "react";
import styles from "./index.module.scss";
import {
  calculateTimeForMeeting,
  formatDuration,
  formatTime,
  getDateFromString,
  getDayOfWeek,
  getFutureTime,
  getMonthAbbreviation,
  getYearBasedOnDate,
  // replaceDashWithTo,
} from "../../../utils/commonFunctions";
import calendar from "../../../assets/images/calendar.svg";
import clockIcon from "../../../assets/images/clock.svg";
import { Button } from "../Button";
import { useNavigate } from "react-router-dom";
import { setItemInLocalStorage } from "../../../services/localStorage";
// import circleArrowRight from "../../../assets/images/circle-arrow-right.svg";

interface RegistrationsCardProps {
  formattedMeetingStart?: string;
  durationTime?: string;
  duration?: number;
  inputValue?: string;
  isButtons?: boolean;
  registrationStartsAt?: string | undefined;
  formattedTime?: string;
  registrationStartDataTestId?: string;
  formattedTimeDataTestId?: string;
  diffStyles?: boolean;
  title: string;
  Onclick?: () => void;
  meetingId?: string;
  regEndsAt?: string;
}

export const RegistrationsCard: React.FC<RegistrationsCardProps> = ({
  formattedMeetingStart,
  // durationTime,
  duration,
  inputValue,
  diffStyles,
  Onclick,
  // isButtons,
  title,
  isButtons,
  // registrationStartsAt = "",
  // formattedTime,
  // registrationStartDataTestId,
  // formattedTimeDataTestId,
  meetingId,
  regEndsAt,
}) => {
  const navigate = useNavigate();

  const [timeRemaining, setTimeRemaining] = useState<string | null>();

  /**
   * Using this useeffect to update the time remaining every second
   */
  useEffect(() => {
    const intervalId = setInterval(() => {
      const remainingTime =
        regEndsAt?.length && calculateTimeForMeeting(regEndsAt);
      setTimeRemaining(remainingTime);

      if (remainingTime === null) {
        clearInterval(intervalId);
      }
    }, 1000);

    return () => clearInterval(intervalId); // Clear interval on component unmount
  }, [regEndsAt]);

  // console.log(timeRemaining, title, "Title");
  return (
    <div className={diffStyles ? styles.diffContainer : styles.cardContainer} data-testid="card-content">
      {!diffStyles && (
        <span className={styles.mainTitle}>Upcoming sessions</span>
      )}

      <div
        className={
          diffStyles
            ? styles.diffMeeetingRegistrationDetails
            : styles.meetingRegistrationsDetails
        }
        onClick={Onclick}
        data-testid={`meeting-registrations-details-${title}`}
      >
        <div className={styles.cardContent} data-testid="card-content">
          <span className={styles.titleDisplay}  data-testid="title-display">
            {inputValue}
          </span>
          <span className={styles.subtitle} data-testid="title-display">{title}</span>
          <div className={styles.dateTime} data-testid="date-time">
            <div className={styles.calendar} data-testid="calendar-date">
              <img
                src={calendar}
                alt="calendar icon"
                data-testid="calendar-icon"
              />
              {formattedMeetingStart && (
                <span data-testid="formatted-date">
                  {/* Sunday, 05-Nov-2024 */}
                  {getDayOfWeek(formattedMeetingStart)},{" "}
                  {getDateFromString(formattedMeetingStart)}-
                  {getMonthAbbreviation(formattedMeetingStart)}-
                  {getYearBasedOnDate(formattedMeetingStart)}
                </span>
              )}
            </div>
            <div className={styles.calendar} data-testid="calendar-time">
              <img src={clockIcon} alt="clock icon" data-testid="clock-icon" />
              {formattedMeetingStart && (
                <p data-testid="duration-time">
                  {formatTime(formattedMeetingStart)} to{" "}
                  {getFutureTime(formattedMeetingStart, duration)} IST
                  <span className={styles.timer} data-testid="timer">
                    {formatDuration(duration)}
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>
        {isButtons && (
          <div className={!diffStyles ? styles.buttonsDiv : ""} data-testid="start-button">
            {/* {isButtons ?  ( */}
            <Button
              type="submit"
              buttonClassName={styles.buttonContainer}
              buttonTextClassName={styles.buttonText}
              datatestid={`start-${title}`}
              datatestidText={`start-${title}-text`}
              onClick={(e) => {
                e.stopPropagation();
                setItemInLocalStorage("table_meeting_id", meetingId);
                navigate("/admin/zoom");
              }}
              disable={timeRemaining !== null}
            >
              start session
            </Button>
            {/* ):
            (registrationStartsAt &&  <div className={styles.regOpen} data-testid={formattedTimeDataTestId}>
              Registrations open on{" "}
              <span className={styles.regOpenText} data-testid={registrationStartDataTestId}>
                {" "}
                {getDayOfWeek(registrationStartsAt)},{" "}
                {getDateFromString(registrationStartsAt)}-
                {getMonthAbbreviation(registrationStartsAt)}-
                {getYearBasedOnDate(registrationStartsAt)}
              </span>
              , at {formattedTime} IST.
            </div>)} */}
            {/* <img src={circleArrowRight} alt="arrow" /> */}
          </div>
        )}
      </div>
    </div>
  );
};
