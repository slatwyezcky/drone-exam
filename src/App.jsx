import { useState, useEffect } from "react";
import { generateQuestions } from "./data/questions";

const StartScreen = ({ onStart }) => (
	<div className="max-w-2xl mx-auto px-4 py-12 animate-fade">
		<div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 text-center">
			<div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-50 text-indigo-600">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth={1.5}
					stroke="currentColor"
					className="w-8 h-8"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-11.12c.07-.9-.73-1.6-1.6-1.45a9.48 9.48 0 0 0-7.58 4.01 9.02 9.02 0 0 0-3.96 0 9.48 9.48 0 0 0-7.58-4.01c-.87-.15-1.67.55-1.6 1.45A14.98 14.98 0 0 0 8.41 14.37m7.18 0a16.1 16.1 0 0 1-6.16 0"
					/>
				</svg>
			</div>
			<h1 className="text-3xl md:text-4xl font-bold text-slate-800 tracking-tight">
				Подготовка к экзамену
			</h1>
			<p className="text-slate-500 mt-3 text-lg">
				БПЛА · Аэронавигация · Метеорология · DJI
			</p>
			<div className="mt-6 bg-slate-50 rounded-xl p-5 text-left">
				<p className="text-slate-700 text-sm font-medium">
					✓ 49 вопросов с ответами
				</p>
				<p className="text-slate-700 text-sm mt-1">
					✓ Мгновенная обратная связь после проверки
				</p>
				<p className="text-slate-700 text-sm mt-1">
					✓ Детальный разбор ошибок в финале
				</p>
			</div>
			<button onClick={onStart} className="btn-primary mt-8">
				Начать тест →
			</button>
		</div>
	</div>
);

