git pull
npm install --only=production
npm run sequelize db:migrate
pm2 start npm start
