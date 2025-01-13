import { useNavigate } from "react-router-dom";
import { endPoints } from "../constants/urlConstants";
import { deleteCall, getCall, postCall } from "../services/apiService";
import {
  getItemInLocalStorage,
  setItemInLocalStorage,
} from "../services/localStorage";

export function formatDateTime(
  dateTimeString: string,
  options: {
    showDayOfWeek?: boolean;
    use24HourFormat?: boolean;
  } = {},
): string {
  // Parse the input string manually to ensure correct IST interpretation
  const [datePart, timePart] = dateTimeString.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);

  // Create a date object in local time zone (which should be IST)
  const date = new Date(year, month - 1, day, hour, minute);

  // Get day of the week
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const dayOfWeek = daysOfWeek[date.getDay()];

  // Get hours and minutes
  let hours = date.getHours();
  const minutes = date.getMinutes();

  let timeString = "";

  if (options.use24HourFormat) {
    // 24-hour format
    timeString = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
  } else {
    // 12-hour format
    const ampm = hours >= 12 ? "p.m." : "a.m.";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    timeString = `${hours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
  }

  // Construct the formatted string
  return options.showDayOfWeek ? `${dayOfWeek}, ${timeString}` : timeString;
}

export function formatDateTimeCustom(dateTimeString: string): string {
  // Parse the input string manually to ensure correct IST interpretation
  const [datePart, timePart] = dateTimeString.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);

  // Create a date object in local time zone (which should be IST)
  const date = new Date(year, month - 1, day, hour, minute);

  // Get month abbreviation
  const months = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];
  const monthAbbr = months[date.getMonth()];

  // Get day of the week
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const dayOfWeek = daysOfWeek[date.getDay()];

  // Get hours and minutes
  let hours = date.getHours();
  const minutes = date.getMinutes();

  // 12-hour format
  const ampm = hours >= 12 ? "p.m." : "a.m.";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'

  // Construct the formatted string
  return `${monthAbbr} ${day.toString().padStart(2, "0")}, ${dayOfWeek} at ${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")} ${ampm}`;
}

export function getMonthAbbreviation(dateTimeString: string): string {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Extract the month from the date string
  const monthIndex = parseInt(dateTimeString.split("-")[1], 10) - 1;

  // Return the corresponding month abbreviation
  return months[monthIndex];
}

export function getDateFromString(dateTimeString: string): number {
  // Extract the date part from the string
  const datePart = dateTimeString?.split("T")[0];

  // Split the date part and get the day
  const day = parseInt(datePart?.split("-")[2], 10);

  return day.toString().padStart(2, "0");
}

export function formatTime(dateTimeString: string): string {
  // Extract the time part from the string
  const timePart = dateTimeString.split("T")[1];

  // Split the time part and get hours and minutes
  const [hours, minutes] = timePart.split(":").map(Number);

  // Determine if it's AM or PM
  const period = hours >= 12 ? "p.m." : "a.m.";

  // Convert to 12-hour format
  const hours12 = hours % 12 || 12;

  // Format the time string
  return `${hours12}:${minutes.toString().padStart(2, "0")} ${period}`;
}

export function getFutureTime(
  startDate: string,
  durationMinutes: number,
): string {
  // Parse the start date
  const [datePart, timePart] = startDate.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);

  // Create a Date object and add the duration
  const futureDate = new Date(year, month - 1, day, hour, minute);
  futureDate?.setMinutes(futureDate.getMinutes() + durationMinutes);

  // Extract hours and minutes from the future date
  let futureHours = futureDate.getHours();
  const futureMinutes = futureDate.getMinutes();

  // Determine AM or PM
  const period = futureHours >= 12 ? "p.m." : "a.m.";

  // Convert to 12-hour format
  futureHours = futureHours % 12 || 12;

  // Format the time string
  return `${futureHours}:${futureMinutes.toString().padStart(2, "0")} ${period}`;
}

