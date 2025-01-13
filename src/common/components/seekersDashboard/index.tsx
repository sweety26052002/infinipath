import React, { useCallback, useEffect, useState } from "react";
import {
  DataGrid,
  GridColDef,
  GridSelectionModel,
} from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import { getDataGridHeaders } from "../TableHeader/index.tsx";
// import MoreVertIcon from "@mui/icons-material/MoreVert"; // Import the icon
import { PaginationFooter } from "../GridPagination/index.tsx";
// import menuActionsIcon from "../../../assets/images/menu-dots.svg";
import styles from "./index.module.scss";
interface SeekersDashboardProps {
  seekersData?: unknown[];
  hoverImageClass?: string;
  totalData?: number;
  pageSize?: number;
  setPageSize?: (size: number) => void;
  currentPage?: number;
  setCurrentPage?: (page: number) => void;
  loading?: boolean;
}
const SeekersDashboard: React.FC<SeekersDashboardProps> = ({
  seekersData,
  hoverImageClass,
  totalData,
  pageSize,
  setPageSize,
  currentPage,
  setCurrentPage,
  loading,
}) => {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [dataToShow, setDataToShow] = useState<unknown[]>([]);
  const columns: GridColDef[] = getDataGridHeaders().map((column) => ({
    ...column,
    sortable: false, // Disable sorting for each column
  }));

  const loadMoreData = useCallback(() => {
    // setLoading(true);
    const startIndex = (currentPage - 1) * pageSize;
    const newData = seekersData.slice(startIndex, startIndex + pageSize);
    setDataToShow(newData);
    // setLoading(false);
  }, [currentPage, pageSize, seekersData]);

  useEffect(() => {
    loadMoreData();
  }, [loadMoreData]);

  const handleSelectionChange = (newSelection: GridSelectionModel) => {
    setSelectedRows(newSelection.map(Number));
  };

  // const handleRowClick = (params: GridRowParams) => {
  //   const id = params.row.programRegistrationId;
  //   if (params.row?.SeekerStatus !== 'Cancelled') {
  //       // navigate(`/admin/details/${id}`);
  //   } else {
  //       // dispatch(
  //       //     updateNotifyTriggers({
  //       //         open: true,
  //       //         message: 'Opening cancelled seeker details is not allowed',
  //       //     })
  //       // );
  //   }
  //   console.log("Row clicked:", params.row);
  // };

  useEffect(() => {
    setDataToShow(seekersData);
  }, [seekersData]);

  const total = totalData;
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    loadMoreData();
    setDataToShow(seekersData);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
    loadMoreData();
  };
  const getItemsPerPageOptions = (total: number) => {
    const options = [10, 25, 50, 100];
    return options.filter((option) => option <= total); // Filter options based on the total
  };
  return (
    <div className={styles.seekerListDashboard} data-testid="seeker-list-dashboard">
      <div>
        <Box className={styles.container} data-testid="box-container">
          <DataGrid
            sx={{
              rowWidth: "100%",
              "&.MuiDataGrid-root": {
                borderLeft: "none",
                borderRight: "none",
                height: `calc(100vh - 347px)`,
                overflow: "unset",
              },
              "& .MuiDataGrid-scrollbar--vertical ": {
                maxWidth: "5px",
              },
              "& .MuiDataGrid-scrollbar--horizontal ": {
                maxHeight: "100%",
                display: "block",
              },
              "& .MuiDataGrid-columnSeparator": {
                display: "none",
              },
              "& .MuiDataGrid-columnHeaderTitle": {
                fontWeight: "400",
                fontSize: "14px",
                color: "#051B46",
              },
              "& .MuiDataGrid-columnHeaderTitle:focus": {
                outline: "none",
              },
              "& .MuiDataGrid-row": {
                cursor: "pointer",
                [`&:hover .${hoverImageClass}`]: {
                  display: "block",
                },
              },
              ".MuiDataGrid-row": {
                cursor: "pointer",
              },
              ".MuiDataGrid-columnHeader": {
                border: "none",
                borderColor: "none",
                padding: "10px",
                cursor: "default",
              },
              ".MuiDataGrid-cell": {
                padding: '10px',
                color: "#051B46",
              },
              ".MuiDataGrid-cell:focus": {
                outline: "none",
              },
              "& .MuiDataGrid-cellCheckbox:focus-within": {
                outline: "none",
              },
              "& .MuiDataGrid-columnHeader:focus-within,": {
                outline: "none",
              },
              "& .MuiCheckbox-root": {
                color: "transparent",
              },
              "& .MuiCheckbox-root svg": {
                fill: "grey",
              },
              "& .Mui Checkbox-root.Mui-checked svg": {
                fill: "#1859B4",
              },
            }}
            rows={dataToShow}
            columns={columns}
            paginationMode="server"
            rowCount={total}
            pageSize={pageSize}
            onPageSizeChange={(newPageSize) => handlePageSizeChange(newPageSize)}
            page={currentPage - 1}
            initialState={{
              pagination: { paginationModel: { pageSize: pageSize || 10, page: currentPage - 1 } },
            }}
            slots={{
              footer: () => (
                <PaginationFooter
                  currentPage={currentPage}
                  pageSize={pageSize}
                  total={total}
                  itemsPerPageOptions={getItemsPerPageOptions(total)}
                  onPageSizeChange={(newPageSize) => {
                    setPageSize(newPageSize);
                    setCurrentPage(1);
                  }}
                  onPageChange={(newPage) => {
                    console.log("newPage", newPage);
                    handlePageChange(newPage);
                  }}
                  showPagination={true}
                  data-testid="pagination-footer"
                />
              ),
              noRowsOverlay: () => ( // Custom "No results found" message
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                  }}
                >
                  No results found
                </Box>
              ),
            }}
            loading={loading}
            slotProps={{
              loadingOverlay: {
                variant: 'linear-progress',
                noRowsVariant: 'linear-progress',
              },
            }}
            disableColumnMenu
            disableColumnSelector
            disableColumnResize
            onRowSelectionModelChange={handleSelectionChange}
            selectionModel={selectedRows}
            disableRowSelectionOnClick
            data-testid="data-grid"
          />
        </Box>
      </div>
    </div>
  );
};

export default SeekersDashboard;
