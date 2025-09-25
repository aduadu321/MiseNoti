<?php

/**
 * Environment Variables Loader
 * Loads configuration from .env file for production security
 */

class Environment
{
    private static $variables = [];
    private static $loaded = false;

    /**
     * Load environment variables from .env file
     */
    public static function load($path = null)
    {
        if (self::$loaded) {
            return;
        }

        if ($path === null) {
            $path = dirname(__DIR__, 2) . '/.env';
        }

        if (!file_exists($path)) {
            // Fallback pentru development - folosește valori default
            self::$variables = [
                'DB_HOST' => 'localhost',
                'DB_NAME' => 'misedain_users',
                'DB_USERNAME' => 'misedain_admin',
                'DB_PASSWORD' => '5bCKGA0D2vVMxbKo',
                'JWT_SECRET' => 'your-super-secret-jwt-key-change-this-in-production-2025',
                'CORS_ORIGIN' => '*',
                'APP_ENV' => 'development',
                'APP_DEBUG' => 'true'
            ];
            self::$loaded = true;
            return;
        }

        $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        
        foreach ($lines as $line) {
            if (strpos(trim($line), '#') === 0) {
                continue; // Skip comments
            }

            list($name, $value) = explode('=', $line, 2);
            $name = trim($name);
            $value = trim($value);
            
            // Remove quotes if present
            if (preg_match('/^"(.*)"$/', $value, $matches)) {
                $value = $matches[1];
            } elseif (preg_match("/^'(.*)'$/", $value, $matches)) {
                $value = $matches[1];
            }
            
            self::$variables[$name] = $value;
        }

        self::$loaded = true;
    }

    /**
     * Get environment variable
     */
    public static function get($key, $default = null)
    {
        self::load();
        return self::$variables[$key] ?? $default;
    }

    /**
     * Check if running in production
     */
    public static function isProduction()
    {
        return self::get('APP_ENV') === 'production';
    }

    /**
     * Check if debug mode is enabled
     */
    public static function isDebug()
    {
        return self::get('APP_DEBUG') === 'true';
    }
}