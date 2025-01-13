import React, { useState } from "react";
import styles from "./index.module.scss";
import defaultProfileIcon from "../../assets/images/default-profile.svg";
import { Button } from "../../common/components/Button";
import { auth } from "../../Firebase";
import { useNavigate } from "react-router-dom";
import { getItemInLocalStorage } from "../../services/localStorage";
import {
  capitalizeWords,
  deleteSeekerAccount,
} from "../../utils/commonFunctions";
import editPen from "../../assets/images/edit-pen.svg";
import { Avatar } from "@mui/material";
import arrowIcon from "../../assets/images/arrow-icon.svg";
import AlertDialog from "../../common/components/AlertDialogue";
import CustomPopup from "../../common/components/CustomPopup";
import Loader from "../../common/components/Loader";

function Profile() {
  const navigate = useNavigate();
  const seekerDetails = getItemInLocalStorage("seekerDetails");
  const [toastState, setToastState] = useState({ message: "", open: false });
  const [popupOpen, setPopupOpen] = useState(false);
  const [signOutpopupOpen, setSignOutPopupOpen] = useState(false);
  const [popupDescription, setPopupDescription] = useState("");
  const [note, setNote] = useState("");
  const [confirmText, setConfirmText] = useState("yes");
  const [cancelText, setCancelText] = useState("no");
  const [loading, setLoading] = useState(false);
  const signOut = () => {
    if (auth != null) {
      auth.signOut();
    }
    localStorage.clear();
    sessionStorage.clear();
    navigate("/");
  };

  const setOpenToast = (params: { message: string; open: boolean }) => {
    setToastState(params);
  };

  const handleOpenPopup = () => {
    setPopupOpen(true);
    setPopupDescription("Are you sure you want to delete your account?");
    setNote("Note: This action is irreversible and all your data will be lost");
  };

  const handleSignOutPopup = () => {
    setSignOutPopupOpen(true);
  };

  const handleSignOutClose = () => {
    setSignOutPopupOpen(false);
  };

  const handleClose = () => {
    setPopupOpen(false);
  };

  const handleDeleteAccount = async () => {
    try {
      setLoading(true);
      const response = await deleteSeekerAccount(seekerDetails?.id);
      if (response?.data?.statusCode === 200) {
        setLoading(false);
        navigate("/");
      } else {
        setLoading(false);
        setPopupDescription("Error deleting account");
        setNote(
          "Note: Please try again later or contact support for assistance",
        );
        setPopupOpen(true);
        setConfirmText("Try Again");
        setCancelText("Cancel");
      }
    } catch (error) {
      setLoading(false);
      setPopupDescription("Error deleting account");
      setNote("Note: Please try again later or contact support for assistance");
      setPopupOpen(true);
      setConfirmText("Try Again");
      setCancelText("Cancel");
    }
  };

  return (
    <>
      {loading && <Loader type="large" data-textid="loader" />}
      <div className={styles.container} data-testid="profile-container">
        <div
          className={styles.friendsContainer}
          data-testid="friends-container"
        >
          {/* Profile */}
          <div className={styles.profileDetails} data-testid="profile-details">
            <div className={styles.appIconDiv} data-testid="app-icon-div">
              <div
                className={styles.profileIconDiv}
                data-testid="profile-icon-div"
              >
                <Avatar
                  alt="Remy Sharp"
                  src={
                    seekerDetails?.profileUrl?.length > 0
                      ? `${seekerDetails?.profileUrl}?timestamp=${new Date().getTime()}` // to avoid caching
                      : defaultProfileIcon
                  }
                  sx={{
                    width: 160,
                    height: 160,
                    border: "1px solid #DDDDDD",
                  }}
                  data-testid="profile-avatar"
                />
                <div
                  className={styles.editDiv}
                  onClick={() =>
                    navigate("/verifyuserface?updateProfilePicture=true")
                  }
                  data-testid="edit-profile-icon"
                >
                  <img src={editPen} alt="edit" data-testid="edit-icon" />
                </div>
              </div>
              <div
                className={styles.seekerDetails}
                data-testid="seeker-details"
              >
                <p className={styles.name} data-testid="seeker-name">
                  {capitalizeWords(seekerDetails?.fullName)}
                </p>
                <p
                  className={styles.phoneNumber}
                  data-testid="seeker-phone-number"
                >
                  {seekerDetails?.countryCode?.startsWith("+")
                    ? seekerDetails.countryCode
                    : `+${seekerDetails?.countryCode || ""}`}{" "}
                  {seekerDetails?.phoneNumber
                    ? seekerDetails.phoneNumber
                    : "Invalid phone number"}
                </p>
              </div>
            </div>

            <div className={styles.cards} data-testid="authentication-cards">
              <div
                className={styles.cardBlock}
                data-testid="authentication-card-block"
              >
                <div
                  className={styles.cardNameLine}
                  data-testid="card-name-line"
                >
                  <span className={styles.cardHeading}>Authentication</span>
                </div>
                <div
                  className={styles.authenticationCard}
                  data-testid="authentication-card"
                >
                  <div
                    className={styles.authenticationCardContent}
                    data-testid="authentication-card-content"
                  >
                    <div
                      className={styles.authenticationCardText}
                      data-testid="authentication-card-text"
                    >
                      <span> Facial recognition</span>
                      {seekerDetails?.faceUrl?.length > 0 ? (
                        <div
                          className={styles.enrolledText}
                          data-testid="facial-recognition-enabled"
                        >
                          enabled
                        </div>
                      ) : (
                        <div
                          className={styles.notEnrolledText}
                          data-testid="facial-recognition-not-enabled"
                        >
                          not enabled
                        </div>
                      )}
                    </div>
                    <div>
                      {seekerDetails?.faceUrl?.length > 0 ? (
                        <span
                          onClick={() =>
                            navigate("/verifyuserface?enrollFaceId=true")
                          }
                          className={styles.generateText}
                          data-testid="generate-new-face"
                        >
                          generate new
                        </span>
                      ) : (
                        <span
                          onClick={() =>
                            navigate("/verifyuserface?enrollFaceId=true")
                          }
                          className={styles.generateText}
                          data-testid="enroll-face"
                        >
                          enroll
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <div className={styles.signOutDiv} data-testid="sign-out-section"> */}
          <div className={styles.signOutDiv} data-testid="sign-out-section">
            <Button
              type="button"
              onClick={handleSignOutPopup}
              buttonClassName={styles.buttonClass}
              datatestid="sign-out-button"
              datatestidText="sign-out-text"
            >
              sign out
            </Button>

            <div className={styles.deleteText} onClick={handleOpenPopup}>
              <span>click here to delete your account </span>
              <img
                src={arrowIcon}
                alt="delete arrow"
                data-testid="detele-arrow"
              />
            </div>
          </div>
        </div>
        {/* </div> */}
      </div>
      <AlertDialog
        title={"Notification"}
        message={toastState.message}
        isOpen={toastState.open}
        setOpenToast={setOpenToast}
        data-testid="alert-dialog"
      />
      {popupOpen && (
        <CustomPopup
          open={popupOpen}
          onclose={() => setPopupOpen(false)}
          title={"Delete account"}
          description={popupDescription}
          onConfirm={handleDeleteAccount}
          onCancel={handleClose}
          confirmText={confirmText}
          cancelText={cancelText}
          note={note}
          data-testid="custom-popup"
        />
      )}
      {signOutpopupOpen && (
        <CustomPopup
          open={signOutpopupOpen}
          onclose={handleSignOutClose}
          title={"Sign Out"}
          description={"Are you sure you want to sign out?"}
          onConfirm={signOut}
          onCancel={handleSignOutClose}
          confirmText={"yes"}
          cancelText={"no"}
          data-testid="signout-popup"
        />
      )}
    </>
  );
}

export default Profile;
