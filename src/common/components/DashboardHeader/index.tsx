import React, { useEffect, useState } from 'react';
import styles from "./index.module.scss";
import searchIcon from "../../../assets/images/dashboard-search.svg";
import filterIcon from "../../../assets/images/dashboard-filter.svg";
import { Tooltip } from '@mui/material';

interface DashboardHeaderProps {
    title?: string;
    onSearch: (value: string) => void; // Callback prop for passing search value
    setSearchPopup?: (value: boolean) => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onSearch, setSearchPopup }) => {
    const [searchValue, setSearchValue] = useState({ value: '', open: false });
    const [debouncedValue, setDebouncedValue] = useState('');

    const searchInput = (value: string) => {
        setSearchValue({ value, open: true });
    };

    // Debounce logic
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(searchValue.value);
        }, 1000);

        return () => {
            clearTimeout(handler);
        };
    }, [searchValue.value]);

    // Pass debounced value to parent
    useEffect(() => {
        if (debouncedValue) {
            onSearch(debouncedValue);
        } else {
            onSearch('');
        }

    }, [debouncedValue]);

    return (
        <div className={styles.dashboardHeader} data-testid="dashboard-header">
            <div className={styles.heading}>List of Seekers Details </div>
            <div className={styles.iconsBlock} data-testid="icons-block">
                {searchValue.open && (
                    <div className={styles.search} data-testid="search-container">
                        <input
                            type="text"
                            className={styles.searchInput}
                            autoFocus
                            value={searchValue.value}
                            placeholder="Search seeker with name or mobile number"
                            onChange={(e) => searchInput(e.target.value)}
                            data-testid="search-input"
                        />
                    </div>
                )}
                <Tooltip title="Search" arrow>
                    <button className={styles.filter}
                       data-testid="search-button"
                    >
                        <img
                            src={searchIcon}
                            alt="search"
                            data-testid="search-icon"
                            onClick={() =>
                                setSearchValue({ value: '', open: !searchValue.open })
                            }
                        />
                    </button>
                </Tooltip>

                <Tooltip title="Filter" arrow  >
                    <button className={styles.filter} style={{ cursor: "not-allowed" }} disabled>
                        <img
                            src={filterIcon}
                            alt="filter icon"
                            data-testid="filter-icon"
                            onClick={() => setSearchPopup && setSearchPopup(true)}
                        />
                    </button>
                </Tooltip>
            </div>
        </div>
    );
};

export default DashboardHeader;
