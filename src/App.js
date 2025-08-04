import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Trophy } from 'lucide-react';

// 컴포넌트 외부로 데이터를 분리하여 불필요한 재선언을 방지합니다.
const INITIAL_TASKS = [
  {
    id: 1,
    title: "업무공백 중 불안한 예산 초과",
    description: "예산이 초과될까봐 휴가가 휴가 같지 않아 😵",
    icon: "https://i.imgur.com/xXkiKG5.png",
    type: "image",
    adrielSolution: "Goal Pacing 기능 → 캠페인 목표 예산 대비 실적을 실시간 추적하며, 설정된 목표 이상으로 지출되면 자동으로 알림을 받아 예산 낭비를 사전에 차단할 수 있어요."
  },
  {
    id: 2,
    title: "휴가 중 갑작스런 보고서 요청 전화",
    description: "딱 누웠는데 “오늘 중으로 보고서 받을 수 있을까요?” 연락 오는 순간...",
    icon: "https://i.imgur.com/nbCV8WG.png",
    type: "image",
    resultIcon: "https://i.imgur.com/zj296HY.mp4",
    resultType: "video",
    adrielSolution: "리포트 공유 기능 → 자동 생성된 대시보드 리포트 링크를 고객에게 실시간 공유하면, 휴가 중에도 문의 없이 셀프 확인이 가능해요."
  },
  {
    id: 3,
    title: "퇴근하고픈데 떠오르지 않는 여름 광고 소재..",
    description: "아이디어는 텅텅, 시간은 퇴근 시간... 비행기표도 끊어놨는데..",
    icon: "https://i.imgur.com/JVmCj0v.png",
    type: "image",
    adrielSolution: "AI 에이전트 기능 → \"지난주 리드가 왜 줄었지?\"처럼 질문만 하면, AI가 분석해 답을 주니까 노트북 없이도 모바일에서 바로 해결할 수 있어요."
  },
  {
    id: 4,
    title: "휴가 중 문득 떠오르는 캠페인 성과 걱정",
    description: "쉬는데도 생각나는 여름 프로모션 성과.. 잘 돌아가나?",
    icon: "https://i.imgur.com/UpsRaRS.png",
    type: "image",
    resultIcon: "https://i.imgur.com/UpsRaRS.mp4",
    resultType: "video",
    adrielSolution: "오토메이션 기능 → 캠페인 성과나 특정 조건에 따라 자동 알림 or 이메일 보고서를 설정하면, 아무 걱정 없이 휴가 보내도 돼요."
  },
  {
    id: 5,
    title: "무더위에도 가을 캠페인 기획하는 나란 마케터..",
    description: "성과 예측도 어려운데 내부 리소스는 쉬고, 고객 반응도 적고..",
    icon: "https://i.imgur.com/JXTYPQf.png",
    type: "image",
    adrielSolution: "템플릿 라이브러리 기능 → 업종별/목표별 캠페인 성과 분석 템플릿을 통해 빠르게 개선 포인트 확인 가능."
  },
  {
    id: 6,
    title: "공항 가기 한시간 전.. 갑작스런 광고 세팅 요청",
    description: "공항에서도 내 손은 아직 키보드 위🧑‍💻🥲",
    icon: "https://i.imgur.com/Mou1A7p.png",
    type: "image",
    adrielSolution: "대시보드 실시간 업데이트 기능 → 실적이 자동 반영된 실시간 대시보드를 통해 보고서 작성 없이 링크만 전달하면 끝!"
  },
  {
    id: 7,
    title: "휴가철에도 멈추지 않는 성과 취합 노가다",
    description: "페이스북, 구글, 네이버... 하나씩 다 들어가서 확인 🔄",
    icon: "https://i.imgur.com/PWd3Poc.png",
    type: "image",
    resultIcon: "https://i.imgur.com/PWd3Poc.mp4",
    resultType: "video",
    adrielSolution: "광고 매체 통합 기능 (Dashboard 기본 기능) → Meta, Google, Naver, Kakao 등 600개+ 매체 데이터 자동 통합, Excel 다운로드도 클릭 한 번!"
  },
  {
    id: 8,
    title: "팀원의 계속되는 업무 관련 연락\n휴가 중에 완전 방해받기",
    description: "쉬고 있는데 계속 울리는 까톡... 스트레스 MAX 📱",
    icon: "https://i.imgur.com/3DmxSSl.png",
    type: "image",
    adrielSolution: "자동화 기반 데일리 요약 보고 기능 → 오전 9시 등 원하는 시간에 하루 1회만 요약 리포트를 받아서 알림 스트레스를 줄일 수 있어요."
  }
];

