import axiosInstance from './axiosInstance';

let similarProblemText = ''; // similarProblem의 결과를 저장하는 전역 변수

// 이미지 분석 요청 (이미지와 하드코딩된 텍스트 전송)
export const analyzeImage = async (imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile); // 이미지 파일 추가
  formData.append('requestText', "아래의 과정을 따라서 답변을 해줘. 첨부된 이미지 본문을 번역해서 알려줘. 해당 이미지의 해설 및 정답을 알려줘."); // 하드코딩된 텍스트 추가
  // formData.append('requestText', "첨부된 이미지를 해석하고 해설 및 정답을 알려줘. 가독성을 높여줘");

  console.log(imageFile);

  try {
    // 서버로 이미지 분석 요청 전송
    const response = await axiosInstance.post('/GPT/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${process.env.CHATGPT_API_KEY}`

      },
    });

    // 서버에서 받은 해설 및 정답 반환
    return response.data;
  } catch (error) {
    console.error('이미지 분석 요청 실패:', error);
    throw error;
  }
};

// 비슷한 유형 문제 요청 (이미지 파일을 서버로 전송하고 유사 문제를 저장)
export const similarProblem = async (imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile); // 이미지 파일 추가
  formData.append('requestText', "첨부한 이미지와 비슷한 유형의 문제를 만들어줘. 다른 답변없이 문제만 출력해줘"); // 요청 텍스트 추가

  console.log(imageFile);

  try {
    const response = await axiosInstance.post('/GPT/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${process.env.CHATGPT_API_KEY}`

      },
    });

    // 비슷한 유형의 문제를 저장
    similarProblemText = response.data; // 응답 데이터를 텍스트로 저장
    console.log(similarProblemText);
    return similarProblemText;
  } catch (error) {
    console.error("비슷한 유형 문제 요청 실패:", error);
    throw error;
  }
};

// 비슷한 유형 문제 요청 (텍스트 파일을 서버로 전송하고 유사 문제를 저장)
export const similarProblem_text = async (_requestText) => {
  const formData = new FormData();
  formData.append('requestText', `${similarProblemText}\n 위 문제와 비슷한 유형의 문제를 생성해줘. `)

  try {
    const response = await axiosInstance.post('/GPT/text', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${process.env.CHATGPT_API_KEY}`
      },
    });

    console.log(response.data); // 해설 및 답 확인
    return response.data;
  } catch (error) {
    console.error("해설 및 답 요청 실패:", error);
    throw error;
  }
};

// 비슷한 유형 문제 해설 및 답을 받아오는 함수
export const similarProblemAnswer = async (_requestText) => {
  const formData = new FormData();
  formData.append('requestText', `${similarProblemText}\n 위 문제를 한글로 번역하고 해설및 정답을 알려줘. `)

  //console.log(`Request Text: ${requestText}\n문제: ${similarProblemText}`);

  try {
    const response = await axiosInstance.post('/GPT/text', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${process.env.CHATGPT_API_KEY}`

      },
    });

    console.log(response.data); // 해설 및 답 확인
    return response.data;
  } catch (error) {
    console.error("해설 및 답 요청 실패:", error);
    throw error;
  }
};

