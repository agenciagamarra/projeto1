<?php
if (!isAdmin()) {
    redirect('home');
}

$section = $_GET['section'] ?? 'dashboard';

// Estatísticas do Dashboard
$stats = [
    'total_users' => $pdo->query('SELECT COUNT(*) FROM users')->fetchColumn(),
    'total_quizzes' => $pdo->query('SELECT COUNT(*) FROM quizzes')->fetchColumn(),
    'avg_score' => $pdo->query('SELECT AVG(score) FROM quiz_attempts')->fetchColumn(),
    'attempts_today' => $pdo->query('SELECT COUNT(*) FROM quiz_attempts WHERE DATE(completed_at) = CURRENT_DATE')->fetchColumn()
];

// Atividade Recente
$recentActivity = $pdo->query('
    SELECT 
        qa.id,
        u.name as user_name,
        q.title as quiz_title,
        qa.score,
        qa.completed_at
    FROM quiz_attempts qa
    JOIN users u ON qa.user_id = u.id
    JOIN quizzes q ON qa.quiz_id = q.id
    ORDER BY qa.completed_at DESC
    LIMIT 5
')->fetchAll();

?>

<div class="flex">
    <!-- Sidebar -->
    <div class="w-64 bg-white shadow-sm">
        <nav class="space-y-1 px-2 py-4">
            <a 
                href="?page=admin&section=dashboard" 
                class="<?php echo $section === 'dashboard' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'; ?> group flex items-center px-2 py-2 text-sm font-medium rounded-md"
            >
                <svg class="mr-3 h-5 w-5 <?php echo $section === 'dashboard' ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500'; ?>" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Dashboard
            </a>
            
            <a 
                href="?page=admin&section=users" 
                class="<?php echo $section === 'users' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'; ?> group flex items-center px-2 py-2 text-sm font-medium rounded-md"
            >
                <svg class="mr-3 h-5 w-5 <?php echo $section === 'users' ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500'; ?>" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Usuários
            </a>
            
            <a 
                href="?page=admin&section=quizzes" 
                class="<?php echo $section === 'quizzes' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'; ?> group flex items-center px-2 py-2 text-sm font-medium rounded-md"
            >
                <svg class="mr-3 h-5 w-5 <?php echo $section === 'quizzes' ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500'; ?>" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Quizzes
            </a>
        </nav>
    </div>

    <!-- Content -->
    <div class="flex-1 min-w-0 bg-white">
        <div class="py-6 px-4 sm:px-6 lg:px-8">
            <?php if ($section === 'dashboard'): ?>
                <!-- Dashboard Stats -->
                <div class="mb-8">
                    <h2 class="text-2xl font-bold text-gray-900">Dashboard</h2>
                    <p class="mt-2 text-sm text-gray-700">Uma visão geral do sistema</p>
                </div>

                <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    <div class="bg-white overflow-hidden shadow rounded-lg">
                        <div class="p-5">
                            <div class="flex items-center">
                                <div class="flex-shrink-0">
                                    <svg class="h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                </div>
                                <div class="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt class="text-sm font-medium text-gray-500 truncate">Total de Usuários</dt>
                                        <dd class="flex items-baseline">
                                            <div class="text-2xl font-semibold text-gray-900"><?php echo $stats['total_users']; ?></div>
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white overflow-hidden shadow rounded-lg">
                        <div class="p-5">
                            <div class="flex items-center">
                                <div class="flex-shrink-0">
                                    <svg class="h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <div class="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt class="text-sm font-medium text-gray-500 truncate">Total de Quizzes</dt>
                                        <dd class="flex items-baseline">
                                            <div class="text-2xl font-semibold text-gray-900"><?php echo $stats['total_quizzes']; ?></div>
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white overflow-hidden shadow rounded-lg">
                        <div class="p-5">
                            <div class="flex items-center">
                                <div class="flex-shrink-0">
                                    <svg class="h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <div class="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt class="text-sm font-medium text-gray-500 truncate">Média de Pontuação</dt>
                                        <dd class="flex items-baseline">
                                            <div class="text-2xl font-semibold text-gray-900"><?php echo round($stats['avg_score']); ?>%</div>
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white overflow-hidden shadow rounded-lg">
                        <div class="p-5">
                            <div class="flex items-center">
                                <div class="flex-shrink-0">
                                    <svg class="h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div class="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt class="text-sm font-medium text-gray-500 truncate">Tentativas Hoje</dt>
                                        <dd class="flex items-baseline">
                                            <div class="text-2xl font-semibold text-gray-900"><?php echo $stats['attempts_today']; ?></div>
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Recent Activity -->
                <div class="mt-8">
                    <h3 class="text-lg font-medium text-gray-900">Atividade Recente</h3>
                    <div class="mt-4 bg-white shadow overflow-hidden sm:rounded-md">
                        <ul class="divide-y divide-gray-200">
                            <?php foreach ($recentActivity as $activity): ?>
                                <li>
                                    <div class="px-4 py-4 sm:px-6">
                                        <div class="flex items-center justify-between">
                                            <div class="flex items-center">
                                                <div class="flex-shrink-0">
                                                    <svg class="h-8 w-8 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                                    </svg>
                                                </div>
                                                <div class="ml-4">
                                                    <div class="text-sm font-medium text-gray-900">
                                                        <?php echo htmlspecialchars($activity['user_name']); ?>
                                                    </div>
                                                    <div class="text-sm text-gray-500">
                                                        Completou <?php echo htmlspecialchars($activity['quiz_title']); ?>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="flex items-center space-x-4">
                                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium <?php
                                                    echo $activity['score'] >= 80 ? 'bg-green-100 text-green-800' :
                                                        ($activity['score'] >= 60 ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-red-100 text-red-800');
                                                ?>">
                                                    <?php echo $activity['score']; ?>%
                                                </span>
                                                <div class="text-sm text-gray-500">
                                                    <?php echo date('d/m/Y H:i', strtotime($activity['completed_at'])); ?>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            <?php endforeach; ?>
                        </ul>
                    </div>
                </div>

            <?php elseif ($section === 'users'): ?>
                <?php include 'admin/users.php'; ?>
            <?php elseif ($section === 'quizzes'): ?>
                <?php include 'admin/quizzes.php'; ?>
            <?php endif; ?>
        </div>
    </div>
</div>