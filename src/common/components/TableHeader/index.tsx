import { GridColDef } from "@mui/x-data-grid";
import styles from "./index.module.scss";
import { Avatar, Tooltip } from "@mui/material";
import defaultProfileIcon from "../../../assets/images/default-profile.svg";
import { calculateAge } from "../../../utils/commonFunctions";
// import menuActionsIcon from "../../../assets/images/dashboard-dots.svg";

export const getDataGridHeaders = (): GridColDef[] => [
  {
    field: "firstName",
    headerName: "First name",
    width: 200,
    renderCell: (params) => (
      <div className={styles.row_cell}>
        <div className={styles.profileImage}>
          <Avatar
            alt={params.row.firstName}
            src={
              params.row.profileUrl && params.row.profileUrl.length > 0
                ? params.row.profileUrl
                : defaultProfileIcon
            }
            sx={{
              width: 32,
              height: 36,
              border: "1px solid #ffffff",
            }}
            data-testid="user-avatar"
          />
        </div>
        <Tooltip title={params.value} arrow>
          <span className={styles.detailsText}>
            {params?.value
              ? params.value?.length > 17
                ? params.value.substring(0, 17) + "..."
                : params.value
              : "-"}
          </span>
        </Tooltip>
      </div>
    ),
  },
  {
    field: "lastName",
    headerName: "Last name",
    width: 150,
    renderCell: (params) => (
      <Tooltip title={params.value} arrow>
        <div className={styles.row_cell}>
          <span className={styles.detailsText}>
            {params?.value
              ? params.value?.length > 17
                ? params.value.substring(0, 17) + "..."
                : params.value
              : "-"}
          </span>
        </div>
      </Tooltip>
    ),
  },
  {
    field: "dob",
    headerName: "Age",
    width: 150,
    renderCell: (params) => {
      const age = calculateAge(params.value);
      return (
        <div className={styles.row_cell}>
          <span className={styles.detailsText}>
            {age !== "-" ? `${age}` : "-"}
          </span>
        </div>
      );
    },
  },

  {
    field: "mobile",
    headerName: "Mobile number",
    width: 250,
    renderCell: (params) => (
      <div className={styles.row_cell}>
        <span className={styles.detailsText}>
          {params.row.countryCode ? params?.row?.countryCode : ""}{" "}
          {params.value ? params?.value : "-"}
        </span>
      </div>
    ),
  },
  {
    field: "address",
    headerName: "City",
    width: 200,
    renderCell: (params) => (
      <Tooltip title={params.value} arrow>
        <div className={styles.row_cell}>
          <span className={styles.detailsText}>
            {params?.value
              ? params.value?.length > 17
                ? params.value.substring(0, 17) + "..."
                : params.value
              : "-"}
          </span>
        </div>
      </Tooltip>
    ),
  },
  {
    field: "typeOfRegistration",
    headerName: "Type of registration",
    width: 170,
    renderCell: (params) => (
      <div className={styles.row_cell}>
        <span className={styles.detailsText}>
          {params.value ? params?.value : "-"}
        </span>
      </div>
    ),
  },
];
