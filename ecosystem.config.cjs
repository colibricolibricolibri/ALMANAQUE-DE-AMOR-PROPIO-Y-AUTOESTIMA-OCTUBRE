/**
 * Configuración de PM2 para AWS EC2 (t2.micro / t3.micro en Capa Gratuita de AWS)
 * Uso: pm2 start ecosystem.config.cjs
 */
module.exports = {
  apps: [
    {
      name: 'almanaque-de-paz',
      script: 'index.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '450M',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }
  ]
};
