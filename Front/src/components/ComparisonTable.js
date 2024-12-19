import React from 'react';

const ComparisonTable = ({
  questionData,
  incorrectQuestionNumbers = [], // SolutionsPage용
  answers = {}, // QuestionsPage용
  setCurrentQuestionIndex,
  mode = 'question', // 페이지 타입 결정 ('question' 또는 'solution')
}) => {
  const handleRowClick = (index) => {
    setCurrentQuestionIndex(index); // 문제 번호 클릭 시 해당 문제로 이동
  };

  return (
    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
      <table>
        <thead>
          <tr>
            <th>번호</th>
            <th>{mode === 'solution' ? '결과' : '답안'}</th> {/* 헤더 동적 렌더링 */}
          </tr>
        </thead>
        <tbody>
          {questionData.map((question, index) => (
            <tr 
              key={question.number} 
              onClick={() => handleRowClick(index)} 
              style={{ cursor: 'pointer' }}
            >
              <td>{question.number}</td>
              <td>
                {mode === 'solution'
                  ? incorrectQuestionNumbers.includes(question.number) ? 'X' : 'O' // SolutionsPage에서 O/X
                  : answers[index] || ' ' // QuestionsPage에서 사용자 답안
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ComparisonTable;
