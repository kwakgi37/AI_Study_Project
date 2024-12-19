import React from 'react';
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

function YearSelectionTable({
  //years,
  selectedYear,
  setSelectedYear,
  //filteredData,
  onExamClick,
  selectedCategory,
  handleCategoryChange,
  handleFileChange,
  fileInputRef,
}) {

  const historyData = [
    { year: '2024', date: '2024-11-14', examInfo: '2024년 수능' },
    { year: '2024', date: '2024-09-04', examInfo: '2024년 9월 모의고사' },
    { year: '2024', date: '2024-06-04', examInfo: '2024년 6월 모의고사' },
    { year: '2024', date: '2024-03-28', examInfo: '2024년 3월 모의고사' },
    { year: '2023', date: '2023-11-16', examInfo: '2023년 수능' },
    { year: '2023', date: '2023-09-06', examInfo: '2023년 9월 모의고사' },
    { year: '2023', date: '2023-06-04', examInfo: '2023년 6월 모의고사' },
    { year: '2023', date: '2023-03-25', examInfo: '2023년 3월 모의고사' },
    { year: '2022', date: '2022-11-16', examInfo: '2022년 수능' },
    { year: '2022', date: '2022-09-06', examInfo: '2022년 9월 모의고사' },
    { year: '2022', date: '2022-06-04', examInfo: '2022년 6월 모의고사' },
    { year: '2022', date: '2022-03-25', examInfo: '2022년 3월 모의고사' },
    { year: '2021', date: '2021-11-16', examInfo: '2021년 수능' },
    { year: '2021', date: '2021-09-06', examInfo: '2021년 9월 모의고사' },
    { year: '2021', date: '2021-06-04', examInfo: '2021년 6월 모의고사' },
    { year: '2021', date: '2021-03-25', examInfo: '2021년 3월 모의고사' },
    { year: '2020', date: '2020-11-16', examInfo: '2020년 수능' },
    { year: '2020', date: '2020-09-06', examInfo: '2020년 9월 모의고사' },
    { year: '2020', date: '2020-06-04', examInfo: '2020년 6월 모의고사' },
    { year: '2020', date: '2020-03-25', examInfo: '2020년 3월 모의고사' },
    { year: '2019', date: '2019-11-16', examInfo: '2019년 수능' },
    { year: '2019', date: '2019-09-06', examInfo: '2019년 9월 모의고사' },
    { year: '2019', date: '2019-06-04', examInfo: '2019년 6월 모의고사' },
    { year: '2019', date: '2019-03-25', examInfo: '2019년 3월 모의고사' },
    { year: '2018', date: '2018-11-16', examInfo: '2018년 수능' },
    { year: '2018', date: '2018-09-06', examInfo: '2018년 9월 모의고사' },
    { year: '2018', date: '2018-06-04', examInfo: '2018년 6월 모의고사' },
    { year: '2018', date: '2018-03-25', examInfo: '2018년 3월 모의고사' },
    { year: '2017', date: '2017-11-16', examInfo: '2017년 수능' },
    { year: '2017', date: '2017-09-06', examInfo: '2017년 9월 모의고사' },
    { year: '2017', date: '2017-06-04', examInfo: '2017년 6월 모의고사' },
    { year: '2017', date: '2017-03-25', examInfo: '2017년 3월 모의고사' },
  ];

  const years = [...new Set(historyData.map((item) => item.year))];
  const filteredData = historyData.filter((record) => record.year === selectedYear)

  const handleExamClick = (year, month) => {
    localStorage.removeItem('lastQuestionIndex');
    localStorage.removeItem('lastSelectedTime');
    onExamClick(year, month);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        padding: 0,
      }}
    >
      {/* 파일 불러오기 버튼 */}
      {/* <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        ref={fileInputRef}
        style={{ display: 'none' }}
      />
      <Button
        variant="contained"
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          zIndex: 10,
          fontSize: '12px',
          padding: '4px 8px',
        }}
        onClick={() => fileInputRef.current.click()}
      >
        파일 불러오기
      </Button> */}

      {/* 카테고리 버튼 그룹
      <Box textAlign="center" mb={1}>
        <ButtonGroup>
          <Button
            variant={selectedCategory === '문제풀이' ? 'contained' : 'outlined'}
            sx={{ padding: '4px 8px', fontSize: '12px', minWidth: '60px' }}
            onClick={() => handleCategoryChange('문제풀이')}
          >
            문제풀이
          </Button>
          <Button
            variant={selectedCategory === '문제해설' ? 'contained' : 'outlined'}
            sx={{ padding: '4px 8px', fontSize: '12px', minWidth: '60px' }}
            onClick={() => handleCategoryChange('문제해설')}
          >
            문제해설
          </Button>
        </ButtonGroup>
      </Box> */}

      {/* 연도 선택 버튼 */}
      <Box className="yearCategories" sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
        {years.map((year) => (
          <Button
            key={year}
            onClick={() => setSelectedYear(year)}
            variant={selectedYear === year ? 'contained' : 'outlined'}
            sx={{
              margin: '4px',
              padding: '4px 8px',
              fontSize: '12px',
              minWidth: '60px',
            }}
          >
            {year}년
          </Button>
        ))}
      </Box>

      {/* 시험 정보 테이블 */}
      <TableContainer
        component={Paper}
        className="examTable"
        sx={{
          marginTop: 1,
          width: '100%',
          maxWidth: '800px',
          height: '100%',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Table sx={{ width: '100%' }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ padding: '10px', fontSize: '16px', fontWeight: 'bold' }}>날짜</TableCell>
              <TableCell sx={{ padding: '10px', fontSize: '16px', fontWeight: 'bold' }}>시험 정보</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((record, index) => {
              const year = record.year;
              const month = record.examInfo.split(' ')[1].replace('월', '');

              return (
                <TableRow key={index} sx={{ height: '40px' }}>
                  <TableCell sx={{ padding: '10px', fontSize: '14px' }}>{record.date}</TableCell>
                  <TableCell sx={{ padding: '10px', fontSize: '14px' }}>
                    <span
                      onClick={() => handleExamClick(year, month)}
                      style={{ cursor: 'pointer', color: 'blue' }}
                    >
                      {record.examInfo}
                    </span>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default YearSelectionTable;
