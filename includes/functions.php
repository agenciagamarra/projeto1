<?php
function isAuthenticated() {
    return isset($_SESSION['user']);
}

function isAdmin() {
    return isAuthenticated() && $_SESSION['user']['role'] === 'admin';
}

function redirect($page, $params = []) {
    $url = "index.php?page=" . urlencode($page);
    if (!empty($params)) {
        foreach ($params as $key => $value) {
            $url .= "&" . urlencode($key) . "=" . urlencode($value);
        }
    }
    header("Location: $url");
    exit;
}

function getQuizzes($search = null) {
    global $pdo;
    
    $sql = "SELECT q.*, COUNT(qu.id) as question_count 
            FROM quizzes q 
            LEFT JOIN questions qu ON q.id = qu.quiz_id";
    
    if ($search) {
        $sql .= " LEFT JOIN question_options qo ON qu.id = qo.question_id
                  WHERE q.title LIKE :search 
                  OR q.subject LIKE :search 
                  OR qu.text LIKE :search 
                  OR qo.option_text LIKE :search";
    }
    
    $sql .= " GROUP BY q.id ORDER BY q.created_at DESC";
    
    $stmt = $pdo->prepare($sql);
    
    if ($search) {
        $search = "%$search%";
        $stmt->bindParam(':search', $search);
    }
    
    $stmt->execute();
    return $stmt->fetchAll();
}

function getQuizById($id) {
    global $pdo;
    
    // Buscar quiz
    $stmt = $pdo->prepare("SELECT * FROM quizzes WHERE id = ?");
    $stmt->execute([$id]);
    $quiz = $stmt->fetch();
    
    if (!$quiz) return null;
    
    // Buscar questões
    $stmt = $pdo->prepare("
        SELECT q.*, GROUP_CONCAT(qo.option_text ORDER BY qo.option_index) as options
        FROM questions q
        LEFT JOIN question_options qo ON q.id = qo.question_id
        WHERE q.quiz_id = ?
        GROUP BY q.id
        ORDER BY q.id
    ");
    $stmt->execute([$id]);
    
    $quiz['questions'] = array_map(function($q) {
        $q['options'] = explode(',', $q['options']);
        if ($q['image_url']) {
            $q['image'] = [
                'url' => $q['image_url'],
                'width' => $q['image_width'],
                'height' => $q['image_height']
            ];
        }
        return $q;
    }, $stmt->fetchAll());
    
    return $quiz;
}

function submitQuizAttempt($userId, $quizId, $answers, $score, $timeSpent) {
    global $pdo;
    
    try {
        $pdo->beginTransaction();
        
        // Inserir tentativa
        $stmt = $pdo->prepare("
            INSERT INTO quiz_attempts (user_id, quiz_id, score, time_spent)
            VALUES (?, ?, ?, ?)
        ");
        $stmt->execute([$userId, $quizId, $score, $timeSpent]);
        $attemptId = $pdo->lastInsertId();
        
        // Inserir respostas
        $stmt = $pdo->prepare("
            INSERT INTO attempt_answers (attempt_id, question_id, selected_option)
            VALUES (?, ?, ?)
        ");
        
        foreach ($answers as $index => $answer) {
            $stmt->execute([$attemptId, $index + 1, $answer]);
        }
        
        $pdo->commit();
        return $attemptId;
    } catch (Exception $e) {
        $pdo->rollBack();
        throw $e;
    }
}

function getUserAttempts($userId) {
    global $pdo;
    
    $stmt = $pdo->prepare("
        SELECT 
            qa.*,
            q.title as quiz_title,
            u.name as user_name
        FROM quiz_attempts qa
        JOIN quizzes q ON qa.quiz_id = q.id
        JOIN users u ON qa.user_id = u.id
        WHERE qa.user_id = ?
        ORDER BY qa.completed_at DESC
    ");
    
    $stmt->execute([$userId]);
    return $stmt->fetchAll();
}

function getAttemptDetails($id) {
    global $pdo;
    
    // Buscar tentativa
    $stmt = $pdo->prepare("
        SELECT 
            qa.*,
            q.title as quiz_title,
            u.name as user_name
        FROM quiz_attempts qa
        JOIN quizzes q ON qa.quiz_id = q.id
        JOIN users u ON qa.user_id = u.id
        WHERE qa.id = ?
    ");
    
    $stmt->execute([$id]);
    $attempt = $stmt->fetch();
    
    if (!$attempt) return null;
    
    // Buscar respostas
    $stmt = $pdo->prepare("
        SELECT 
            aa.question_id,
            aa.selected_option,
            q.text as question_text,
            q.correct_option,
            GROUP_CONCAT(qo.option_text ORDER BY qo.option_index) as options
        FROM attempt_answers aa
        JOIN questions q ON aa.question_id = q.id
        JOIN question_options qo ON q.id = qo.question_id
        WHERE aa.attempt_id = ?
        GROUP BY aa.question_id
        ORDER BY aa.question_id
    ");
    
    $stmt->execute([$id]);
    $attempt['answers'] = array_map(function($a) {
        $a['options'] = explode(',', $a['options']);
        return $a;
    }, $stmt->fetchAll());
    
    return $attempt;
}
?>