"use client";

import { useState, useEffect, useRef } from "react";

type Question = {
  id: number;
  sentence: string;
  meaning: string;
  answer: string;
  type?: "mc" | "short";
};

// 샘플 문제 데이터
const rawQuestions = [
  {
    "id": 1,
    "sentence": "Every work of art is a ___ work.",
    "meaning": "모든 예술 작품은 모방된 작품이다.",
    "answer": "derivative"
  },
  {
    "id": 2,
    "sentence": "Our high-road mind is ___; our low-road mind is intuitive.",
    "meaning": "우리의 높은 의식은 성찰적이며, 낮은 의식은 직관적이다.",
    "answer": "reflective"
  },
  {
    "id": 3,
    "sentence": "That notion is met with considerable ___ in creative spaces.",
    "meaning": "그러한 개념은 창조적 공간에서 상당한 저항에 부딪힌다.",
    "answer": "resistance"
  },
  {
    "id": 4,
    "sentence": "Most often, our recollection of an event differs ___ from the actual event.",
    "meaning": "대개, 사건에 대한 우리의 기억은 실제 사건과 상당히 다르다.",
    "answer": "substantially"
  },
  {
    "id": 5,
    "sentence": "Such questions can be called 'scientific' and their answers can be ___ by experiment or observation.",
    "meaning": "그러한 질문들은 '과학적'이라고 불릴 수 있으며, 그들의 답은 실험이나 관찰을 통해 검증될 수 있다.",
    "answer": "validated"
  },
  {
    "id": 6,
    "sentence": "The laws of aerodynamics work ___ of political or social prejudices.",
    "meaning": "공기 역학의 법칙은 정치적이거나 사회적 편견과 무관하게 작용한다.",
    "answer": "regardless"
  },
  {
    "id": 7,
    "sentence": "Actually, after moving right, you ___ the steering wheel equally to the left of center.",
    "meaning": "실제로 오른쪽으로 이동한 후, 당신은 중심에서 왼쪽으로 핸들을 동일하게 돌린다.",
    "answer": "reverse"
  },
  {
    "id": 8,
    "sentence": "Some methods also try to ___ the consumers' emotions.",
    "meaning": "일부 방법은 소비자의 감정을 탐지하려고 시도한다.",
    "answer": "detect"
  },
  {
    "id": 9,
    "sentence": "There is no more ___ practice than eating an apple a day.",
    "meaning": "하루에 사과를 먹는 것보다 더 미덕 있는 실천은 없다.",
    "answer": "virtuous"
  },
  {
    "id": 10,
    "sentence": "People are ___ with the cognitive dissonance aroused by stereotypes.",
    "meaning": "사람들은 고정 관념에 의해 불러일으켜진 인지 부조화에 직면한다.",
    "answer": "confronted"
  },
    {
    "id": 11,
    "sentence": "Waves of sound are ___ and can be graphed and measured.",
    "meaning": "소리의 파동은 물리적인 것이며, 그래프로 나타내거나 측정할 수 있다.",
    "answer": "physical"
  },
  {
    "id": 12,
    "sentence": "Whereas the brain is a ___ organ, the mind has no mass.",
    "meaning": "뇌는 물리적인 기관인 반면, 정신은 질량이 없다.",
    "answer": "material"
  },
  {
    "id": 13,
    "sentence": "Like a bridge, the beam must ___ the weight of anything on it.",
    "meaning": "다리처럼, 그 들보는 그 위에 있는 모든 것의 무게를 지탱해야 한다.",
    "answer": "support"
  },
  {
    "id": 14,
    "sentence": "In the right hemisphere, the interpreter is ___.",
    "meaning": "우뇌에서는, 해석하는 기능이 줄어든다.",
    "answer": "diminished"
  },
  {
    "id": 15,
    "sentence": "The soul is an ___ part of our existence.",
    "meaning": "영혼은 우리의 존재에 없어서는 안 될 부분이다.",
    "answer": "essential"
  },
  {
    "id": 16,
    "sentence": "They helped him ___ on his journey.",
    "meaning": "그들은 그의 여행을 가능하게 하는 데 도움을 주었다.",
    "answer": "proceed"
  },
  {
    "id": 17,
    "sentence": "Economists study how to ___ scarce resources.",
    "meaning": "경제학자들은 희소한 자원을 어떻게 분배할 것인가를 연구한다.",
    "answer": "allocate"
  },
  {
    "id": 18,
    "sentence": "If it is to ___ successfully, it must find something it can do better than its rivals.",
    "meaning": "성공적으로 살아남으려면, 그것은 경쟁자들보다 더 잘할 수 있는 무언가를 찾아야 한다.",
    "answer": "survive"
  },
  {
    "id": 19,
    "sentence": "It would be wrong to ___ that the organism was inactive.",
    "meaning": "그 유기체가 비활성 상태였다고 가정하는 것은 잘못된 일일 것이다.",
    "answer": "assume"
  },
  {
    "id": 20,
    "sentence": "Their ___ goals were compatible.",
    "meaning": "그들의 각자의 목표는 양립할 수 있었다.",
    "answer": "respective"
  },
    {
    "id": 21,
    "sentence": "The country has a ___ population growth rate.",
    "meaning": "그 나라는 안정적인 인구 성장률을 가지고 있다.",
    "answer": "stable"
  },
  {
    "id": 22,
    "sentence": "It is ___ that water boils at 100 degrees Celsius.",
    "meaning": "물이 섭씨 100도에서 끓는 것은 자명한 사실이다.",
    "answer": "obvious"
  },
  {
    "id": 23,
    "sentence": "The ___ of the story was unexpected.",
    "meaning": "그 이야기의 결말은 예상 밖이었다.",
    "answer": "ending"
  },
  {
    "id": 24,
    "sentence": "___ conditions can affect your ability to concentrate.",
    "meaning": "환경 조건은 집중력을 영향을 줄 수 있다.",
    "answer": "Environmental"
  },
  {
    "id": 25,
    "sentence": "The manager tried to ___ the team’s concerns.",
    "meaning": "관리자는 팀의 걱정을 해결하려 했다.",
    "answer": "address"
  },
  {
    "id": 26,
    "sentence": "The city needs to ___ more funds for education.",
    "meaning": "그 도시는 교육에 더 많은 자금을 배정해야 한다.",
    "answer": "allocate"
  },
  {
    "id": 27,
    "sentence": "He decided to ___ the offer due to personal reasons.",
    "meaning": "그는 개인적인 이유로 제안을 거절했다.",
    "answer": "decline"
  },
  {
    "id": 28,
    "sentence": "The scientist recorded the data with great ___.",
    "meaning": "과학자는 매우 신중하게 데이터를 기록했다.",
    "answer": "precision"
  },
  {
    "id": 29,
    "sentence": "Her explanation was ___ and easy to follow.",
    "meaning": "그녀의 설명은 명확하고 이해하기 쉬웠다.",
    "answer": "clear"
  },
  {
    "id": 30,
    "sentence": "The theory is based on several key scientific ___.",
    "meaning": "그 이론은 몇 가지 주요 과학적 원리에 기반한다.",
    "answer": "principles"
  },
  {
    "id": 31,
    "sentence": "We must ___ the situation carefully before taking action.",
    "meaning": "우리는 조치를 취하기 전에 상황을 신중히 평가해야 한다.",
    "answer": "evaluate"
  },
  {
    "id": 32,
    "sentence": "She has an ___ talent for painting.",
    "meaning": "그녀는 그림에 타고난 재능이 있다.",
    "answer": "innate"
  },
  {
    "id": 33,
    "sentence": "The company’s profits have increased ___ over the years.",
    "meaning": "그 회사의 수익은 수년에 걸쳐 점차 증가해 왔다.",
    "answer": "gradually"
  },
  {
    "id": 34,
    "sentence": "The new system will help ___ efficiency.",
    "meaning": "새로운 시스템은 효율성을 향상시키는 데 도움이 될 것이다.",
    "answer": "enhance"
  },
  {
    "id": 35,
    "sentence": "There is a strong ___ between diet and health.",
    "meaning": "식단과 건강 사이에는 강한 연관성이 있다.",
    "answer": "correlation"
  },
  {
    "id": 36,
    "sentence": "He tends to ___ in difficult situations.",
    "meaning": "그는 어려운 상황에서 위축되는 경향이 있다.",
    "answer": "hesitate"
  },
  {
    "id": 37,
    "sentence": "His argument is not ___ by any evidence.",
    "meaning": "그의 주장은 아무런 증거로 뒷받침되지 않는다.",
    "answer": "supported"
  },
  {
    "id": 38,
    "sentence": "The company will ___ a new marketing strategy.",
    "meaning": "그 회사는 새로운 마케팅 전략을 도입할 것이다.",
    "answer": "implement"
  },
  {
    "id": 39,
    "sentence": "The issue is highly ___ in political circles.",
    "meaning": "그 문제는 정치계에서 매우 논쟁의 여지가 있다.",
    "answer": "controversial"
  },
  {
    "id": 40,
    "sentence": "They found a ___ solution to the problem.",
    "meaning": "그들은 그 문제에 대해 창의적인 해결책을 찾았다.",
    "answer": "creative"
  },
  {
    "id": 41,
    "sentence": "She was ___ to speak in front of the large audience.",
    "meaning": "그녀는 많은 청중 앞에서 말하는 것이 꺼려졌다.",
    "answer": "reluctant"
  },
  {
    "id": 42,
    "sentence": "The plan is still in its ___ stages.",
    "meaning": "그 계획은 아직 초기 단계에 있다.",
    "answer": "initial"
  },
  {
    "id": 43,
    "sentence": "Please ___ your response within five days.",
    "meaning": "5일 이내로 회신해 주세요.",
    "answer": "submit"
  },
  {
    "id": 44,
    "sentence": "He is widely ___ as a leading expert in the field.",
    "meaning": "그는 그 분야의 선도적인 전문가로 널리 인정받고 있다.",
    "answer": "recognized"
  },
  {
    "id": 45,
    "sentence": "They made a ___ decision based on the facts.",
    "meaning": "그들은 사실에 근거하여 합리적인 결정을 내렸다.",
    "answer": "rational"
  },
  {
    "id": 46,
    "sentence": "The product is available in a ___ of colors.",
    "meaning": "그 제품은 다양한 색상으로 제공된다.",
    "answer": "variety"
  },
  {
    "id": 47,
    "sentence": "The policy will ___ changes in the education system.",
    "meaning": "그 정책은 교육 시스템에 변화를 유도할 것이다.",
    "answer": "trigger"
  },
  {
    "id": 48,
    "sentence": "He has a deep ___ of classical literature.",
    "meaning": "그는 고전 문학에 대한 깊은 이해를 가지고 있다.",
    "answer": "understanding"
  },
  {
    "id": 49,
    "sentence": "The artist’s work is highly ___.",
    "meaning": "그 예술가의 작품은 매우 상징적이다.",
    "answer": "symbolic"
  },
  {
    "id": 50,
    "sentence": "The success of the project is ___ on funding.",
    "meaning": "그 프로젝트의 성공은 자금에 달려 있다.",
    "answer": "dependent"
  },
  {
    "id": 51,
    "sentence": "We must consider the ___ of our actions.",
    "meaning": "우리는 우리의 행동의 결과를 고려해야 한다.",
    "answer": "consequences"
  },
  {
    "id": 52,
    "sentence": "She has a ___ interest in environmental issues.",
    "meaning": "그녀는 환경 문제에 강한 관심을 가지고 있다.",
    "answer": "genuine"
  },
  {
    "id": 53,
    "sentence": "The robot can ___ human emotions.",
    "meaning": "그 로봇은 인간의 감정을 모방할 수 있다.",
    "answer": "mimic"
  },
  {
    "id": 54,
    "sentence": "The discovery had a ___ impact on modern science.",
    "meaning": "그 발견은 현대 과학에 지대한 영향을 미쳤다.",
    "answer": "profound"
  },
  {
    "id": 55,
    "sentence": "The researchers ___ a link between diet and memory.",
    "meaning": "연구자들은 식단과 기억력 사이의 연관성을 발견했다.",
    "answer": "identified"
  },
  {
    "id": 56,
    "sentence": "He is ___ for his contributions to physics.",
    "meaning": "그는 물리학에 대한 공로로 유명하다.",
    "answer": "renowned"
  },
  {
    "id": 57,
    "sentence": "The model is based on ___ assumptions.",
    "meaning": "그 모델은 이론적인 가정을 기반으로 한다.",
    "answer": "theoretical"
  },
  {
    "id": 58,
    "sentence": "The author presents a ___ view of society.",
    "meaning": "그 작가는 사회에 대한 비판적인 시각을 제시한다.",
    "answer": "critical"
  },
  {
    "id": 59,
    "sentence": "There is a clear ___ between cause and effect.",
    "meaning": "원인과 결과 사이에는 명확한 연관이 있다.",
    "answer": "connection"
  },
  {
    "id": 60,
    "sentence": "The concept is difficult to ___.",
    "meaning": "그 개념은 이해하기 어렵다.",
    "answer": "grasp"
  }
];

