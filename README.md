# Setup

## Create database

If you use docker first get into the container `docker exec -it rosebud_db bash`

```
mysql -u root -p
CREATE DATABASE rosebud;
CREATE USER <MY_USER> IDENTIFIED BY '<MY_PASSWORD>';
GRANT ALL PRIVILEGES ON rosebud.* TO <MY_USER>;
```

## Create tables
`mysql rosebud -u root -p < ./database/database.sql`

Or with Docker
```
docker cp ./database/database.sql <MY_CONTAINER>:/tmp/rosebud/database.sql
docker exec -it mysql bash -c 'mysql -u <MY_USER> -p <MY_DATABASE> < /tmp/rosebud/database.sql'
```

## Insert data
`mysql rosebud -u root -p < ./database/seeds.sql`

Or with Docker
```
docker cp ./database/seeds.sql <MY_CONTAINER>:/tmp/rosebud/seeds.sql
docker exec -it mysql bash -c 'mysql -u <MY_USER> -p <MY_DATABASE> < /tmp/rosebud/seeds.sql'
```