/**
 * @description this function is used to parse the ISO date to local date, when the dateString directly converting to date object it will converting to +5.30 hrs and making my day to next day
 * @param dateTimeString
 * @returns
 */
export function parseISOToLocalDate(dateTimeString: string): Date {
  // Parse the ISO string manually to avoid automatic time zone conversion
  const [datePart, timePart] = dateTimeString.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hours, minutes, seconds] = timePart.split(":").map((part) => {
    // Handle milliseconds and timezone information
    const [mainPart] = part.split(".");
    return Number(mainPart);
  });

  // Create a new Date object in local time
  const localDate = new Date(year, month - 1, day, hours, minutes, seconds);

  return localDate;
}

export function getDayOfWeek(dateTimeString: string): string {
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  // Create a Date object from the input string
  const date = dateTimeString && parseISOToLocalDate(dateTimeString);

  // Get the day of the week (0-6, where 0 is Sunday)
  const dayIndex = date ? date.getDay() : 0;

  // Return the corresponding day name
  return daysOfWeek[dayIndex];
}

// Utility function to capitalize each word
export const capitalizeWords = (str: string) =>
  str?.replace(/\S+/g, (word) => word.charAt(0).toUpperCase() + word.slice(1));

export function formatDateTimeWithHiphens(
  dateTimeString: string,
  includeTime: boolean = true,
): string {
  // Parse the input string manually to ensure correct IST interpretation
  const [datePart, timePart] = dateTimeString.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);

  // Create a date object in local time zone (which should be IST)
  const date = new Date(year, month - 1, day, hour, minute);

  // Get month abbreviation
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const monthAbbr = months[date.getMonth()];

  // Get day of the week
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const dayOfWeek = daysOfWeek[date.getDay()];

  // Get hours and minutes
  let hours = date.getHours();
  const minutes = date.getMinutes();

  // 12-hour format
  const ampm = hours >= 12 ? "p.m" : "a.m.";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'

  // Base formatted string
  const dateString = `${dayOfWeek}, ${day.toString().padStart(2, "0")}-${monthAbbr}-${year.toString()}`;

  // Add time only if includeTime is true
  if (includeTime) {
    return `${dateString} at ${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")} ${ampm}`;
  }

  return dateString;
}

export function calculateTimeForMeeting(
  meetingDateTimeString: string,
): string | null {
  // console.log(meetingDateTimeString, "meetingDateTimeString");
  const currentDateTime = new Date();
  // const meetingDateTime = new Date(meetingDateTimeString);

  // Parse the ISO string manually to avoid automatic time zone conversion
  const [datePart, timePart] = meetingDateTimeString.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hoursEnd, minutesEnd, secondsEnd] = timePart.split(":").map((part) => {
    // Handle milliseconds and timezone information
    const [mainPart] = part.split(".");
    return Number(mainPart);
  });

  // Create a new Date object in local time
  const meetingDateTime = new Date(
    year,
    month - 1,
    day,
    hoursEnd,
    minutesEnd,
    secondsEnd,
  );

  // Calculate the time difference in milliseconds
  const timeDifference =
    meetingDateTime?.getTime() - currentDateTime?.getTime();

  if (timeDifference <= 0) {
    // If the meeting time is now or has already passed
    return null;
  }

  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  // Pluralization helper
  const pluralize = (value: number, unit: string) =>
    `${value} ${unit}${value === 1 ? "" : "s"}`;

  if (days > 0) {
    const remainingHours = hours % 24;
    return `${pluralize(days, "day")} ${pluralize(remainingHours, "hr")}`;
  } else if (hours > 0) {
    const remainingMinutes = minutes % 60;
    return `${pluralize(hours, "hr")} ${pluralize(remainingMinutes, "min")}`;
  } else if (minutes > 0) {
    const remainingSeconds = seconds % 60;
    return `${pluralize(minutes, "min")} ${pluralize(remainingSeconds, "sec")}`;
  } else {
    return `${pluralize(seconds, "sec")}`;
  }
}

