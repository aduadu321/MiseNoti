<?php

/**
 * Database Configuration for PHP 8.4.11
 * Compatible with MySQL 8.4.11 / MariaDB 11.4.8
 */

class Database
{
    private $host = 'localhost';
    private $db_name = 'misedain_users';
    private $username = 'misedain_admin';
    private $password = '5bCKGA0D2vVMxbKo';
    private $conn;

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