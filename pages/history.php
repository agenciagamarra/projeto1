<?php
$attempts = getUserAttempts($_SESSION['user']['id']);

// Calcular estatísticas
$totalAttempts = count($attempts);
if ($totalAttempts > 0) {
    $averageScore = array_reduce($attempts, fn($acc, $attempt) => $acc + $attempt['score'], 0) / $totalAttempts;
    $bestScore = max(array_column($attempts, 'score'));
} else {
    $averageScore = 0;
    $bestScore = 0;
}

// Buscar detalhes de uma tentativa específica
$attemptId = $_GET['attempt'] ?? null;
$attemptDetails = $attemptId ? getAttemptDetails($attemptId) : null;

function formatTime($seconds) {
    $minutes = floor($seconds / 60);
    $remainingSeconds = $seconds % 60;
    return sprintf("%d:%02d", $minutes, $remainingSeconds);
}
?>

<div>
    <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Histórico de Tentativas</h1>
        <p class="mt-2 text-gray-600">Visualize seu histórico de quizzes e desempenho</p>
    </div>

    <div class="bg-white shadow overflow-hidden sm:rounded-md">
        <ul class="divide-y divide-gray-200">
            <?php foreach ($attempts as $attempt): ?>
                <li>
                    <button
                        onclick="window.location.href='index.php?page=history&attempt=<?php echo $attempt['id']; ?>'"
                        class="w-full text-left hover:bg-gray-50 transition-colors"
                    >
                        <div class="px-4 py-4 sm:px-6">
                            <div class="flex items-center justify-between">
                                <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                                    <p class="text-sm font-medium text-gray-900">
                                        <?php echo htmlspecialchars($attempt['quiz_title']); ?>
                                    </p>
                                    <div class="flex items-center gap-4 text-sm text-gray-500">
                                        <span class="flex items-center">
                                            <svg class="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <?php echo date('d/m/Y H:i', strtotime($attempt['completed_at'])); ?>
                                        </span>
                                        <span class="flex items-center">
                                            <svg class="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <?php echo formatTime($attempt['time_spent']); ?>
                                        </span>
                                    </div>
                                </div>
                                <div class="flex items-center gap-4">
                                    <span class="flex items-center">
                                        <svg class="h-4 w-4 mr-1 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                        </svg>
                                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium <?php
                                            echo $attempt['score'] >= 80 ? 'bg-green-100 text-green-800' :
                                                ($attempt['score'] >= 60 ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800');
                                        ?>">
                                            <?php echo $attempt['score']; ?>%
                                        </span>
                                    </span>
                                </div>
                            </div>

                            <div class="mt-4">
                                <div class="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        class="h-2 rounded-full <?php
                                            echo $attempt['score'] >= 80 ? 'bg-green-500' :
                                                ($attempt['score'] >= 60 ? 'bg-yellow-500' :
                                                'bg-red-500');
                                        ?>"
                                        style="width: <?php echo $attempt['score']; ?>%"
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </button>
                </li>
            <?php endforeach; ?>
        </ul>
    </div>

    <div class="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
        <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg font-medium text-gray-900">Resumo de Desempenho</h3>
            <dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div class="px-4 py-5 bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6">
                    <dt class="text-sm font-medium text-gray-500 truncate">Média de Pontuação</dt>
                    <dd class="mt-1 text-3xl font-semibold text-gray-900"><?php echo round($averageScore); ?>%</dd>
                </div>
                <div class="px-4 py-5 bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6">
                    <dt class="text-sm font-medium text-gray-500 truncate">Total de Quizzes</dt>
                    <dd class="mt-1 text-3xl font-semibold text-gray-900"><?php echo $totalAttempts; ?></dd>
                </div>
                <div class="px-4 py-5 bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6">
                    <dt class="text-sm font-medium text-gray-500 truncate">Melhor Pontuação</dt>
                    <dd class="mt-1 text-3xl font-semibold text-gray-900"><?php echo $bestScore; ?>%</dd>
                </div>
            </dl>
        </div>
    </div>

    <?php if ($attemptDetails): ?>
        <!-- Modal de detalhes da tentativa -->
        <div class="fixed inset-0 z-50 overflow-y-auto" x-data="{ show: true }" x-show="show">
            <div class="flex min-h-screen items-center justify-center p-4">
                <div class="fixed inset-0 bg-gray-500 bg-opacity-75" @click="window.location.href='index.php?page=history'"></div>

                <div class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl sm:p-6">
                    <div class="absolute right-0 top-0 pr-4 pt-4">
                        <button
                            type="button"
                            class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                            onclick="window.location.href='index.php?page=history'"
                        >
                            <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div class="space-y-6">
                        <div class="bg-gray-50  p-4 rounded-lg">
                            <h4 class="text-lg font-medium text-gray-900 mb-2">Resultado Final</h4>
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <p class="text-sm text-gray-500">Pontuação</p>
                                    <p class="text-2xl font-bold text-gray-900"><?php echo $attemptDetails['score']; ?>%</p>
                                </div>
                                <div>
                                    <p class="text-sm text-gray-500">Tempo Utilizado</p>
                                    <p class="text-2xl font-bold text-gray-900">
                                        <?php echo formatTime($attemptDetails['time_spent']); ?>
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div class="space-y-4">
                            <?php foreach ($attemptDetails['answers'] as $index => $answer): ?>
                                <div class="p-6 border rounded-lg <?php
                                    echo $answer['selected_option'] === $answer['correct_option']
                                        ? 'border-green-200 bg-green-50'
                                        : 'border-red-200 bg-red-50';
                                ?>">
                                    <div class="flex items-start justify-between mb-4">
                                        <h3 class="text-lg font-medium text-gray-900">
                                            <?php echo $index + 1; ?>. <?php echo htmlspecialchars($answer['question_text']); ?>
                                        </h3>
                                        <div class="ml-4">
                                            <?php if ($answer['selected_option'] === $answer['correct_option']): ?>
                                                <svg class="h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                                </svg>
                                            <?php else: ?>
                                                <svg class="h-6 w-6 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            <?php endif; ?>
                                        </div>
                                    </div>

                                    <div class="space-y-3">
                                        <?php foreach ($answer['options'] as $optionIndex => $option): ?>
                                            <div class="p-3 rounded-md <?php
                                                if ($optionIndex === $answer['correct_option']) {
                                                    echo 'bg-green-100 text-green-700';
                                                } elseif ($answer['selected_option'] === $optionIndex) {
                                                    echo 'bg-red-100 text-red-700';
                                                } else {
                                                    echo 'bg-white text-gray-500';
                                                }
                                            ?>">
                                                <div class="flex items-center">
                                                    <span class="mr-3"><?php echo chr(65 + $optionIndex); ?>.</span>
                                                    <?php echo htmlspecialchars($option); ?>
                                                    <?php if ($optionIndex === $answer['correct_option']): ?>
                                                        <svg class="ml-auto h-4 w-4 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    <?php elseif ($answer['selected_option'] === $optionIndex): ?>
                                                        <svg class="ml-auto h-4 w-4 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    <?php endif; ?>
                                                </div>
                                            </div>
                                        <?php endforeach; ?>
                                    </div>

                                    <?php if ($answer['selected_option'] !== $answer['correct_option']): ?>
                                        <div class="mt-4 flex items-start space-x-2 text-sm text-red-600">
                                            <svg class="h-5 w-5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                            </svg>
                                            <p>
                                                Resposta correta: <?php echo chr(65 + $answer['correct_option']); ?>.
                                                <?php echo htmlspecialchars($answer['options'][$answer['correct_option']]); ?>
                                            </p>
                                        </div>
                                    <?php endif; ?>
                                </div>
                            <?php endforeach; ?>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    <?php endif; ?>
</div>