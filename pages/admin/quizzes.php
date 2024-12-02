<?php
// Buscar quizzes
$search = $_GET['search'] ?? '';
$query = "
    SELECT q.*, COUNT(qu.id) as question_count
    FROM quizzes q
    LEFT JOIN questions qu ON q.id = qu.quiz_id
    WHERE 1=1
";
if ($search) {
    $query .= " AND (q.title LIKE :search OR q.subject LIKE :search)";
}
$query .= " GROUP BY q.id ORDER BY q.created_at DESC";

$stmt = $pdo->prepare($query);
if ($search) {
    $searchTerm = "%$search%";
    $stmt->bindParam(':search', $searchTerm);
}
$stmt->execute();
$quizzes = $stmt->fetchAll();

// Processar ações
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';
    
    if ($action === 'delete' && !empty($_POST['quiz_id'])) {
        $stmt = $pdo->prepare("DELETE FROM quizzes WHERE id = ?");
        $stmt->execute([$_POST['quiz_id']]);
        redirect('admin', ['section' => 'quizzes']);
    }
}
?>

<div class="sm:flex sm:items-center sm:justify-between">
    <div>
        <h2 class="text-2xl font-bold text-gray-900">Quizzes</h2>
        <p class="mt-2 text-sm text-gray-700">Gerencie os quizzes do sistema</p>
    </div>
    <div class="mt-4 sm:mt-0 space-x-3">
        <button 
            onclick="document.getElementById('importQuizModal').classList.remove('hidden')"
            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
            <svg class="-ml-1 mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Importar Quiz
        </button>
        
        <button 
            onclick="document.getElementById('newQuizModal').classList.remove('hidden')"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
            <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Novo Quiz
        </button>
    </div>
</div>

<!-- Search -->
<div class="mt-6">
    <form method="GET" action="index.php">
        <input type="hidden" name="page" value="admin">
        <input type="hidden" name="section" value="quizzes">
        <div class="max-w-lg flex rounded-md shadow-sm">
            <input
                type="search"
                name="search"
                value="<?php echo htmlspecialchars($search); ?>"
                class="flex-1 block w-full rounded-none rounded-l-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Buscar por título ou matéria..."
            >
            <button
                type="submit"
                class="inline-flex items-center px-4 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-700 hover:bg-gray-100"
            >
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </button>
        </div>
    </form>
</div>

<!-- Quizzes Grid -->
<div class="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
    <?php foreach ($quizzes as $quiz): ?>
        <div class="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
            <div class="p-6">
                <div class="flex items-center justify-between">
                    <div class="bg-indigo-100 rounded-md p-3">
                        <svg class="h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <span class="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                        <?php echo htmlspecialchars($quiz['subject']); ?>
                    </span>
                </div>
                
                <h3 class="mt-4 text-lg font-medium text-gray-900">
                    <?php echo htmlspecialchars($quiz['title']); ?>
                </h3>
                
                <div class="mt-4 flex items-center justify-between text-sm text-gray-500">
                    <div class="flex items-center">
                        <svg class="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <?php echo $quiz['time_limit']; ?> minutos
                    </div>
                    <div class="flex items-center">
                        <svg class="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <?php echo $quiz['question_count']; ?> questões
                    </div>
                </div>
            </div>
            
            <div class="px-6 py-4 bg-gray-50">
                <div class="flex justify-end space-x-3">
                    <button
                        onclick="editQuiz(<?php echo htmlspecialchars(json_encode($quiz)); ?>)"
                        class="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-900"
                    >
                        <svg class="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Editar
                    </button>
                    <button
                        onclick="deleteQuiz(<?php echo $quiz['id']; ?>, '<?php echo htmlspecialchars($quiz['title']); ?>')"
                        class="inline-flex items-center text-sm font-medium text-red-600 hover:text-red-900"
                    >
                        <svg class="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Excluir
                    </button>
                </div>
            </div>
        </div>
    <?php endforeach; ?>
</div>

<!-- Import Quiz Modal -->
<div id="importQuizModal" class="hidden fixed inset-0 bg-gray-500 bg-opacity-75 overflow-y-auto">
    <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
            <form method="POST" enctype="multipart/form-data" class="space-y-6">
                <input type="hidden" name="action" value="import">
                
                <div>
                    <label for="title" class="block text-sm font-medium text-gray-700">Título do Quiz</label>
                    <input
                        type="text"
                        name="title"
                        id="title"
                        required
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                </div>

                <div>
                    <label for="subject" class="block text-sm font-medium text-gray-700">Matéria</label>
                    <input
                        type="text"
                        name="subject"
                        id="subject"
                        required
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                </div>

                <div>
                    <label for="time_limit" class="block text-sm font-medium text-gray-700">Tempo Limite (minutos)</label>
                    <input
                        type="number"
                        name="time_limit"
                        id="time_limit"
                        min="1"
                        max="180"
                        required
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700">Arquivo de Questões</label>
                    <div class="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
                        <div class="space-y-1 text-center">
                            <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                            <div class="flex text-sm text-gray-600">
                                <label for="file" class="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500">
                                    <span>Upload a file</span>
                                    <input id="file" name="file" type="file" class="sr-only" accept=".txt,.json">
                                </label>
                                <p class="pl-1">or drag and drop</p>
                            </div>
                            <p class="text-xs text-gray-500">TXT ou JSON até 10MB</p>
                        </div>
                    </div>
                </div>

                <div class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                    <button
                        type="submit"
                        class="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                    >
                        Importar
                    </button>
                    <button
                        type="button"
                        onclick="document.getElementById('importQuizModal').classList.add('hidden')"
                        class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>

<!-- Delete Quiz Modal -->
<div id="deleteQuizModal" class="hidden fixed inset-0 bg-gray-500 bg-opacity-75 overflow-y-auto">
    <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
            <form method="POST" class="space-y-6">
                <input type="hidden" name="action" value="delete">
                <input type="hidden" name="quiz_id" id="delete_quiz_id">
                
                <div class="sm:flex sm:items-start">
                    <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                        <svg class="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                        <h3 class="text-base font-semibold leading-6 text-gray-900">Excluir Quiz</h3>
                        <div class="mt-2">
                            <p class="text-sm text-gray-500">
                                Tem certeza que deseja excluir o quiz <span id="delete_quiz_title" class="font-medium"></span>? Esta ação não pode ser desfeita.
                            </p>
                        </div>
                    </div>
                </div>

                <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button
                        type="submit"
                        class="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                    >
                        Excluir
                    </button>
                    <button
                        type="button"
                        onclick="document.getElementById('deleteQuizModal').classList.add('hidden')"
                        class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>

<script>
function deleteQuiz(quizId, quizTitle) {
    document.getElementById('delete_quiz_id').value = quizId;
    document.getElementById('delete_quiz_title').textContent = quizTitle;
    document.getElementById('deleteQuizModal').classList.remove('hidden');
}

// File input preview
document.getElementById('file').addEventListener('change', function(e) {
    const fileName = e.target.files[0]?.name;
    if (fileName) {
        const fileText = document.querySelector('.text-xs.text-gray-500');
        fileText.textContent = `Arquivo selecionado: ${fileName}`;
    }
});
</script>