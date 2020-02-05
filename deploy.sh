cd /var/www/rosebud-back
git pull
npm install --only=production
npm run sequelize db:migrate
pm2 start npm -- start
