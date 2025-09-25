<?php
require_once __DIR__ . '/config/cors.php';
require_once __DIR__ . '/config/database.php';

/**
 * Authentication API endpoint
 * Handles login, register, forgot password, reset password
 * Compatible with PHP 8.4.11
 */

// JWT Secret Key - Change this in production!
define('JWT_SECRET', 'your-super-secret-jwt-key-change-this-in-production-2025');

$database = new Database();
$db = $database->getConnection();

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);
$action = $input['action'] ?? '';

switch ($action) {
    case 'login':
        login($db, $input);
        break;
    case 'register':
        register($db, $input);
        break;
    case 'forgot_password':
        forgotPassword($db, $input);
        break;
    case 'reset_password':
        resetPassword($db, $input);
        break;
    default:
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid action']);
        break;
}

function login($db, $data)
{
    try {
        $emailOrPhone = $data['emailOrPhone'] ?? '';
        $password = $data['password'] ?? '';

        if (empty($emailOrPhone) || empty($password)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Email/telefon și parolă sunt obligatorii']);
            return;
        }

        // Check if it's email or phone
        $query = "SELECT id, name, email, phone, password FROM users WHERE email = :emailOrPhone OR phone = :emailOrPhone LIMIT 1";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':emailOrPhone', $emailOrPhone);
        $stmt->execute();

        $user = $stmt->fetch();

        if ($user && password_verify($password, $user['password'])) {
            // Generate JWT token
            $token = generateJWT([
                'user_id' => $user['id'],
                'email' => $user['email'],
                'exp' => time() + (24 * 60 * 60) // 24 hours
            ]);

            // Remove password from response
            unset($user['password']);

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'message' => 'Autentificare reușită',
                'token' => $token,
                'user' => $user
            ]);
        } else {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Date de autentificare invalide']);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Eroare server: ' . $e->getMessage()]);
    }
}

function register($db, $data)
{
    try {
        $step = $data['step'] ?? '1';

        if ($step === '1') {
            // Step 1: Send verification code
            return sendVerificationCode($db, $data);
        } else {
            // Step 2: Verify code and create account
            return verifyAndCreateAccount($db, $data);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Eroare server: ' . $e->getMessage()]);
    }
}

function sendVerificationCode($db, $data)
{
    $nume = trim($data['nume'] ?? '');
    $prenume = trim($data['prenume'] ?? '');
    $contactType = $data['contactType'] ?? 'email';
    $email = trim($data['email'] ?? '');
    $phone = trim($data['phone'] ?? '');
    $password = $data['password'] ?? '';
    $confirmPassword = $data['confirmPassword'] ?? '';

    // Basic validation
    if (empty($nume) || empty($prenume) || empty($password)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Nume, prenume și parola sunt obligatorii']);
        return;
    }

    if ($password !== $confirmPassword) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Parolele nu coincid']);
        return;
    }

    if (strlen($password) < 6) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Parola trebuie să aibă minimum 6 caractere']);
        return;
    }

    // Validate contact based on type
    if ($contactType === 'email') {
        if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Email invalid']);
            return;
        }
        $contactValue = $email;
        $contactField = 'email';
    } else {
        if (empty($phone)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Număr de telefon invalid']);
            return;
        }
        $contactValue = $phone;
        $contactField = 'phone';
    }

    // Check if contact already exists
    $checkQuery = "SELECT id FROM users WHERE $contactField = :contact LIMIT 1";
    $checkStmt = $db->prepare($checkQuery);
    $checkStmt->bindParam(':contact', $contactValue);
    $checkStmt->execute();

    if ($checkStmt->fetch()) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Acest ' . ($contactType === 'email' ? 'email' : 'număr de telefon') . ' este deja înregistrat']);
        return;
    }

    // Generate verification code (for testing, always 000000)
    $verificationCode = '000000';

    // Store verification data in session or database (for now, we'll use a simple approach)
    // In production, store in database with expiry

    // For testing, we'll just return success
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Cod de verificare trimis cu succes',
        'contactType' => $contactType,
        'contact' => $contactValue
    ]);
}

