import React from "react";
import styles from "./index.module.scss";

export interface iButtonProps {
  onClick?: () => void;
  children?: React.ReactNode | string;
  buttonTextClassName?: string;
  buttonClassName?: string;
  type?: "button" | "submit" | "reset";
  disable?: boolean;
  isNonActive?: boolean;
  datatestid?: string;
  datatestidText?: string;
}

export const Button: React.FC<iButtonProps> = ({
  onClick,
  children,
  buttonClassName,
  buttonTextClassName,
  type,
  disable,
  isNonActive,
  datatestid,
  datatestidText,
}) => {
  return (
    <button
      className={`${buttonClassName} ${disable === true ? styles.disableButton : isNonActive ? styles.nonActiveButton : styles.button}`}
      onClick={onClick}
      type={type || "button"}
      disabled={disable}
      data-testid={datatestid}
    >
      <span
        className={buttonTextClassName || ""}
        data-testid={datatestidText}
      >
        {children}
      </span>
    </button>
  );
};
