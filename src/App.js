import React, { useState, useEffect } from 'react';
import { Trophy, BarChart3, MessageSquare, Target, DollarSign, Eye, FileText, TrendingDown, Bell } from 'lucide-react';

const App = () => {
  const initialTasks = [
    {
      id: 1,
      title: "휴가 중에도 예산 소진 체크 알림 폭격 받기",
      description: "하루 종일 울리는 예산 알림... 휴가가 휴가 같지 않아 😵",
      icon: <DollarSign className="w-8 h-8" />,
      color: "bg-red-500",
      adrielSolution: "Goal Pacing 기능 → 캠페인 목표 예산 대비 실적을 실시간 추적하며, 설정된 목표 이상으로 지출되면 자동으로 알림을 받아 예산 낭비를 사전에 차단할 수 있어요."
    },
    {
      id: 2,
      title: "고객사 전화 \"보고서 아직인가요?\" 😠",
      description: "휴가지에서 울리는 고객 전화... 뭐라고 답해야 하지?",
      icon: <MessageSquare className="w-8 h-8" />,
      color: "bg-orange-500",
      adrielSolution: "리포트 공유 기능 → 자동 생성된 대시보드 리포트 링크를 고객에게 실시간 공유하면, 휴가 중에도 문의 없이 셀프 확인이 가능해요."
    },
    {
      id: 3,
      title: "리드 줄었는지 확인하려고 노트북 켜기",
      description: "해변에서 노트북 켜고 있는 나... 이게 맞나?",
      icon: <TrendingDown className="w-8 h-8" />,
      color: "bg-blue-500",
      adrielSolution: "AI 에이전트 기능 → \"지난주 리드가 왜 줄었지?\"처럼 질문만 하면, AI가 분석해 답을 주니까 노트북 없이도 모바일에서 바로 해결할 수 있어요."
    },
    {
      id: 4,
      title: "퇴근 전 설정한 광고, 휴가 중엔 어떻게 돼가나 걱정",
      description: "저 광고 잘 돌아가고 있을까... 계속 신경 쓰여 🤔",
      icon: <Target className="w-8 h-8" />,
      color: "bg-purple-500",
      adrielSolution: "오토메이션 기능 → 캠페인 성과나 특정 조건에 따라 자동 알림 or 이메일 보고서를 설정하면, 아무 걱정 없이 휴가 보내도 돼요."
    },
    {
      id: 5,
      title: "캠페인 성과가 안 좋을 때, 대안 소재 찾느라 밤잠 설침",
      description: "성과 안 나오는데 어떻게 해야 하지... 잠이 안 와 😴",
      icon: <Eye className="w-8 h-8" />,
      color: "bg-green-500",
      adrielSolution: "템플릿 라이브러리 기능 → 업종별/목표별 캠페인 성과 분석 템플릿을 통해 빠르게 개선 포인트 확인 가능."
    },
    {
      id: 6,
      title: "마감 보고서 작성하느라 공항에서 PPT 열기",
      description: "비행기 타기 전 공항에서 급하게 PPT... 진짜 최악 ✈️",
      icon: <FileText className="w-8 h-8" />,
      color: "bg-pink-500",
      adrielSolution: "대시보드 실시간 업데이트 기능 → 실적이 자동 반영된 실시간 대시보드를 통해 보고서 작성 없이 링크만 전달하면 끝!"
    },
    {
      id: 7,
      title: "여러 광고매체 성과 모으느라 노가다 작업 반복",
      description: "페이스북, 구글, 네이버... 하나씩 다 들어가서 확인 🔄",
      icon: <BarChart3 className="w-8 h-8" />,
      color: "bg-yellow-500",
      adrielSolution: "광고 매체 통합 기능 (Dashboard 기본 기능) → Meta, Google, Naver, Kakao 등 600개+ 매체 데이터 자동 통합, Excel 다운로드도 클릭 한 번!"
    },
    {
      id: 8,
      title: "실시간으로 알림 오는 메신저 & 이메일 때문에 완전 방해받기",
      description: "쉬고 있는데 계속 울리는 알림... 스트레스 MAX 📱",
      icon: <Bell className="w-8 h-8" />,
      color: "bg-indigo-500",
      adrielSolution: "자동화 기반 데일리 요약 보고 기능 → 오전 9시 등 원하는 시간에 하루 1회만 요약 리포트를 받아서 알림 스트레스를 줄일 수 있어요."
    }
  ];

  const [currentTasks, setCurrentTasks] = useState(initialTasks);
  const [currentRound, setCurrentRound] = useState(1);
  const [currentMatch, setCurrentMatch] = useState(0);
  const [winners, setWinners] = useState([]);
  const [gamePhase, setGamePhase] = useState('lead'); // 'lead', 'playing', 'finished'
  const [finalWinner, setFinalWinner] = useState(null);
  const [leadInfo, setLeadInfo] = useState({
    name: '',
    email: '',
    phone: '',
    budget: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  // Function to show a custom modal instead of alert
  const showCustomModal = (message) => {
    setModalMessage(message);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalMessage('');
  };

  const getRoundName = (tasksLength) => {
    if (tasksLength === 8) return "8강";
    if (tasksLength === 4) return "4강";
    if (tasksLength === 2) return "결승";
    return "완료";
  };

  const selectTask = (selectedTask) => {
    const newWinners = [...winners, selectedTask];
    setWinners(newWinners);

    if (currentMatch + 1 < currentTasks.length / 2) {
      setCurrentMatch(currentMatch + 1);
    } else {
      // All matches in the current round are done
      if (newWinners.length === 1) { // If only one winner, it's the final winner
        setFinalWinner(newWinners[0]);
        setGamePhase('finished');
      } else { // Move to the next round
        setCurrentTasks(newWinners);
        setCurrentRound(currentRound + 1);
        setCurrentMatch(0);
        setWinners([]);
      }
    }
  };

  const resetGame = () => {
    setCurrentTasks(initialTasks);
    setCurrentRound(1);
    setCurrentMatch(0);
    setWinners([]);
    setGamePhase('lead');
    setFinalWinner(null);
    setLeadInfo({
      name: '',
      email: '',
      phone: '',
      budget: ''
    });
  };

  const handleLeadSubmit = async () => {
    console.log('제출된 리드 정보:', leadInfo);
    if (leadInfo.name && leadInfo.email && leadInfo.phone && leadInfo.budget) {
      setIsSubmitting(true);
      
      try {
        // Note: Google Apps Script URL is configured in the original code
        const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyyuSvR5EayjraolRWXKkzHYJ8hJDU_Z128lq0RztnBBy8yU9fd5iJvFj-so1KBjc1L0g/exec';
        
        // In this demo environment, we'll just log the data
        console.log('🏖️ Marketer Lead Info:', leadInfo);
        setGamePhase('playing');
      } catch (error) {
        console.error('Data submission error:', error);
        setGamePhase('playing');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      showCustomModal('모든 필드를 입력해주세요.');
    }
  };

  const handleInputChange = (field, value) => {
    setLeadInfo(prev => ({ ...prev, [field]: value }));
  };

  // Custom Modal Component
  const Modal = ({ message, onClose }) => (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm mx-auto text-center">
        <p className="text-lg font-semibold text-gray-800 mb-4">{message}</p>
        <button
          onClick={onClose}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
        >
          확인
        </button>
      </div>
    </div>
  );

  if (gamePhase === 'lead') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 font-sans">
        {showModal && <Modal message={modalMessage} onClose={closeModal} />}
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              🏖️ 마케터 여름휴가 고민 월드컵
            </h1>
            <p className="text-gray-600 mb-6">
              마케터들의 여름휴가 고민을 재미있게 풀어보세요! 😅<br />
              먼저 간단한 정보를 입력해주시면 시작할 수 있습니다.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
              마케터 정보 입력
            </h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  담당자명 *
                </label>
                <input
                  id="name"
                  type="text"
                  value={leadInfo.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="홍길동"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  회사 이메일 *
                </label>
                <input
                  id="email"
                  type="email"
                  value={leadInfo.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="marketer@company.com"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  전화번호 *
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={leadInfo.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="010-1234-5678"
                />
              </div>

              <div>
                <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
                  월 마케팅 예산 *
                </label>
                <select
                  id="budget"
                  value={leadInfo.budget}
                  onChange={(e) => handleInputChange('budget', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">예산 규모를 선택해주세요</option>
                  <option value="under100">100만원 이하</option>
                  <option value="100to500">100~500만원</option>
                  <option value="500to1000">500~1000만원</option>
                  <option value="over1000">1000만원 이상</option>
                </select>
              </div>

              <div className="pt-4">
                <button
                  onClick={handleLeadSubmit}
                  disabled={isSubmitting}
                  className={`w-full ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'} text-white py-3 px-4 rounded-lg font-semibold transition-colors`}
                >
                  {isSubmitting ? '처리 중...' : '월드컵 시작하기! 🏆'}
                </button>
              </div>
            </div>

            <p className="text-xs text-gray-500 text-center mt-4">
              * 입력하신 정보는 마케팅 솔루션 안내 목적으로만 사용됩니다.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (gamePhase === 'finished') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 font-sans">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Trophy className="w-12 h-12 text-yellow-500" />
              <h1 className="text-3xl font-bold text-gray-800">🏆 우승!</h1>
            </div>
            <h2 className="text-xl text-gray-600 mb-6">마케터의 최대 고민이 무엇인지 확인해보세요!</h2>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 text-center mb-8">
            <div className={`${finalWinner.color} w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-white`}>
              {finalWinner.icon}
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">{finalWinner.title}</h3>
            <p className="text-gray-600 mb-6">{finalWinner.description}</p>
            <div className="text-4xl mb-4">😱</div>
            <p className="text-lg text-gray-700 mb-8">
              <strong>우승!</strong><br />
              쉰다고 껐는데 백그라운드에서 계속 돌아가던 놈 = 이 고민
            </p>
            
            <div className="bg-blue-50 rounded-lg p-6 text-left">
              <h4 className="text-lg font-bold text-blue-900 mb-3 flex items-center gap-2">
                <span className="text-blue-600">💡</span>
                아드리엘을 사용하면?
              </h4>
              <p className="text-blue-800 leading-relaxed">
                <strong>Adriel 기능 추천:</strong> {finalWinner.adrielSolution}
              </p>
            </div>
          </div>

          <div className="text-center">
            <div className="mb-4">
              <a 
                href="https://www.adriel.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-block mr-4"
              >
                Adriel 무료 체험하기 →
              </a>
            </div>
            <button
              onClick={resetGame}
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              다시 시작하기
            </button>
          </div>
        </div>
      </div>
    );
  }

  const task1 = currentTasks[currentMatch * 2];
  const task2 = currentTasks[currentMatch * 2 + 1];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🏖️ 마케터 여름휴가 고민 월드컵
          </h1>
          <p className="text-gray-600 mb-4">둘 중 더 싫은 업무를 선택해주세요! 😭</p>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
            <span className="bg-white px-3 py-1 rounded-full">
              {getRoundName(currentTasks.length)}
            </span>
            <span>
              {currentMatch + 1} / {currentTasks.length / 2}
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div
            onClick={() => selectTask(task1)}
            className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all hover:scale-105"
          >
            <div className="text-center">
              <div className={`${task1.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white`}>
                {task1.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{task1.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{task1.description}</p>
            </div>
          </div>

          <div className="md:hidden flex items-center justify-center py-4">
            <div className="bg-red-500 text-white px-4 py-2 rounded-full font-bold">VS</div>
          </div>

          <div
            onClick={() => selectTask(task2)}
            className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all hover:scale-105"
          >
            <div className="text-center">
              <div className={`${task2.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white`}>
                {task2.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{task2.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{task2.description}</p>
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center justify-center -mt-6 mb-6">
          <div className="bg-red-500 text-white px-6 py-3 rounded-full font-bold text-lg shadow-lg">
            VS
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg p-4">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>진행률</span>
            <span>{Math.round(((currentMatch * 2 + winners.length) / currentTasks.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentMatch * 2 + winners.length) / currentTasks.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="text-center mt-6">
          <button
            onClick={resetGame}
            className="text-gray-500 hover:text-gray-700 text-sm underline"
          >
            처음부터 다시 시작
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;