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

Run the program with 
```
node server
```