function verifyAndCreateAccount($db, $data)
{
    $verificationCode = $data['verificationCode'] ?? '';
    $nume = trim($data['nume'] ?? '');
    $prenume = trim($data['prenume'] ?? '');
    $contactType = $data['contactType'] ?? 'email';
    $email = trim($data['email'] ?? '');
    $phone = trim($data['phone'] ?? '');
    $password = $data['password'] ?? '';

    // Verify code (for testing, accept 000000)
    if ($verificationCode !== '000000') {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Cod de verificare incorect']);
        return;
    }

    // Final validation
    if (empty($nume) || empty($prenume) || empty($password)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Date incomplete']);
        return;
    }

    $contactValue = ($contactType === 'email') ? $email : $phone;

    // Hash password
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    // Create full name
    $fullName = $nume . ' ' . $prenume;

    // Insert new user
    $insertEmail = ($contactType === 'email') ? $email : null;
    $insertPhone = ($contactType === 'phone') ? $phone : null;

    $query = "INSERT INTO users (name, email, phone, password, created_at) VALUES (:name, :email, :phone, :password, :created_at)";
    $stmt = $db->prepare($query);

    $stmt->bindParam(':name', $fullName);
    $stmt->bindParam(':email', $insertEmail);
    $stmt->bindParam(':phone', $insertPhone);
    $stmt->bindParam(':password', $hashedPassword);
    $stmt->bindParam(':created_at', date('Y-m-d H:i:s'));

    if ($stmt->execute()) {
        $userId = $db->lastInsertId();

        http_response_code(201);
        echo json_encode([
            'success' => true,
            'message' => 'Cont creat cu succes!',
            'user_id' => $userId,
            'user' => [
                'id' => $userId,
                'name' => $fullName,
                'email' => $insertEmail,
                'phone' => $insertPhone
            ]
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Eroare la crearea contului']);
    }
}

function forgotPassword($db, $data)
{
    try {
        $emailOrPhone = $data['emailOrPhone'] ?? '';

        if (empty($emailOrPhone)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Email sau telefon obligatoriu']);
            return;
        }

        // Check if user exists
        $query = "SELECT id, name, email FROM users WHERE email = :emailOrPhone OR phone = :emailOrPhone LIMIT 1";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':emailOrPhone', $emailOrPhone);
        $stmt->execute();

        $user = $stmt->fetch();

        if (!$user) {
            // Don't reveal if user exists or not for security
            http_response_code(200);
            echo json_encode(['success' => true, 'message' => 'Dacă există un cont cu aceste date, veți primi instrucțiuni']);
            return;
        }

        // Generate reset token
        $resetToken = bin2hex(random_bytes(32));
        $expiresAt = date('Y-m-d H:i:s', time() + 3600); // 1 hour

        // Store reset token
        $tokenQuery = "INSERT INTO password_resets (user_id, token, expires_at, created_at) VALUES (:user_id, :token, :expires_at, :created_at)
                       ON DUPLICATE KEY UPDATE token = :token, expires_at = :expires_at, created_at = :created_at";
        $tokenStmt = $db->prepare($tokenQuery);

        $tokenStmt->bindParam(':user_id', $user['id']);
        $tokenStmt->bindParam(':token', $resetToken);
        $tokenStmt->bindParam(':expires_at', $expiresAt);
        $tokenStmt->bindParam(':created_at', date('Y-m-d H:i:s'));

        $tokenStmt->execute();

        // In a real application, you would send an email here
        // For now, we'll just return success
        // TODO: Implement email sending

        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Instrucțiunile au fost trimise pe email',
            // Remove this in production!
            'debug_token' => $resetToken
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Eroare server: ' . $e->getMessage()]);
    }
}

function resetPassword($db, $data)
{
    try {
        $token = $data['token'] ?? '';
        $newPassword = $data['newPassword'] ?? '';
        $confirmPassword = $data['confirmPassword'] ?? '';

        if (empty($token) || empty($newPassword) || empty($confirmPassword)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Toate câmpurile sunt obligatorii']);
            return;
        }

        if ($newPassword !== $confirmPassword) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Parolele nu coincid']);
            return;
        }

        if (strlen($newPassword) < 6) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Parola trebuie să aibă minimum 6 caractere']);
            return;
        }

        // Verify token
        $query = "SELECT pr.user_id FROM password_resets pr 
                  WHERE pr.token = :token AND pr.expires_at > NOW() 
                  ORDER BY pr.created_at DESC LIMIT 1";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':token', $token);
        $stmt->execute();

        $reset = $stmt->fetch();

        if (!$reset) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Token invalid sau expirat']);
            return;
        }

        // Update password
        $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
        $updateQuery = "UPDATE users SET password = :password WHERE id = :user_id";
        $updateStmt = $db->prepare($updateQuery);

        $updateStmt->bindParam(':password', $hashedPassword);
        $updateStmt->bindParam(':user_id', $reset['user_id']);

        if ($updateStmt->execute()) {
            // Delete used token
            $deleteQuery = "DELETE FROM password_resets WHERE user_id = :user_id";
            $deleteStmt = $db->prepare($deleteQuery);
            $deleteStmt->bindParam(':user_id', $reset['user_id']);
            $deleteStmt->execute();

            http_response_code(200);
            echo json_encode(['success' => true, 'message' => 'Parola a fost resetată cu succes']);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Eroare la actualizarea parolei']);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Eroare server: ' . $e->getMessage()]);
    }
}

function generateJWT($payload)
{
    $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
    $payload = json_encode($payload);

    $headerEncoded = base64url_encode($header);
    $payloadEncoded = base64url_encode($payload);

    $signature = hash_hmac('sha256', $headerEncoded . "." . $payloadEncoded, JWT_SECRET, true);
    $signatureEncoded = base64url_encode($signature);

    return $headerEncoded . "." . $payloadEncoded . "." . $signatureEncoded;
}

function base64url_encode($data)
{
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function verifyJWT($token)
{
    $parts = explode('.', $token);
    if (count($parts) !== 3) {
        return false;
    }

    $header = $parts[0];
    $payload = $parts[1];
    $signature = $parts[2];

    $expectedSignature = base64url_encode(hash_hmac('sha256', $header . "." . $payload, JWT_SECRET, true));

    if (!hash_equals($signature, $expectedSignature)) {
        return false;
    }

    $payloadData = json_decode(base64_decode(strtr($payload, '-_', '+/')), true);

    if ($payloadData['exp'] < time()) {
        return false; // Token expired
    }

    return $payloadData;
}