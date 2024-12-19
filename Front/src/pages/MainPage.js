import React, { useContext, useEffect, useState, useRef } from 'react';
import { Box, Typography, ButtonGroup, Button } from '@mui/material';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';
import { AuthContext } from '../context/AuthContext';
import YearSelectionTable from '../components/YearSelectionTable';
import { useNavigate } from 'react-router-dom';
import useQuestionStorage from '../hooks/useQuestionStorage';
import { ImageContext } from '../context/ImageContext';
import LineChart from '../components/LineChart';
import Chatbot from '../components/Chatbot';
import QuestionTypeTable from '../components/QuestionTypeTable';
import { fetchEightTests, fetchLastTest, fetchCorrectQuestionCounts } from '../api/questionsApi'; // fetchEightTests API 함수 가져오기

function MainPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedCategory, setSelectedCategory] = useState('문제풀이'); // 카테고리 상태 추가
  const [chartData, setChartData] = useState([{ x: "No Data", y: 0 }]); // LineChart에 사용할 데이터 상태 추가
  const [correctQuestionCounts, setCorrectQuestionCounts] = useState({}); // 맞은 문제 유형 개수 상태 추가
  const [lastTestData, setLastTestData] = useState(null); // lastTestData 상태 정의
  
  const { clearStorageData } = useQuestionStorage();
  const { setImageUrl } = useContext(ImageContext); // ImageContext에서 setImageUrl을 사용
  const [ imageFile, setImageFile] = React.useState(null);

  // fileInputRef 정의
  const fileInputRef = useRef(null);

  useEffect(() => {
    const loadRecentTests = async () => {
      try {
        if (isAuthenticated === null) {
          return; // 아직 인증 여부가 결정되지 않은 상태
        }
  
        if (!user || !user.userId) {
          console.warn("사용자 정보가 유효하지 않습니다. userId를 확인하세요.");
          return;
        }
  
        setLoading(true);
  
        // 최근 8개의 시험 기록 가져오기
        const tests = await fetchEightTests(user.userId);
        console.log(`최근 8개의 시험 기록 데이터 (userId: ${user.userId}):`, tests); // 데이터 콘솔에 출력
  
        if (tests && tests.length > 0) {
          // id를 기준으로 오름차순 정렬 (id가 큰 값이 나중에 나옴)
          const sortedTests = tests.sort((a, b) => a.id - b.id);
  
          // id를 x축, score를 y축으로 설정하여 chartData 구성
          const chartData = sortedTests.map((test) => ({
            x: test.id, // x축에 id 사용
            y: parseInt(test.score), // 점수를 숫자로 변환
            label: test.yearAndMonth, // 추가로 라벨을 yearAndMonth로 설정
          }));
          
          setChartData(chartData);
        } else {
          setChartData([{ x: "No Data", y: 0 }]);
        }
      } catch (error) {
        console.error("최근 8개의 시험 기록 가져오는 중 오류 발생:", error);
        setChartData([{ x: "Error", y: 0 }]);
      } finally {
        setLoading(false);
      }
    };
  
    loadRecentTests();
  }, [user, isAuthenticated]);
  
  useEffect(() => {
    const loadLastTest = async () => {
      try {
        if (isAuthenticated === null) {
          return; // 아직 인증 여부가 결정되지 않은 상태
        }
  
        if (!user || !user.userId) {
          console.warn("사용자 정보가 유효하지 않습니다. userId를 확인하세요.");
          return;
        }
  
        // 가장 최근의 시험 데이터 가져오기
        const lastTest = await fetchLastTest(user.userId);
        console.log("가장 최근 시험 데이터:", lastTest); // 데이터 확인
  
        if (lastTest) {
          setLastTestData(lastTest);
        }
      } catch (error) {
        console.error("가장 최근 시험 데이터를 가져오는 중 오류 발생:", error);
      }
    };
  
    if (user && isAuthenticated) {
      loadLastTest();
    }
  }, [user, isAuthenticated]);
  

  useEffect(() => {
    const loadCorrectQuestionCounts = async () => {
      try {
        if (!lastTestData || !lastTestData.id) {
          return; // 가장 최근 시험 데이터가 없을 경우 반환
        }
  
        // lastTestData에서 필요한 데이터 추출
        const { id, yearAndMonth, userId } = lastTestData;
  
        // 맞은 문제 유형 개수 요청 보내기
        const counts = await fetchCorrectQuestionCounts(id, userId, yearAndMonth);
        console.log("맞은 문제 유형 개수:", counts);
  
        // 상태 업데이트
        setCorrectQuestionCounts(counts);
      } catch (error) {
        console.error("맞은 문제 유형 개수를 가져오는 중 오류 발생:", error);
      }
    };
  
    if (lastTestData) {
      loadCorrectQuestionCounts();
    }
  }, [lastTestData]);

  // 파일 선택 핸들러
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setImageFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result); // 이미지 URL을 ImageContext에 저장
        navigate('/analysis'); // 파일이 선택되면 자동으로 Analysis 화면으로 이동
      };
      reader.readAsDataURL(file);
    }
  };

  const handleButtonClick = () => {
    // fileInputRef.current.click()을 통해 파일 선택
    fileInputRef.current.click();
  };

  const handleExamClick = (year, month) => {
    clearStorageData();
    localStorage.setItem('lastSelectedYear', year.slice(2)); // 연도 저장
    localStorage.setItem('lastSelectedMonth', month);        // 월 저장
    navigate(`/questions/${year.slice(2)}/${month}`);
  };
  
  const handleSolutionClick = (year, month) => {
    clearStorageData();
    localStorage.setItem('lastSelectedYear', year.slice(2)); // 연도 저장
    localStorage.setItem('lastSelectedMonth', month);        // 월 저장
    navigate(`/solutions/${year.slice(2)}/${month}`);
  };
  

  const historyData = [
    { year: '2024', date: '2024-11-14', examInfo: '2024년 수능' },
    { year: '2024', date: '2024-09-04', examInfo: '2024년 9월 모의고사' },
    { year: '2024', date: '2024-06-04', examInfo: '2024년 6월 모의고사' },
    { year: '2024', date: '2024-03-28', examInfo: '2024년 3월 모의고사' },
    { year: '2023', date: '2023-11-14', examInfo: '2023년 수능' },
    { year: '2023', date: '2023-09-04', examInfo: '2023년 9월 모의고사' },
    { year: '2023', date: '2023-06-04', examInfo: '2023년 6월 모의고사' },
    { year: '2023', date: '2023-03-28', examInfo: '2023년 3월 모의고사' },
    { year: '2022', date: '2022-11-14', examInfo: '2022년 수능' },
    { year: '2022', date: '2022-09-04', examInfo: '2022년 9월 모의고사' },
    { year: '2022', date: '2022-06-04', examInfo: '2022년 6월 모의고사' },
    { year: '2022', date: '2022-03-28', examInfo: '2022년 3월 모의고사' },
  ];

  const years = [...new Set(historyData.map((item) => item.year))];
  const filteredData = historyData.filter((record) => record.year === selectedYear);
