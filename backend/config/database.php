<?php

require_once __DIR__ . '/environment.php';

/**
 * Database Configuration for PHP 8.4.11
 * Compatible with MySQL 8.4.11 / MariaDB 11.4.8
 * Now uses environment variables for production security
 */

class Database
{
    private $host;
    private $db_name;
    private $username;
    private $password;
    private $conn;

    public function __construct()
    {
        Environment::load();
        $this->host = Environment::get('DB_HOST', 'localhost');
        $this->db_name = Environment::get('DB_NAME', 'misedain_users');
        $this->username = Environment::get('DB_USERNAME', 'misedain_admin');
        $this->password = Environment::get('DB_PASSWORD', '5bCKGA0D2vVMxbKo');
    }

    /**
     * Get database connection
     * @return PDO
     */
    public function getConnection()
    {
        $this->conn = null;

        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->db_name . ";charset=utf8mb4",
                $this->username,
                $this->password
            );
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        } catch (PDOException $exception) {
            echo "Connection error: " . $exception->getMessage();
        }

        return $this->conn;
    }
}