// GET YEAR FROM DATE STRING
export function getYearBasedOnDate(dateTimeString: string): string {
  // Extract the year from the date string
  return dateTimeString.split("-")[0];
}

/**
 * Removes the country code from a phone number.
 * @param phoneNumber - The phone number with country code.
 * @param countryCode - The country code to remove.
 * @returns The phone number without the country code.
 */
export function removeCountryCode(
  phoneNumber: string,
  countryCode: string,
): string {
  // Ensure the country code starts with a plus sign
  if (countryCode.startsWith("+")) {
    countryCode = countryCode.slice(1);
  }

  // Remove the country code from the phone number
  if (phoneNumber.startsWith(countryCode)) {
    return phoneNumber.slice(countryCode.length);
  }
  console.log(phoneNumber.slice(countryCode.length), "phoneeea");

  // If the phone number does not start with the country code, return it as is
  return phoneNumber;
}

// Adjust the import path as necessary
export const fetchSearchMemberDetails = (
  userId: string,
  searchText: string,
  setLoading: (loading: boolean) => void,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setSeekersData: (data: any) => void,
  setErrorMsg: (message: string) => void,
) => {
  setLoading(true);
  getCall(`${endPoints.getUsers}?user_id=${userId}&search_string=${searchText}`)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .then((response: any) => {
      if (response?.data?.statusCode === 200) {
        setLoading(false);
        setSeekersData(response?.data?.data);
      } else {
        setLoading(false);
        console.error("Error:", response?.data?.message);
        setErrorMsg(response?.data?.message);
      }
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .catch((error: any) => {
      setLoading(false);
      console.error("Error:", error);
      setErrorMsg("Failed to fetch data");
    });
};

export const handleJoin = (
  verifiedSeekersIds: string[],
  isChecked: string[],
  setItemInLocalStorage: (key: string, value: unknown) => void,
  navigate: ReturnType<typeof useNavigate>,
) => {
  const attendanceIds = Array.from(
    new Set(
      [...verifiedSeekersIds, ...isChecked]?.filter(
        (id) => verifiedSeekersIds?.includes(id) && isChecked?.includes(id),
      ),
    ),
  );
  setItemInLocalStorage("verifiedSeekersIds", attendanceIds);
  navigate("/infinipath/zoom");
};

export const seekerExistanceCheck = (formattedPhone: unknown) => {
  const getUserPayload = {
    phone_number: formattedPhone,
    app_type: "infinipath",
  };
  return postCall(endPoints.getUser, getUserPayload)
    .then((response) => {
      if (response?.data?.statusCode === 200) {
        return response;
      }
      if (response?.data?.statusCode === 200) {
        return response;
      }
    })
    .catch((error) => {
      throw error;
    });
};

export const deleteSeekerAccount = (id: unknown) => {
  const seekerPayload = {
    // phone_number: phoneNumber,
    appType: "infinipath",
  };

  return deleteCall(`${endPoints.users}/${id}`, seekerPayload)
    .then((response) => {
      if (response?.data?.statusCode === 200) {
        return response;
      }
      return response;
    })
    .catch((error) => {
      throw error;
    });
};

export function formatDuration(minutes: number): string {
  // console.log(minutes, "minutes");
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  const formattedHours = hours.toString().padStart(2, "0");

  const formattedMinutes = remainingMinutes.toString().padStart(2, "0");
  if (hours === 0) {
    return `${formattedMinutes}m`;
  } else if (remainingMinutes === 0) {
    return `${formattedHours}h`;
  } else {
    return `${formattedHours}h ${formattedMinutes}m`;
  }
}

export const convertToISOFormat = (
  dateString: string,
  timeString?: string | Date,
): string => {
  const date = new Date(dateString);

  if (timeString instanceof Date) {
    const hours = timeString?.getHours();
    const minutes = timeString?.getMinutes();
    date.setHours(hours, minutes, 0, 0);
  } else if (typeof timeString === "string") {
    const [hours, minutes] = timeString.split(":").map(Number);
    date.setHours(hours, minutes, 0, 0);
  }
  // Adjust for the local time zone offset
  const offset = date.getTimezoneOffset();
  date.setMinutes(date.getMinutes() - offset);

  return date.toISOString();
};

// export const createMeeting = (
//   payload: unknown,
//   setLoading: (loading: boolean) => void,
// ) => {
//   setLoading(true);
//   return postCall(endPoints.webinars, payload)
//     .then((response) => {
//       if (response?.data?.statusCode === 200) {
//         setLoading(false);
//         return response;
//       }
//       setLoading(false);
//       return response;
//     })
//     .catch((error) => {
//       setLoading(false);
//       throw error;
//     });
// };

export const calculateEndTime = (
  startTime: string,
  duration: string,
): string => {
  const [time, period] = startTime.split(" ");
  const [hours, minutes] = time.split(":").map(Number);

  let durationMinutes = 0;
  if (duration.includes("h")) {
    const [hours, mins] = duration.split("h");
    durationMinutes = Number(hours) * 60;
    if (mins) {
      durationMinutes += Number(mins.replace("m", ""));
    }
  } else {
    durationMinutes = Number(duration.replace("m", ""));
  }

  let totalMinutes = hours * 60 + minutes;
  if (period === "PM" && hours !== 12) totalMinutes += 12 * 60;
  if (period === "AM" && hours === 12) totalMinutes = minutes;

  totalMinutes += durationMinutes;

  let newHours = Math.floor(totalMinutes / 60);
  const newMinutes = totalMinutes % 60;
  let newPeriod = "AM";

  if (newHours >= 12) {
    newPeriod = "PM";
    if (newHours > 12) newHours -= 12;
  }
  if (newHours === 0) newHours = 12;

  return `${newHours}:${newMinutes.toString().padStart(2, "0")} ${newPeriod}`;
};

export const convertTimeToMinutes = (timeString: string): string => {
  let totalMinutes = 0;

  // Extract hours and minutes using regular expressions
  const hoursMatch = timeString.match(/(\d+)h/);
  const minutesMatch = timeString.match(/(\d+)m/);

  // Convert hours to minutes and add to total minutes
  if (hoursMatch) {
    totalMinutes += parseInt(hoursMatch[1]) * 60;
  }

  // Add minutes to total minutes
  if (minutesMatch) {
    totalMinutes += parseInt(minutesMatch[1]);
  }

  return totalMinutes.toString();
};

export const formattedTime = (time: string): string => {
  return time.replace(/AM/, "a.m").replace(/PM/, "p.m").replace(/a.m./, "a.m");
};

export const replaceDashWithTo = (timeRange: string): string => {
  return timeRange.replace(" - ", " to ");
};

export const formatTimeString = (timeString: string): string => {
  const timePattern = /(\d{1,2})h\s*(\d{1,2})m/;
  const minutePattern = /(\d{1,2})m/;
  const hourPattern = /(\d{1,2})h/;
  if (timePattern.test(timeString)) {
    const match = timeString.match(timePattern);
    const hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const hourLabel = hours === 1 ? "hour" : "hours";
    const minuteLabel = "min";
    return `${hours} ${hourLabel} ${minutes} ${minuteLabel}`;
  } else if (minutePattern.test(timeString)) {
    const match = timeString.match(minutePattern);
    const minutes = parseInt(match[1], 10);
    const minuteLabel = "min";
    return `${minutes} ${minuteLabel}`;
  } else if (hourPattern.test(timeString)) {
    const match = timeString.match(hourPattern);
    const hours = parseInt(match[1], 10);
    const hourLabel = hours === 1 ? "hour" : "hours";

    return `${hours} ${hourLabel}`;
  } else {
    throw new Error("Invalid time format");
  }
};

/**
 * @description this function is used to get the admin latest meeting data
 * @param setLoading
 * @param setAdminMeetingData
 */
export const FetchMeetingDetails = (
  setLoading: (loading: boolean) => void,
  setAdminMeetingData: (data: unknown) => void,
) => {
  const userData = getItemInLocalStorage("seekerDetails");
  // ${endPoints.webinars}/?user_id=${userData?.phoneNumber}
  setLoading(true);
  getCall(`${endPoints.admin}/${userData?.id}/webinars`)
    .then((res) => {
      if (res?.data?.statusCode === 200) {
        setLoading(false);
        setAdminMeetingData(res?.data.data);
        setItemInLocalStorage("table_meeting_id", res?.data?.data?.meetingId);
      } else {
        setLoading(false);
        // setErrorMsg(res?.data?.message);
      }
    })
    .catch((err) => {
      console.log(err);
      setLoading(false);
      // setErrorMsg("Failed to fetch data");
    })
    .finally(() => setLoading(false));
};
// Utility function to capitalize the first letter of a string
export const capitalizeFirstLetter = (text: string) => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

// Utility function to calculate the age from a date of birth string
export const calculateAge = (dobString: string): string => {
  if (!dobString) return "-"; // Handle empty values
  const dob = new Date(dobString);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDifference = today.getMonth() - dob.getMonth();
  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < dob.getDate())
  ) {
    age--;
  }
  return age.toString();
};
export const FetchWebinarList = (
  setLoading: (loading: boolean) => void,
  setAdminMeetingData: (data: unknown) => void,
) => {
  const userData = getItemInLocalStorage("seekerDetails");
  setLoading(true);
  getCall(`${endPoints.webinars}?userId=${userData?.id}&page=1&limit=20`)
    .then((res) => {
      if (res?.data?.statusCode === 200) {
        setLoading(false);
        setAdminMeetingData(res?.data.data.data);
      } else {
        setLoading(false);
        // setErrorMsg(res?.data?.message);
      }
    })
    .catch((err) => {
      console.log(err);
      setLoading(false);
      // setErrorMsg("Failed to fetch data");
    })
    .finally(() => setLoading(false));
};

