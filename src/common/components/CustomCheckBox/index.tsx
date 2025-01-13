import React, { ChangeEvent } from "react";
import Checkbox from "@mui/material/Checkbox";
import uncheckedIcon from "../../../assets/images/unchecked-checkbox.svg";
import checkedIcon from "../../../assets/images/checked-checkbox.svg";
import indeterminateIcon from "../../../assets/images/indeterminate.svg";
import styles from "./index.module.scss";

interface CheckboxWithTextProps {
  text: string;
  checked: boolean;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  diffStyles?: boolean;
}
const CustomCheckbox: React.FC<CheckboxWithTextProps> = ({
  text,
  checked,
  onChange,
  diffStyles,
}) => {
  return (
    <div
      className={
        diffStyles ? styles.checkBoxWithoutWidth : styles.checkboxContainer
      }
    >
      <Checkbox
        icon={<img src={uncheckedIcon} alt="unchecked" loading="lazy" />}
        checkedIcon={<img src={checkedIcon} alt="checked" loading="lazy" />}
        indeterminateIcon={<img src={indeterminateIcon} alt="indeterminate" />}
        checked={checked}
        onChange={onChange}
        sx={{ padding: "0px !important" }}
      />
      <p className={styles.checkboxText}>{text}</p>
    </div>
  );
};

export default CustomCheckbox;
