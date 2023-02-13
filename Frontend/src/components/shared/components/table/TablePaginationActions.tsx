import { IconButton } from '@mui/material';
import Box from '@mui/material/Box';
import { KeyboardArrowLeft, KeyboardArrowRight, LastPage, FirstPage } from '@mui/icons-material/'
import { useTheme } from '@mui/material/styles';
import React from 'react';

export interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: React.MouseEvent<HTMLButtonElement>, newPage: number) => void;
}

export const TablePaginationActions = ({ count, page, rowsPerPage, onPageChange }: TablePaginationActionsProps) => {
  const theme = useTheme();
  let isDirectionRtl: boolean = theme.direction === 'rtl' ? true : false

  const handleFirstPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton onClick={handleFirstPageButtonClick} disabled={page === 0} aria-label="first-page">
        {isDirectionRtl ? <LastPage /> : <FirstPage />}
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="back-page">
        {isDirectionRtl ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton onClick={handleNextButtonClick} disabled={page >= Math.ceil(count - rowsPerPage) - 1}>
        {isDirectionRtl ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton onClick={handleLastPageButtonClick} disabled={page >= Math.ceil(count / rowsPerPage) - 1}>
        {isDirectionRtl ? <FirstPage /> : <LastPage />}
      </IconButton>
    </Box>
  )
};    