/**
 * @description Converting the age distribution to a combined format as per UI
 * @param agePercentages
 * @returns
 */
export const convertAgeDestribution = (agePercentages: unknown) => {
  const combinedAgePercentages = {
    "3-18": agePercentages["3-18"],
    "19-60":
      agePercentages["18-29"] +
      agePercentages["29-40"] +
      agePercentages["40-60"],
    "60+": agePercentages["60+"],
  };
  return combinedAgePercentages;
};

/**
 * @description Converting the method of attendance as per UI
 * @param agePercentages
 * @returns
 */
export const modifyMethodOfAttendance = (data: unknown) => {
  const modifiedData = {
    "Own device": data?.selfJoiningPercentage,
    "Other device": data?.joiningOnOtherDevicePercentage,
    "Cross device": data?.joiningWithOthersPercentage,
  };
  return modifiedData;
};

/**
 * @description Custom Numbers for method of attendance
 * @param agePercentages
 * @returns
 */
export const customNumbersMethodOfAttendance = (data: unknown) => {
  const modifiedData = {
    "Own device": data?.joiningModeData?.selfJoining,
    "Other device": data?.joiningModeData?.joiningOnOtherDevice,
    "Cross device": data?.joiningModeData?.joiningWithOthers,
  };
  return modifiedData;
};
interface DeviceData {
  deviceType: string;
  percentage: number;
}

export const convertArrayToObject = (
  data: DeviceData[],
): { [key: string]: number } => {
  return data?.reduce(
    (acc, item) => {
      acc[item?.deviceType] = item.percentage;
      return acc;
    },
    {} as { [key: string]: number },
  );
};

export const modifyAudienceDiscipline = (data: unknown) => {
  const modifiedData = {
    Cancellations: data?.cancellations || 0,
    "Video downgrades": data?.videoDowngraded || 0,
    "Late joiners count": data?.lateJoinersCount || 0,
    Rejoins: data?.rejoinersCount || 0,
    // "Drop off": data?.dropOff || 0,
    // Rejoins: data?.rejoins || 0,
  };
  return modifiedData;
};
