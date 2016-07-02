# c2b-session
A minimalist session-manager for NodeJS

---

### Setup
```javascript
var sessionManager = require('c2b-session');

//Optionally set a timeout (min) for sessions
sessionManager.setTimeout(1);
```

### Create a session
```javascript
sessionManager.create({
    ident: "my-session-name"

}, function(err, session){
    if(err){ return console.log(err); };

    console.log("[SESSION] Successfully created!");
    console.log(session);
});

//You may also pass some default data to your session

sessionManager.create({
    ident: "my-session-name",
    data: {
        A: "Data 1",
        B: "Data 2",
        C: "Data 3"
    }

}, function(err, session){
    if(err){ return console.log(err); };

    console.log("[SESSION] Successfully created!");
    console.log(session);
});
```

### Retrieve a session
```javascript
sessionManager.retrive("my-session-name", function(err, session){
    if(err){ return console.log(err); };

    console.log("[SESSION] Successfully retriven!");
    console.log(session);
});
```

### Test whether session exist
```javascript
if(sessionManager.exists("my-session-name")){
    console.log("[SESSION] Exist!");
}else{
    console.log("[SESSION] Invalid session!");
}
```

### Test whether session is connected
```javascript
if(!sessionManager.is_connected("my-session-name")){
    console.log("[SESSION] Online!");
}else{
    console.log("[SESSION] Offline!");
}
```

### Get all sessions
```javascript
sessionManager.getAll();

//or
sessionManager.sessions;
```

### Get online sessions
```javascript
sessionManager.getOnline();
```

### Destroy a session
```javascript
sessionManager.destroy("my-session-name");
```
---
Methods of a session-object:
 - connect
 - disconnect
 - online
 - put
 - get

### Connect a session
```javascript
session.connect(function(err){
    if(err){ return console.log(err); };

    console.log("[SESSION] Successfully connected!");
});
```

### Disonnect a session
```javascript
session.disconnect(function(err){
    if(err){ return console.log(err); };

    console.log("[SESSION] Successfully disconnected!");
});
```

### Test status
```javascript
if(session.online()){
    console.log("[SESSION] Online!");
}else{
    console.log("[SESSION] Offline!");
}
```

### Store session-data
```javascript
session.put({ 
    D: "Data 4",
    E: "Data 5",
    F: "Data 6"

}, function(err){
    if(err){ return console.log(err); };

    console.log("[SESSION] Successfully stored the data!");
});
```

### Query session-data
```javascript
//Query by key
session.get("E", function(err, result){
    if(err){ return console.log(err); };
    
    console.log("[SESSION] Successfully fetched the data!");
    console.log(result);
});

//Query all
session.get(function(err, result){
    if(err){ return console.log(err); };

    console.log("[SESSION] Successfully fetched the data!");
    console.log(result);
});
```

---

### Example 1
Create a session if it does not exist,
otherwise retrive the exisiting session:

```javascript
if(!sessionHandler.exists("my-session-name")){

    sessionHandler.create({
        ident: "my-session-name"

    }, function(err, session){
        if(err){ return console.log(err); };
        console.log("[SESSION] Successfully created!");
        console.log(session);

        //You may now connect via session.connect(...)
    });

}else{

    sessionHandler.retrive("my-session-name", function(err, session){
        if(err){ return console.log(err); };
        console.log("[SESSION] Successfully retriven!");
        console.log(session);

        //You may now connect via session.connect(...)
    });
}
```

### Example 2 (recommended)
This example is the recommended approach.

```javascript
sessionHandler.createOrRetrive({
    ident: "my-session-name"

}, function(err, session, state){
    if(err){ return console.log(err); };

    if(state == 1){ console.log("Successfully created!"); }
    if(state == 2){ console.log("Successfully retriven!"); }

    if(!session.online()){
        session.connect(function(err){
            if(err){ return console.log(err); };
            console.log("Successfully connected!");
        });
    }

});
```
---
##How to install:
Just use `npm install c2b-session` 
