import { ZoomMtg } from "@zoom/meetingsdk";
import { useEffect, useState } from "react";
import { endPoints } from "../../constants/urlConstants";
import { getCall, postCall } from "../../services/apiService";
import { useDispatch, useSelector } from "react-redux";
import { addMeetingData } from "../../reducers/ZoomReducer";
import { extractTk, extractZak } from "../../utils/zoomIntegration";
import Loader from "../../common/components/Loader";
import styles from "./index.module.scss";
import {
  getItemInLocalStorage,
  removeItemInLocalStorage,
} from "../../services/localStorage";
import { detectBrowser } from "../../utils/detectBrowser";
import { useNavigate } from "react-router-dom";

export default function Zoom() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // members with verification status
  const membersData = useSelector(
    (state: unknown) => state?.seekerReducer?.members || [],
  );
  const verifiedSeekersIds = useSelector(
    (state: unknown) => state?.seekerReducer?.verifiedSeekersIds || [],
  );
  const getMembersWithVerificationStatus = (
    membersData: Array<unknown>,
    verifiedIds: Array<number>,
  ) => {
    return membersData.map((member) => ({
      userId: `${member?.id}`,
      faceVerificationStatus: verifiedIds.includes(member?.id),
    }));
  };

  useEffect(() => {
    if (membersData.length > 0) {
      const membersWithStatus = getMembersWithVerificationStatus(
        membersData,
        verifiedSeekersIds,
      );
      console.log(membersWithStatus, "membersWithStatus");
    }
  }, [membersData]);

  const seekerData = getItemInLocalStorage("seekerDetails") || {};
  const verificationStatus = getItemInLocalStorage("verification_status");
  const tableMeetingId = getItemInLocalStorage("table_meeting_id");
  const [loading, setLoading] = useState(false);
  const [APIError, setAPIError] = useState(null);

  /**
   * @description API call to mark attendance of the seeker once he joins the meeting
   */
  const joinmeetingAttendance = async () => {
    const browser = detectBrowser();
    const payload = {
      userId: seekerData?.id, // pass userId not mobile number
      modeOfJoining: "SELF", //SELF,JOINING_ON_OTHER_DEVICE
      faceVerificationStatus: verificationStatus?.includes("success")
        ? true
        : false, // true or false
      attendees: getItemInLocalStorage("attendees")?.length
        ? getItemInLocalStorage("attendees")
        : [],
      // meeting_id: tableMeetingId || "",
      deviceType: "Browser",
      deviceInfo: browser?.toUpperCase(),
    };
    await postCall(
      `${endPoints.webinars}/${tableMeetingId}/attendance`,
      payload,
    )
      .then((response) => {
        console.log(response, "Attendance marked2222");
        removeItemInLocalStorage("attendees");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  /**
   * @description To get the join details of the meeting
   */
  const getJoinDetails = () => {
    setLoading(true);
    let tkToken = "";
    let zakToken = "";
    getCall(
      `${endPoints.webinars}/${tableMeetingId}/user/${seekerData?.id}/join-details`,
    )
      .then((response) => {
        if (response?.status === 200) {
          dispatch(addMeetingData(response?.data?.data));
          if (response?.data?.data?.startUrl?.length > 0) {
            zakToken = extractZak(response?.data?.data?.startUrl);
          } else if (response?.data?.data?.joinUrl?.length > 0) {
            tkToken = extractTk(response?.data?.data?.joinUrl);
          }
          handleZoom(response?.data?.data, tkToken, zakToken);
        } else {
          setLoading(false);
          // setAPIError(response?.data?.message);
          setAPIError(
            "Session already ended or session not found, you are being redirected to infinipath...",
          );
          setTimeout(() => {
            navigate("/infinipath/myspace");
          }, 3000);
        }
      })
      .catch((err: unknown) => {
        setLoading(false);
        console.log(err, "error");
      });
  };

  /**
   * @description To initiate the zoom SDK and join or start the meeting
   * @param joinDetails meeting details from the API
   * @param tkToken
   * @param zakToken
   */
  const handleZoom = (
    joinDetails: unknown,
    tkToken: string,
    zakToken: string,
  ) => {
    ZoomMtg.preLoadWasm();
    ZoomMtg.prepareWebSDK();
    ZoomMtg.init({
      leaveUrl: `${window.location.origin}/infinipath/redirect`, // https://example.com/thanks-for-joining
      success: (success: unknown) => {
        console.log(success, "success");
        setLoading(false);
        ZoomMtg.join({
          sdkKey: process.env.REACT_APP_ZOOM_SDK_KEY,
          signature: joinDetails?.webToken,
          meetingNumber: joinDetails?.webinarIdExt,
          passWord: joinDetails?.password,
          userName: seekerData?.fullName,
          userEmail: seekerData?.email, // userEmail property required
          tk: tkToken,
          zak: zakToken,
          success: (success: unknown) => {
            console.log(success, "meeting join success");
            seekerData?.role === "viewer" && joinmeetingAttendance();
            // markAttendance();
          },
          error: (error: unknown) => {
            console.log(error);
          },
        });
      },
      error: (error: unknown) => {
        console.log(error);
      },
    });
  };

  useEffect(() => {
    getJoinDetails();
  }, []);

  return (
    <div className={styles.errormsg}>
      {loading && <Loader type="large" />}
      {APIError?.length > 0 && <div>{APIError}</div>}
    </div>
  );
}
