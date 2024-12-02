<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sistema de Quiz</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="min-h-screen bg-gray-50">
    <nav class="bg-white border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16">
                <div class="flex">
                    <a href="index.php" class="flex items-center px-4 text-gray-900">Home</a>
                    <?php if (isAuthenticated()): ?>
                        <a href="index.php?page=quizzes" class="flex items-center px-4 text-gray-600 hover:text-gray-900">Quizzes</a>
                        <a href="index.php?page=history" class="flex items-center px-4 text-gray-600 hover:text-gray-900">Histórico</a>
                        <?php if (isAdmin()): ?>
                            <a href="index.php?page=admin" class="flex items-center px-4 text-gray-600 hover:text-gray-900">Admin</a>
                        <?php endif; ?>
                    <?php endif; ?>
                </div>
                
                <div class="flex items-center">
                    <?php if (isAuthenticated()): ?>
                        <a href="index.php?page=profile" class="px-4 text-gray-600 hover:text-gray-900">
                            <?php echo htmlspecialchars($_SESSION['user']['name']); ?>
                        </a>
                        <a href="index.php?page=logout" class="px-4 text-gray-600 hover:text-gray-900">Sair</a>
                    <?php else: ?>
                        <a href="index.php?page=login" class="px-4 text-gray-600 hover:text-gray-900">Login</a>
                        <a href="index.php?page=register" class="px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Registrar</a>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </nav>
    
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">