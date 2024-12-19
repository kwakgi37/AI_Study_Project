import React, { useEffect, useState, useContext } from 'react';
import { Box, Typography, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';
import { fetchAllTests } from '../api/questionsApi';
import { AuthContext } from '../context/AuthContext';

function HistoryPage() {
  const { user } = useContext(AuthContext); // 현재 로그인된 사용자 정보
  const [tests, setTests] = useState([]); // 모든 시험 기록 저장
  const [loading, setLoading] = useState(true); // 로딩 상태 관리
  const [error, setError] = useState(null); // 에러 상태 관리
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [selectedTest, setSelectedTest] = useState(null); // 선택된 시험 데이터
  const [isDialogOpen, setIsDialogOpen] = useState(false); // 다이얼로그 열림 상태
  const itemsPerPage = 10; // 페이지당 항목 수
  const isAuthenticated = !!user; // 사용자가 있으면 true, 없으면 false
  // yearAndMonth를 사람이 읽을 수 있는 형식으로 변환
  const formatYearAndMonth = (value) => {
    const [year, month] = value.split('-');
    return `${2000 + parseInt(year)}년 ${month}월 모의고사`;
  };

  // testDay를 사람이 읽기 쉬운 날짜로 변환
  const formatDate = (dateTime) => {
    const date = new Date(dateTime);
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 두 개의 yearAndMonth 데이터를 각각 요청
        const data24 = await fetchAllTests(user?.userId, '24-9');
        const data23 = await fetchAllTests(user?.userId, '23-9');

        // 데이터를 병합하고 최신순으로 정렬
        const combinedData = [...data24, ...data23].sort(
          (a, b) => new Date(b.testDay) - new Date(a.testDay)
        );

        console.log("Fetched Tests:", combinedData); // 콘솔에 데이터 출력
        setTests(combinedData); // 정렬된 데이터 저장
        setLoading(false);
      } catch (err) {
        console.error("Error fetching tests:", err); // 콘솔에 에러 출력
        setError('학습 기록을 불러오는 데 실패했습니다.');
        setLoading(false);
      }
    };

    if (user?.userId) {
      fetchData();
    }
  }, [user?.userId]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '10  0vh' }}>
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <Typography color="error" variant="h6" textAlign="center">
        {error}
      </Typography>
    );
  }

  // 페이지네이션 데이터 계산
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = tests.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(tests.length / itemsPerPage);

  // 상세 보기 다이얼로그 열기
  const handleOpenDialog = (test) => {
    setSelectedTest(test);
    setIsDialogOpen(true);
  };

  // 상세 보기 다이얼로그 닫기
  const handleCloseDialog = () => {
    setSelectedTest(null);
    setIsDialogOpen(false);
  };

  return (
    <div style={{ display: 'flex' }}>
      {/* 사이드바 */}
      <Sidebar />

      <div style={{ flex: 1 }}>
        {/* 상단 네비게이션 바 */}

        <div style={{ backgroundColor: '#F3F6FE', minHeight: '100vh', paddingTop: '2px', display: 'flex', flexDirection: 'column' }}>
          {/* 컨텐츠 영역 */}
          <Box
            sx={{
              flex: 1,
              backgroundColor: 'white',
              borderRadius: 3,
              textAlign: 'center',
              p: 1,
              mx: 2,
              my: 2,
            }}
          >
            <Typography variant="h5" sx={{ mb: 2 }}>
              학습 기록
            </Typography>

            {/* 학습 기록 테이블 */}
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>시험 날짜</TableCell>
                    <TableCell>시험 이름</TableCell>
                    <TableCell>시험 시간</TableCell>
                    <TableCell>점수</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        학습 기록이 없습니다.
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentItems.map((test, index) => (
                      <TableRow key={index}>
                        <TableCell>{formatDate(test.testDay)}</TableCell>
                        <TableCell>{formatYearAndMonth(test.yearAndMonth)}</TableCell>
                        <TableCell>{`${test.testTime}분`}</TableCell>
                        <TableCell>{test.score}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          {/* 페이지 이동 버튼 */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              px: 2,
              py: 0,
              backgroundColor: '#f0f0f0',
            }}
          >
            <Button
              startIcon={<ArrowBackIcon />}
              variant="outlined"
              // size="small" // 버튼 크기를 줄이는 Prop
              // sx={{
              //   minWidth: 'auto', // 기본 너비를 최소화
              //   padding: '4px 8px', // 패딩 조정
              //   fontSize: '0.75rem', // 글꼴 크기 조정
              // }}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              이전 페이지
            </Button>
            <Typography sx={{ fontSize: '0.875rem' }}>{`${currentPage} / ${totalPages}`}</Typography>
            <Button
              endIcon={<ArrowForwardIcon />}
              variant="outlined"
              // size="small" // 버튼 크기를 줄이는 Prop
              // sx={{
              //   minWidth: 'auto', // 기본 너비를 최소화
              //   padding: '4px 8px', // 패딩 조정
              //   fontSize: '0.75rem', // 글꼴 크기 조정
              // }}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              다음 페이지
            </Button>
          </Box>
        </div>
      </div>

      {/* 상세 보기 다이얼로그 */}
      <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>시험 상세 정보</DialogTitle>
        <DialogContent>
          {selectedTest && (
            <>
              <Typography>시험 날짜: {formatDate(selectedTest.testDay)}</Typography>
              <Typography>시험 이름: {formatYearAndMonth(selectedTest.yearAndMonth)}</Typography>
              <Typography>시험 시간: {`${selectedTest.testTime}분`}</Typography>
              <Typography>점수: {selectedTest.score}</Typography>
              {/* <Typography>사용자 답안: {selectedTest.userAnswer}</Typography> */}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            닫기
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default HistoryPage;
