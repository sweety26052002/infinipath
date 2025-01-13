import React from "react";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import  { Dayjs } from "dayjs";
import { ReactComponent as ClockIcon } from "../../../assets/images/drop-down-light.svg";


interface CustomTimePickerProps {
  value: Dayjs | null;
  onChange?: (date: Date | null) => void;
  readOnly?: boolean;
  errorExist?: boolean;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  dataTestid?: string;
}

const customTimer : React.FC<CustomTimePickerProps> = ({
  value,
  onChange,
  readOnly = false,
  errorExist,
  onKeyDown,
  dataTestid,
}) => {

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
    
        <TimePicker views={['minutes']} format="mm"
           value={value}
           onChange={onChange}
           slots={{
            openPickerIcon: (props) => (
              <ClockIcon {...props} data-testid="clock-icon" />
            ), // Icon for the open picker button with data-testid
          }}
          timeSteps={{ minutes: 1 }}
           sx={{
            fieldset: {
              borderColor: errorExist ? "#E28619" : "#C9C9C9",
              borderTopWidth: 1,
              borderRightWidth: 1,
              borderBottomWidth: 1,
              borderLeftWidth: 1,
              borderRadius: "8px",
            },
            "&:hover": {
              fieldset: {
                borderColor: readOnly ? "#8A8A8A" : "#1859B4 !important",
              },
              ".MuiOutlinedInput-notchedOutline": {
                borderColor: readOnly ? "#8A8A8A" : "#1859B4",
              },
            },
            "&:focus-within": {
              fieldset: { borderColor: "#8A8A8A" },
              ".MuiOutlinedInput-notchedOutline": {
                borderColor: readOnly ? "#8A8A8A" : "#1859B4",
              },
            },
            "& input::placeholder": {
              textColor: "#051b46",
              fontSize: 16,
            },
            "& .MuiInputBase-input": {
              color: "#051b46", // Text color for the input field
              fontSize: 16,
              textAlign: "left",
              fontWeight: 400,
              padding: "8px",
              // borderRight: "1px solid #C9C9C9",
            },
            "& .MuiInputBase-root": {
              backgroundColor: readOnly ? "#f6f6f6" : "#fff",
              height: 40,
              width: 200,
              // gap: "8px",
              flexDirection: { flexDirection: "row" },
            },
            "& .MuiInputAdornment-root": {
              marginLeft: "0px",
            },
          }}
          slotProps={{
            textField: {
              size: "medium",
              fullWidth: true,
              required: false,
              autoFocus: false,
              error: false,
              onKeyDown,
            },
            openPickerButton: {
              "data-testid": `${dataTestid}-duration-icon`, 
            }
          }}
         />
  </LocalizationProvider>
  );
};

export default customTimer;
