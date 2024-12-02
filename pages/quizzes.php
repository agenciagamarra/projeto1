<?php
$search = $_GET['search'] ?? '';
$quizzes = getQuizzes($search);
?>

<div>
    <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Quizzes Disponíveis</h1>
        <p class="mt-2 text-gray-600">Selecione um quiz para começar sua avaliação</p>
    </div>

    <div class="mb-6">
        <form method="GET" action="index.php">
            <input type="hidden" name="page" value="quizzes">
            <div class="max-w-xl flex">
                <div class="relative flex-1">
                    <input
                        type="search"
                        name="search"
                        placeholder="Buscar por título, matéria ou conteúdo das questões..."
                        value="<?php echo htmlspecialchars($search); ?>"
                        class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 pl-10"
                    >
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg class="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>
                <button type="submit" class="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                    Buscar
                </button>
            </div>
        </form>
    </div>

    <?php if (empty($quizzes)): ?>
        <div class="text-center py-12">
            <p class="text-gray-500">Nenhum quiz encontrado</p>
        </div>
    <?php else: ?>
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <?php foreach ($quizzes as $quiz): ?>
                <a href="index.php?page=quiz&id=<?php echo $quiz['id']; ?>" class="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div class="p-6">
                        <div class="flex items-center justify-between">
                            <div class="inline-flex items-center justify-center p-2 bg-indigo-100 rounded-md">
                                <svg class="h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                                <?php echo htmlspecialchars($quiz['subject']); ?>
                            </span>
                        </div>
                        
                        <h3 class="mt-4 text-lg font-medium text-gray-900">
                            <?php echo htmlspecialchars($quiz['title']); ?>
                        </h3>
                        
                        <div class="mt-4 flex items-center justify-between text-sm text-gray-500">
                            <div class="flex items-center">
                                <svg class="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <?php echo $quiz['time_limit']; ?> minutos
                            </div>
                            <div class="flex items-center">
                                <svg class="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                </svg>
                                <?php echo $quiz['question_count']; ?> questões
                            </div>
                        </div>
                    </div>
                </a>
            <?php endforeach; ?>
        </div>
    <?php endif; ?>
</div>