import * as yup from "yup";
import dayjs from "dayjs";

export const NonInfinipathSeekerSchema = yup.object().shape({
  email: yup
    .string()
    .required("Email is required")
    // .matches(/\.com$/, 'Email must end with .com'),
    .matches(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Invalid email format",
    ),
  terms: yup
    .boolean()
    .oneOf([true], "You must accept the terms and conditions") // Add validation for terms
    .required("Terms and conditions are required"), // Ensure the field is required
  city: yup.string().required("City is required"),
  otherCity: yup
    .string()
    .test("city", "Other City is required", function (value) {
      const city = this.parent.city;
      return city === "Other" ? !!value : true;
    }),
  dob: yup
    .date()
    .required("Date of birth is required")
    .test(
      "valid-date",
      "Age must be between 3 and 100 years",
      function (value) {
        if (value) {
          const saveDate = dayjs().startOf("day"); // Today's date
          const age = saveDate.diff(value, "years");
          return age >= 3;
        }
        return true;
      },
    )
    .test(
      "valid-date-above",
      "Age must be between 3 and 100 years",
      function (value) {
        if (value) {
          const saveDate = dayjs().startOf("day"); // Today's date
          const age = saveDate.diff(value, "years");
          return age <= 99;
        }
        return true;
      },
    )
    .typeError("Date of birth is invalid"),
});