const INITIAL_LEAD_INFO = { 
  name: '', email: '', phone: '', companyName: '', jobTitle: '', budget: '', giveawayConsent: false 
};

// 이미지 지연 로딩(Lazy Loading)을 위한 재사용 컴포넌트
const LazyImage = ({ src, alt, className }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = new Image();
            img.src = src;
            img.onload = () => setIsLoaded(true);
            observer.unobserve(imgRef.current);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, [src]);

  return (
    <div ref={imgRef} className={`${className} bg-gray-200 rounded-lg`}>
      {isLoaded && <img src={src} alt={alt} className={`${className} transition-opacity duration-500 opacity-100`} />}
    </div>
  );
};

// 비디오 지연 로딩(Lazy Loading)을 위한 재사용 컴포넌트
const LazyVideo = ({ src, className }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            videoRef.current.src = src;
            observer.unobserve(videoRef.current);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, [src]);

  return (
    <video
      ref={videoRef}
      className={className}
      autoPlay
      loop
      muted
      playsInline
    />
  );
};

// 재사용 가능한 모달 컴포넌트
const Modal = ({ message, onClose }) => (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm mx-auto text-center">
      <p className="text-lg font-semibold text-gray-800 mb-4 break-keep">{message}</p>
      <button
        onClick={onClose}
        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors w-full"
      >
        확인
      </button>
    </div>
  </div>
);

// 로딩 애니메이션 컴포넌트
const LoadingAnimation = () => (
  <div className="fixed inset-0 bg-white bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="text-center">
      <div className="animate-rocking-boat text-6xl mb-4">⛵️</div>
      <p className="text-lg font-semibold text-gray-700">월드컵 대진표를 만들고 있어요...</p>
    </div>
  </div>
);

