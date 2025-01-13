// import React from "react";
// import { Menu, MenuItem } from '@mui/material';
import styles from "./index.module.scss";
// import menuActionsIcon from "../../../assets/image/dashboard-dots.svg";
import menuActionsIcon from "../../../assets/images/dashboard-dots.svg";

const MenuActions = () => {
  // const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // const handleClick = (event: React.MouseEvent<HTMLElement>) => {
  //   setAnchorEl(event.currentTarget);
  // };

  return (
    <div>
      <img
        src={menuActionsIcon}
        alt="Actions"
        // onClick={handleClick}
        className={styles.actionIcon} // Add a class for styling
      />
    </div>
  );
};

export default MenuActions;
