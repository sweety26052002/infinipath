export const modifyResponseForTable = (data: unknown) => {
  const modifiedData = data.map((item: unknown) => {
    return {
      id: item?.userId,
      firstName: item?.firstName,
      lastName: item?.lastName,
      mobile: item?.phoneNumber,
      email: item?.email,
      address: item?.otherAddress ? item?.otherAddress : item?.address,
      profileUrl: item?.profileUrl,
      dob: item?.dob || 0,
      typeOfRegistration: item?.isPanelist ? "Video" : "Non-Video",
      countryCode: item?.countryCode,
    };
  });

  return modifiedData;
};

// const prepareDummyData = (data: unknown[]) => {
//   const result = [...data];
//   while (result.length < 30) {
//     result.push(...data);
//   }
//   return result.slice(0, 30);
// };
