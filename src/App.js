import React, { useState, useCallback } from 'react';
import { Trophy, BarChart3, MessageSquare, Target, DollarSign, Eye, FileText, TrendingDown, Bell } from 'lucide-react';

// 컴포넌트 외부로 데이터를 분리하여 불필요한 재선언을 방지합니다.
const INITIAL_TASKS = [
  {
    id: 1,
    title: "휴가 중에도 예산 소진 체크 알림\n폭격 받기",
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
    title: "퇴근 전 설정한 광고,\n휴가 중엔 어떻게 돼가나 안절부절하기",
    description: "저 광고 잘 돌아가고 있을까... 계속 신경 쓰여 🤔",
    icon: <Target className="w-8 h-8" />,
    color: "bg-purple-500",
    adrielSolution: "오토메이션 기능 → 캠페인 성과나 특정 조건에 따라 자동 알림 or 이메일 보고서를 설정하면, 아무 걱정 없이 휴가 보내도 돼요."
  },
  {
    id: 5,
    title: "캠페인 성과가 안 좋아서,\n원인 파악하느라 밤잠 설침",
    description: "성과 안 나오는데 어떻게 해야 하지... 잠이 안 와 😴",
    icon: <Eye className="w-8 h-8" />,
    color: "bg-green-500",
    adrielSolution: "템플릿 라이브러리 기능 → 업종별/목표별 캠페인 성과 분석 템플릿을 통해 빠르게 개선 포인트 확인 가능."
  },
  {
    id: 6,
    title: "마감 보고서 작성하느라\n공항에서 PPT 열기",
    description: "비행기 타기 전 공항에서 급하게 PPT... 진짜 최악 ✈️",
    icon: <FileText className="w-8 h-8" />,
    color: "bg-pink-500",
    adrielSolution: "대시보드 실시간 업데이트 기능 → 실적이 자동 반영된 실시간 대시보드를 통해 보고서 작성 없이 링크만 전달하면 끝!"
  },
  {
    id: 7,
    title: "여러 광고매체 성과 모으느라\n노가다 작업 반복",
    description: "페이스북, 구글, 네이버... 하나씩 다 들어가서 확인 🔄",
    icon: <BarChart3 className="w-8 h-8" />,
    color: "bg-yellow-500",
    adrielSolution: "광고 매체 통합 기능 (Dashboard 기본 기능) → Meta, Google, Naver, Kakao 등 600개+ 매체 데이터 자동 통합, Excel 다운로드도 클릭 한 번!"
  },
  {
    id: 8,
    title: "실시간으로 알림 오는 카톡&메일\n휴가 중에 완전 방해받기",
    description: "쉬고 있는데 계속 울리는 알림... 스트레스 MAX 📱",
    icon: <Bell className="w-8 h-8" />,
    color: "bg-indigo-500",
    adrielSolution: "자동화 기반 데일리 요약 보고 기능 → 오전 9시 등 원하는 시간에 하루 1회만 요약 리포트를 받아서 알림 스트레스를 줄일 수 있어요."
  }
];

// 새로운 필드를 포함한 초기 리드 정보 상태
const INITIAL_LEAD_INFO = { 
  name: '', 
  email: '', 
  phone: '', 
  companyName: '', 
  jobTitle: '', 
  budget: '' 
};

// 재사용 가능한 모달 컴포넌트
const Modal = ({ message, onClose }) => (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm mx-auto text-center">
      <p className="text-lg font-semibold text-gray-800 mb-4 break-keep">{message}</p>
      <button
        onClick={onClose}
        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
      >
        확인
      </button>
    </div>
  </div>
);

