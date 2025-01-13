import React from 'react';
import { Pagination, Select, MenuItem } from '@mui/material';
import styles from './index.module.scss';

export interface PaginationFooterProps {
  currentPage: number;
  pageSize: number;
  total: number;
  itemsPerPageOptions?: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  showPagination?: boolean;
}

export const PaginationFooter: React.FC<PaginationFooterProps> = ({
  currentPage,
  pageSize,
  total,
  itemsPerPageOptions = [10, 20, 50, 100],
  onPageChange,
  onPageSizeChange,
  showPagination = true,
}) => {
  const totalPages = Math.ceil(total / pageSize);

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    onPageChange(page);
  };

  return showPagination ? (
    <div className={styles.footerContainer}>
      <div className={`${styles.footer} ${styles.padding}`}>
        <div className={styles.pagination}>
          <Pagination
            showFirstButton
            showLastButton
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            siblingCount={1}
            boundaryCount={0}
            sx={{
              '& .MuiPaginationItem-root': {
                backgroundColor: 'none',
                color: '#7F7F7F',
              },
              '& .Mui-selected': {
                backgroundColor: '#EBF3FA',
                color: '#051B46',
              },
              '& .MuiPaginationItem-root:hover': {
                backgroundColor: '#D0E2F2',
              },
              '.MuiPaginationItem-root ': {
                margin: '0px',
              },
            }}
          />
        </div>

        <span className={styles.footerText}>Showing</span>
        <div className={styles.select}>
          {itemsPerPageOptions.length > 0 && (
            <Select
              value={pageSize}
              onChange={(e) => onPageSizeChange(parseInt(e.target.value))}
              sx={{
                '.MuiOutlinedInput-notchedOutline': {
                  borderStyle: 'none',
                  padding: '0px',
                },
              }}
            >
              {itemsPerPageOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          )}
          <p className={styles.footerText}>
            {itemsPerPageOptions.length > 0 && 'of '}
            {total} seekers
          </p>
        </div>
      </div>
    </div>
  ) : null;
};
