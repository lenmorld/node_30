*`> mongo.exe`*

```
> show dbs
OAuthTest  0.000GB
admin      0.000GB
foodblog   0.000GB
local      0.000GB
mapmatch   0.000GB
>
> show dbs
OAuthTest  0.000GB
admin      0.000GB
auth_test  0.000GB
foodblog   0.000GB
local      0.000GB
mapmatch   0.000GB
> use auth_test
switched to db auth_test
> db.users.find()
{ "_id" : ObjectId("5c3a404d0b1097c724fd2fcd"), "email" : "lenny@user.com", "username" : "lenny", "password" : "1234", "passwordConf" : "1234", "__v" : 0 }
```