// 리드 수집 폼 화면 컴포넌트
const LeadFormScreen = ({ onLeadSubmit }) => {
  const [leadInfo, setLeadInfo] = useState(INITIAL_LEAD_INFO);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modal, setModal] = useState({ show: false, message: '' });

  const handleInputChange = (field, value) => {
    setLeadInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // 모든 필드에 대한 유효성 검사
    if (!leadInfo.name || !leadInfo.email || !leadInfo.phone || !leadInfo.companyName || !leadInfo.jobTitle || !leadInfo.budget) {
      setModal({ show: true, message: '모든 필드를 입력해주세요.' });
      return;
    }
    
    setIsSubmitting(true);
    try {
      const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyyuSvR5EayjraolRWXKkzHYJ8hJDU_Z128lq0RztnBBy8yU9fd5iJvFj-so1KBjc1L0g/exec';
      
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', 
        body: JSON.stringify(leadInfo)
      });
      console.log('✅ 구글 스프레드시트에 저장 요청을 보냈습니다.');
    } catch (error) {
      console.error('⚠️ 데이터 제출 중 네트워크 오류가 발생했습니다:', error);
    } finally {
      console.log('🏖️ Marketer Lead Info:', leadInfo);
      setIsSubmitting(false);
      onLeadSubmit(); // 게임 시작
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 font-sans flex items-center justify-center">
      {modal.show && <Modal message={modal.message} onClose={() => setModal({ show: false, message: '' })} />}
      <div className="max-w-lg mx-auto w-full">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <img 
            src="https://images.pexels.com/photos/237272/pexels-photo-237272.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop" 
            alt="아름다운 해변 풍경"
            className="w-full h-48 object-cover"
          />
          
          <div className="p-8">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-2 break-keep">🏖️ 마케터 여름휴가 고민 월드컵</h1>
              <p className="text-gray-600 break-keep">
                마케터들의 여름휴가 고민을 재미있게 풀어보세요! 😅<br />
                먼저 간단한 정보를 입력해주시면 시작할 수 있습니다.
              </p>
            </div>

            <h2 className="text-xl font-bold text-gray-800 mb-6 text-center border-t pt-6 break-keep">마케터 정보 입력</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 입력 필드들 */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">담당자명 *</label>
                <input id="name" type="text" value={leadInfo.name} onChange={(e) => handleInputChange('name', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="홍길동" required />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">회사 이메일 *</label>
                <input id="email" type="email" value={leadInfo.email} onChange={(e) => handleInputChange('email', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="marketer@company.com" required />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">전화번호 *</label>
                <input id="phone" type="tel" value={leadInfo.phone} onChange={(e) => handleInputChange('phone', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="010-1234-5678" required />
              </div>
              {/* 추가된 필드: 회사명 / 서비스명 */}
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">회사명 / 서비스명 *</label>
                <input id="companyName" type="text" value={leadInfo.companyName} onChange={(e) => handleInputChange('companyName', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="아드리엘" required />
              </div>
              {/* 추가된 필드: 직책 및 직급 */}
              <div>
                <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-2">직책 및 직급 *</label>
                <select id="jobTitle" value={leadInfo.jobTitle} onChange={(e) => handleInputChange('jobTitle', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                  <option value="">직책/직급을 선택해주세요</option>
                  <option value="intern_staff">인턴/사원급</option>
                  <option value="assistant_manager">대리/과장급</option>
                  <option value="team_lead">팀장급</option>
                  <option value="executive">임원</option>
                  <option value="ceo">CEO</option>
                </select>
              </div>
              {/* 수정된 필드: 월 마케팅 예산 */}
              <div>
                <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">월 마케팅 예산을 알려주세요 *</label>
                <select id="budget" value={leadInfo.budget} onChange={(e) => handleInputChange('budget', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                  <option value="">예산 규모를 선택해주세요</option>
                  <option value="no_ads">광고 미진행</option>
                  <option value="under_10m">1천만원 이하</option>
                  <option value="10m_to_50m">1천만원 ~ 5천만원</option>
                  <option value="50m_to_100m">5천만원 ~ 1억</option>
                  <option value="over_100m">1억원 이상</option>
                </select>
              </div>
              <div className="pt-4">
                <button type="submit" disabled={isSubmitting} className={`w-full ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'} text-white py-3 px-4 rounded-lg font-semibold transition-colors`}>
                  {isSubmitting ? '처리 중...' : '월드컵 시작하기! 🏆'}
                </button>
              </div>
            </form>
            <p className="text-xs text-gray-500 text-center mt-4">* 입력하신 정보는 마케팅 솔루션 안내 목적으로만 사용됩니다.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// 게임 진행 화면 컴포넌트
const GameScreen = ({ tasks, onSelect, onReset }) => {
  const [match, setMatch] = useState(0);
  const [winners, setWinners] = useState([]);
  const [currentTasks, setCurrentTasks] = useState(tasks);

  const getRoundName = useCallback((tasksLength) => {
    if (tasksLength === 8) return "8강";
    if (tasksLength === 4) return "4강";
    if (tasksLength === 2) return "결승";
    return "완료";
  }, []);

  const handleSelect = (selectedTask) => {
    const newWinners = [...winners, selectedTask];
    
    if (match + 1 < currentTasks.length / 2) {
      setWinners(newWinners);
      setMatch(match + 1);
    } else {
      if (newWinners.length === 1) {
        onSelect(newWinners[0]); // 최종 우승자 전달
      } else {
        setCurrentTasks(newWinners);
        setWinners([]);
        setMatch(0);
      }
    }
  };

  const task1 = currentTasks[match * 2];
  const task2 = currentTasks[match * 2 + 1];

  if (!task1 || !task2) return null; // 렌더링 보호

  const progress = Math.round(((match) / (currentTasks.length / 2)) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 font-sans flex items-center justify-center">
      <div className="max-w-4xl mx-auto w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 break-keep">🏖️ 마케터 여름휴가 고민 월드컵</h1>
          <p className="text-gray-600 mb-4 break-keep">둘 중 더 싫은 업무를 선택해주세요! 😭</p>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
            <span className="bg-white px-3 py-1 rounded-full font-semibold">{getRoundName(currentTasks.length)}</span>
            <span>{match + 1} / {currentTasks.length / 2}</span>
          </div>
        </div>

        <div className="relative">
            <div className="grid md:grid-cols-2 gap-6 items-stretch">
                {/* Task 1 Card */}
                <div onClick={() => handleSelect(task1)} className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all hover:scale-105 flex flex-col justify-between">
                    <div className="text-center">
                        <div className={`${task1.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white`}>{task1.icon}</div>
                        <h3 className="text-xl font-bold text-gray-800 mb-3 break-keep text-center whitespace-pre-line h-16 flex items-center justify-center">{task1.title}</h3>
                        <p className="text-gray-600 text-sm leading-relaxed break-keep">{task1.description}</p>
                    </div>
                </div>

                {/* Task 2 Card */}
                <div onClick={() => handleSelect(task2)} className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all hover:scale-105 flex flex-col justify-between">
                    <div className="text-center">
                        <div className={`${task2.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white`}>{task2.icon}</div>
                        <h3 className="text-xl font-bold text-gray-800 mb-3 break-keep text-center whitespace-pre-line h-16 flex items-center justify-center">{task2.title}</h3>
                        <p className="text-gray-600 text-sm leading-relaxed break-keep">{task2.description}</p>
                    </div>
                </div>
            </div>
            
            {/* VS Separator */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                <div className="bg-red-500 text-white px-6 py-3 rounded-full font-bold text-lg shadow-lg">VS</div>
            </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-8 bg-white rounded-lg p-4">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>진행률</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-500 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="text-center mt-6">
          <button onClick={onReset} className="text-gray-500 hover:text-gray-700 text-sm underline">처음부터 다시 시작</button>
        </div>
      </div>
    </div>
  );
};


// 결과 화면 컴포넌트
const FinishedScreen = ({ winner, onReset }) => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 font-sans flex items-center justify-center">
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Trophy className="w-12 h-12 text-yellow-500" />
          <h1 className="text-3xl font-bold text-gray-800 break-keep">🏆 우승!</h1>
        </div>
        <h2 className="text-xl text-gray-600 mb-6 break-keep">마케터의 최대 고민이 무엇인지 확인해보세요!</h2>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8 text-center mb-8">
        <div className={`${winner.color} w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-white`}>
          {winner.icon}
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2 break-keep text-center whitespace-pre-line">{winner.title}</h3>
        <p className="text-gray-600 mb-6 break-keep">{winner.description}</p>
        <div className="text-4xl mb-4">😱</div>
        <p className="text-lg text-gray-700 mb-8 break-keep">
          <strong>우승!</strong><br />
          쉰다고 껐는데 백그라운드에서 계속 돌아가던 놈 = 이 고민
        </p>
        
        <div className="bg-blue-50 rounded-lg p-6 text-left mb-6">
          <h4 className="text-lg font-bold text-blue-900 mb-3 flex items-center gap-2 break-keep">
            <span className="text-blue-600">💡</span>
            아드리엘을 사용하면?
          </h4>
          <p className="text-blue-800 leading-relaxed break-keep">
            <strong>Adriel 기능 추천:</strong> {winner.adrielSolution}
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 w-full">
        <a 
          href="https://www.adriel.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors w-full max-w-xs text-center"
        >
          Adriel 무료 체험하기 →
        </a>
        <button
          onClick={onReset}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-8 py-3 rounded-lg font-semibold transition-colors w-full max-w-xs"
        >
          다시 시작하기
        </button>
      </div>
    </div>
  </div>
);

// 메인 앱 컴포넌트
const App = () => {
  const [gamePhase, setGamePhase] = useState('lead'); // 'lead', 'playing', 'finished'
  const [finalWinner, setFinalWinner] = useState(null);

  const handleStartGame = () => setGamePhase('playing');
  
  const handleGameFinish = (winner) => {
    setFinalWinner(winner);
    setGamePhase('finished');
  };

  const handleReset = () => {
    setFinalWinner(null);
    setGamePhase('lead');
  };

  return (
    <>
      <style>{`
        @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css');
        body, button, input, select, textarea {
          font-family: 'Pretendard', sans-serif !important;
        }
      `}</style>
      {gamePhase === 'lead' && <LeadFormScreen onLeadSubmit={handleStartGame} />}
      {gamePhase === 'playing' && <GameScreen tasks={INITIAL_TASKS} onSelect={handleGameFinish} onReset={handleReset} />}
      {gamePhase === 'finished' && <FinishedScreen winner={finalWinner} onReset={handleReset} />}
    </>
  );
};

export default App;
