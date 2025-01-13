import { Controller, UseFormHandleSubmit, useForm } from "react-hook-form";
import styles from "./index.module.scss";
import { meetingFormSchema } from "./creatingMeetingFormSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import CustomDatePicker from "../../common/components/CustomDatePicker";
import CustomTimePicker from "../../common/components/CustomTimePicker";
import { Button } from "../../common/components/Button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  convertTimeToMinutes,
  convertToISOFormat,
  // createMeeting,
  formatTime,
  formatTimeString,
  getDateFromString,
  getDayOfWeek,
  getMonthAbbreviation,
  getYearBasedOnDate,
  replaceDashWithTo,
} from "../../utils/commonFunctions";
import { getItemInLocalStorage } from "../../services/localStorage";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import GrayLine from "../../common/components/GrayLine";
import TimeDropdown from "../../common/components/TimeDropDown";
import calendar from "../../assets/images/calendar.svg";
import clockIcon from "../../assets/images/clock.svg";
import SuccessPopUp from "../../common/components/SuccessPopUp";
// import minus from "../../assets/images/minus.svg";
// import add from "../../assets/images/add.svg";
import Loader from "../../common/components/Loader";
import RegistrationsOpenLayer from "../../common/components/RegistrationsOpenLayer";
import ArrowIcon from "../../assets/images/arrow-left.svg";
import { endPoints } from "../../constants/urlConstants";
import { postCall } from "../../services/apiService";
import CustomTimer from "../../common/components/CustomTimer";
import dayjs from "dayjs";

const getDefaultDates = (baseDate: Date = new Date()) => {
  const now = baseDate;
  const nextSunday = new Date(now);

  // Calculate the number of days to add to get to the next Sunday
  const daysToAdd = now.getDay() === 0 ? 7 : 7 - now.getDay();

  // Set the date to the next Sunday
  nextSunday.setDate(now.getDate() + daysToAdd);

  // Set the time to 10 AM
  nextSunday.setHours(10, 0, 0, 0);
  let registrationStart: Date;
  const isTuesdayAfter6PM = now.getDay() === 2 && now.getHours() >= 18; // Check if it's Tuesday after 6 PM
  if (isTuesdayAfter6PM) {
    registrationStart = new Date(now); // Set to current date and time
  } else {
    // Calculate the upcoming Tuesday
    const upcomingTuesday = new Date(now);
    upcomingTuesday.setDate(now.getDate() + ((2 + 7 - now.getDay()) % 7));
    upcomingTuesday.setHours(18, 0, 0, 0); // Set to 6 PM

    // If the upcoming Tuesday is before the meeting date, set registration start to that Tuesday
    if (upcomingTuesday < nextSunday) {
      registrationStart = upcomingTuesday;
    } else {
      registrationStart = new Date(now); // Set to current date and time
    }
  }

  const registrationEnd = new Date(nextSunday);
  registrationEnd.setMinutes(nextSunday.getMinutes() - 10); // Set to 10 minutes before meeting start time

  return {
    registrationStart,
    registrationEnd,
    meetingStart: nextSunday,
  };
};

