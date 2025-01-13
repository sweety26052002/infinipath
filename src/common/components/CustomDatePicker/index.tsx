import React from "react";
import {
  DatePicker,
  DateValidationError,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { Box } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import "../../styles/variables.scss";
import { ReactComponent as CalendarIcon } from "../../../assets/images/calendar.svg";

type CustomDatePickerProps = {
  value: Date | undefined;
  onChange: (date: Date | null) => void;
  error?: boolean;
  errorMessage?: string | null;
  maxDate?: Date;
  futureDate: boolean;
  fixedDate?: boolean;
  errorExist?: boolean;
  readOnly?: boolean;
  startDate?: Date;
  iconStyles?: React.CSSProperties;
  disabled?: boolean;
  className?: string;
  styleChange?: boolean;
  borderRight?: boolean;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  dataTestId?: string;
};

const getDate = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
};

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  value,
  onChange,
  error = false,
  maxDate,
  futureDate,
  startDate,
  errorExist,
  readOnly,
  disabled,
  className,
  styleChange,
  borderRight,
  onKeyDown,
  dataTestId,
}) => {
  const handleDateChange = (date: Date | null) => {
    if (date) {
      const isValidDate = !isNaN(date.getTime());
      if (isValidDate) {
        const formattedDate = getDate(date).toISOString().split("T")[0];
        onChange(new Date(formattedDate));
      } else {
        onChange(date);
      }
    } else {
      onChange(null);
    }
  };

  const handleError = (error: DateValidationError, value: Date | null) => {
    console.error("Date picker error:", error, value);
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
      }}
      data-testid="date-picker-box"
    >
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          localeText={{
            fieldMonthPlaceholder: () => "MMM",
          }}
          value={value}
          onChange={handleDateChange} // Pass the handler that accepts Date | null
          onError={handleError}
          minDate={startDate ? startDate : undefined}
          maxDate={futureDate ? maxDate || undefined : undefined}
          format="EEEE, dd-MMM-yyyy"
          slots={{
            openPickerIcon: (props) => (
              <CalendarIcon {...props} data-testid="calendar-icon" />
            ),
          }}
          sx={{
            width: "100%",
            fieldset: {
              border: "1px solid #8A8A8A",
              borderColor: errorExist ? "#E28619 !important" : "#C9C9C9",
              borderRadius: styleChange ? "8px" : "8px 0px 0px 8px",
              borderRight:
                borderRight && errorExist ? "1px solid #C9C9C9 !important" : "",
              color: "#051B46",
              fontSize: 26,
            },
            "&:hover": {
              fieldset: {
                borderColor: readOnly ? "#8A8A8A" : "#1859B4 !important",
              },
              ".MuiOutlinedInput-notchedOutline": {
                borderColor: readOnly ? "#8A8A8A" : "#1859B4",
                borderRight:
                  borderRight && errorExist
                    ? "1px solid #C9C9C9 !important"
                    : "",
              },
            },
            "&:focus-within": {
              fieldset: {
                borderColor: readOnly ? "#8A8A8A" : "#1859B4 !important",
              },
              ".MuiOutlinedInput-notchedOutline": {
                borderColor: readOnly ? "#8A8A8A" : "#1859B4 !important",
              },
            },
            "& input::placeholder": {
              fontSize: 16,
            },
            "& .MuiInputBase-input": {
              color: "#051b46", // Text color for the input field
              fontSize: 16,
              textAlign: "left",
              fontWeight: 400,
              padding: "8px",
              borderRight: "1px solid #C9C9C9",
              cursor: readOnly ? "not-allowed" : "default",
            },
            input: {
              fontSize: 16,
              textAlign: "left",
              fontWeight: 400,
            },
            "& .MuiInputBase-root": {
              backgroundColor: readOnly ? "#f6f6f6" : "#fff",
              height: 40,
              flexDirection: "row",
              width: "100%",
              cursor: readOnly ? "not-allowed" : "default",
            },
          }}
          slotProps={{
            textField: {
              autoFocus: false,
              error: !!error,
              onKeyDown,
            },
            openPickerButton: {
              "data-testid": `${dataTestId}-calendar-icon`,
            },
            previousIconButton: {
              "data-testid": `${dataTestId}-prev-button`,
            },
            nextIconButton: {
              "data-testid": `${dataTestId}-next-button`,
            },
            toolbar: {
              'data-testid': 'datepicker-toolbar',
            },
            switchViewButton: {
              'data-testid': 'month-year-dropdown',
            },
          }}
          readOnly={readOnly}
          disabled={disabled}
          className={className}
          data-testid="date-picker-input"
        />
      </LocalizationProvider>
    </Box>
  );
};

export default CustomDatePicker;
