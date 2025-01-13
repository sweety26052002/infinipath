import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../common/components/Button";
import styles from "./index.module.scss";
import { useForm } from "react-hook-form";
import {
  getCallWithoutAuth,
  postCall,
  // postCallForGetUser,
} from "../../services/apiService";
import signInImage from "../../assets/images/signin-img.svg";
import signUpImage from "../../assets/images/sign-up.svg";
import {
  // getItemInLocalStorage,
  setItemInLocalStorage,
} from "../../services/localStorage";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import OtpFields from "../../components/OtpFields";
import Loader from "../../common/components/Loader";
import Signup from "../Signup";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { auth } from "../../Firebase.js";
import { endPoints } from "../../constants/urlConstants";
import { addSeekerData } from "../../reducers/SeekerReducer.ts";
import { useDispatch } from "react-redux";
import faceLoginIcon from "../../assets/images/face-verify-icon3.svg";
import GrayLine from "../../common/components/GrayLine/index.tsx";
import { formatDateToISOString } from "../../utils/addNewSeeker.ts";
import NonInfinipathSeekerForm from "../NonInfinipathSeeker/index.tsx";

const LoginScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isOTPEntered, setIsOTPEntered] = useState(false);
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [loader, setLoader] = useState(false);
  const [disableButtons, setDisableButtons] = useState({
    verifyOTP: true,
  });
  const [confirmationResult, setConfirmationResult] = useState<unknown>();
  const [otp, setOtp] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [signUpData, setSignUpData] = useState<unknown>(null);
  const mobileInputRef = useRef<HTMLInputElement | null>(null);
  const [signInWithFace, setSignInWithFace] = useState(true);
  const skipFaceVerify = new URLSearchParams(window.location.search).get(
    "skipFaceVerify",
  );
  const [addFaceUrl, setAddFaceUrl] = useState(false);
  const [nonInfinipathSeeker, setNonInfinipathSeeker] = useState(false);
  // const [phoneNumberWithoutCountryCode, setPhoneNumberWithoutCountryCode] =
  //   useState("");
  const [userIdFromValidateAPI, setUserIdFromValidateAPI] = useState("");

  interface getUserPayload {
    phone_number: string;
    app_type: string;
  }

  interface formData {
    firstName?: string;
    lastName?: string;
    phone?: string;
    email?: string;
    terms?: boolean;
  }

  useEffect(() => {
    if (skipFaceVerify) {
      setSignInWithFace(false);
    }
  }, [skipFaceVerify]);

  useEffect(() => {
    localStorage.clear();
    sessionStorage.clear();
    // Automatically focus the mobile input field when the component mounts
    if (mobileInputRef.current) {
      mobileInputRef.current.focus();
    }

    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
          callback: () => {
            console.log("recaptcha solved");
          },
        },
      );
    }
    return () => {
      window.recaptchaVerifier = null;
    };
  }, []);

  const schema = yup.object().shape({
    phone: yup
      .string()
      .required("Mobile number is required")
      .test(
        "is-valid-phone",
        "Mobile number is invalid or does not match the country code",
        (value) => {
          const phoneNumber = parsePhoneNumberFromString(`+${value}`);
          return phoneNumber ? phoneNumber.isValid() : false;
        },
      ),
  });

  const {
    handleSubmit,
    formState: { errors },
    clearErrors,
    getValues,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });

  /**
   * @description: This function is used to verify the OTP
   * @param pin
   */
  const verifyOTP = async (pin: string) => {
    // const getUserPayload = {
    //   phone_number: phoneNumberWithoutCountryCode,
    //   app_type: "infinipath",
    // };
    setLoader(true);
    try {
      const result = await confirmationResult.confirm(pin);
      if (result) {
        if (signUpData) {
          // Store IdToken and localId in local storage
          const idToken = result.user.accessToken;
          const localId = result.user.uid;
          const expirationTime = Date.now() + 3600 * 1000;
          setItemInLocalStorage("idToken", idToken);
          setItemInLocalStorage("localId", localId);
          setItemInLocalStorage(
            "tokenExpirationTime",
            expirationTime.toString(),
          );
          handleSeekerSignup();
        } else {
          // Store IdToken and localId in local storage
          const idToken = result.user.accessToken;
          const localId = result.user.uid;
          const expirationTime = Date.now() + 3600 * 1000;
          setItemInLocalStorage("idToken", idToken);
          setItemInLocalStorage("localId", localId);
          setItemInLocalStorage(
            "tokenExpirationTime",
            expirationTime.toString(),
          );
          await getUserByPhoneNumber();
          setLoader(false);
        }
      }
    } catch (error) {
      setLoader(false);
      setOtpError("Invalid OTP, please try again.");
    }
  };

  /**
   * @description: This function is used to send OTP
   * @param auth
   * @param phnNumber
   * @param recaptcha
   */
  const sendOtpHandler = (
    auth: unknown,
    phnNumber: string,
    recaptcha: unknown,
  ) => {
    setSignInWithFace(false);
    signInWithPhoneNumber(auth, phnNumber, recaptcha)
      .then((confirmationResult) => {
        setConfirmationResult(confirmationResult);
        setSignIn(!signIn);
        setIsOTPEntered(true);
        setLoader(false);
        setSignIn(false);
      })
      .catch((error) => {
        setLoader(false);
        console.log(error.message, "error sending otp");
        if (error.message?.includes("too", "many")) {
          setPhoneNumberError("Too many requests, please try again later");
        } else {
          setPhoneNumberError("Failed to send the OTP, please try again later");
        }
      });
  };

  /**
   * @description: This function is used to verify the captcha and call send otp handler
   * @param phnNumber
   */
  const onCaptchVerify = async (phnNumber: string) => {
    try {
      const appVerifier = window.recaptchaVerifier;
      if (appVerifier) {
        sendOtpHandler(auth, phnNumber, appVerifier);
      } else {
        console.error("reCAPTCHA verifier not initialized");
        setLoader(false);
      }
    } catch (error) {
      console.error("Error in onCaptchVerify:", error);
      setLoader(false);
    }
  };

  /**
   * @description: This function is used to get the user data by phone number
   * @param phnNumber
   */
  const getUserByPhoneNumber = async () => {
    await getCallWithoutAuth(
      `${endPoints.users}/${userIdFromValidateAPI}?appType=infinipath`,
    )
      .then((response) => {
        if (
          response?.data?.statusCode === 200 &&
          response?.data?.data?.isInfipath &&
          response?.data?.data?.isInfipathUserActive
        ) {
          dispatch(addSeekerData(response?.data?.data));
          setItemInLocalStorage("seekerDetails", response?.data?.data);
          setPhoneNumberError("");
          if (
            response?.data?.data?.email?.length === 0 ||
            response?.data?.data?.address?.length === 0 ||
            response?.data?.data?.dob?.length === 0 ||
            response?.data?.data?.email === null ||
            response?.data?.data?.address === null ||
            response?.data?.data?.dob === null
          ) {
            setNonInfinipathSeeker(true);
          } else {
            navigate("/infinipath/myspace");
          }
        }
      })
      .catch((error) => {
        console.log(error);
        setLoader(false);
        setPhoneNumberError(
          "Failed to fetch user data, please try again later",
        );
      });
  };

  /**
   * @description: This function is used to get the user data from
   * @param data
   */
  const onSubmit = async (data: formData) => {
    if (isOTPEntered && otp?.length === 6 && disableButtons.verifyOTP) {
      setLoader(true);
      verifyOTP(otp);
    } else if (!isOTPEntered) {
      setLoader(true);
      const phoneWithoutCountryCode = data?.phone?.slice(countryCode?.length);
      const getUserPayload = {
        phone_number: phoneWithoutCountryCode,
        app_type: "infinipath",
      };
      // setPhoneNumberWithoutCountryCode(phoneWithoutCountryCode);
      validateUser(getUserPayload, data);
      // getUserByPhoneNumber(getUserPayload, data);
    }
  };

  /**
   * @description: This function is used to handle the form submit
   * @param data
   */
  const handleFormSubmit = (data: unknown) => {
    setPhoneNumberError("");
    onSubmit(data);
  };

  const [signIn, setSignIn] = useState(false);
  const [phone, setPhone] = useState<string>("91");

  /**
   * @description: This function is used to handle the seeker signup
   */

  const handleSeekerSignup = () => {
    const phoneWithoutCountryCodeForSignup = signUpData?.phone?.slice(
      signUpData?.countryCode?.length,
    );
    const formattedDob = formatDateToISOString(signUpData?.dob);
    const signUpPayload = {
      phoneNumber: phoneWithoutCountryCodeForSignup,
      fullName: signUpData?.firstName + " " + signUpData?.lastName,
      firstName: signUpData?.firstName,
      lastName: signUpData?.lastName,
      appType: "infinipath",
      email: signUpData?.email,
      faceUrl: "",
      profileUrl: "",
      address: signUpData?.city,
      dob: formattedDob,
      countryCode: signUpData?.countryCode?.startsWith("+")
        ? signUpData?.countryCode
        : `+${signUpData?.countryCode}`,
      ...(signUpData?.city === "Other" && {
        otherAddress: signUpData?.otherCity,
      }),
    };

    postCall(endPoints.users, signUpPayload)
      .then((response) => {
        if (response?.data?.statusCode === 200) {
          setLoader(false);
          setItemInLocalStorage("seekerDetails", response?.data?.data);
          if (response?.data?.data?.faceUrl?.length > 0) {
            navigate("/infinipath/myspace");
          } else {
            /**Handling faceID enrollment here if face_url is not present for seekers */
            setAddFaceUrl(true);
          }
        }
      })
      .catch((error) => {
        console.log(error);
        setLoader(false);
      });
  };

  /**
   * @description: This function is used to handle enter key press to submit form
   * @param event
   */
  const handleKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (event.key === "Enter") {
      if (otp?.length !== 6) {
        event.preventDefault();
        handleSubmit(handleFormSubmit)();
      } else {
        verifyOTP(otp);
      }
    }
  };

  /**
   * @description: This function is used to verify that the OTP is entered
   * @param otp
   * @param isComplete
   */
  const verifyOTPEntered = (otp: string, isComplete: boolean) => {
    if (otp?.length === 6) {
      setOtp(otp);
      setDisableButtons({ verifyOTP: !isComplete });
    } else {
      setOtp("");
      setDisableButtons({ verifyOTP: !isComplete });
    }
  };

  /**
   * @description: This function is used to handle the signup form submit
   * @param data
   */
  const signUpHandler = (data: unknown) => {
    setLoader(true);
    setSignUpData(data);
    // const formatPh = "+" + data?.phone;
    setPhoneNumberError("");
    const phoneWithoutCountryCode = data?.phone?.slice(
      data?.countryCode?.length,
    );
    const getUserPayload = {
      phone_number: phoneWithoutCountryCode,
      app_type: "infinipath",
    };
    validateUser(getUserPayload, data);
  };

  /**
   * @description: This function is used to resend the OTP
   * @param phone if it is signin flow, else it will be undefined and signupData.phone will be used
   */
  const resendOtp = (phone: string) => {
    setLoader(true);
    if (signUpData) {
      const formatPh = "+" + signUpData?.phone;
      onCaptchVerify(formatPh);
    } else {
      const formatPh = "+" + phone;
      onCaptchVerify(formatPh);
    }
  };

  useEffect(() => {
    setPhoneNumberError("");
  }, [phone]);

  const handleSignIn = () => {
    setSignIn(!signIn);
    setPhoneNumberError("");
    setSignUpData(null);
    setPhone("+91");
    setValue("phone", "");
  };

  const editLoginForm = () => {
    if (signUpData) {
      setSignIn(true);
      setIsOTPEntered(false);
      setOtp("");
      setDisableButtons({ verifyOTP: true });
      setOtpError("");
    } else {
      setSignIn(false);
      setIsOTPEntered(false);
      setOtp("");
      setDisableButtons({ verifyOTP: true });
      setOtpError("");
    }
  };

  const handleSignInWithFaceNavigate = () => {
    window.location.replace("/verifyuserface?login=true");
  };

  /**
   * @param @description: This function is used to validate the user exist or not
   * @param data: form data
   */
  const validateUser = (payload: getUserPayload, data: formData) => {
    const formatPh = "+" + data?.phone;
    getCallWithoutAuth(
      `users/${payload?.phone_number}/validate?appType=infinipath`,
    )
      .then((res) => {
        if (res?.data?.statusCode === 200) {
          setUserIdFromValidateAPI(res?.data?.data?.userId);
          // Here signIn state is for signupForm
          if (signIn) {
            setLoader(false);
            setPhoneNumberError("Phone number already exists, please sign in");
          } else {
            onCaptchVerify(formatPh);
          }
        } else if (res?.data?.statusCode === 400) {
          // Here signIn state is for signupForm
          if (signIn) {
            onCaptchVerify(formatPh);
          } else {
            setLoader(false);
            setPhoneNumberError("User does not exist, please sign up");
          }
        }
      })
      .catch((err) => {
        console.log("validateUser", err);
        setLoader(false);
        setPhoneNumberError("Failed to send the OTP, please try again later");
      });
  };

  return (
    <div
      className={styles.organisationLandingPage}
      data-testid="organisation-landing-page"
    >
      <div className={styles.bgImageIcon} data-testid="bg-image-icon"></div>

      <div className={styles.cardsWrapper} data-testid="cards-wrapper">
        <div id="recaptcha-container" data-testid="recaptcha-container"></div>
        <div className={styles.cards} data-testid="cards">
          {signIn ? (
            <>
              <Signup
                signIn={signIn}
                handleSignIn={handleSignIn}
                signUpHandler={signUpHandler}
                loader={loader}
                signUpData={signUpData}
                phoneNumberError={phoneNumberError}
                setPhoneNumberError={setPhoneNumberError}
                data-testid="signup-component"
              />
            </>
          ) : nonInfinipathSeeker ? (
            <NonInfinipathSeekerForm
              phoneNumber={signUpData?.phone}
              countryCode={signUpData?.countryCode}
              signUpData={signUpData}
              loader={loader}
              setPhoneNumberError={setPhoneNumberError}
              setNonInfinipathSeeker={setNonInfinipathSeeker}
              data-testid="exist-seeker-form"
              setLoader={setLoader}
            />
          ) : !addFaceUrl ? (
            <>
              <div
                className={styles.signInSection1}
                data-testid="sign-in-section-1"
              >
                <div className={styles.signIn} data-testid="sign-in">
                  {signUpData && !isOTPEntered ? (
                    <img
                      src={signUpImage}
                      alt="Sign-up image"
                      data-testid="sign-up-image"
                    />
                  ) : (
                    <>
                      {!isOTPEntered && (
                        <img
                          src={signInImage}
                          alt="Sign-in image"
                          data-testid="sign-up-image"
                        />
                      )}
                      {!isOTPEntered && skipFaceVerify && (
                        <p data-testid="enter-mobile-number">
                          Enter mobile number
                        </p>
                      )}
                    </>
                  )}
                </div>
                {signInWithFace ? (
                  /** Sign in with Face ID */
                  <div
                    className={styles.signInWithFace}
                    data-testid="sign-in-with-face"
                  >
                    <p
                      className={`${styles.signInCaption} ${styles.signInCaptionPaddingTop}`}
                      data-testid="sign-in-caption"
                    >
                      capture your face for <br></br>quick authentication
                    </p>
                    <img
                      src={faceLoginIcon}
                      alt="faceicon"
                      data-testid="face-login-icon"
                    />
                    <div
                      className={styles.signInWithFaceButtonDiv}
                      data-testid="sign-in-face-buttons"
                    >
                      <Button
                        buttonClassName={styles.submitButton}
                        onClick={() => navigate("/verifyuserface?login=true")}
                        datatestid="capture-face-button"
                        datatestidText="capture-face"
                      >
                        sign in using face ID
                      </Button>
                      <div className={styles.orDiv} data-testid="or-divider">
                        <GrayLine />
                        or
                        <GrayLine />
                      </div>
                      <Button
                        buttonClassName={styles.submitButtonSecondary}
                        onClick={() => navigate("/login?skipFaceVerify=true")}
                        datatestid="sign-in-otp-button"
                        datatestidText="sign-in-otp"
                      >
                        sign in using OTP
                      </Button>
                      <div
                        className={styles.createText}
                        data-testid="create-text"
                      >
                        {"Create account?"}{" "}
                        <span
                          className={styles.signUpText}
                          onClick={handleSignIn}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault(); // Prevent form submission
                              handleSignIn();
                            }
                          }}
                          data-testid="sign-up-text"
                          tabIndex={0} // Make the element focusable with the Tab key
                          role="button" // Indicate that the element acts as a button
                          aria-label="Sign up" // Provide an accessible label
                        >
                          sign up
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  /** Sign in with phone number and OTP*/
                  <form
                    onSubmit={handleSubmit(handleFormSubmit)}
                    onKeyDown={handleKeyDown}
                    className={styles.formTag}
                    data-testid="login-form"
                  >
                    {!isOTPEntered ? (
                      <>
                        <div
                          className={styles.labelInput}
                          data-testid="mobile-input-field"
                        >
                          <div className={styles.labelText}>Mobile number*</div>
                          <div className={styles.fieldBlock}>
                            <PhoneInput
                              country={"IN"}
                              value={phone}
                              onChange={(phone: string, country: unknown) => {
                                setCountryCode(country?.dialCode);
                                const cleanedPhone = phone
                                  ? phone.replace(/-/g, "")
                                  : "";
                                setPhone(cleanedPhone);
                                setValue("phone", cleanedPhone);
                                clearErrors("phone");
                              }}
                              containerClass={styles.loginCustomContainer}
                              inputClass={`${styles.loginCustomInput} ${errors.phone ? styles.errorFieldPhone : ""}`}
                              buttonClass={styles.loginCustomButton}
                              dropdownClass={styles.loginCustomDropdown}
                              enableSearch={true}
                              disableSearchIcon={true}
                              countryCodeEditable={false}
                              inputProps={{
                                ref: mobileInputRef,
                                autoFocus: true,
                                "data-testid": "phone-input-field",
                              }}
                              data-testid="phone-input"
                            />
                          </div>
                          {/* Showing invalid phone number error */}
                          {errors.phone && (
                            <div
                              className={styles.error}
                              data-testid="phone-number-error"
                            >
                              {errors.phone.message}
                            </div>
                          )}
                          {/* Showing phone number doest not exist error */}
                          {phoneNumberError && !errors.phone && (
                            <div
                              className={styles.error}
                              data-testid="phone-error"
                            >
                              {phoneNumberError.includes(
                                "User does not exist, please sign up",
                              ) ? (
                                <>
                                  User does not exist, please
                                  <span
                                    className={styles.signUpText}
                                    onClick={handleSignIn}
                                    data-testid="sign-up-link"
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") {
                                        handleSignIn();
                                      }
                                    }}
                                    tabIndex={0} // Make the element focusable with the Tab key
                                    role="button" // Indicate that the element acts as a button
                                    aria-label="Sign up" // Provide an accessible label
                                  >
                                    &nbsp;sign up
                                  </span>
                                </>
                              ) : (
                                phoneNumberError
                              )}
                            </div>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className={styles.formFields}>
                        <div
                          className={styles.OTPForm}
                          data-testid="otp-section"
                        >
                          <div className={styles.text} data-testid="otp-text">
                            Confirm OTP
                          </div>
                          <div
                            className={styles.caption}
                            data-testid="otp-enter"
                          >
                            <span data-testid="enter-otp-text">
                              Enter the OTP sent to +
                              {signUpData
                                ? signUpData?.phone
                                : getValues("phone")}
                            </span>

                            <p>
                              Click here to{" "}
                              <span
                                className={styles.changeMobileNumber}
                                onClick={() => editLoginForm()}
                                data-testid="otp-change-mobile"
                              >
                                change your mobile number.
                              </span>
                            </p>
                          </div>
                          <OtpFields
                            onComplete={verifyOTPEntered}
                            setOtpError={setOtpError}
                            data-testid="otp-fields"
                          />
                          {otpError && (
                            <div
                              className={styles.error}
                              data-testid="otp-error"
                            >
                              {otpError}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    <div className={styles.buttonContainer}>
                      {!isOTPEntered && !loader && (
                        <>
                          <Button
                            buttonClassName={styles.submitButton}
                            type="submit"
                            datatestid="get-otp-button"
                            datatestidText="get-otp"
                          >
                            get OTP
                          </Button>
                          <div
                            className={styles.orDiv2}
                            data-testid="or-divider"
                          >
                            <GrayLine />
                            or
                            <GrayLine />
                          </div>
                          <Button
                            buttonClassName={styles.submitButtonSecondary}
                            onClick={() => handleSignInWithFaceNavigate()}
                            datatestid="sign-in-with-face-id-button"
                            datatestidText="sign-in-with-face-id"
                          >
                            sign in using face ID
                          </Button>
                          <div
                            className={styles.createText}
                            data-testid="create-account-text"
                          >
                            {"Create account?"}{" "}
                            <span
                              className={styles.signUpText}
                              onClick={handleSignIn}
                              data-testid="sign-up-link"
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  handleSignIn();
                                }
                              }}
                              tabIndex={0} // Make the element focusable with the Tab key
                              role="button" // Indicate that the element acts as a button
                              aria-label="Sign up" // Provide an accessible label
                            >
                              sign up
                            </span>
                          </div>
                        </>
                      )}
                      {isOTPEntered && !loader && (
                        <div
                          className={styles.otpResendDiv}
                          data-testid="otp-resend-div"
                        >
                          <Button
                            buttonClassName={`${styles.submitButton} ${styles.verifyBtnWidth}`}
                            type="button"
                            disable={disableButtons.verifyOTP}
                            onClick={() => {
                              // sendOTP();
                              verifyOTP(otp);
                            }}
                            datatestid="verify-otp-button"
                            datatestidText="verify"
                          >
                            verify
                          </Button>
                          {loader ? (
                            <Loader type="small" data-testid="loader" />
                          ) : (
                            <>
                              <span
                                className={styles.caption2}
                                data-testid="otp-caption"
                              >
                                did not receive an OTP?{" "}
                                <span
                                  className={styles.resend}
                                  onClick={() => {
                                    resendOtp(getValues("phone"));
                                  }}
                                  data-testid="resend-otp-link"
                                >
                                  resend OTP
                                </span>
                              </span>
                              {phoneNumberError && (
                                <div
                                  className={styles.errorResend}
                                  data-testid="phone-number-error"
                                >
                                  {phoneNumberError}
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      )}
                      {loader && <Loader type="small" data-testid="loader" />}
                    </div>
                  </form>
                )}
              </div>
            </>
          ) : (
            <div className={styles.signInWithFace}>
              <p
                className={`${styles.signInCaption} ${styles.paddingTop}`}
                data-testid="face-id-caption"
              >
                Your OTP is verified! Now, capture your <br></br>face for quick
                authentication.
              </p>
              <img
                src={faceLoginIcon}
                alt="faceicon"
                data-testid="face-id-icon"
                className={styles.faceIconSignup}
              />
              <div
                className={`${styles.signInWithFaceButtonDiv} ${styles.marginTopForBtns}`}
                data-testid="face-id-buttons"
              >
                <Button
                  buttonClassName={styles.submitButton}
                  onClick={() => navigate("/verifyuserface?enrollFaceId=true")}
                  datatestid="capture-face-id-button"
                  datatestidText="capture-face-id"
                >
                  capture my face ID
                </Button>
                <span
                  className={styles.skipText}
                  onClick={() => navigate("/infinipath/myspace")}
                  data-testid="skip-for-now-link"
                >
                  skip for now
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>

    //   );
  );
};
export default LoginScreen;
