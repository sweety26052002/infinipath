import React, { useEffect, useState } from "react";
import {
  useForm,
  SubmitHandler,
  FormProvider,
  Controller,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import "react-phone-input-2/lib/style.css";
import styles from "./index.module.scss";
import { Button } from "../../common/components/Button";
import Loader from "../../common/components/Loader";
import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import Header from "../../common/Header";
import closeIcon from "../../assets/images/cross-icon.svg";
import DropdownWithInput from "../../common/components/DropdownTextfield";
import { cityList } from "../../utils/functions";
import { LocalizationProvider } from "@mui/x-date-pickers";
import CustomDatePicker from "../../common/components/DobTextfield";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { NonInfinipathSeekerSchema } from "./formSchema";
// import RegisteredFaceId from "../../common/components/RegisteredFaceId";
import { getItemInLocalStorage } from "../../services/localStorage";
import {
  formatDateToISOString,
  handleNonInfinipathSeekerUpdate,
} from "../../utils/addNewSeeker";
import { useNavigate } from "react-router-dom";

interface IFormInput {
  email: string;
  terms: boolean;
  signIn: boolean;
  countryCode: string;
  dob: Date;
  city: string;
  otherCity?: string;
}

interface Props {
  signIn?: boolean;
  handleSignIn?: () => void;
  signUpHandler?: (data: IFormInput) => void;
  loader?: boolean;
  signUpData?: unknown;
  phoneNumberError?: string;
  phoneNumber?: string;
  countryCode?: string;
  setPhoneNumberError: (error: string) => void;
  setNonInfinipathSeeker?: (value: boolean) => void;
  setLoader?: (value: boolean) => void;
  nonInfinipathSeekerInLogin?: boolean;
}

const NonInfinipathSeekerForm: React.FC<Props> = ({
  loader,
  setPhoneNumberError,
  setLoader,
}) => {
  const [checked, setChecked] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
    setFocus,
    watch,
    unregister,
    control,
  } = useForm<IFormInput>({
    resolver: yupResolver(NonInfinipathSeekerSchema),
    mode: "onSubmit",
  });

  useEffect(() => {
    setFocus("email");
  }, [setFocus]);

  useEffect(() => {
    setValue("terms", checked);
  }, [checked, setValue]);

  const [seekerDetails, setSeekerDetails] = useState<unknown>();

  useEffect(() => {
    setSeekerDetails(getItemInLocalStorage("seekerDetails"));
  }, []);
  console.log(seekerDetails, "seekerDetails");
  const navigate = useNavigate();
  const handleUpdateSeeker = (status: boolean, message: string) => {
    if (status || message) {
      navigate(`/infinipath/myspace`);
    }
  };

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    // console.log(registeredfaceId, "registeredfaceId");
    const formattedDob = formatDateToISOString(data.dob);
    const payload = {
      email: data.email,
      address: data?.city,
      dob: formattedDob,
      ...(data?.city === "Other" && {
        otherAddress: data?.otherCity,
      }),
    };
    setLoader(true);
    handleNonInfinipathSeekerUpdate(payload, handleUpdateSeeker, setLoader);
  };

  const methods = useForm();
  const [open, setOpen] = useState(false);
  const [iframeUrl, setIframeUrl] = useState("");

  const handleOpenModal = (url: string) => {
    setIframeUrl(url);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setIframeUrl("");
  };

  useEffect(() => {
    setPhoneNumberError("");
  }, []);

  const citiesData = cityList.map((city) => {
    return {
      value: city.name,
      label: city.name,
    };
  });
  const cityValue = watch("city");
  const showOtherField = cityValue === "Other";
  const handleValueChange = (value: string) => {
    setValue("city", value);
    unregister("otherCity");
    clearErrors("city");
  };

  const handleDateChange = (date: Date | null) => {
    if (date !== null) {
      setValue("dob", date, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };

  useEffect(() => {
    if (cityValue === "Other") {
      register("otherCity", { required: "Other City is required" });
    } else {
      unregister("otherCity");
    }
  }, [cityValue, register, unregister]);

  return (
    <div className={styles.signupPage} data-testid="signup-page">
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={styles.formContainer}
          data-testid="signup-form"
        >
          <div className={styles.inputFieldsBlock}>
            <div className={styles.fieldsContainer}>
              <div className={styles.labelInput} data-testid="email-field">
                <div className={styles.labelText}>Email address*</div>
                <div className={styles.fieldBlock}>
                  <input
                    {...register("email")}
                    className={`${styles.inputFields} ${errors.email ? styles.errorFields : ""}`}
                    data-testid="email-input"
                  />
                </div>
                {errors.email && (
                  <i className={styles.error} data-testid="email-error">
                    {errors.email.message}
                  </i>
                )}
              </div>

              <Controller
                name="city"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <DropdownWithInput
                    {...field}
                    label="Location*"
                    options={citiesData}
                    onValueChange={(value) => {
                      field.onChange(value);
                      handleValueChange(value);
                    }}
                    error={errors.city?.message}
                    otherError={errors.otherCity?.message}
                    showOtherField={showOtherField}
                    height="35px"
                  />
                )}
              />
              {showOtherField && (
                <div
                  className={styles.labelInput}
                  data-testid="other-city-field"
                >
                  <div className={styles.fieldBlock}>
                    <input
                      {...register("otherCity")}
                      className={`${styles.inputFields} ${errors.otherCity ? styles.errorFields : ""}`}
                      data-testid="other-city-input"
                    />
                  </div>
                  {errors.otherCity && (
                    <i className={styles.error} data-testid="other-city-error">
                      {errors.otherCity.message}
                    </i>
                  )}
                </div>
              )}
              <div>
                <div className={styles.muiInputField}>
                  <div className={styles.dobLabelText}>Date of birth*</div>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <div className={styles.textField}>
                      <Controller
                        name="dob"
                        control={control}
                        render={({ field }) => (
                          <CustomDatePicker
                            value={field.value}
                            futureDate={false}
                            onChange={(date) => {
                              field.onChange(date);
                              handleDateChange(date);
                            }}
                            errorExist={errors.dob ? true : false}
                            className={styles.dropdownInputFromEmail}
                            height="35px"
                          />
                        )}
                      />
                    </div>
                  </LocalizationProvider>
                  {errors?.dob && (
                    <i className={styles.error}>{errors?.dob?.message}</i>
                  )}
                </div>
              </div>
              <div>
                <div className={styles.termsConditionsBlock}>
                  <input
                    type="checkbox"
                    onClick={() => setChecked(!checked)}
                    className={styles.methodTypesInput1}
                    checked={checked}
                    id="checkbox1"
                    {...register("terms")}
                    data-testid="terms-checkbox"
                  />
                  <div>
                    <p>I have read and agreed to the infinipath {""}</p>
                    <span
                      className={styles.loginText}
                      onClick={() =>
                        handleOpenModal(
                          "https://infinipdev.divami.com/termsAndConditions.html",
                        )
                      }
                      data-testid="terms-link"
                    >
                      terms & conditions
                    </span>{" "}
                    and
                    <span
                      className={styles.loginText}
                      onClick={() =>
                        handleOpenModal(
                          "https://infinipdev.divami.com/privacyAndPolicy.html",
                        )
                      }
                      data-testid="privacy-policy-link"
                    >
                      {" "}
                      privacy policy{" "}
                    </span>
                  </div>
                </div>
                {errors.terms && (
                  <i className={styles.error} data-testid="terms-error">
                    {errors.terms.message}
                  </i>
                )}
              </div>
            </div>
          </div>
          <div>
            <div id="recaptcha" data-testid="recaptcha-container"></div>
            {!loader ? (
              <div className={styles.buttonBlock}>
                <Button
                  buttonTextClassName={styles.buttonText}
                  buttonClassName={styles.buttonContainer}
                  type="submit"
                  data-testid="get-otp-button"
                >
                  submit
                </Button>
              </div>
            ) : (
              <Loader type="small" data-testid="loader" />
            )}
          </div>
        </form>
      </FormProvider>
      <div>
        <Dialog
          open={open}
          onClose={handleCloseModal}
          maxWidth={false}
          fullScreen
          data-testid="terms-dialog"
        >
          <Header data-testid="dialog-header" />
          <DialogTitle className={styles.dialogBlock}>
            <div>
              {iframeUrl.includes("terms") && "Terms & conditions"}
              {iframeUrl.includes("privacy") && "Privacy policy"}
            </div>
            <IconButton
              onClick={handleCloseModal}
              data-testid="dialog-close-button"
            >
              <img src={closeIcon} alt="Close" className={styles.modalClose} />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <iframe
              src={iframeUrl}
              title="Terms and Policy"
              className={styles.DialogText}
              style={{
                width: "100%",
                height: "calc(100vh - 200px)",
                border: "none",
              }}
              data-testid="dialog-iframe"
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default NonInfinipathSeekerForm;
