git pull
npm install --only=production
npm run sequelize db:migrate
sequelize db:seed --seed 20200203085907-isPrivate.js
pm2 start npm -- start
