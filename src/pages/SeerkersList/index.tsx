import React, { useEffect, useState } from "react";
import styles from "./index.module.scss";
import AdminKpiData from "../../common/components/AdminKpiData/index.tsx";
import DashboardHeader from "../../common/components/DashboardHeader/index.tsx";
import SeekersDashboard from "../../common/components/seekersDashboard/index.tsx";
import { getCall } from "../../services/apiService.ts";
import { endPoints } from "../../constants/urlConstants.ts";
import { modifyResponseForTable } from "../../utils/adminUtils.ts";
// import { useLocation } from "react-router-dom";
import MeetingDetailsCard from "../../common/components/MeetingDetailsDashboard/index.tsx";
import SeekerListFilterPopUp from "../../common/components/MeetingsFilterPopUp/index.tsx";
import { useLocation, useNavigate } from "react-router-dom";
import ArrowIcon from "../../assets/images/arrow-left.svg";
import {
  calculateTimeForMeeting,
  formatTime,
  getDateFromString,
  getDayOfWeek,
  getMonthAbbreviation,
  getYearBasedOnDate,
} from "../../utils/commonFunctions.ts";
// import Loader from "../../common/components/Loader/index.tsx";

const DataTable: React.FC = () => {
  const navigate = useNavigate();
  const [dataToShow, setDataToShow] = useState<unknown[]>([]);
  const [tabsData, setTabsData] = useState<unknown[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [filtersApplied, setFiltersApplied] = useState({
    gender: [],
    age: [],
    registration: [],
  });
  const [searchPopup, setSearchPopup] = useState(false);
  const [totalData, setTotalData] = useState(0);
  const location = useLocation();
  const [deBounceValue, setDeBounceValue] = useState("");
  const meetingId = location?.state?.meetingId;
  const webinarTitle = location?.state?.webinarTitle;
  const type = "";
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [registrationEndDate, setRegistrationEndDate] = useState("");
  const [actualmeetingendsat, setActualMeetingEndsAt] = useState("");
  const [timeRemaining, setTimeRemaining] = useState<string | null>(null);
  const [timeCalculated, setTimeCalculated] = useState<boolean>(false);

  const fetchData = async (
    label: string,
    searchValue = "",
    pageLimit?: number,
  ) => {
    const PageLimit = pageLimit || pageSize;
    const page = currentPage;
    setLoading(true);
    getCall(
      `${endPoints?.getRegisteredUsersForWebinar}/${meetingId}?page=${page}&type=${label}&limit=${PageLimit}&search=${searchValue}`,
    )
      .then((res: unknown) => {
        if (res?.status === 200) {
          setLoading(false);
          const dataReq = modifyResponseForTable(res?.data?.data?.users);
          const tabsDataReq = res?.data?.data?.kpiData;
          setDataToShow(dataReq);
          setTabsData(tabsDataReq);
          setTotalData(res?.data?.data?.total);
          setRegistrationEndDate(
            res?.data?.data?.webinarData?.registrationEndsAt,
          );
          setActualMeetingEndsAt(
            res?.data?.data?.webinarData?.actualMeetingEndsAt,
          );
        } else {
          setLoading(false);
        }
      })
      .catch((err) => {
        setLoading(false);
        console.error("Error fetching data:", err);
      });
  };

  useEffect(() => {
    fetchData("", deBounceValue);
  }, [currentPage, pageSize, deBounceValue]);

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleTabChange = (count: number, label: string) => {
    fetchData(label, deBounceValue);
  };

  const handleSearch = (searchValue: string) => {
    setDeBounceValue(searchValue);
    fetchData("", searchValue);
  };

  const handleApplyClick = (filters: unknown) => {
    setFiltersApplied(filters);
    setSearchPopup(false);
    fetchData("", deBounceValue);
  };

  /**
   * Using this useeffect to update the time remaining every second
   */
  useEffect(() => {
    if (registrationEndDate?.length > 0) {
      const intervalId = setInterval(() => {
        const remainingTime = calculateTimeForMeeting(registrationEndDate);
        setTimeRemaining(remainingTime);
        setTimeCalculated(true);

        if (remainingTime === null) {
          clearInterval(intervalId);
        }
      }, 1000);

      return () => clearInterval(intervalId); // Clear interval on component unmount
    }
  }, [registrationEndDate]);

  return (
    <div className={styles.seekerListDashboard}>
      <div className={styles.breadcrumbKpiMeetingCard}>
        <div className={styles.breadcrumbKpi}>
          <div className={styles.breadcrumbs} data-testid="breadcrumbs">
            <div
              className={styles.backArrow}
              onClick={() => {
                navigate(-1);
              }}
              data-testid="back-icon-container"
            >
              <img src={ArrowIcon} alt="back" data-testid="back-icon" />
            </div>
            <div
              className={styles.activeHome}
              data-testid="breadcrumb-nonactive-myspace"
              onClick={() => navigate("/admin/home")}
            >
              home
            </div>
            <div
              className={styles.nonActive}
              data-testid="breadcrumb-separator"
            >
              /
            </div>
            <div
              className={styles.active}
              data-testid="breadcrumb-active-session"
            >
              {webinarTitle?.length
                ? webinarTitle?.toLowerCase()
                : "weekly growth session"}{" "}
              {!timeRemaining &&
                timeCalculated &&
                registrationEndDate &&
                registrationEndDate.length > 0 && (
                  <>
                    {`(Registrations closed on `}
                    <span>
                      {getDayOfWeek(registrationEndDate)},{" "}
                      {getDateFromString(registrationEndDate)}-
                      {getMonthAbbreviation(registrationEndDate)}-
                      {getYearBasedOnDate(registrationEndDate)}{" "}
                      {formatTime(registrationEndDate)} IST{")"}
                    </span>
                  </>
                )}
            </div>
          </div>
          <AdminKpiData
            handleTabChange={handleTabChange}
            tabsData={tabsData}
            type={type}
            data-testid="admin-kpi-data"
          />
        </div>
        <div className={styles.kpiMeetingCard}>
          {registrationEndDate?.length !== 0 &&
            actualmeetingendsat === null && (
              <MeetingDetailsCard
                meetingDate={registrationEndDate}
                data-testid="meeting-details-card"
              />
            )}
        </div>
      </div>
      <div className={styles.container}>
        <DashboardHeader
          onSearch={handleSearch}
          setSearchPopup={setSearchPopup}
          data-testid="dashboard-header"
        />
        <SeekersDashboard
          seekersData={dataToShow}
          hoverImageClass={styles.actionHoverImg}
          totalData={totalData}
          pageSize={pageSize}
          setPageSize={handlePageSizeChange}
          currentPage={currentPage}
          setCurrentPage={handlePageChange}
          loading={loading}
          data-testid="seekers-dashboard"
        />
      </div>
      {searchPopup && (
        <SeekerListFilterPopUp
          seekersFilters={filtersApplied}
          open={searchPopup}
          onClose={() => setSearchPopup(false)}
          onApplyClick={handleApplyClick}
          data-testid="search-modal"
        />
      )}
    </div>
  );
};

export default DataTable;
