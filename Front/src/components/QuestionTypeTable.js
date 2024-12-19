import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Chart.js를 사용할 수 있도록 필요한 컴포넌트를 등록합니다.
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function QuestionTypeTable({ correctQuestionCounts }) {
  // 데이터가 없을 경우 초기값 설정
  const defaultData = {
    blankCount: 0,
    compositeCount: 0,
    grammarCount: 0,
    graspCount: 0,
    indirectCount: 0,
    understandingCount: 0,
  };

  // props로 전달된 correctQuestionCounts를 사용하거나 기본 데이터를 사용
  const dataToShow = correctQuestionCounts || defaultData;

  // Chart.js에서 요구하는 형식으로 데이터를 준비합니다.
  const data = {
    labels: ['빈칸 추론', '복합 문제', '문법, 어휘', '대의 파악', '간접 쓰기', '상황 이해'],
    datasets: [
      {
        label: '유형별 맞은 문제 개수',
        data: [
          dataToShow.blankCount,
          dataToShow.compositeCount,
          dataToShow.grammarCount,
          dataToShow.graspCount,
          dataToShow.indirectCount,
          dataToShow.understandingCount,
        ],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        barThickness: 40,  // 막대의 두께 설정
        maxBarThickness: 50,  // 막대의 최대 두께
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,  // 그래프의 비율을 부모 컨테이너에 맞게 설정하지 않음
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 14, // 글씨 크기 조정 (옵션)
          },
        },
      },
      title: {
        display: true,
        text: '유형별 맞은 문제 개수', // 그래프 제목을 한국어로 설정
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
        title: {
          display: true,
          text: '맞은 개수', // Y축 레이블 설정
        },
      },
      x: {
        title: {
          display: true,
          text: '문제 유형', // X축 레이블 설정
        },
      },
    },
  };

  return (
    <div style={{ width: '80%', height: '350px', margin: 'auto' }}>
      <Bar data={data} options={options} />
    </div>
  );
}

export default QuestionTypeTable;
