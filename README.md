If you want to create database with tables : 

//separer DB & tables
create:database = docker exec -it mysqldump "rosebud_db -u root -p > /database/database.sql

//separer data
create:seeds = docker exec -it mysqldump "rosebud_db -u root -p > /database/seeds.sql

//Stocker des images

- Créer un fichier public où je stock l'image.svg
- Récupérer les informations de l'image dans la table (name, ++)