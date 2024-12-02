<?php
session_start();
require_once 'config/database.php';
require_once 'includes/functions.php';

$page = $_GET['page'] ?? 'home';
$action = $_GET['action'] ?? 'index';

// Rotas protegidas
$protected_routes = ['profile', 'quizzes', 'quiz', 'history', 'admin'];

// Verificar autenticação para rotas protegidas
if (in_array($page, $protected_routes) && !isAuthenticated()) {
    header('Location: index.php?page=login');
    exit;
}

// Header
include 'includes/header.php';

// Carregar página
$file = "pages/{$page}.php";
if (file_exists($file)) {
    include $file;
} else {
    include 'pages/404.php';
}

// Footer
include 'includes/footer.php';
?>