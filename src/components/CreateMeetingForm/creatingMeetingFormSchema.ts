import dayjs from "dayjs";
import * as yup from "yup";
export const meetingFormSchema = yup.object().shape({
  meetingDate: yup
    .date()
    .required("Meeting date is required")
    .test(
      "is-not-in-past",
      "Please select a valid meeting date. Past dates are not allowed.",
      function (value) {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to start of the day
        return value >= today;
      },
    )
    .typeError("Entered date is invalid"),
  meetingTime: yup
    .date()
    .required("Meeting time is required")
    .test(
      "is-not-too-soon",
      "Please select a valid meeting time. Past times are not allowed.",
      function (value) {
        const meetingDate = this.parent.meetingDate;
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to start of the day
        meetingDate.setHours(0, 0, 0, 0); // Set to start of the day
        if (
          meetingDate.getFullYear() === today.getFullYear() &&
          meetingDate.getMonth() === today.getMonth() &&
          meetingDate.getDate() === today.getDate()
        ) {
          const currentTime = new Date();
          const currentHours = currentTime.getHours();
          const currentMinutes = currentTime.getMinutes();
          value = this.parent.meetingTime;
          const meetingHours = value.getHours();
          const meetingMinutes = value.getMinutes();
          // Compare the time parts
          if (
            meetingHours < currentHours ||
            (meetingHours === currentHours && meetingMinutes < currentMinutes)
          ) {
            return false;
          } else {
            return true;
          }
        }
        return true;
      },
    )
    .test(
      "is-not-too-so",
      "Meeting time must be at least 10 minutes from now if the meeting is today",
      function (value) {
        const meetingDate = this.parent.meetingDate;
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to start of the day
        meetingDate.setHours(0, 0, 0, 0); // Set to start of the day
        if (
          meetingDate.getFullYear() === today.getFullYear() &&
          meetingDate.getMonth() === today.getMonth() &&
          meetingDate.getDate() === today.getDate()
        ) {
          const now = new Date();
          now.setFullYear(value.getFullYear());
          now.setMonth(value.getMonth());
          now.setDate(value.getDate());
          const diff = value.getTime() - now.getTime(); // Difference in minutes
          const diffInMinutes = Math.floor(diff / (1000 * 60));
          return diffInMinutes >= 10;
        }
        return true;
      },
    ),
  registrationStartDate: yup
    .date()
    .required("Registration start date is required")
    .test(
      "is-before-meeting-date",
      "Registration start date must be before meeting date",
      function (value) {
        const meetingDate: Date = this.parent.meetingDate;

        meetingDate.setHours(0, 0, 0, 0); // Set to start of the day
        value.setHours(0, 0, 0, 0);
        return meetingDate >= value;
      },
    )
    .test(
      "is-not-in-past",
      "Please select a valid registration date. Past dates are not allowed.",
      function (value) {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to start of the day
        return value >= today;
      },
    )
    .test(
      "is-before-registration-end",
      "Registration start date should be before registration end date",
      function (value) {
        const registrationEnd: Date = this.parent.registrationEndDate;
        value.setHours(0, 0, 0, 0); // Set to start of the day
        registrationEnd.setHours(0, 0, 0, 0); // Set to start of the day
        return value <= registrationEnd;
      },
    )
    .typeError("Entered date is invalid"),
  registrationStartTime: yup
    .date()
    .required("Registration start time is required")
    .test(
      "is-before-registration-end-time",
      "Registration start time should be before registration end time",
      function (value) {
        const registrationEndTime: Date = this.parent.registrationEndTime;
        const registrationStart = this.parent.registrationStartDate;
        const registrationEnd = this.parent.registrationEndDate;
        registrationStart.setHours(0, 0, 0, 0); // Set to start of the day
        registrationEnd.setHours(0, 0, 0, 0); // Set to start of the day
        if (
          registrationStart.getFullYear() === registrationEnd.getFullYear() &&
          registrationStart.getMonth() === registrationEnd.getMonth() &&
          registrationStart.getDate() === registrationEnd.getDate()
        ) {
          registrationEndTime.setFullYear(value.getFullYear());
          registrationEndTime.setMonth(value.getMonth());
          registrationEndTime.setDate(value.getDate());
          return value <= registrationEndTime;
        } else {
          return true;
        }
      },
    )
    .test(
      "is-before-meeting-date",
      "Registration start time should be before 10 minutes of meeting time",
      function (value) {
        const meetingDate: Date = this.parent.meetingDate;
        const registationstart: Date = this.parent.registrationStartDate;
        if (
          registationstart.getFullYear() === meetingDate.getFullYear() &&
          registationstart.getMonth() === meetingDate.getMonth() &&
          registationstart.getDate() === meetingDate.getDate()
        ) {
          const meetingTime: Date = this.parent.meetingTime;
          value.setFullYear(meetingTime.getFullYear());
          value.setMonth(meetingTime.getMonth());
          value.setDate(meetingTime.getDate());
          const diff = meetingTime.getTime() - value.getTime(); // Difference in minutes
          const diffInMinutes = Math.floor(diff / (1000 * 60));
          return diffInMinutes >= 10;
        }
        return true;
      },
    )
    .test(
      "is-not-too-soon",
      "Please select a valid registration start time. Past times are not allowed.",
      function (value) {
        const meetingDate = this.parent.registrationStartDate;
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to start of the day
        meetingDate.setHours(0, 0, 0, 0); // Set to start of the day
        if (
          meetingDate.getFullYear() === today.getFullYear() &&
          meetingDate.getMonth() === today.getMonth() &&
          meetingDate.getDate() === today.getDate()
        ) {
          const currentTime = new Date();
          const currentHours = currentTime.getHours();
          const currentMinutes = currentTime.getMinutes();
          const meetingHours = value.getHours();
          const meetingMinutes = value.getMinutes();
          // Compare the time parts
          if (
            meetingHours < currentHours ||
            (meetingHours === currentHours &&
              meetingMinutes + 10 < currentMinutes)
          ) {
            return false;
          } else {
            return true;
          }
        }
        return true;
      },
    ),
  registrationEndDate: yup
    .date()
    .required("Registration end date is required")
    .test(
      "is-before-meeting-date",
      "Registration end date must be before meeting date",
      function (value) {
        const meetingDate: Date = this.parent.meetingDate;
        meetingDate.setHours(0, 0, 0, 0); // Set to start of the day
        value.setHours(0, 0, 0, 0);
        return value <= meetingDate;
      },
    )
    .test(
      "is-not-in-past",
      "Please select a valid registration end date. Past dates are not allowed.",
      function (value) {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to start of the day
        return value >= today;
      },
    )
    .test(
      "is-before-registration-end",
      "Registration end date should be after registration start date",
      function (value) {
        const registrationEnd: Date = this.parent.registrationStartDate;
        value.setHours(0, 0, 0, 0); // Set to start of the day
        registrationEnd.setHours(0, 0, 0, 0); // Set to start of the day
        return value >= registrationEnd;
      },
    )
    .typeError("Entered date is invalid"),
  registrationEndTime: yup
    .date()
    .required("Registration end time is required")
    .test(
      "is-before-meeting-date-end",
      "Registration End time should be before 10 minutes of meeting time",
      function (value) {
        const meetingDate: Date = this.parent.meetingDate;
        const registationEnd: Date = this.parent.registrationEndDate;
        if (
          registationEnd.getFullYear() === meetingDate.getFullYear() &&
          registationEnd.getMonth() === meetingDate.getMonth() &&
          registationEnd.getDate() === meetingDate.getDate()
        ) {
          const meetingTime = this.parent.meetingTime;
          meetingTime.setFullYear(value.getFullYear());
          meetingTime.setMonth(value.getMonth());
          meetingTime.setDate(value.getDate());
          // Calculate the difference in milliseconds
          const diffInMs = meetingTime.getTime() - value.getTime();
          const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
          return diffInMinutes >= 10;
        }
        return true;
      },
    )
    .test(
      "is-not-too-soon",
      "Please select a valid registration end time. Past times are not allowed",
      function (value) {
        const meetingDate = this.parent.registrationEndDate;
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to start of the day
        meetingDate.setHours(0, 0, 0, 0); // Set to start of the day
        if (meetingDate.getTime() === today.getTime()) {
          const currentTime = new Date();
          const currentHours = currentTime.getHours();
          const currentMinutes = currentTime.getMinutes();
          const meetingHours = value.getHours();
          const meetingMinutes = value.getMinutes();

          // Compare the time parts
          if (
            meetingHours < currentHours ||
            (meetingHours === currentHours &&
              meetingMinutes + 10 < currentMinutes)
          ) {
            return false;
          } else {
            return true;
          }
        }
        return true;
      },
    )
    .test(
      "is-before-registration-start-time",
      "Registration end time should be after registration start time",
      function (value) {
        const registrationStartTime: Date = this.parent.registrationStartTime;
        const registrationStart = this.parent.registrationStartDate;
        const registrationEnd = this.parent.registrationEndDate;
        registrationStart.setHours(0, 0, 0, 0); // Set to start of the day
        registrationEnd.setHours(0, 0, 0, 0); // Set to start of the day
        if (
          registrationStart.getFullYear() === registrationEnd.getFullYear() &&
          registrationStart.getMonth() === registrationEnd.getMonth() &&
          registrationStart.getDate() === registrationEnd.getDate()
        ) {
          registrationStartTime.setFullYear(value.getFullYear());
          registrationStartTime.setMonth(value.getMonth());
          registrationStartTime.setDate(value.getDate());
          return value >= registrationStartTime;
        } else {
          return true;
        }
      },
    ),
  title: yup.string().required("Title is required").max(50, ""),
  // access: yup.string().required("join access is required"),
  videoLimit: yup
    .number()
    .required("Video limit is required")
    .min(1, "Minimum should be 1")
    .max(1000, "Maximum should be 1000 ")
    .typeError("Video limit is required"),
  nonVideoLimit: yup
    .number()
    .required("Non-video limit is required")
    .min(1, "Minimum should be 1")
    .max(9000, "Maximum should be 9000")
    .typeError("Non-video limit is required"),
  preJoinTime: yup. mixed<dayjs.Dayjs>().required("Pre-join session time is required"),
});
