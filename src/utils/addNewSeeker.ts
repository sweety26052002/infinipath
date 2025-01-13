import { endPoints } from "../constants/urlConstants";
import { postCall, putCall } from "../services/apiService";
import {
  getItemInLocalStorage,
  setItemInLocalStorage,
} from "../services/localStorage";

export const handleFriendsAndFamilyUpdate = (
  data: unknown,
  handleUpdateSeeker: (status: boolean, message: string) => void,
  setLoader: (value: boolean) => void,
) => {
  const loggedInSeekerData = getItemInLocalStorage("seekerDetails");
  const updateSeekerPayload = {
    // user_id: loggedInSeekerData?.phone_number,
    // type: "ADD", // ADD, UPDATE, DELETE
    members: [
      {
        // id: null, // For UPDATE, DELETE
        firstName: data?.firstName,
        phoneNumber: data?.phoneNumber,
        email: data?.email,
        countryCode: data?.countryCode?.startsWith("+")
          ? data?.countryCode
          : `+${data?.countryCode}`,
        relation: "",
        faceUrl: data?.faceUrl?.length > 0 ? data?.faceUrl : "",
        lastName: data?.lastName,
        profileUrl: data?.profileUrl,
        fullName: data?.fullName,
        ...(data?.address?.length > 0 && { address: data?.address }),
        dob: data?.dob,
        // other_address: data?.other_address,
        ...(data?.city === "Other" && { otherAddress: data?.otherCity }),
      },
    ],
  };

  //   setLoading(true);
  postCall(
    `${endPoints.users}/${loggedInSeekerData?.id}/members`,
    updateSeekerPayload,
  )
    .then((res) => {
      // console.log(res, "responseUpdate");
      if (res?.data?.statusCode === 200) {
        handleUpdateSeeker(true, res?.data?.message);
        setLoader(false);
      } else {
        console.error("Error:", res?.data?.message);
        handleUpdateSeeker(false, res?.data?.message);
        setLoader(false);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      handleUpdateSeeker(false, error?.message);
      setLoader(false);
    });
};

export const formatDateToISOString = (date: Date | null): string | null => {
  if (!date) return null;
  const clonedDate = new Date(date);
  clonedDate.setHours(0, 0, 0, 0);
  return clonedDate.toISOString();
};

export const handleNonInfinipathSeekerUpdate = (
  data: unknown,
  UpdateSeeker: (status: boolean, message: string) => void,
  setLoader: (value: boolean) => void,
) => {
  const seekersData = getItemInLocalStorage("seekerDetails");
  const userData = {
    appType: "infinipath",
    email: data?.email,
    address: data?.address,
    dob: data?.dob,
    otherAddress: data?.otherAddress,
  };

  putCall(`${endPoints.users}/${seekersData?.id}`, userData)
    .then((res) => {
      if (res?.data?.statusCode === 200) {
        setItemInLocalStorage("seekerDetails", res?.data?.data);
        UpdateSeeker(true, res?.data?.message);
        setLoader(false);
      } else {
        console.error("Error:", res?.data?.message);
        UpdateSeeker(false, res?.data?.message);
        setLoader(false);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      UpdateSeeker(false, error?.message);
      setLoader(false);
    });
};