;


  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1 }}>
        <TopNav isAuthenticated={isAuthenticated} user={user} />
          <Box textAlign="center" >
            {isAuthenticated ? (
              <>

                <div className="content-area">
                  <Box
                    sx={{
                      //height: '500px', // 높이를 화면의 50vh로 설정
                      //flex: 1, // 남은 공간을 모두 차지하도록 설정
                      backgroundColor: '#c8d2eb;', // 내용의 가독성을 위해 흰색 배경 설정
                      borderRadius: 3,
                      textAlign: 'center',
                      p: 1, // 패딩을 줄여 여백을 줄임
                      mx: 2, // 좌우 여백 추가
                      //my: 2, // 상하 여백 추가
                      //position: 'relative', // 작은 박스를 위한 상대 위치 설정
                      
                    }}
                  >
                    {/* 시험 문제 영역을 두 개의 박스로 나누기 */}
                    <Box
                      sx={{
                        flex: 1,
                        //marginTop: '10px', // 작은 박스 아래로 밀어내기 위해 여백 추가
                        //height: '100%', // 남은 공간을 모두 차지하도록 높이 계산
                        display: 'flex', // 내부 콘텐츠 정렬을 위한 flex 설정
                        flexDirection: 'row', // 두 개의 박스를 가로로 배치
                        borderRadius: 3, // 둥근 모서리
                        //overflow: 'hidden', // 내용이 넘치는 것을 방지
                        
                      }}
                    >
                      {/* 첫 번째 박스 */}
                      <Box
                        sx={{
                          flex: 1, // 남은 공간을 모두 차지하도록 설정
                          backgroundColor: '#ffffff', // 첫 번째 박스의 배경색
                          //borderRadius: '3px 0 0 3px', // 둥근 모서리
                          borderRadius: 3,
                          marginRight: '1%',
                          display: 'flex',
                          flexDirection: 'column', // 세로 방향으로 배치
                          justifyContent: 'center', // 수직 중앙 정렬
                          alignItems: 'center', // 수평 중앙 정렬
                          position: 'relative', // 상대 위치 설정
                          p: 1, // 패딩 추가
                          height: '100%',
                           marginright: '0.5%',
                          borderradius: '12px'
                          
                        }}
                      >
                       <LineChart
                        data={[
                          {
                            id: 'CodeCraft',
                            data: chartData,
                          },
                        ]}
                      />
                      </Box>

                      {/* 두 번째 박스 */}
                      <Box
                        sx={{
                          flex: 1, // 남은 공간을 모두 차지하도록 설정
                          backgroundColor: '#ffffff', // 두 번째 박스의 배경색
                          //borderRadius: '0 3px 3px 0', // 둥근 모서리
                          borderRadius: 3,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          
                        }}
                      >
                        <QuestionTypeTable correctQuestionCounts={correctQuestionCounts} />
                      </Box>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      //height: '50vh', // 높이를 화면의 50vh로 설정
                      //flex: 1, // 남은 공간을 모두 차지하도록 설정
                      backgroundColor: '#c8d2eb;', // 내용의 가독성을 위해 흰색 배경 설정
                      borderRadius: 3,
                      textAlign: 'center',
                      p: 1, // 패딩을 줄여 여백을 줄임
                      mx: 2, // 좌우 여백 추가
                      //my: 2, // 상하 여백 추가
                      //position: 'relative', // 작은 박스를 위한 상대 위치 설정
                    }}
                  >
                    {/* 시험 문제 영역을 두 개의 박스로 나누기 */}
                    <Box
                      sx={{
                        //flex: 1,
                        //height: '275px', // 남은 공간을 모두 차지하도록 높이 계산
                        display: 'flex', // 내부 콘텐츠 정렬을 위한 flex 설정
                        flexDirection: 'row', // 두 개의 박스를 가로로 배치
                        borderRadius: 3, // 둥근 모서리
                        overflow: 'hidden', // 내용이 넘치는 것을 방지
                        
                      }}
                    >
                      {/* 첫 번째 박스 */}
                      <Box
                        sx={{
                          flex: 1, // 남은 공간을 모두 차지하도록 설정
                          backgroundColor: '#ffffff', // 첫 번째 박스의 배경색
                          borderRadius: '3px 0 0 3px', // 둥근 모서리
                          display: 'flex',
                          flexDirection: 'column', // 세로 방향으로 배치
                          justifyContent: 'center', // 수직 중앙 정렬
                          alignItems: 'center', // 수평 중앙 정렬
                          position: 'relative', // 상대 위치 설정
                          p: 1, // 패딩 추가
                          
                        }}
                      >
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          ref={fileInputRef}  // fileInputRef를 연결
                          style={{ display: 'none' }}
                        />
                        <Button
                          variant="contained"
                          sx={{
                            position: 'absolute',
                            top: 8, // 상단에서 8px
                            right: 8, // 우측에서 8px
                            zIndex: 10, // 다른 요소 위에 표시
                            fontSize: '12px', // 버튼 글씨 크기 조정
                            padding: '4px 8px', // 패딩 조정
                          }}
                          onClick={handleButtonClick}
                        >
                          파일 불러오기
                        </Button>
                        {/* 카테고리 버튼 그룹 추가 */}
                        {isAuthenticated && (
  <Box textAlign="center" mb={1}>
    <ButtonGroup>
      <Button
        variant={selectedCategory === '문제풀이' ? 'contained' : 'outlined'}
        sx={{
          padding: '4px 8px',
          fontSize: '12px',
          minWidth: '60px',
          position: 'relative',
          overflow: 'hidden',
          // 기본 상태
          backgroundColor: selectedCategory === '문제풀이' ? '#1976d2' : 'transparent',
          color: selectedCategory === '문제풀이' ? '#fff' : '#1976d2',
          // 애니메이션
          transition: 'transform 0.2s, background-color 0.2s',
          '&:hover': {
            backgroundColor: selectedCategory === '문제풀이' ? '#115293' : '#e3f2fd',
            transform: 'scale(1.05)', // 버튼 크기 확대
          },
          '&:active': {
            transform: 'scale(0.95)', // 버튼 클릭 시 축소
          },
        }}
        onClick={() => handleCategoryChange('문제풀이')}
      >
        문제풀이
      </Button>
      <Button
        variant={selectedCategory === '문제해설' ? 'contained' : 'outlined'}
        sx={{
          padding: '4px 8px',
          fontSize: '12px',
          minWidth: '60px',
          position: 'relative',
          overflow: 'hidden',
          // 기본 상태
          backgroundColor: selectedCategory === '문제해설' ? '#1976d2' : 'transparent',
          color: selectedCategory === '문제해설' ? '#fff' : '#1976d2',
          // 애니메이션
          transition: 'transform 0.2s, background-color 0.2s',
          '&:hover': {
            backgroundColor: selectedCategory === '문제해설' ? '#115293' : '#e3f2fd',
            transform: 'scale(1.05)', // 버튼 크기 확대
          },
          '&:active': {
            transform: 'scale(0.95)', // 버튼 클릭 시 축소
          },
        }}
        onClick={() => handleCategoryChange('문제해설')}
      >
        문제해설
      </Button>
    </ButtonGroup>
  </Box>
)}



                        {/* 선택된 카테고리에 따라 YearSelectionTable 표시 */}
                        {isAuthenticated && (
                          <YearSelectionTable
                            years={years}
                            selectedYear={selectedYear}
                            setSelectedYear={setSelectedYear}
                            filteredData={filteredData}
                            onExamClick={selectedCategory === '문제풀이' ? handleExamClick : handleSolutionClick}
                          />
                        )}
                      </Box>

                      {/* 두 번째 박스 */}
                      <Box
                        sx={{
                          flex: 1, // 남은 공간을 모두 차지하도록 설정
                          backgroundColor: '#ffffff', // 두 번째 박스의 배경색
                          borderRadius: '0 3px 3px 0', // 둥근 모서리
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Chatbot />
                      </Box>
                    </Box>
                  </Box>
                </div>
              </>
            ) : (
              <>
                <div className="content-area">
                  <Box
                    sx={{
                      //height: '50vh', // 높이를 화면의 50vh로 설정
                      //flex: 1, // 남은 공간을 모두 차지하도록 설정
                      backgroundColor: 'white', // 내용의 가독성을 위해 흰색 배경 설정
                      borderRadius: 3,
                      textAlign: 'center',
                      p: 1, // 패딩을 줄여 여백을 줄임
                      mx: 2, // 좌우 여백 추가
                      //my: 2, // 상하 여백 추가
                      //position: 'relative', // 작은 박스를 위한 상대 위치 설정
                    }}
                  >
                    {/* 시험 문제 영역을 두 개의 박스로 나누기 */}
                    <Box
                      sx={{
                        flex: 1,
                        //marginTop: '10px', // 작은 박스 아래로 밀어내기 위해 여백 추가
                        //height: '100%', // 남은 공간을 모두 차지하도록 높이 계산
                        display: 'flex', // 내부 콘텐츠 정렬을 위한 flex 설정
                        flexDirection: 'row', // 두 개의 박스를 가로로 배치
                        borderRadius: 3, // 둥근 모서리
                        //overflow: 'hidden', // 내용이 넘치는 것을 방지
                      }}
                    >
                      {/* 첫 번째 박스 */}
                      <Box
                        sx={{
                          flex: 1, // 남은 공간을 모두 차지하도록 설정
                          backgroundColor: '#ffffff', // 첫 번째 박스의 배경색
                          borderRadius: '3px 0 0 3px', // 둥근 모서리
                          display: 'flex',
                          flexDirection: 'column', // 세로 방향으로 배치
                          justifyContent: 'center', // 수직 중앙 정렬
                          alignItems: 'center', // 수평 중앙 정렬
                          position: 'relative', // 상대 위치 설정
                          p: 1, // 패딩 추가
                          height: '500px',
                        }}
                      >
                       <Typography variant='h4'>성적 그래프</Typography>
                      </Box>

                      {/* 두 번째 박스 */}
                      <Box
                        sx={{
                          flex: 1, // 남은 공간을 모두 차지하도록 설정
                          backgroundColor: '#ffffff', // 두 번째 박스의 배경색
                          borderRadius: '0 3px 3px 0', // 둥근 모서리
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Typography variant='h4'>문제 유형 그래프</Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      //height: '50vh', // 높이를 화면의 50vh로 설정
                      //flex: 1, // 남은 공간을 모두 차지하도록 설정
                      backgroundColor: 'white', // 내용의 가독성을 위해 흰색 배경 설정
                      borderRadius: 3,
                      textAlign: 'center',
                      p: 1, // 패딩을 줄여 여백을 줄임
                      mx: 2, // 좌우 여백 추가
                      //my: 2, // 상하 여백 추가
                      //position: 'relative', // 작은 박스를 위한 상대 위치 설정
                    }}
                  >
                    {/* 시험 문제 영역을 두 개의 박스로 나누기 */}
                    <Box
                      sx={{
                        //flex: 1,
                        //height: '275px', // 남은 공간을 모두 차지하도록 높이 계산
                        display: 'flex', // 내부 콘텐츠 정렬을 위한 flex 설정
                        flexDirection: 'row', // 두 개의 박스를 가로로 배치
                        borderRadius: 3, // 둥근 모서리
                        overflow: 'hidden', // 내용이 넘치는 것을 방지
                      }}
                    >
                      {/* 첫 번째 박스 */}
                      <Box
                        sx={{
                          flex: 1, // 남은 공간을 모두 차지하도록 설정
                          backgroundColor: '#ffffff', // 첫 번째 박스의 배경색
                          borderRadius: '3px 0 0 3px', // 둥근 모서리
                          display: 'flex',
                          flexDirection: 'column', // 세로 방향으로 배치
                          justifyContent: 'center', // 수직 중앙 정렬
                          alignItems: 'center', // 수평 중앙 정렬
                          position: 'relative', // 상대 위치 설정
                          p: 1, // 패딩 추가
                          height: '350px',
                        }}
                      >
                        <Typography variant='h4'>시험 선택</Typography>
                      </Box>

                      {/* 두 번째 박스 */}
                      <Box
                        sx={{
                          flex: 1, // 남은 공간을 모두 차지하도록 설정
                          backgroundColor: '#ffffff', // 두 번째 박스의 배경색
                          borderRadius: '0 3px 3px 0', // 둥근 모서리
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Typography variant='h4'>챗봇</Typography>
                      </Box>
                    </Box>
                  </Box>
                </div>
              </>
            )}
          </Box>
      </div>
    </div>
  );
}

export default MainPage;
