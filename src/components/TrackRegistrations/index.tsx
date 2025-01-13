import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../../common/components/Loader";
import { RegistrationsCard } from "../../common/components/RegistrationsCard";
import { FetchWebinarList, formatTime } from "../../utils/commonFunctions";
import styles from "./index.module.scss";
import GrayLine from "../../common/components/GrayLine";
import RegistrationsOpenLayer from "../../common/components/RegistrationsOpenLayer";

interface MeetingData {
  title: string;
  startAt: string;
  duration: string;
}

export const TrackRegistrations = () => {
  const [loading, setLoading] = useState(true);
  const [adminMeetingData, setAdminMeetingData] = useState<MeetingData[]>([]);
  const navigate = useNavigate();

  /**
  /**
   * @description Fetch admin meeting data
   */
  const getAdminMeetingData = () => {
    FetchWebinarList(setLoading, setAdminMeetingData);
  };

  /**
   * @description Fetch admin meeting data on component mount
   */
  useEffect(() => {
    getAdminMeetingData();
  }, []);

  const handleSeekersListDashBoard = (id: number, webinarTitle: string) => {
    if (id) {
      navigate(`/admin/seekerslist`, {
        state: {
          meetingId: id,
          webinarTitle: webinarTitle,
        },
      });
    } else {
      console.error("Meeting ID is not available!");
    }
  };

  const handleAnalytics = (id: number, webinarTitle: string) => {
    if (id) {
      navigate(`/admin/viewanalytics`, {
        state: {
          meetingId: id,
          webinarTitle: webinarTitle,
        },
      });
    } else {
      console.error("Meeting ID is not available!");
    }
  };

  /**
   * @description To check weather upcoming meetings available or not
   */
  const countOfUpcomingMeetings = (data: unknown) => {
    if (!data) return 0;

    const filteredMeetings = data?.filter((meeting: unkown) => {
      return meeting?.actualMeetingEndsAt === null;
    });

    return filteredMeetings?.length;
  };

  /**
   * @description To check weather completed meetings available or not
   */
  const countOfCompletedMeetings = (data: unknown) => {
    if (!data) return 0;

    const filteredMeetings = data?.filter((meeting: unkown) => {
      return meeting?.actualMeetingEndsAt !== null;
    });

    return filteredMeetings?.length;
  };

  return (
    <div className={styles.container}>
      {loading && <Loader type="large" />}
      {!loading && (
        <div>
          <div className={styles.subHeadingDiv} data-testid="page-header">
            <p className={styles.titleHeading} data-testid="track-&-manage">
              Track & Manage Sessions
            </p>
            <GrayLine data-testid="gray-line" />
          </div>
          <p className={styles.viewAll} data-testid="view">
            View upcoming and completed infinipaths
          </p>
          <div className={styles.completedSessions}>
            <p className={styles.registerStatus} data-testid="upcoming-title">
              Upcoming infinipaths
            </p>
            <div className={styles.registrationCard}>
              {adminMeetingData?.length > 0 &&
                adminMeetingData.map(
                  (meeting, index) =>
                    meeting?.actualMeetingEndsAt === null && (
                      <div key={index}>
                        <div className={styles.registerCardWidth} data-testid="title-heading">
                          <RegistrationsOpenLayer
                            registrationStartsAt={meeting?.registrationStartsAt}
                            formattedTime={formatTime(
                              meeting?.registrationStartsAt,
                            )}
                            cardTitle="Registrations open on"
                            formattedTimeDataTestId={`${meeting?.title}-formatted-time`}
                            registrationStartDataTestId={`${meeting?.title}-registration-starts-at`}
                          />
                        </div>
                        <RegistrationsCard
                          key={index}
                          title={meeting?.title}
                          formattedMeetingStart={meeting?.startAt}
                          duration={meeting?.duration}
                          diffStyles={true}
                          isButtons={meeting?.actualMeetingEndsAt === null}
                          Onclick={() =>
                            handleSeekersListDashBoard(
                              meeting?.id,
                              meeting?.title,
                            )
                          }
                          data-testid={`meeting-card-${index}`}
                          meetingId={meeting?.id}
                          regEndsAt={meeting?.registrationEndsAt}
                        />
                      </div>
                    ),
                )}
              {(adminMeetingData?.length === 0 ||
                countOfUpcomingMeetings(adminMeetingData) === 0) && (
                  <p className={styles.noMeetingText}>No upcoming infinipaths!</p>
                )}
            </div>
          </div>
          <div className={styles.upComingSessions}>
            <p className={styles.registerStatus} data-testid="completed-title">
              Completed infinipaths
            </p>
            <div className={styles.registrationCard}>
              {adminMeetingData?.length > 0 &&
                adminMeetingData.map(
                  (meeting, index) =>
                    meeting?.actualMeetingEndsAt && (
                      <div key={index}>
                        <div className={styles.registerCardWidth}>
                          <RegistrationsOpenLayer
                            registrationStartsAt={meeting?.registrationEndsAt}
                            formattedTime={formatTime(
                              meeting?.registrationEndsAt,
                            )}
                            diffStyles={true}
                            cardTitle="Registrations closed on"
                            formattedTimeDataTestId={`${meeting?.title}-formatted-time`}
                            registrationStartDataTestId={`${meeting?.title}-registration-starts-at`}
                          />
                        </div>
                        <RegistrationsCard
                          key={index}
                          title={meeting.title}
                          formattedMeetingStart={meeting?.startAt}
                          duration={meeting?.duration}
                          diffStyles={true}
                          Onclick={() =>
                            handleAnalytics(meeting?.id, meeting?.title)
                          }
                          data-testid={`analytics-of-${index}`}
                        />
                      </div>
                    ),
                )}
            </div>
            {(adminMeetingData?.length === 0 ||
              countOfCompletedMeetings(adminMeetingData) === 0) && (
                <p className={styles.noMeetingText}>No completed infinipaths!</p>
              )}
          </div>
        </div>
      )}
    </div>
  );
};