// 리드 수집 폼 화면 컴포넌트
const LeadFormScreen = ({ onLeadSubmit }) => {
  const [leadInfo, setLeadInfo] = useState(INITIAL_LEAD_INFO);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modal, setModal] = useState({ show: false, message: '' });

  useEffect(() => {
    INITIAL_TASKS.forEach(task => {
      if (task.icon && task.type === 'image') {
        const img = new Image();
        img.src = task.icon;
      }
    });
  }, []);

  const handleInputChange = (field, value) => {
    if (field === 'phone') {
      const numericValue = value.replace(/\D/g, '');
      setLeadInfo(prev => ({ ...prev, [field]: numericValue }));
    } else {
      setLeadInfo(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!leadInfo.name || !leadInfo.email || !leadInfo.phone || !leadInfo.companyName || !leadInfo.jobTitle || !leadInfo.budget) {
      setModal({ show: true, message: '모든 필드를 입력해주세요.' });
      return;
    }

    if (leadInfo.phone.length !== 11) {
      setModal({ show: true, message: "전화번호 11자리를 '-' 없이 정확하게 입력해주세요." });
      return;
    }
    
    if (!leadInfo.giveawayConsent) {
      setModal({ show: true, message: '[필수] 경품 제공을 위한 마케팅 수신에 동의해주세요.' });
      return;
    }

    setIsSubmitting(true);
    try {
      const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyyuSvR5EayjraolRWXKkzHYJ8hJDU_Z128lq0RztnBBy8yU9fd5iJvFj-so1KBjc1L0g/exec';
      
      const payload = { ...leadInfo };
      delete payload.giveawayConsent;

      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', 
        body: JSON.stringify(payload)
      });
      console.log('✅ 구글 스프레드시트에 저장 요청을 보냈습니다.');
    } catch (error) {
      console.error('⚠️ 데이터 제출 중 네트워크 오류가 발생했습니다:', error);
    } finally {
      console.log('🏖️ Marketer Lead Info:', leadInfo);
      setIsSubmitting(false);
      onLeadSubmit();
    }
  };

  return (
    <div 
      className="min-h-screen font-sans bg-cover bg-center" 
      style={{ backgroundImage: "url('https://i.imgur.com/yfyw5jG.png')" }}
    >
      <div className="min-h-screen bg-black bg-opacity-40 p-4 flex items-center justify-center">
        {isSubmitting && <LoadingAnimation />}
        {modal.show && <Modal message={modal.message} onClose={() => setModal({ show: false, message: '' })} />}
        <div className="max-w-lg mx-auto w-full">
          <div className="bg-white rounded-xl shadow-2xl shadow-indigo-400/40 overflow-hidden transition-all duration-300 hover:shadow-indigo-400/60 hover:scale-105">
            <div className="p-6 sm:p-8">
              <div className="text-center mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 break-keep">🏖️ 마케터 여름휴가 고민 월드컵</h1>
                <p className="text-gray-600 break-keep text-sm sm:text-base">
                  당신이 가장 싫어하는 여름 휴가철 업무는?! 😅<br />
                  결과 페이지를 보여주시면 휴가철 필수템도 증정!
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">담당자명 *</label>
                  <input id="name" type="text" value={leadInfo.name} onChange={(e) => handleInputChange('name', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="홍길동" required />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">회사 이메일 *</label>
                  <input id="email" type="email" value={leadInfo.email} onChange={(e) => handleInputChange('email', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="marketer@company.com" required />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">전화번호 *</label>
                  <input id="phone" type="tel" value={leadInfo.phone} onChange={(e) => handleInputChange('phone', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="'-' 없이 11자리 입력" required maxLength="11" />
                </div>
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">회사명 / 서비스명 *</label>
                  <input id="companyName" type="text" value={leadInfo.companyName} onChange={(e) => handleInputChange('companyName', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="아드리엘" required />
                </div>
                <div>
                  <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-2">직책 및 직급 *</label>
                  <select id="jobTitle" value={leadInfo.jobTitle} onChange={(e) => handleInputChange('jobTitle', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                    <option value="">직책/직급을 선택해주세요</option>
                    <option value="intern_staff">인턴/사원급</option>
                    <option value="assistant_manager">대리/과장급</option>
                    <option value="team_lead">팀장급</option>
                    <option value="executive">임원</option>
                    <option value="ceo">CEO</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">월 마케팅 예산을 알려주세요 *</label>
                  <select id="budget" value={leadInfo.budget} onChange={(e) => handleInputChange('budget', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                    <option value="">예산 규모를 선택해주세요</option>
                    <option value="no_ads">광고 미진행</option>
                    <option value="under_10m">1천만원 이하</option>
                    <option value="10m_to_50m">1천만원 ~ 5천만원</option>
                    <option value="50m_to_100m">5천만원 ~ 1억</option>
                    <option value="over_100m">1억원 이상</option>
                  </select>
                </div>
                <div className="pt-2 pb-2">
                  <div className="flex items-center">
                    <input
                      id="giveawayConsent"
                      name="giveawayConsent"
                      type="checkbox"
                      checked={leadInfo.giveawayConsent}
                      onChange={(e) => handleInputChange('giveawayConsent', e.target.checked)}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="giveawayConsent" className="ml-2 block text-sm text-gray-700">
                      [필수] 경품 제공을 위한 마케팅 수신에 동의합니다
                    </label>
                  </div>
                </div>
                <div className="pt-2">
                  <button type="submit" disabled={isSubmitting} className={`w-full ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'} text-white py-3 px-4 rounded-lg font-semibold transition-colors`}>
                    {isSubmitting ? '월드컵 개최 중...' : '월드컵 시작하기! 🏆'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 게임 진행 화면 컴포넌트
const GameScreen = ({ tasks, onSelect }) => {
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
        onSelect(newWinners[0]);
      } else {
        setCurrentTasks(newWinners);
        setWinners([]);
        setMatch(0);
      }
    }
  };

  const task1 = currentTasks[match * 2];
  const task2 = currentTasks[match * 2 + 1];

  if (!task1 || !task2) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 font-sans flex items-center justify-center">
      <div className="max-w-4xl mx-auto w-full">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 break-keep">🏖️ 마케터 여름휴가 고민 월드컵</h1>
          <p className="text-gray-600 mb-4 break-keep text-sm sm:text-base">둘 중 더 싫은 업무를 선택해주세요! 😭</p>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
            <span className="bg-white px-3 py-1 rounded-full font-semibold">{getRoundName(currentTasks.length)}</span>
            <span>{match + 1} / {currentTasks.length / 2}</span>
          </div>
        </div>

        <div className="flex flex-col md:grid md:grid-cols-2 md:gap-8 items-center">
          {/* Task 1 Card */}
          <div onClick={() => handleSelect(task1)} className="w-full bg-white rounded-xl shadow-lg px-6 pt-6 pb-6 cursor-pointer hover:shadow-xl transition-all hover:scale-105 flex flex-col justify-between mb-4 md:mb-0">
            <div className="text-center">
              <div className="flex items-center justify-center mx-auto mb-6" style={{minHeight: '9.5rem'}}>
                {task1.icon ? <LazyImage src={task1.icon} alt={`${task1.title} 아이콘`} className="w-56 h-auto object-contain" /> : <div className="w-56 h-full"/>}
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 break-keep text-center whitespace-pre-line flex items-center justify-center min-h-[4rem]">{task1.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed break-keep">{task1.description}</p>
            </div>
          </div>

          {/* VS Separator for Mobile */}
          <div className="md:hidden flex items-center justify-center my-2">
            <div className="bg-red-500 text-white px-4 py-1 rounded-full font-bold text-base shadow-lg">VS</div>
          </div>

          {/* Task 2 Card */}
          <div onClick={() => handleSelect(task2)} className="w-full bg-white rounded-xl shadow-lg px-6 pt-6 pb-6 cursor-pointer hover:shadow-xl transition-all hover:scale-105 flex flex-col justify-between mt-4 md:mt-0">
            <div className="text-center">
              <div className="flex items-center justify-center mx-auto mb-6" style={{minHeight: '9.5rem'}}>
                {task2.icon ? <LazyImage src={task2.icon} alt={`${task2.title} 아이콘`} className="w-56 h-auto object-contain" /> : <div className="w-56 h-full"/>}
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 break-keep text-center whitespace-pre-line flex items-center justify-center min-h-[4rem]">{task2.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed break-keep">{task2.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


// 결과 화면 컴포넌트
const FinishedScreen = ({ winner, onReset }) => {
  const resultMediaSrc = winner.resultIcon || winner.icon;
  const resultMediaType = winner.resultType || winner.type;

  return (
    <div 
      className="min-h-screen font-sans bg-cover bg-center" 
      style={{ backgroundImage: "url('https://i.imgur.com/yfyw5jG.png')" }}
    >
      <div className="min-h-screen bg-black bg-opacity-40 p-4 flex items-center justify-center">
        <div className="max-w-2xl mx-auto w-full">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Trophy className="w-12 h-12 text-yellow-500" />
              <h1 className="text-2xl sm:text-3xl font-bold text-white break-keep">🏆 우승!</h1>
            </div>
            <h2 className="text-lg sm:text-xl text-gray-200 mb-6 break-keep">당신의 최대 고민은?</h2>
          </div>

          <div className="bg-white rounded-xl shadow-lg px-6 sm:px-8 pt-10 sm:pt-12 pb-6 sm:pb-8 text-center mb-8">
            <div className="flex items-center justify-center mx-auto mb-8" style={{minHeight: '10.5rem'}}>
              {winner.icon ? <LazyImage src={winner.icon} alt={`${winner.title} 아이콘`} className="w-60 h-auto object-contain" /> : <div className="w-60 h-full"/>}
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 break-keep text-center whitespace-pre-line">{winner.title}</h3>
            <p className="text-gray-600 mb-8 break-keep">{winner.description}</p>
            
            <div className="bg-blue-50 rounded-lg p-6 text-left">
              <h4 className="text-lg font-bold text-blue-900 mb-3 flex items-center gap-2 break-keep">
                <span className="text-blue-600">💡</span>
                아드리엘을 사용하면?
              </h4>
              {winner.id === 1 ? (
                <div>
                  <div className="text-sm font-medium text-blue-600">오토메이션</div>
                  <h5 className="text-xl font-bold text-gray-800 mt-2 break-keep">
                    딩동! 기회와 위기의 순간을<br/>놓치지 않는 오토메이션
                  </h5>
                  <div className="my-4">
                    <LazyImage 
                      src="https://i.imgur.com/DHgq97q.png" 
                      alt="아드리엘 오토메이션 기능 예시" 
                      className="w-full h-auto object-contain rounded-lg shadow-md" 
                    />
                  </div>
                  <p className="text-base text-gray-700 mt-4 break-keep">
                    KPI에 따른 오토메이션 시스템이<br/>24시간 모니터링하고 최적화합니다.<br/>
                    <strong className="font-bold">캠페인의 효율을 극대화하고, 손실은 최소화하세요.</strong>
                  </p>
                </div>
              ) : winner.id === 2 ? (
                <div>
                  <div className="text-sm font-medium text-blue-600">리포트 자동 생성 기능</div>
                  <h5 className="text-xl font-bold text-gray-800 mt-2 break-keep">
                    지금 보고 있는 화면 그대로 PDF 리포트로 저장
                  </h5>
                  <div className="my-4">
                    <LazyVideo 
                      src={resultMediaSrc} 
                      className="w-full h-auto object-contain rounded-lg shadow-md" 
                    />
                  </div>
                  <p className="text-base text-gray-700 mt-4 break-keep">
                    급한 보고서 제작 고민은 이제 그만!<br/>
                    보고 있는 대시보드 화면을 손쉽게 PDF로 변환하여 다운로드할 수 있습니다.<br/>
                    <strong className="font-bold">가볍고 스마트한 리포팅으로 업무 효율을 극대화하세요.</strong>
                  </p>
                </div>
              ) : winner.id === 3 ? (
                <div>
                  <div className="text-sm font-medium text-blue-600">AI 인사이트</div>
                  <h5 className="text-xl font-bold text-gray-800 mt-2 break-keep">
                    AI 인사이트로 캠페인/소재별 분석 끝
                  </h5>
                  <div className="my-4">
                    <LazyImage 
                      src="https://i.imgur.com/8q2NbSE.png" 
                      alt="아드리엘 AI Insight 기능 예시" 
                      className="w-full h-auto object-contain rounded-lg shadow-md" 
                    />
                  </div>
                  <p className="text-base text-gray-700 mt-4 break-keep">
                    어떤 소재가 반응이 좋았는지 확인하기 위해 데이터를 일일이 가공하시나요?<br/>
                    AI 인사이트 기능 한 번이면, 단 몇 분만에 소재에 대한 퍼포먼스 체크가 가능합니다.<br/>
                    <strong className="font-bold">고효율 소재를 디벨롭하면 끝! 더이상 소재 고민에 시달리지 마세요.</strong>
                  </p>
                </div>
              ) : winner.id === 4 ? (
                <div>
                  <div className="text-sm font-medium text-blue-600">아드리엘 시각화 대시보드 기능</div>
                  <h5 className="text-xl font-bold text-gray-800 mt-2 break-keep">
                    시각화 대시보드로 데이터와 인사이트를 한 눈에
                  </h5>
                  <div className="my-4">
                    <LazyVideo 
                      src={resultMediaSrc} 
                      className="w-full h-auto object-contain rounded-lg shadow-md" 
                    />
                  </div>
                  <p className="text-base text-gray-700 mt-4 break-keep">
                    우리 팀의 모든 데이터와 인사이트가 한 곳에 모아진 시각화 대시보드를 생성하세요<br/>
                    퍼포먼스 추적부터, 마케팅 전략 수립까지 한 페이지 내에서
                  </p>
                </div>
              ) : winner.id === 5 ? (
                <div>
                  <div className="text-sm font-medium text-blue-600">아드리엘 AI 에이전트</div>
                  <h5 className="text-xl font-bold text-gray-800 mt-2 break-keep">
                    마케팅 전략을 담당하는 단 하나의 AI
                  </h5>
                  <div className="my-4">
                    <LazyImage 
                      src="https://i.imgur.com/t56d9RL.png" 
                      alt="아드리엘 AI Agent 기능 예시" 
                      className="w-full h-auto object-contain rounded-lg shadow-md" 
                    />
                  </div>
                  <p className="text-base text-gray-700 mt-4 break-keep">
                    마케팅 전략, AI의 도움을 받고 싶으시다면?<br/>
                    아드리엘의 AI 에이전트는 연결된 모든 마케팅 데이터를 기반으로 인사이트를 도출합니다.<br/>
                    <strong className="font-bold">더이상 혼자서 고민하지마세요.</strong>
                  </p>
                </div>
              ) : winner.id === 6 ? (
                <div>
                  <div className="text-sm font-medium text-blue-600">아드리엘 AdLaunch</div>
                  <h5 className="text-xl font-bold text-gray-800 mt-2 break-keep">
                    광고 캠페인, 세팅부터 모니터링까지 원스탑
                  </h5>
                  <div className="my-4">
                    <LazyImage 
                      src="https://i.imgur.com/QLnZTUD.png" 
                      alt="아드리엘 애드런처 기능 예시" 
                      className="w-full h-auto object-contain rounded-lg shadow-md" 
                    />
                  </div>                
                  <p className="text-base text-gray-700 mt-4 break-keep">
                    시도때도 없는 광고 세팅 요청에 지치셨나요?<br/>
                    이제 광고 카피, 소재, 타겟팅까지 모두 한 곳에서 세팅하세요.<br/>
                    <strong className="font-bold">최종 라이브 될 때까지 필요한 리소스는 클릭 단 몇 번!</strong>
                  </p>
                </div>
              ) : winner.id === 7 ? (
                <div>
                  <div className="text-sm font-medium text-blue-600">아드리엘 데이터 통합 기능</div>
                  <h5 className="text-xl font-bold text-gray-800 mt-2 break-keep">
                    매출&매체 데이터 성과 실시간 통합
                  </h5>
                  <div className="my-4">
                    <LazyVideo 
                      src={resultMediaSrc} 
                      className="w-full h-auto object-contain rounded-lg shadow-md" 
                    />
                  </div>
                  <p className="text-base text-gray-700 mt-4 break-keep">
                    650개 이상의 매체 데이터를 통합 지원하는 아드리엘 마케팅 대시보드<br/>
                    연결 한 번으로 데이터 취합으로<br/>
                    <strong className="font-bold">불필요하게 낭비되던 시간을 절약하세요.</strong>
                  </p>
                </div>
              ) : winner.id === 8 ? (
                <div>
                  <div className="text-sm font-medium text-blue-600">아드리엘 대시보드 템플릿 기능</div>
                  <h5 className="text-xl font-bold text-gray-800 mt-2 break-keep">
                    다양한 목적별 맞춤 템플릿으로 마케팅 대시보드를 손쉽게 완성하세요
                  </h5>
                  <div className="my-4">
                    <LazyImage 
                      src="https://i.imgur.com/pyM8OuI.png" 
                      alt="아드리엘 대시보드 템플릿 예시" 
                      className="w-full h-auto object-contain rounded-lg shadow-md" 
                    />
                  </div>
                  <p className="text-base text-gray-700 mt-4 break-keep">
                    PPC, SEO, 소셜 미디어 분석 등 업무 별로 맞춤 제작된 30여개의 마케팅 대시보드 템플릿을 사용해보세요.<br/>
                    <strong className="font-bold">연동된 데이터가 있다면 몇 번의 클릭만으로 상황에 맞는 맞춤 대시보드를 구현할 수 있습니다.</strong>
                  </p>
                </div>
              ) : (
                <p className="text-blue-800 leading-relaxed break-keep">
                  <strong>Adriel 기능 추천:</strong> {winner.adrielSolution}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col items-center gap-4 w-full">
            <a 
              href="https://meetings.hubspot.com/kim-noah/2508mgs?utm_source=offline&utm_medium=event&utm_campaign=mgs2025&utm_content=marketingworldcup" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors w-full max-w-xs text-center"
            >
              Adriel 무료 체험하기 →
            </a>
            <a 
              href="https://www.adriel.com/ko?utm_source=offline&utm_medium=event&utm_campaign=mgs2025&utm_content=marketingworldcup" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-white hover:bg-gray-100 text-blue-600 border border-blue-600 px-8 py-3 rounded-lg font-semibold transition-colors w-full max-w-xs text-center"
            >
              대시보드 둘러보기
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
    </div>
  );
};

// 메인 앱 컴포넌트
const App = () => {
  const [gamePhase, setGamePhase] = useState('lead');
  const [finalWinner, setFinalWinner] = useState(null);

  // 화면이 바뀔 때마다 맨 위로 스크롤합니다.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [gamePhase]);

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
        @keyframes rocking-boat {
          0%, 100% {
            transform: rotate(-5deg);
          }
          50% {
            transform: rotate(5deg);
          }
        }
        .animate-rocking-boat {
          animation: rocking-boat 1.5s ease-in-out infinite;
        }
      `}</style>
      {gamePhase === 'lead' && <LeadFormScreen onLeadSubmit={handleStartGame} />}
      {gamePhase === 'playing' && <GameScreen tasks={INITIAL_TASKS} onSelect={handleGameFinish} />}
      {gamePhase === 'finished' && <FinishedScreen winner={finalWinner} onReset={handleReset} />}
    </>
  );
};

export default App;
