import React, { useState, useContext, useEffect, useRef, useCallback } from 'react';
import { Box, Typography, Button } from '@mui/material';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';
import { ImageContext } from '../context/ImageContext';
import { analyzeImage, similarProblem, similarProblem_text, similarProblemAnswer } from '../api/chatGPTApi';
import { AuthContext } from '../context/AuthContext'; // AuthContext 추가
function Analysis() {
  const { imageUrl, setImageUrl } = useContext(ImageContext);
  const [ setImageFile] = React.useState(null);
  
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isMerged, setIsMerged] = useState(false);
  const [similarProblemText, setSimilarProblemText] = useState(null);
  const [similarProblemAnswerText, setSimilarProblemAnswerText] = useState(null);
  const { user, isAuthenticated } = useContext(AuthContext); // AuthContext에서 user와 isAuthenticated 가져오기
  // fileInputRef 정의
  const fileInputRef = useRef(null);

  // 파일 선택 핸들러
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setImageFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result); // 이미지 URL을 ImageContext에 저장
      };
      reader.readAsDataURL(file);
    }
  };

  const handleButtonClick = () => {
    // fileInputRef.current.click()을 통해 파일 선택
    fileInputRef.current.click();
  };

  // 이미지 분석 요청
  const handleAnalyze = useCallback(async () => {
    setLoading(true);
    try {
      const imageFile = imageUrl ? await fetch(imageUrl).then(res => res.blob()) : null;
      if (imageFile) {
        const result = await analyzeImage(imageFile);
        setAnalysisResult(result);
      } else {
        throw new Error('이미지가 없습니다.');
      }
    } catch (error) {
      console.error('해설 요청 실패:', error);
      alert('해설을 불러오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, [imageUrl]); // imageUrl이 변경될 때만 함수를 다시 생성

  // 비슷한 유형 문제 생성
  const handleSimilarProblem = useCallback(async () => {
    setLoading(true);
    try {
      if (imageUrl) {
        const imageFile = await fetch(imageUrl).then(res => res.blob());
        const result = await similarProblem(imageFile);
        setSimilarProblemText(result);
      } else if (similarProblemText) {
        const result = await similarProblem_text(similarProblemText);
        setSimilarProblemText(result);
      } else {
        alert('이미지 또는 텍스트가 필요합니다.');
      }
  
      setImageUrl(null);
      setAnalysisResult(null);
    } catch (error) {
      console.error('비슷한 유형 문제 요청 실패:', error);
      alert('비슷한 유형 문제를 가져오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, [imageUrl, similarProblemText, setImageUrl]);

  // 해설 및 정답을 받아오는 함수
  const handleSimilarProblemAnswer = useCallback(async () => {
    setLoading(true);
    try {
      const answerResult = await similarProblemAnswer(similarProblemText);
      setSimilarProblemAnswerText(answerResult);
      console.log(answerResult);
    } catch (error) {
      console.error('해설 및 정답 요청 실패:', error);
      alert('해설 및 정답을 가져오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, [similarProblemText]);

  // 이미지 URL이 변경될 때마다 handleAnalyze 호출
  useEffect(() => {
    if (imageUrl) {
      handleAnalyze();
    }
  }, [imageUrl, handleAnalyze]);

  const handleToggleAndAction = () => {
    setIsMerged(!isMerged);

    if (isMerged) {
      handleSimilarProblemAnswer();
    } else {
      handleSimilarProblem();
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />

      <div style={{ flex: 1 }}>

        <div style={{ backgroundColor: '#F3F6FE', minHeight: '100vh', paddingTop: '2px', display: 'flex', flexDirection: 'column' }}>
          <Box
            sx={{
              height: '50vh',
              flex: 1,
              backgroundColor: 'white',
              borderRadius: 3,
              textAlign: 'center',
              p: 1,
              mx: 2,
              my: 2,
              position: 'relative',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
              <Button onClick={handleToggleAndAction} variant="contained">
                {isMerged ? '해설 보기' : '비슷한 유형 문제 풀기'}
              </Button>
            </Box>

            <Box
              sx={{
                marginTop: '10px',
                height: '780px',
                display: 'flex',
                flexDirection: isMerged ? 'column' : 'row',
                borderRadius: 3,
                //overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  flex: 1,
                  backgroundColor: '#e0e0e0',
                  borderRadius: isMerged ? '3px' : '3px 0 0 3px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'relative',
                  p: 1,
                }}
              >
                {!imageUrl && !isMerged && !similarProblemText && ( // isMerged나 similarProblemText가 있으면 버튼 숨김
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      ref={fileInputRef} // fileInputRef 연결
                      style={{ display: 'none' }}
                    />
                    <Button onClick={handleButtonClick} variant="contained">
                      파일 불러오기
                    </Button>
                  </div>
                )}
                <Box sx={{ marginTop: 2, backgroundColor: '#f0f0f0', padding: 2, borderRadius: 2 }}>
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt="Uploaded"
                      style={{ width: '100%', maxHeight: '500px', objectFit: 'contain' }}
                    />
                  ) : similarProblemText ? (
                    <Typography style={{ whiteSpace: 'pre-line' }}>
                      {similarProblemText}
                    </Typography>
                  ) : (
                    <Typography>비슷한 유형 문제가 여기에 표시됩니다.</Typography>
                  )}
                </Box>
              </Box>

              {!isMerged && (
                <Box
                  sx={{
                    flex: 1,
                    backgroundColor: '#d0d0d0',
                    borderRadius: '0 3px 3px 0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Box sx={{ marginTop: 2, marginLeft: 2, marginRight: 2, backgroundColor: '#f0f0f0', padding: 2, borderRadius: 2 }}>
                    <Typography variant="h6">GPT 해설 및 정답</Typography>
                    {loading ? (
                      <Typography>Loading...</Typography>
                    ) : analysisResult ? (
                      <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', textOverflow: 'ellipsis' }}>
                        {JSON.stringify(analysisResult, null, 2)}
                      </pre>
                    ) : similarProblemAnswerText ? (
                      <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', textOverflow: 'ellipsis' }}>
                        {similarProblemAnswerText}
                      </pre>
                    ) : (
                      <Typography>해설을 불러오는 중입니다.</Typography>
                    )}
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        </div>
      </div>
    </div>
  );
}

export default Analysis;
