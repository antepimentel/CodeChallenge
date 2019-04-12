﻿# CodeChallenge

In the main directory run: 
```
npm install
```


A properties file is required to connect to a MySQL database. Create a new file called properties.ini with this format: 

```
[db]
name = <NAME OF YOUR DB>
user = <YOUR DB USERNAME>
pass = <YOU DB PASSWORD>
host = <YOUR DB HOST (localhost or IP of remote server)>
```

If you are running MySQL locally then set up the database using the script sql/db-create.sql

MySQL 5.7 should work as is, 8.0 might require some extra commands to ensure the program can connect:
```
mysql> ALTER USER 'YOUR-USER'@'localhost' IDENTIFIED WITH mysql_native_password BY 'YOUR-USER-PASSWORD';
mysql> FLUSH PRIVILEDGES;
```

Run the program with 
```
> node server
```
