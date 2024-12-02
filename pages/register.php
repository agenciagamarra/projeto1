<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = $_POST['name'] ?? '';
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';
    $confirmPassword = $_POST['confirmPassword'] ?? '';
    
    try {
        if ($password !== $confirmPassword) {
            throw new Exception('As senhas não coincidem');
        }

        // Verificar se email já existe
        $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute([$email]);
        if ($stmt->fetch()) {
            throw new Exception('Email já cadastrado');
        }

        // Criar usuário
        $passwordHash = password_hash($password, PASSWORD_DEFAULT);
        $stmt = $pdo->prepare("
            INSERT INTO users (name, email, password_hash, role)
            VALUES (?, ?, ?, 'user')
        ");
        $stmt->execute([$name, $email, $passwordHash]);

        $_SESSION['user'] = [
            'id' => $pdo->lastInsertId(),
            'name' => $name,
            'email' => $email,
            'role' => 'user'
        ];

        redirect('home');
    } catch (Exception $e) {
        $error = $e->getMessage();
    }
}
?>

<div class="min-h-[80vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <div class="flex justify-center">
            <div class="rounded-full bg-indigo-100 p-3">
                <svg class="h-12 w-12 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
            </div>
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Crie sua conta
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
            Comece sua jornada de aprendizado hoje
        </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10 border border-gray-100">
            <form class="space-y-6" method="POST">
                <?php if (isset($error)): ?>
                    <div class="bg-red-50 border border-red-200 text-red-600 rounded-md p-3 text-sm">
                        <?php echo htmlspecialchars($error); ?>
                    </div>
                <?php endif; ?>

                <div>
                    <label for="name" class="block text-sm font-medium text-gray-700">Nome completo</label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        required
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                </div>

                <div>
                    <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        required
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                </div>

                <div>
                    <label for="password" class="block text-sm font-medium text-gray-700">Senha</label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        required
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                </div>

                <div>
                    <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Confirmar senha</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        id="confirmPassword"
                        required
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                </div>

                <button
                    type="submit"
                    class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Criar conta
                </button>

                <div class="mt-6">
                    <div class="relative">
                        <div class="absolute inset-0 flex items-center">
                            <div class="w-full border-t border-gray-300"></div>
                        </div>
                        <div class="relative flex justify-center text-sm">
                            <span class="px-2 bg-white text-gray-500">Já tem uma conta?</span>
                        </div>
                    </div>

                    <div class="mt-6">
                        <a
                            href="index.php?page=login"
                            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100"
                        >
                            Fazer login
                        </a>
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>