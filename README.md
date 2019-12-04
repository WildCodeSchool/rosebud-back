# Setup

If you use docker, you should first get into the container using `docker exec -it bash` :

## Create database
```
mysql -u root -p
CREATE DATABASE rosebud;
```

## Create tables
`mysql rosebud -u root -p < /database/database.sql`

## Insert data
`mysql rosebud -u root -p < /database/seeds.sql`
