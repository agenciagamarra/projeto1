<?php if (!isAuthenticated()): ?>
<div class="py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
            <h1 class="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
                Bem-vindo ao Sistema de Quiz
            </h1>
            <p class="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                Teste seus conhecimentos com nosso sistema abrangente de quiz. Acompanhe seu progresso e melhore suas habilidades.
            </p>
            <div class="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
                <a href="index.php?page=register" class="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                    Começar Agora
                </a>
            </div>
        </div>

        <div class="mt-20">
            <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                <div class="pt-6">
                    <div class="flow-root bg-white rounded-lg px-6 pb-8">
                        <div class="-mt-6">
                            <div class="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                                <svg class="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <h3 class="mt-8 text-lg font-medium text-gray-900 tracking-tight">Múltiplas Matérias</h3>
                            <p class="mt-5 text-base text-gray-500">
                                Acesse quizzes de várias matérias e níveis de dificuldade.
                            </p>
                        </div>
                    </div>
                </div>

                <div class="pt-6">
                    <div class="flow-root bg-white rounded-lg px-6 pb-8">
                        <div class="-mt-6">
                            <div class="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                                <svg class="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                            <h3 class="mt-8 text-lg font-medium text-gray-900 tracking-tight">Perfis de Usuário</h3>
                            <p class="mt-5 text-base text-gray-500">
                                Acompanhe seu progresso e gerencie sua jornada de aprendizado.
                            </p>
                        </div>
                    </div>
                </div>

                <div class="pt-6">
                    <div class="flow-root bg-white rounded-lg px-6 pb-8">
                        <div class="-mt-6">
                            <div class="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                                <svg class="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <h3 class="mt-8 text-lg font-medium text-gray-900 tracking-tight">Análise de Desempenho</h3>
                            <p class="mt-5 text-base text-gray-500">
                                Visualize estatísticas detalhadas e melhore seu desempenho.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<?php else: ?>
<div class="py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
            <h1 class="text-3xl font-bold text-gray-900">
                Olá, <?php echo htmlspecialchars($_SESSION['user']['name']); ?>!
            </h1>
            <p class="mt-3 text-gray-500">
                Continue sua jornada de aprendizado.
            </p>
        </div>

        <div class="mt-10">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Quizzes Recentes</h2>
            <?php
            $quizzes = getQuizzes();
            if (empty($quizzes)): ?>
                <p class="text-center text-gray-500">Nenhum quiz disponível no momento.</p>
            <?php else: ?>
                <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <?php foreach (array_slice($quizzes, 0, 3) as $quiz): ?>
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

                <div class="mt-8 text-center">
                    <a href="index.php?page=quizzes" class="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                        Ver Todos os Quizzes
                    </a>
                </div>
            <?php endif; ?>
        </div>
    </div>
</div>
<?php endif; ?>