const QuizInterface = ({ questions, onFinish }) => {
	const [currentIdx, setCurrentIdx] = useState(0);
	const [selectedAnswer, setSelectedAnswer] = useState(null);
	const [isChecked, setIsChecked] = useState(false);
	const [userResponses, setUserResponses] = useState([]);

	const currentQ = questions[currentIdx];
	const total = questions.length;

	const handleSelect = (opt) => {
		if (isChecked) return;
		setSelectedAnswer(opt);
	};

	const handleCheck = () => {
		if (!selectedAnswer) {
			alert("Пожалуйста, выберите вариант ответа");
			return;
		}
		const isCorrect = selectedAnswer === currentQ.correctAnswer;
		setUserResponses((prev) => [
			...prev,
			{
				questionId: currentQ.id,
				questionText: currentQ.questionText,
				discipline: currentQ.discipline,
				selected: selectedAnswer,
				correct: currentQ.correctAnswer,
				isCorrect,
			},
		]);
		setIsChecked(true);
	};

	const handleNext = () => {
		if (currentIdx + 1 < total) {
			setCurrentIdx(currentIdx + 1);
			setSelectedAnswer(null);
			setIsChecked(false);
		} else {
			onFinish(userResponses);
		}
	};

	const getOptionStyle = (opt) => {
		if (!isChecked)
			return "border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/30";
		if (opt === currentQ.correctAnswer)
			return "border-green-400 bg-green-50 ring-1 ring-green-300";
		if (opt === selectedAnswer && opt !== currentQ.correctAnswer)
			return "border-red-400 bg-red-50 ring-1 ring-red-300";
		return "border-gray-200 opacity-80 bg-gray-50/50";
	};

	const progressPercent = (currentIdx / total) * 100;

	return (
		<div className="max-w-3xl mx-auto px-4 py-6 md:py-10 animate-fade">
			<div className="bg-white rounded-2xl shadow-xl overflow-hidden">
				<div className="p-5 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-white">
					<div className="flex justify-between items-center text-sm font-medium text-slate-500 mb-2">
						<span>
							Вопрос {currentIdx + 1} из {total}
						</span>
						<span className="bg-slate-100 px-3 py-1 rounded-full text-slate-700 text-xs">
							{currentQ.discipline}
						</span>
					</div>
					<div className="w-full bg-gray-200 rounded-full h-2">
						<div
							className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
							style={{ width: `${progressPercent}%` }}
						></div>
					</div>
				</div>
				<div className="p-6 md:p-8">
					<h2 className="text-xl md:text-2xl font-semibold text-slate-800 leading-tight">
						{currentQ.questionText}
					</h2>
					<div className="mt-8 space-y-3">
						{currentQ.options.map((opt, idx) => (
							<div
								key={idx}
								onClick={() => handleSelect(opt)}
								className={`option-card p-4 rounded-xl border-2 cursor-pointer transition-all ${getOptionStyle(opt)}`}
							>
								<div className="flex items-start">
									<div
										className={`w-5 h-5 mt-0.5 rounded-full border flex items-center justify-center mr-3 ${selectedAnswer === opt && !isChecked ? "border-indigo-600 bg-indigo-600" : "border-gray-300"}`}
									>
										{selectedAnswer === opt && !isChecked && (
											<div className="w-2 h-2 rounded-full bg-white"></div>
										)}
									</div>
									<span className="text-slate-700">{opt}</span>
									{isChecked && opt === currentQ.correctAnswer && (
										<svg
											className="w-5 h-5 text-green-600 ml-auto"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth="2"
												d="M5 13l4 4L19 7"
											></path>
										</svg>
									)}
									{isChecked &&
										opt === selectedAnswer &&
										opt !== currentQ.correctAnswer && (
											<svg
												className="w-5 h-5 text-red-500 ml-auto"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth="2"
													d="M6 18L18 6M6 6l12 12"
												></path>
											</svg>
										)}
								</div>
							</div>
						))}
					</div>
					<div className="mt-10 flex justify-end">
						{!isChecked ? (
							<button onClick={handleCheck} className="btn-primary">
								Проверить
							</button>
						) : (
							<button
								onClick={handleNext}
								className="bg-indigo-600 hover:bg-indigo-700 text-white px-7 py-2.5 rounded-xl font-medium transition"
							>
								{currentIdx + 1 === total ? "Завершить тест →" : "Далее →"}
							</button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

const ResultsScreen = ({ responses, totalQuestions, onRestart }) => {
	const correctCount = responses.filter((r) => r.isCorrect).length;
	const mistakes = responses.filter((r) => !r.isCorrect);

	return (
		<div className="max-w-4xl mx-auto px-4 py-8 animate-fade">
			<div className="bg-white rounded-2xl shadow-xl overflow-hidden">
				<div className="p-6 md:p-8 text-center border-b">
					<div className="inline-flex p-3 rounded-full bg-emerald-100 text-emerald-700 mb-4">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-8 w-8"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
					</div>
					<h2 className="text-3xl font-bold text-slate-800">
						Результаты теста
					</h2>
					<p className="text-5xl font-extrabold mt-4 text-indigo-700">
						{correctCount} / {totalQuestions}
					</p>
					<p className="text-slate-500 mt-2">правильных ответов</p>
					<button
						onClick={onRestart}
						className="mt-6 border border-indigo-300 text-indigo-700 hover:bg-indigo-50 px-6 py-2 rounded-xl font-medium transition"
					>
						Пройти тест заново
					</button>
				</div>
				{mistakes.length > 0 && (
					<div className="p-6 md:p-8 bg-slate-50">
						<h3 className="font-semibold text-lg text-slate-800 mb-4 flex items-center gap-2">
							📘 Разбор ошибок
						</h3>
						<div className="space-y-4">
							{mistakes.map((m, idx) => (
								<div
									key={idx}
									className="bg-white rounded-xl border-l-4 border-red-400 shadow-sm p-5"
								>
									<div className="text-xs text-slate-500 mb-1">
										{m.discipline}
									</div>
									<p className="font-medium text-slate-800">{m.questionText}</p>
									<div className="mt-3 pl-2 flex flex-col gap-2">
										<div className="flex items-start gap-2">
											<span className="text-red-600 font-medium text-sm">
												✗ Ваш ответ:
											</span>
											<span className="text-red-700 bg-red-50 px-2 py-0.5 rounded-md text-sm">
												{m.selected}
											</span>
										</div>
										<div className="flex items-start gap-2">
											<span className="text-green-600 font-medium text-sm">
												✓ Правильный:
											</span>
											<span className="text-green-800 bg-green-50 px-2 py-0.5 rounded-md text-sm">
												{m.correct}
											</span>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

function App() {
	const [questions, setQuestions] = useState([]);
	const [testState, setTestState] = useState("welcome"); // welcome, active, results
	const [finalResponses, setFinalResponses] = useState([]);

	useEffect(() => {
		const allQs = generateQuestions();
		// Перемешиваем порядок вопросов
		for (let i = allQs.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[allQs[i], allQs[j]] = [allQs[j], allQs[i]];
		}
		setQuestions(allQs);
	}, []);

	const handleStart = () => setTestState("active");
	const handleFinish = (responses) => {
		setFinalResponses(responses);
		setTestState("results");
	};
	const handleRestart = () => {
		const newQs = generateQuestions();
		for (let i = newQs.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[newQs[i], newQs[j]] = [newQs[j], newQs[i]];
		}
		setQuestions(newQs);
		setTestState("welcome");
	};

	if (testState === "welcome") return <StartScreen onStart={handleStart} />;
	if (testState === "active")
		return <QuizInterface questions={questions} onFinish={handleFinish} />;
	if (testState === "results")
		return (
			<ResultsScreen
				responses={finalResponses}
				totalQuestions={questions.length}
				onRestart={handleRestart}
			/>
		);
	return null;
}

export default App;
