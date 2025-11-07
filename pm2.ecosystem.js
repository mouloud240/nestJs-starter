/**
 * PM2 Production Configuration
 *
 * This configuration manages the Core API process for the Portals application in production.
 * PM2 will handle process management, auto-restart, clustering, and monitoring.
 *
 * This is focused on the main API server, which serves both HTTP and WebSocket traffic.
 * The worker process for background jobs is managed separately, and it is keept as one process for now since bullmq manages traffic .
 *
 * This  runs on cluster mode for better performance and reliability.
 * This can be  ditched in favor of Docker/Kubernetes orchestration in more complex deployments, or auto scaling .
 * Process:
 * - portals-api: Main NestJS API server (HTTP + WebSocket)
 *
 * Production Features:
 * - Cluster mode with  INSTANCES_NUMBER instances (recommended: 4-6 for production depending on CPU cores)
 * - Graceful reload support for zero-downtime deployments
 * - Log rotation to prevent disk space issues
 * - Enhanced error handling and recovery
 * - Process monitoring and health checks
 */

module.exports = {
  apps: [
    {
      name: 'portals-api',
      script: './dist/main.js',
      instances: parseInt(process.env.INSTANCES_NUMBER||"1",10), 
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '2G',
      env: {
        NODE_ENV: 'production',
      },
      // Log files with rotation
      // error_file: './logs/api-error.log',
      // out_file: './logs/api-out.log',
      // log_date_format: 'YYYY-MM-DD HH:mm:ss Z',

      // Log rotation to prevent disk space issues
      // log_type: 'json',
      // max_size: '100M',
      // retain: 10, // Keep last 10 rotated logs
      // compress: true, // Compress rotated logs

      // Enhanced restart policies
      min_uptime: '30s', // Increased to ensure proper startup
      max_restarts: 15, // Increased for better resilience
      restart_delay: 5000, // Increased delay between restarts
      exp_backoff_restart_delay: 100, // Exponential backoff for consecutive crashes

      // Graceful shutdown/reload settings
      kill_timeout: 10000, // Increased to allow proper cleanup
      listen_timeout: 15000, // Increased for production startup time
      shutdown_with_message: true,
      wait_ready: true, // Wait for app to signal it's ready

      // Health monitoring
      instance_var: 'INSTANCE_ID',

      // Source map support for better error traces
      source_map_support: true,

      // Disable automatic restart during specific hours (optional)
      cron_restart: '0 3 * * *', // Daily restart at 3 AM for memory cleanup
    },
  ],
};