const CreateMeetingForm = () => {
  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    getValues,
    watch,
    trigger,
  } = useForm({
    resolver: yupResolver(meetingFormSchema),
    mode: "onBlur",
  });

  const navigate = useNavigate();
  const [duration, setDuration] = useState("01h");
  const [durationTime, setDurationTime] = useState("10:00 a.m - 11:00 a.m");
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState("Weekly Growth Session");
  const seekerDetails = getItemInLocalStorage("seekerDetails");
  const registationstart = watch("registrationStartDate");
  const registrationEnd = watch("registrationEndDate");
  const registrationStartTimeWatch = watch("registrationStartTime");
  const registrationEndTimeWatch = watch("registrationEndTime");
  const meetingDateWatch = watch("meetingDate");
  const meetingTimeWatch = watch("meetingTime");
  const preJoinTimeWatch = watch("preJoinTime");
  const videoLimitWatch = watch("videoLimit");
  const nonVideoLimitWatch = watch("nonVideoLimit");
  const titleWatch = watch("title");
  const [meetingTitleForPopup, setMeetingTitleForPopup] = useState("");

  // Trigger validation when the following fields change
  useEffect(() => {
    trigger("registrationStartTime");
    trigger("registrationStartDate");
    trigger("registrationEndDate");
    trigger("registrationEndTime");
    trigger("meetingDate");
    trigger("meetingTime");
    trigger("videoLimit");
    trigger("nonVideoLimit");
    trigger("title");
    trigger("preJoinTime");
  }, [
    registrationStartTimeWatch,
    registrationEndTimeWatch,
    meetingDateWatch,
    meetingTimeWatch,
    registationstart,
    registrationEnd,
    videoLimitWatch,
    nonVideoLimitWatch,
    titleWatch,
    preJoinTimeWatch,
  ]);

  // Handle input change
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value.length <= 50) {
      setInputValue(value);
    } else {
      // Trim the input to the allowed length
      const trimmedValue = value.slice(0, 50);
      setInputValue(trimmedValue);
    }
  };

  // Adjust the date to local time
  const adjustToLocalTime = (date: Date) => {
    if (!isNaN(date.getTime())) {
      const offset = date.getTimezoneOffset() * 60000; // Get the offset in milliseconds
      const localTime = new Date(date.getTime() - offset); // Adjust the date by the offset
      return localTime.toISOString();
    } else {
      const today = new Date();
      today.setHours(18, 0, 0, 0); // Set the time to 6 PM
      return today.toISOString();
    }
  };

  const formattedRegistrationStart = registationstart
    ? adjustToLocalTime(new Date(registationstart))
    : "";
  const registrationStartTime = registationstart
    ? formatTime(adjustToLocalTime(new Date(registrationStartTimeWatch)))
    : "";
  const meetingStart = watch("meetingDate");

  const formattedMeetingStart = meetingStart
    ? adjustToLocalTime(new Date(meetingStart))
    : "";

  // Set default values for the form
  useEffect(() => {
    const defaultDates = getDefaultDates();
    setValue("title", "Weekly Growth Session");
    setValue("registrationStartDate", defaultDates.registrationStart);
    setValue("registrationEndDate", defaultDates.registrationEnd);
    setValue("registrationStartTime", defaultDates.registrationStart);
    setValue("registrationEndTime", defaultDates.registrationEnd);
    setValue("meetingTime", defaultDates.meetingStart);
    setValue("meetingDate", defaultDates.meetingStart);
    // setValue("access", "General");
    setValue("videoLimit", 950);
    setValue("nonVideoLimit", 9000);
    setValue("preJoinTime", dayjs().minute(15).second(0).millisecond(0));
  }, [setValue]);

  // Update registration dates based on the meeting date
  const updateRegistrationDates = (newMeetingDate: Date) => {
    const now = new Date();
    const isTomorrowTuesday = now.getDay() === 1; // Check if today is Monday
    const isMeetingTomorrowAt10AM =
      newMeetingDate.getHours() === 10 &&
      newMeetingDate.getDate() === now.getDate() + 1 &&
      newMeetingDate.getMonth() === now.getMonth(); // Check if meeting is tomorrow at 10 AM in the same month

    // If the meeting is tomorrow at 10 AM and today is Monday
    if (isTomorrowTuesday && isMeetingTomorrowAt10AM) {
      setValue("registrationStartDate", now); // Set registration start date to current date
      setValue("registrationStartTime", now); // Set registration start time to current time
    } else {
      // Check for the next Tuesday
      const nextTuesday = new Date(now);
      const currentDay = now.getDay();

      // Calculate the next Tuesday from the current day
      nextTuesday.setDate(now.getDate() + ((2 + 7 - currentDay) % 7 || 7));

      // Adjust nextTuesday for newMeetingDate in a different month
      if (
        newMeetingDate.getMonth() > now.getMonth() ||
        newMeetingDate.getFullYear() > now.getFullYear()
      ) {
        nextTuesday.setDate(now.getDate() + ((2 + 7 - currentDay) % 7 || 7));
      }

      // If nextTuesday is before the meeting date, set registration start date
      if (nextTuesday < newMeetingDate) {
        setValue("registrationStartDate", nextTuesday);
        setValue(
          "registrationStartTime",
          new Date(nextTuesday.setHours(18, 0, 0, 0)),
        ); // Set registration start time to 6 PM
      } else {
        setValue("registrationStartDate", now); // Set registration start date to current date
        setValue("registrationStartTime", now); // Set registration start time to current time
      }
    }

    // Set registration end date to 10 minutes before the meeting date
    setValue(
      "registrationEndDate",
      new Date(newMeetingDate.getTime() - 10 * 60000),
    ); // Set to 10 minutes before meeting date
  };
  // Call this function only when the meeting date changes
  const handleMeetingDateChange = (newMeetingDate: Date) => {
    setValue("meetingDate", newMeetingDate); // Update the meeting date
    updateRegistrationDates(newMeetingDate); // Update registration dates based on the new meeting date
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  // Create meeting API call
  const handleCreateMeeting = async (payload: unknown) => {
    setLoading(true);
    postCall(endPoints?.webinars, payload)
      .then((response: unknown) => {
        if (response?.data?.statusCode === 200) {
          setLoading(false);
          setShowPopup(true);
        } else {
          setLoading(false);
          const errorMessage =
            response?.data?.message ||
            "Failed to create meeting, please try again later";
          alert(errorMessage);
        }
      })
      .catch((error) => {
        console.log("Error creating meeting:", error);
        setLoading(false);
        alert("Failed to create meeting, please try again later");
      });
  };

  // Handle form submission
  const onSubmit = (
  
    data: UseFormHandleSubmit<
      {
        meetingDate: Date;
        meetingTime: Date;
        duration: Date;
        registrationStartDate: Date;
        registrationStartTime: Date;
        registrationEndDate: Date;
        registrationEndTime: Date;
        title: string;
        passcode: string;
      },
      undefined
    >,
  ) => {
    const payload = {
      // meeting_update: "CREATE",
      userId: seekerDetails?.id,
      title: data?.title,
      password: "Passcode1",
      startDate: convertToISOFormat(data?.meetingDate, data?.meetingTime),
      duration: Number(convertTimeToMinutes(duration)),
      startAt: convertToISOFormat(data?.meetingDate, data?.meetingTime),
      registrationStartsAt: convertToISOFormat(
        data?.registrationStartDate,
        data?.registrationStartTime,
      ),
      registrationEndsAt: convertToISOFormat(
        data?.registrationEndDate,
        data?.registrationEndTime,
      ),
      joinEnableTime: data?.preJoinTime.minute(),
      // meeting_id: 12, // for update
      // maxVideoLimit: data?.videoLimit,
      // maxNonVideoLimit: data?.nonVideoLimit,
      programSessionId: 1,
      createdBy: "Admin",
    };
    setMeetingTitleForPopup(data?.title);
    handleCreateMeeting(payload);
  };

  const handleNonVideoLimitInput = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    const invalidChars = ["-", ".", "e", "E"];
    if (invalidChars.includes(e.key)) {
      e.preventDefault();
    }
  };

  // console.log("errors", errors);
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };
  return (
    <div className={styles.meetingContainer} data-testid="meeting-container">
      {loading && <Loader type="large" />}
      <div className={styles.appTitle}>infinipath</div>
      <div className={styles.topShadow}>
        <div className={styles.breadcrumbs} data-testid="breadcrumbs">
          <div
            className={styles.backArrow}
            onClick={() => {
              navigate("/admin/home");
            }}
            data-testid="back-icon-container"
          >
            <img src={ArrowIcon} alt="back" data-testid="back-icon" />
          </div>
          <div
            className={styles.activeHome}
            data-testid="breadcrumb-nonactive-myspace"
            onClick={() => navigate("/admin/home")}
          >
            home
          </div>
          <div className={styles.nonActive} data-testid="breadcrumb-separator">
            /
          </div>
          <div
            className={styles.active}
            data-testid="breadcrumb-active-session"
          >
            create infinipath
          </div>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={styles.formContainer}
          data-testid="form-container"
        >
          <div
            className={styles.formWithoutButtons}
            data-testid="form-with-buttons"
          >
            <div data-testid="main-div">
              <div
                className={styles.subHeadingDiv}
                data-testid="sub-heading-div"
              >
                <p className={styles.titleHeading} data-testid="title-heading">
                  Configure your infinipath session
                </p>
                <GrayLine data-testid="gray-line" />
              </div>
              <p
                className={styles.subHeadingcontext}
                data-testid="sub-heading-context"
              >
                Set up your infinipath session with customizable options and
                preferences
              </p>
            </div>

            <div className={styles.formFieldsContainer}>
              <div className={styles.formRow}>
                <div className={styles.labelInput} data-testid="title-input">
                  <div className={styles.labelText}>
                    Enter a title for the infinipath
                  </div>
                  <div className={styles.fieldBlock} data-testid="field-block">
                    <input
                      data-testid="title-input"
                      {...register("title")}
                      value={inputValue}
                      onInput={handleInput}
                      onKeyDown={handleKeyDown}
                      className={`${styles.inputFields} ${errors.title ? styles.errorFields : ""}`}
                    />
                  </div>
                  {errors.title && (
                    <i className={styles.errorMsg} data-testid="title-est-id">
                      {errors.title.message}
                    </i>
                  )}
                </div>
              </div>
              <div>
                <p className={styles.subHeading}>
                  Set date & time for the session
                </p>
                <div className={styles.formRow}>
                  <div className={styles.formRowContainer} data-testid="">
                    <p className={styles.labelText} data-testid="">
                      Set date & time
                    </p>
                    <div>
                      <div
                        className={styles.formFieldMeeting}
                        data-testid="form-field-meeting"
                      >
                        <Controller
                          control={control}
                          {...register("meetingDate")}
                          render={({ field }) => (
                            <CustomDatePicker
                              value={field.value}
                              futureDate={false}
                              onChange={(date) => {
                                field.onChange(date);
                                handleMeetingDateChange(date);
                              }}
                              startDate={new Date()}
                              borderRight={true}
                              errorExist={
                                errors.meetingDate || errors.meetingTime
                                  ? true
                                  : false
                              }
                              error={
                                errors.meetingDate || errors.meetingTime
                                  ? true
                                  : false
                              }
                              errorMessage={errors.meetingDate?.message}
                              onKeyDown={handleKeyDown}
                              dataTestId="set-date"
                            />
                          )}
                        />
                      </div>
                      <div
                        className={styles.formFields}
                        data-testid="form-fields"
                      >
                        <LocalizationProvider
                          dateAdapter={AdapterDateFns}
                          data-testid="localization-provider"
                        >
                          <div
                            className={`${styles.textField} ${errors.meetingTime ? styles.errorInput : ""}`}
                            data-testid="meeting-time-text-field"
                          >
                            <Controller
                              name="meetingTime"
                              control={control}
                              render={({ field }) => (
                                <TimeDropdown
                                  errorExist={
                                    errors.meetingTime || errors.meetingDate
                                      ? true
                                      : false
                                  }
                                  onTimeSelect={(time) => {
                                    // Convert time string to Date object and update form
                                    const [hours, minutes] = time.split(":");
                                    const period = time.split(" ")[1];
                                    const newDate = new Date(field.value);
                                    let hours24 = parseInt(hours);
                                    if (period === "PM" && hours24 < 12) {
                                      hours24 += 12;
                                    } else if (
                                      period === "AM" &&
                                      hours24 === 12
                                    ) {
                                      hours24 = 0;
                                    }
                                    const meetingDate =
                                      getValues("meetingDate");
                                    const newDateMeeting = meetingDate;
                                    newDateMeeting.setHours(
                                      hours24,
                                      parseInt(minutes),
                                      0,
                                    );
                                    setValue("meetingTime", newDateMeeting);
                                    newDate.setHours(
                                      parseInt(hours),
                                      parseInt(minutes),
                                      0,
                                    );
                                  }}
                                  onDurationSelect={(Range) => {
                                    // Handle duration selection if needed
                                    setDuration(Range);
                                  }}
                                  getFormattedTime={(time) => {
                                    // Update form with formatted time
                                    setDurationTime(time);
                                    return time; // Return the time as a string
                                  }}
                                />
                              )}
                            />
                          </div>
                        </LocalizationProvider>
                      </div>
                    </div>
                    {errors.meetingDate && (
                      <i
                        className={styles.errorMsg}
                        data-testid="meeting-date-test-id"
                      >
                        {errors.meetingDate.message}
                      </i>
                    )}
                    {watch("meetingTime") &&
                      errors.meetingTime &&
                      !errors.meetingDate && (
                        <i
                          className={styles.errorMsg}
                          data-testid="meeting-time-test-id"
                        >
                          {errors.meetingTime.message}
                        </i>
                      )}
                    <p
                      className={styles.labelTextColored}
                      data-testid="label-text-colored"
                    >
                      Session Duration: {formatTimeString(duration)}
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <p className={styles.subHeading}>
                  Set date & time for the registration
                </p>
                <div className={styles.registrationsDiv}>
                  <div className={styles.formRow}>
                    <div
                      className={styles.formRowContainerRegistrations}
                      data-testid="form-row-container-registrations"
                    >
                      <div
                        className={styles.registerdiv}
                        data-testid="register-div"
                      >
                        <div
                          className={styles.RegisterDateDiv}
                          data-testid="register-date-div"
                        >
                          <p
                            className={styles.labelText}
                            data-testid="label-text-start-date"
                          >
                            Start date
                          </p>
                          <div
                            className={styles.formFieldsRegistrations}
                            data-testid="form-fields-registrations"
                          >
                            <Controller
                              name="registrationStartDate"
                              control={control}
                              render={({ field }) => (
                                <CustomDatePicker
                                  value={field.value}
                                  futureDate={true}
                                  onChange={(date) => {
                                    field.onChange(date);
                                  }}
                                  styleChange={true}
                                  startDate={new Date()}
                                  maxDate={
                                    getValues("meetingDate") ||
                                    getValues("registrationEndDate")
                                  }
                                  errorExist={!!errors.registrationStartDate}
                                  errorMessage={
                                    errors.registrationStartDate?.message
                                  }
                                  data-testid="custom-date-picker"
                                  onKeyDown={handleKeyDown}
                                  dataTestId="start-date"
                                />
                              )}
                            />
                          </div>
                        </div>
                        <div
                          className={styles.RegisterDateDiv}
                          data-testid="register-time-div"
                        >
                          <p
                            className={styles.labelText}
                            data-testid="label-text-start-time"
                          >
                            Start time
                          </p>
                          <div
                            className={styles.formFields}
                            data-testid="form-fields"
                          >
                            <Controller
                              name="registrationStartTime"
                              control={control}
                              render={({ field }) => (
                                <CustomTimePicker
                                  value={
                                    field.value ||
                                    new Date().setHours(18, 0, 0, 0)
                                  }
                                  errorExist={
                                    errors.registrationStartTime &&
                                    !errors.registrationStartDate
                                      ? true
                                      : false
                                  }
                                  onChange={(time: Date | null) => {
                                    if (time && !isNaN(time.getTime())) {
                                      setValue("registrationStartTime", time);
                                    }
                                  }}
                                  data-testid="custom-time-picker"
                                  onKeyDown={handleKeyDown}
                                  dataTestid="start"
                                />
                              )}
                            />
                          </div>
                        </div>
                      </div>
                      {errors.registrationStartDate && (
                        <i
                          className={styles.errorMsg}
                          data-testid="error-msg-start-date"
                        >
                          {errors.registrationStartDate.message}
                        </i>
                      )}
                      {errors.registrationStartTime &&
                        !errors.registrationStartDate && (
                          <i
                            className={styles.errorMsg}
                            data-testid="error-msg-start-time"
                          >
                            {errors.registrationStartTime.message}
                          </i>
                        )}
                    </div>
                  </div>
                  <div className={styles.formRow} data-testid="form-row">
                    <div
                      className={styles.formRowContainerRegistrations}
                      data-testid="form-row-container-registrations"
                    >
                      <div
                        className={styles.registerdiv}
                        data-testid="register-div"
                      >
                        <div
                          className={styles.RegisterDateDiv}
                          data-testid="register-date-div"
                        >
                          <p
                            className={styles.labelText}
                            data-testid="label-text-end-date"
                          >
                            End date
                          </p>
                          <div
                            className={styles.formFieldsRegistrations}
                            data-testid="form-fields-registrations"
                          >
                            <Controller
                              name="registrationEndDate"
                              control={control}
                              render={({ field }) => (
                                <CustomDatePicker
                                  value={field.value}
                                  futureDate={true}
                                  onChange={(date) => {
                                    field.onChange(date);
                                  }}
                                  styleChange={true}
                                  startDate={
                                    getValues("registrationStartDate") ||
                                    new Date()
                                  }
                                  maxDate={getValues("meetingDate")}
                                  error={!!errors.registrationEndDate}
                                  errorMessage={
                                    errors.registrationEndDate?.message
                                  }
                                  data-testid="custom-date-picker"
                                  onKeyDown={handleKeyDown}
                                  dataTestId="end-date"
                                />
                              )}
                            />
                          </div>
                        </div>
                        <div
                          className={styles.RegisterDateDiv}
                          data-testid="register-time-div"
                        >
                          <p
                            className={styles.labelText}
                            data-testid="label-text-end-time"
                          >
                            End time
                          </p>
                          <div
                            className={styles.formFields}
                            data-testid="form-fields"
                          >
                            <Controller
                              name="registrationEndTime"
                              control={control}
                              render={({ field }) => (
                                <CustomTimePicker
                                  value={
                                    getValues("registrationEndTime") ||
                                    new Date().setHours(18, 0, 0, 0) ||
                                    field.value
                                  }
                                  errorExist={
                                    errors.registrationEndTime ? true : false
                                  }
                                  onChange={(time: Date | null) => {
                                    if (time && !isNaN(time.getTime())) {
                                      setValue("registrationEndTime", time);
                                    }
                                  }}
                                  data-testid="custom-time-picker"
                                  onKeyDown={handleKeyDown}
                                  dataTestid="end"
                                />
                              )}
                            />
                          </div>
                        </div>
                      </div>
                      {errors.registrationEndDate && (
                        <i
                          className={styles.errorMsg}
                          data-testid="error-msg-end-date"
                        >
                          {errors.registrationEndDate.message}
                        </i>
                      )}
                      {errors.registrationEndTime &&
                        !errors.registrationEndDate && (
                          <i
                            className={styles.errorMsg}
                            data-testid="error-msg-end-time"
                          >
                            {errors.registrationEndTime.message}
                          </i>
                        )}
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.formRowLimit}>
                <div className={styles.limitDiv}>
                  <div className={styles.limitEach} data-testid="limit-each">
                    <div className={styles.eachRange} data-testid="each-range">
                      <p className={styles.labelFont} data-testid="label-font">
                        Set video registrations limit{" "}
                        <span
                          className={styles.labelText}
                          data-testid="label-text"
                        >
                          <i>(Max: 1000)</i>
                        </span>
                      </p>
                      <div
                        className={styles.authenticationCard}
                        data-testid="authentication-card"
                      >
                        {/* <img
                          src={minus}
                          onClick={() =>
                            setValue("videoLimit", getValues("videoLimit") - 1)
                          }
                          alt="minus"
                          className={`${styles.minus} ${watch("videoLimit") <= 1 ? styles.disabled : ""}`}
                          style={{
                            cursor:
                              watch("videoLimit") <= 1
                                ? "not-allowed"
                                : "pointer",
                          }}
                          data-testid="minus-button"
                        /> */}
                        <input
                          type="number"
                          {...register("videoLimit", { valueAsNumber: true })}
                          className={styles.enrolledText}
                          data-testid="video-limit-input"
                          onKeyDown={handleNonVideoLimitInput}
                        />
                        {/* <img
                          src={add}
                          onClick={() =>
                            setValue("videoLimit", getValues("videoLimit") + 1)
                          }
                          alt="add"
                          className={`${styles.increment} ${watch("videoLimit") >= 1000 ? styles.disabled : ""}`}
                          style={{
                            cursor:
                              watch("videoLimit") >= 1000
                                ? "not-allowed"
                                : "pointer",
                          }}
                          data-testid="add-button"
                        /> */}
                      </div>
                    </div>
                    {errors.videoLimit && (
                      <p
                        className={styles.errorMsg}
                        data-testid="error-msg-video-limit"
                      >
                        {errors.videoLimit.message}
                      </p>
                    )}
                  </div>
                  <div className={styles.limitEach} data-testid="limit-each">
                    <div className={styles.eachRange} data-testid="each-range">
                      <p className={styles.labelFont} data-testid="label-font">
                        {" "}
                        Set non-video registrations limit{" "}
                        <i
                          className={styles.labelText}
                          data-testid="label-text"
                        >
                          (Max: 9000)
                        </i>
                      </p>
                      <div
                        className={styles.authenticationCard}
                        data-testid="authentication-card"
                      >
                        {/* <img
                          src={minus}
                          onClick={() =>
                            setValue(
                              "nonVideoLimit",
                              getValues("nonVideoLimit") - 1,
                            )
                          }
                          alt="minus"
                          className={`${styles.minus} ${watch("nonVideoLimit") <= 1 ? styles.disabled : ""}`}
                          style={{
                            cursor:
                              watch("nonVideoLimit") <= 1
                                ? "not-allowed"
                                : "pointer",
                          }}
                          data-testid="minus-button"
                        /> */}
                        <input
                          type="number"
                          {...register("nonVideoLimit", {
                            valueAsNumber: true,
                          })}
                          className={styles.enrolledText}
                          data-testid="non-video-limit-input"
                          onKeyDown={handleNonVideoLimitInput}
                        />
                        {/* <img
                          src={add}
                          onClick={() =>
                            setValue(
                              "nonVideoLimit",
                              getValues("nonVideoLimit") + 1,
                            )
                          }
                          alt="add"
                          className={`${styles.increment} ${watch("nonVideoLimit") >= 9000 ? styles.disabled : ""}`}
                          style={{
                            cursor:
                              watch("nonVideoLimit") >= 9000
                                ? "not-allowed"
                                : "pointer",
                          }}
                          data-testid="add-button"
                        /> */}
                      </div>
                    </div>
                    {errors.nonVideoLimit && (
                      <i
                        className={styles.errorMsg}
                        data-testid="error-msg-non-video"
                      >
                        {errors.nonVideoLimit.message}
                      </i>
                    )}
                  </div>
                </div>
             
              </div>
            </div>
       
            <div className={styles.timers}>
                      <p className={styles.labelFont} data-testid="label-font">
                      Pre-session joining time
                      </p>
                      <div
                        data-testid="authentication-card"
                      >
                 <Controller
                              name="preJoinTime"
                              control={control}
                              render={({ field }) => (
                                <CustomTimer
                                  value={
                                    getValues("preJoinTime") ||
                                    field.value
                                  }
                                  errorExist={
                                    errors.registrationEndTime ? true : false
                                  }
                                  onChange={(date) => {
                                    field.onChange(date);
                                    console.log("check it",dayjs(date).minute())
                                  }}
                                  data-testid="custom-time-picker"
                                  onKeyDown={handleKeyDown}
                                  dataTestid="end"
                                />
                              )}
                            />
                    </div>
                    {errors.preJoinTime && (
                      <i
                        className={styles.errorMsg}
                        data-testid="error-msg-non-video"
                      >
                        {errors.preJoinTime.message}
                      </i>
                    )}
                  </div>
            
            <div className={styles.floatRegistration}>
              <RegistrationsOpenLayer
                registrationStartsAt={formattedRegistrationStart}
                formattedTime={registrationStartTime}
                registrationStartDataTestId="registration-start-date-create-meeting"
                formattedTimeDataTestId="registration-start-time-create-meeting"
                cardTitle="Registrations open on"
              />
              <div className={styles.cardContainer}>
                <div className={styles.cardContent} data-testid="card-content">
                  <span
                    className={styles.titleDisplay}
                    data-testid="title-display"
                  >
                    {inputValue}
                  </span>
                  <div className={styles.dateTime} data-testid="date-time">
                    <div
                      className={styles.calendar}
                      data-testid="calendar-date"
                    >
                      <img
                        src={calendar}
                        alt="calendar icon"
                        data-testid="calendar-icon"
                      />
                      <span data-testid="formatted-date">
                        {getDayOfWeek(formattedMeetingStart)},{" "}
                        {getDateFromString(formattedMeetingStart)}-
                        {getMonthAbbreviation(formattedMeetingStart)}-
                        {getYearBasedOnDate(formattedMeetingStart)}
                      </span>
                    </div>
                    <div
                      className={styles.calendar}
                      data-testid="calendar-time"
                    >
                      <img
                        src={clockIcon}
                        alt="clock icon"
                        data-testid="clock-icon"
                      />
                      <p data-testid="duration-time">
                        {replaceDashWithTo(durationTime)} IST
                      </p>
                      <span className={styles.timer} data-testid="timer">
                        {duration}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.divWithButtons}>
            <GrayLine />
            <div className={styles.formRowButton}>
              <Button
                type="button"
                buttonClassName={styles.buttonContainerSecondary}
                buttonTextClassName={styles.buttonTextSecondary}
                onClick={() => {
                  navigate("/admin/home");
                }}
                datatestid="create-meeting-cancel-button"
                datatestidText="create-meeting-cancel"
              >
                cancel
              </Button>
              <Button
                type="submit"
                buttonClassName={styles.buttonContainer}
                buttonTextClassName={styles.buttonText}
                datatestid="create-meeting-button"
                datatestidText="create-meeting-confirm"
              >
                confirm
              </Button>
            </div>
          </div>
        </form>
      </div>
      {showPopup && (
        <SuccessPopUp
          open={showPopup}
          onclose={closePopup}
          onConfirm={() => navigate("/admin/home")}
          onCancel={closePopup}
          confirmText="home"
          cancelText="cancel"
          confirmDataTestId="create-meeting-confirm-popup"
          cancelDataTestId="create-meeting-cancel-popup"
          title={meetingTitleForPopup}
        />
      )}
    </div>
  );
};
export default CreateMeetingForm;
