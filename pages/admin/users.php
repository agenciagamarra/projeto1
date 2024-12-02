<?php
// Buscar usuários
$search = $_GET['search'] ?? '';
$query = "SELECT * FROM users WHERE 1=1";
if ($search) {
    $query .= " AND (name LIKE :search OR email LIKE :search)";
}
$query .= " ORDER BY created_at DESC";

$stmt = $pdo->prepare($query);
if ($search) {
    $searchTerm = "%$search%";
    $stmt->bindParam(':search', $searchTerm);
}
$stmt->execute();
$users = $stmt->fetchAll();

// Processar ações
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';
    
    if ($action === 'delete' && !empty($_POST['user_id'])) {
        $stmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
        $stmt->execute([$_POST['user_id']]);
        redirect('admin', ['section' => 'users']);
    }
    
    if ($action === 'update' && !empty($_POST['user_id'])) {
        $stmt = $pdo->prepare("
            UPDATE users 
            SET name = ?, email = ?, role = ?
            WHERE id = ?
        ");
        $stmt->execute([
            $_POST['name'],
            $_POST['email'],
            $_POST['role'],
            $_POST['user_id']
        ]);
        redirect('admin', ['section' => 'users']);
    }
}
?>

<div class="sm:flex sm:items-center sm:justify-between">
    <div>
        <h2 class="text-2xl font-bold text-gray-900">Usuários</h2>
        <p class="mt-2 text-sm text-gray-700">Gerencie os usuários do sistema</p>
    </div>
    <div class="mt-4 sm:mt-0">
        <button 
            onclick="document.getElementById('newUserModal').classList.remove('hidden')"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
            <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Novo Usuário
        </button>
    </div>
</div>

<!-- Search -->
<div class="mt-6">
    <form method="GET" action="index.php">
        <input type="hidden" name="page" value="admin">
        <input type="hidden" name="section" value="users">
        <div class="max-w-lg flex rounded-md shadow-sm">
            <input
                type="search"
                name="search"
                value="<?php echo htmlspecialchars($search); ?>"
                class="flex-1 block w-full rounded-none rounded-l-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Buscar por nome ou email..."
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

<!-- Users Table -->
<div class="mt-8 flex flex-col">
    <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table class="min-w-full divide-y divide-gray-300">
                    <thead class="bg-gray-50">
                        <tr>
                            <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Nome</th>
                            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Email</th>
                            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Função</th>
                            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Criado em</th>
                            <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                <span class="sr-only">Ações</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200 bg-white">
                        <?php foreach ($users as $user): ?>
                            <tr>
                                <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                    <?php echo htmlspecialchars($user['name']); ?>
                                </td>
                                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    <?php echo htmlspecialchars($user['email']); ?>
                                </td>
                                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium <?php echo $user['role'] === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'; ?>">
                                        <?php echo $user['role']; ?>
                                    </span>
                                </td>
                                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    <?php echo date('d/m/Y H:i', strtotime($user['created_at'])); ?>
                                </td>
                                <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                    <button
                                        onclick="editUser(<?php echo htmlspecialchars(json_encode($user)); ?>)"
                                        class="text-indigo-600 hover:text-indigo-900 mr-4"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onclick="deleteUser(<?php echo $user['id']; ?>, '<?php echo htmlspecialchars($user['name']); ?>')"
                                        class="text-red-600 hover:text-red-900"
                                    >
                                        Excluir
                                    </button>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>

<!-- New User Modal -->
<div id="newUserModal" class="hidden fixed inset-0 bg-gray-500 bg-opacity-75 overflow-y-auto">
    <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
            <form method="POST" class="space-y-6">
                <input type="hidden" name="action" value="create">
                
                <div>
                    <label for="name" class="block text-sm font-medium text-gray-700">Nome</label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        required
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                </div>

                <div>
                    <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        required
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                </div>

                <div>
                    <label for="role" class="block text-sm font-medium text-gray-700">Função</label>
                    <select
                        name="role"
                        id="role"
                        required
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                        <option value="user">Usuário</option>
                        <option value="admin">Administrador</option>
                    </select>
                </div>

                <div class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                    <button
                        type="submit"
                        class="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                    >
                        Criar
                    </button>
                    <button
                        type="button"
                        onclick="document.getElementById('newUserModal').classList.add('hidden')"
                        class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>

<!-- Edit User Modal -->
<div id="editUserModal" class="hidden fixed inset-0 bg-gray-500 bg-opacity-75 overflow-y-auto">
    <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
            <form method="POST" class="space-y-6">
                <input type="hidden" name="action" value="update">
                <input type="hidden" name="user_id" id="edit_user_id">
                
                <div>
                    <label for="edit_name" class="block text-sm font-medium text-gray-700">Nome</label>
                    <input
                        type="text"
                        name="name"
                        id="edit_name"
                        required
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                </div>

                <div>
                    <label for="edit_email" class="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        name="email"
                        id="edit_email"
                        required
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                </div>

                <div>
                    <label for="edit_role" class="block text-sm font-medium text-gray-700">Função</label>
                    <select
                        name="role"
                        id="edit_role"
                        required
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                        <option value="user">Usuário</option>
                        <option value="admin">Administrador</option>
                    </select>
                </div>

                <div class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                    <button
                        type="submit"
                        class="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                    >
                        Salvar
                    </button>
                    <button
                        type="button"
                        onclick="document.getElementById('editUserModal').classList.add('hidden')"
                        class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>

<!-- Delete User Modal -->
<div id="deleteUserModal" class="hidden fixed inset-0 bg-gray-500 bg-opacity -75 overflow-y-auto">
    <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
            <form method="POST" class="space-y-6">
                <input type="hidden" name="action" value="delete">
                <input type="hidden" name="user_id" id="delete_user_id">
                
                <div class="sm:flex sm:items-start">
                    <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                        <svg class="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                        <h3 class="text-base font-semibold leading-6 text-gray-900">Excluir Usuário</h3>
                        <div class="mt-2">
                            <p class="text-sm text-gray-500">
                                Tem certeza que deseja excluir o usuário <span id="delete_user_name" class="font-medium"></span>? Esta ação não pode ser desfeita.
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
                        onclick="document.getElementById('deleteUserModal').classList.add('hidden')"
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
function editUser(user) {
    document.getElementById('edit_user_id').value = user.id;
    document.getElementById('edit_name').value = user.name;
    document.getElementById('edit_email').value = user.email;
    document.getElementById('edit_role').value = user.role;
    document.getElementById('editUserModal').classList.remove('hidden');
}

function deleteUser(userId, userName) {
    document.getElementById('delete_user_id').value = userId;
    document.getElementById('delete_user_name').textContent = userName;
    document.getElementById('deleteUserModal').classList.remove('hidden');
}
</script>