// 객관식 옵션을 생성하는 함수
function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// 객관식 보기 생성 함수
function generateOptions(currentAnswer: string, allAnswers: string[], count = 4) {
  const options = [currentAnswer];
  const pool = allAnswers.filter((answer) => answer !== currentAnswer);
  while (options.length < count && pool.length > 0) {
    const randIdx = Math.floor(Math.random() * pool.length);
    options.push(pool[randIdx]);
    pool.splice(randIdx, 1);
  }
  return options.sort(() => Math.random() - 0.5);
}

export default function QuizPage() {
  // 시험문제 배열 상태 (시험 시작 전에는 빈 배열)
  const [testQuestions, setTestQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [questionMode, setQuestionMode] = useState<"mc" | "short" | null>(null);
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
  const [wrongAnswers, setWrongAnswers] = useState<{ question: Question; userAnswer: string }[]>([]);
  const [examFinished, setExamFinished] = useState(false);
  const shortInputRef = useRef<HTMLInputElement>(null);

  // 모든 정답 목록은 전체 rawQuestions에서 추출 (옵션 생성시 사용)
  const allAnswers = rawQuestions.map((q) => q.answer);
  const currentQuestion = testQuestions[currentIndex];

  // 테스트 시작 버튼을 누르면 rawQuestions에서 랜덤으로 25 객관식과 5 주관식을 선택
  const startTest = () => {
    if (rawQuestions.length < 30) {
      alert("문제 수가 부족합니다.");
      return;
    }
    const shuffled = shuffle(rawQuestions);
    const selectedMC = shuffled.slice(0, 25).map((q) => ({ ...q, type: "mc" as const }));
    const selectedShort = shuffled.slice(25, 30).map((q) => ({ ...q, type: "short" as const }));
    const selectedTestQuestions = shuffle([...selectedMC, ...selectedShort]);
    setTestQuestions(selectedTestQuestions);
    setCurrentIndex(0);
    setScore(0);
    setWrongAnswers([]);
    setExamFinished(false);
  };

  // 문제 전환 시—현재 문제에 따라 타이머 및 질문 형태 설정
  useEffect(() => {
    if (examFinished || testQuestions.length === 0) return;
    const current = testQuestions[currentIndex];
    setQuestionMode(current.type!);
    setTimeLeft(current.type === "mc" ? 7 : 15);
    if (current.type === "mc") {
      setShuffledOptions(generateOptions(current.answer, allAnswers));
    }
  }, [currentIndex, testQuestions, examFinished]);

  // 타이머 효과: 시간이 만료되면 빈 문자열로 제출하여 오답 처리
  useEffect(() => {
    if (examFinished || testQuestions.length === 0) return;
    if (timeLeft <= 0) {
      handleAnswer("");
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, examFinished, testQuestions]);

  // 정답 처리 함수
  const handleAnswer = (selectedAnswer: string) => {
    if (!currentQuestion) return;
    if (selectedAnswer.trim().toLowerCase() === currentQuestion.answer.trim().toLowerCase()) {
      setScore((prev) => prev + 1);
    } else {
      setWrongAnswers((prev) => [
        ...prev,
        { question: currentQuestion, userAnswer: selectedAnswer },
      ]);
    }
    handleNext();
  };

  // 주관식 답 제출 처리
  const handleShortAnswerSubmit = () => {
    if (shortInputRef.current) {
      handleAnswer(shortInputRef.current.value);
      shortInputRef.current.value = "";
    }
  };

  // 다음 문제로 진행하거나 시험 종료 처리
  const handleNext = () => {
    if (currentIndex < testQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setExamFinished(true);
    }
  };

  // 시험 시작 전 화면
  // 시험 시작 전 화면
if (testQuestions.length === 0) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-500 to-blue-500 flex flex-col items-center justify-center p-8">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">운정고3 영어 단어 수행 </h1>
        <p className="text-gray-600 mb-6">
          60개의 문제 중 랜덤으로 25개의 객관식과 5개의 주관식 문제가 출제됩니다. 태블릿, 노트북 사용을 권장하나 핸드폰으로도 이용가능합니다.
        </p>
        
        <button
          onClick={startTest}
          className="py-3 px-6 bg-gradient-to-r from-green-400 to-teal-500 hover:from-green-500 hover:to-teal-600 text-white font-bold rounded-full transition-all duration-300 shadow-lg"
        >
          테스트 시작하기
        </button>
        {/* 추가된 부분: 제작자 명시 */}
        <p className="mt-4 text-xs text-gray-400">made by taehyeon</p>
      </div>
    </div>
  );
}

  // 시험 종료 후 화면
  if (examFinished) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 flex flex-col items-center p-8">
      <div className="bg-white bg-opacity-90 shadow-2xl rounded-2xl p-8 max-w-2xl w-full">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">
          시험 종료!
        </h1>
        <div className="flex justify-around mb-6">
          <span className="text-2xl text-gray-700">
            총 문제: {testQuestions.length}
          </span>
          <span className="text-2xl text-gray-700">정답: {score}</span>
          <span className="text-2xl text-gray-700">
            오답: {wrongAnswers.length}
          </span>
        </div>
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">오답 리뷰</h2>
        {/* 오답 리뷰 영역에 스크롤이 가능하도록 수정 */}
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {wrongAnswers.length > 0 ? (
            wrongAnswers.map((item, index) => (
              <div
                key={index}
                className="border border-gray-200 p-4 rounded-lg mb-4 shadow-md bg-gray-50"
              >
                <p className="font-semibold text-gray-800">
                  {item.question.sentence}
                </p>
                <p className="text-sm text-gray-500 mb-1">
                  {item.question.meaning}
                </p>
                <p className="text-green-600 font-semibold">
                  정답: {item.question.answer}
                </p>
                <p className="text-red-600 font-semibold">
                  당신의 답: {item.userAnswer || "(미응답)"}
                </p>
              </div>
            ))
          ) : (
            <p className="text-xl text-center text-green-600">
              모든 문제를 맞추셨습니다!
            </p>
          )}
        </div>
        <button
          onClick={() => {
            // 상태 초기화 후 재시험
            setExamFinished(false);
            setTestQuestions([]);
            setCurrentIndex(0);
            setScore(0);
            setWrongAnswers([]);
          }}
          className="mt-6 py-3 px-8 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold rounded-full transition-all duration-300 shadow-lg"
        >
          다시 시작하기
        </button>
      </div>
    </div>
  );
}

  // 시험 진행 중 화면
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-500 to-blue-500 flex flex-col items-center p-8">
      <div className="w-full max-w-2xl bg-white bg-opacity-95 rounded-xl shadow-2xl p-8">
        <div className="flex justify-between items-center mb-6">
          <div className="text-lg font-semibold text-gray-700">
            남은 문제: {testQuestions.length - currentIndex}
          </div>
          <div className="text-lg font-semibold text-gray-700">
            타이머: {timeLeft}초
          </div>
        </div>
        <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
          <p className="text-2xl font-bold text-gray-800 mb-3">
            {currentQuestion.sentence}
          </p>
          <p className="text-base text-gray-500 mb-4 italic">
            {currentQuestion.meaning}
          </p>
          {/* 객관식 문제 */}
          {questionMode === "mc" && shuffledOptions.length > 0 && (
            <div className="grid grid-cols-2 gap-4">
              {shuffledOptions.map((option, index) => (
  <button
    key={index}
    onClick={() => handleAnswer(option)}
    className="py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-md whitespace-normal break-words"
  >
    {option}
  </button>
))}

            </div>
          )}
          {/* 주관식 문제 */}
          {questionMode === "short" && (
            <div className="flex flex-col">
              <input
                ref={shortInputRef}
                type="text"
                placeholder="정답을 입력하세요"
                className="border border-gray-300 p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleShortAnswerSubmit();
                }}
              />
              <button
                onClick={handleShortAnswerSubmit}
                className="py-3 px-6 bg-gradient-to-r from-green-400 to-teal-500 hover:from-green-500 hover:to-teal-600 text-white font-semibold rounded-xl transition-transform transform hover:scale-105 shadow-md"
              >
                제출
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
