<?php
$quizId = $_GET['id'] ?? null;
if (!$quizId) {
    redirect('quizzes');
}

// Buscar quiz e questões
$stmt = $pdo->prepare("
    SELECT q.*, COUNT(qu.id) as question_count
    FROM quizzes q
    LEFT JOIN questions qu ON q.id = qu.quiz_id
    WHERE q.id = ?
    GROUP BY q.id
");
$stmt->execute([$quizId]);
$quiz = $stmt->fetch();

if (!$quiz) {
    redirect('quizzes');
}

// Buscar questões
$stmt = $pdo->prepare("
    SELECT q.*, GROUP_CONCAT(qo.option_text ORDER BY qo.option_index) as options
    FROM questions q
    LEFT JOIN question_options qo ON q.id = qo.question_id
    WHERE q.quiz_id = ?
    GROUP BY q.id
    ORDER BY q.id
");
$stmt->execute([$quizId]);
$questions = array_map(function($q) {
    return [
        ...q,
        'options' => explode(',', $q['options']),
        'image' => $q['image_url'] ? [
            'url' => $q['image_url'],
            'width' => $q['image_width'],
            'height' => $q['image_height']
        ] : null
    ];
}, $stmt->fetchAll());

// Processar envio do quiz
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $answers = json_decode($_POST['answers'] ?? '[]', true);
    $timeSpent = (int)$_POST['timeSpent'];
    
    // Calcular pontuação
    $correctAnswers = 0;
    foreach ($answers as $index => $answer) {
        if ($answer === $questions[$index]['correct_option']) {
            $correctAnswers++;
        }
    }
    $score = round(($correctAnswers / count($questions)) * 100);
    
    try {
        // Inserir tentativa
        $stmt = $pdo->prepare("
            INSERT INTO quiz_attempts (user_id, quiz_id, score, time_spent)
            VALUES (?, ?, ?, ?)
        ");
        $stmt->execute([$_SESSION['user']['id'], $quizId, $score, $timeSpent]);
        $attemptId = $pdo->lastInsertId();

        // Inserir respostas
        $stmt = $pdo->prepare("
            INSERT INTO attempt_answers (attempt_id, question_id, selected_option)
            VALUES (?, ?, ?)
        ");
        foreach ($answers as $index => $answer) {
            $stmt->execute([$attemptId, $questions[$index]['id'], $answer]);
        }

        redirect('history');
    } catch (Exception $e) {
        $error = 'Erro ao enviar respostas';
    }
}
?>

<div class="max-w-3xl mx-auto" x-data="quizAttempt()">
    <div class="bg-white shadow rounded-lg mb-8">
        <div class="px-4 py-5 sm:p-6">
            <div class="flex justify-between items-center mb-6">
                <div class="flex items-center space-x-4">
                    <div class="flex items-center space-x-2" :class="timeLeft <= 60 ? 'text-red-600 animate-pulse' : 'text-indigo-600'">
                        <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span class="text-lg font-medium" x-text="formatTime(timeLeft)"></span>
                    </div>
                </div>
                <template x-if="!isSubmitted">
                    <div class="flex items-center space-x-2 text-gray-500">
                        <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span x-text="unansweredQuestions + ' questões não respondidas'"></span>
                    </div>
                </template>
            </div>

            <!-- Campo de busca -->
            <div class="mb-6">
                <div class="relative">
                    <input
                        type="search"
                        x-model="searchTerm"
                        placeholder="Buscar questões..."
                        class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 pl-10"
                    >
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg class="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>
            </div>

            <form id="quizForm" method="POST" @submit.prevent="submitQuiz">
                <input type="hidden" name="answers" x-model="JSON.stringify(answers)">
                <input type="hidden" name="timeSpent" x-model="totalTime - timeLeft">

                <div class="space-y-8">
                    <?php foreach ($questions as $index => $question): ?>
                        <div 
                            class="p-6 border rounded-lg"
                            x-show="questionMatchesSearch(<?php echo htmlspecialchars(json_encode($question)); ?>)"
                            :class="{
                                'border-yellow-200': !isSubmitted && answers[<?php echo $index; ?>] === -1,
                                'border-gray-200': !isSubmitted && answers[<?php echo $index; ?>] !== -1,
                                'border-green-200 bg-green-50': isSubmitted && answers[<?php echo $index; ?>] === <?php echo $question['correct_option']; ?>,
                                'border-red-200 bg-red-50': isSubmitted && answers[<?php echo $index; ?>] !== <?php echo $question['correct_option']; ?>
                            }"
                        >
                            <div class="flex items-start justify-between mb-4">
                                <h3 class="text-lg font-medium text-gray-900">
                                    <?php echo $index + 1; ?>. <?php echo htmlspecialchars($question['text']); ?>
                                </h3>
                                <template x-if="isSubmitted">
                                    <div class="ml-4">
                                        <template x-if="answers[<?php echo $index; ?>] === <?php echo $question['correct_option']; ?>">
                                            <svg class="h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </template>
                                        <template x-if="answers[<?php echo $index; ?>] !== <?php echo $question['correct_option']; ?>">
                                            <svg class="h-6 w-6 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </template>
                                    </div>
                                </template>
                            </div>

                            <?php if ($question['image']): ?>
                                <div class="mb-4">
                                    <img
                                        src="<?php echo htmlspecialchars($question['image']['url']); ?>"
                                        alt="Questão"
                                        width="<?php echo $question['image']['width'] ?? 'auto'; ?>"
                                        height="<?php echo $question['image']['height'] ?? 'auto'; ?>"
                                        class="rounded-lg max-w-full h-auto"
                                    >
                                </div>
                            <?php endif; ?>

                            <div class="space-y-3">
                                <?php foreach ($question['options'] as $optionIndex => $option): ?>
                                    <button
                                        type="button"
                                        @click="!isSubmitted && selectAnswer(<?php echo $index; ?>, <?php echo $optionIndex; ?>)"
                                        :disabled="isSubmitted"
                                        class="w-full text-left px-4 py-3 border rounded-md focus:outline-none transition-colors"
                                        :class="getOptionClass(<?php echo $index; ?>, <?php echo $optionIndex; ?>, <?php echo $question['correct_option']; ?>)"
                                    >
                                        <div class="flex items-center">
                                            <span class="mr-3"><?php echo chr(65 + $optionIndex); ?>.</span>
                                            <?php echo htmlspecialchars($option); ?>
                                            <template x-if="isSubmitted && <?php echo $optionIndex; ?> === <?php echo $question['correct_option']; ?>">
                                                <svg class="ml-auto h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                                </svg>
                                            </template>
                                            <template x-if="isSubmitted && answers[<?php echo $index; ?>] === <?php echo $optionIndex; ?> && <?php echo $optionIndex; ?> !== <?php echo $question['correct_option']; ?>">
                                                <svg class="ml-auto h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </template>
                                        </div>
                                    </button>
                                <?php endforeach; ?>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>

                <template x-if="!isSubmitted">
                    <div class="mt-8 flex justify-end">
                        <button
                            type="button"
                            @click="showConfirmSubmit = true"
                            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                            :disabled="isSubmitting"
                        >
                            <template x-if="isSubmitting">
                                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            </template>
                            Finalizar Quiz
                        </button>
                    </div>
                </template>
            </form>
        </div>
    </div>

    <!-- Modal de confirmação -->
    <div
        x-show="showConfirmSubmit"
        class="fixed inset-0 z-50 overflow-y-auto"
        x-cloak
    >
        <div class="flex min-h-screen items-center justify-center p-4">
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75" @click="showConfirmSubmit = false"></div>

            <div class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div class="space-y-4">
                    <template x-if="unansweredQuestions > 0">
                        <div class="text-yellow-600 bg-yellow-50 p-4 rounded-md flex items-start space-x-2">
                            <svg class="h-5 w-5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <p x-text="'Atenção: Você ainda tem ' + unansweredQuestions + ' questões não respondidas. Questões não respondidas serão consideradas erradas.'"></p>
                        </div>
                    </template>
                    <template x-if="unansweredQuestions === 0">
                        <p class="text-gray-600">
                            Você tem certeza que deseja enviar o quiz? Ainda resta <span x-text="formatTime(timeLeft)"></span> de tempo.
                        </p>
                    </template>
                    
                    <div class="flex justify-end space-x-3">
                        <button
                            type="button"
                            @click="showConfirmSubmit = false"
                            class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                            Continuar Respondendo
                        </button>
                        <button
                            type="button"
                            @click="submitQuiz()"
                            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                            :disabled="isSubmitting"
                        >
                            <template x-if="isSubmitting">
                                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            </template>
                            Enviar Quiz
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal de aviso de tempo -->
    <div
        x-show="showTimeWarning"
        class="fixed inset-0 z-50 overflow-y-auto"
        x-cloak
    >
        <div class="flex min-h-screen items-center justify-center p-4">
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75" @click="showTimeWarning = false"></div>

            <div class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div class="space-y-4">
                    <div class="text-red-600 bg-red-50 p-4 rounded-md flex items-start space-x-2">
                        <svg class="h-5 w-5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <p>
                            Atenção: Resta menos de 1 minuto para o término do quiz!
                            O quiz será enviado automaticamente quando o tempo acabar.
                        </p>
                    </div>
                    
                    <div class="flex justify-end">
                        <button
                            type="button"
                            @click="showTimeWarning = false"
                            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                        >
                            Entendi
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>
<script>
function quizAttempt() {
    return {
        timeLeft: <?php echo $quiz['time_limit'] * 60; ?>,
        totalTime: <?php echo $quiz['time_limit'] * 60; ?>,
        answers: new Array(<?php echo count($questions); ?>).fill(-1),
        isSubmitting: false,
        isSubmitted: false,
        showConfirmSubmit: false,
        showTimeWarning: false,
        searchTerm: '',
        isPaused: false,

        init() {
            this.startTimer();
        },

        get unansweredQuestions() {
            return this.answers.filter(a => a === -1).length;
        },

        formatTime(seconds) {
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
        },

        startTimer() {
            const timer = setInterval(() => {
                if (this.isPaused) return;

                this.timeLeft--;

                if (this.timeLeft <= 60 && this.timeLeft > 0 && !this.showTimeWarning) {
                    this.showTimeWarning = true;
                }

                if (this.timeLeft <= 0) {
                    clearInterval(timer);
                    this.submitQuiz(true);
                }
            }, 1000);
        },

        selectAnswer(questionIndex, optionIndex) {
            this.answers[questionIndex] = optionIndex;
        },

        getOptionClass(questionIndex, optionIndex, correctOption) {
            if (!this.isSubmitted) {
                return this.answers[questionIndex] === optionIndex
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-300 hover:border-indigo-500';
            }

            if (optionIndex === correctOption) {
                return 'border-green-500 bg-green-50 text-green-700';
            }

            if (this.answers[questionIndex] === optionIndex) {
                return 'border-red-500 bg-red-50 text-red-700';
            }

            return 'border-gray-300 opacity-60';
        },

        questionMatchesSearch(question) {
            if (!this.searchTerm) return true;
            
            const search = this.searchTerm.toLowerCase();
            return question.text.toLowerCase().includes(search) ||
                   question.options.some(opt => opt.toLowerCase().includes(search));
        },

        async submitQuiz(isTimeUp = false) {
            if (this.isSubmitted) return;
            
            this.isSubmitting = true;
            this.isPaused = true;
            
            if (!isTimeUp) {
                this.showConfirmSubmit = false;
            }
            this.showTimeWarning = false;

            document.getElementById('quizForm').submit();
        }
    }
}
</script>