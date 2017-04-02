# c2b-session
A legacy yet minimalist session-manager for Node.js.
Supports Node.js/IO.js from version 0.10 onwards.

Unit-Tests are included.

[![Build Status](https://travis-ci.org/Cloud2Box/c2b-session.svg?branch=master)](https://travis-ci.org/Cloud2Box/c2b-session) [![npm version](https://badge.fury.io/js/c2b-session.svg)](https://badge.fury.io/js/c2b-session)
---

# Table of contents
* [API](#api)
* [Setup](#setup)
 * [Set a timeout for sessions](#set-a-timeout-for-sessions-optional) (optional)
 * [Create a session](#create-a-session)
 * [Retrive a session](#retrieve-a-session)
 * [Create or retrive a session](#create-or-retrive-a-session)
 * [Test whether session exist](#test-whether-session-exist)
 * [Test whether session is connected](#test-whether-session-is-connected)
 * [Get all sessions](#get-all-sessions)
 * [Get online sessions](#get-online-sessions)
 * [Destroy a session](#destroy-a-session)
* [Session Handling](#session-handling)
 * [Connect a session](#connect-a-session)
 * [Disconnect a session](#disconnect-a-session)
 * [Test status](#test-status)
 * [Store session-data](#store-session-data)
 * [Query session-data](#query-session-data)
* Examples
 * [Example 1](#example-1)
 * [Example 2](#example-2-recommended) (recommended)
* [Unit-Tests](#unit-tests)
 * [Make](#make)
 * [NPM](#npm)
* [How to install](#how-to-install)
* [Use-case](#use-case)

---

## API

Methods (fn) of the module:

```
* setTimeout(time <minutes>, callback <function>(ident, time)) Fn
* create(config <object>, callback <function>(err, session)) Fn
* retrive(ident <string>, callback <function>(err, session)) Fn
* createOrRetrive(config <object>, callback <function>(err, session, state)) Fn
* exists(ident <string>) Boolean
* is_connected(ident <string>) Boolean
* getAll() Object
* getOnline() Array
* destroy() Void
```

Methods (fn) of a session-object:

```
* connect(callback <function>(err)) Fn
* disconnect(callback <function>(err)) Fn
* online() Boolean
* put(callback <function>(err)) Fn
* get([key <string> (optional)], callback <function>(err, result)) Fn
```

Default template of session-object:
```javascript
{
    t_connect: Date.now(),      //timestamp of a sessions initial connection
    t_last_action: Date.now(),  //timestamp of a sessions last action, eg. put() [required]
    connected: false,           //state of a sessions connection [required]
    ident: '',                  //ident of a session [required]
    data: {}                    //storage of session data [required]
}
```

---

## Setup
```javascript
var sessionManager = require('c2b-session');
```

### Set a timeout for sessions (optional)

```javascript
//Optionally set a timeout (min) for sessions...
sessionManager.setTimeout(1);

//as of version 0.0.3 you can pass a function too
sessionManager.setTimeout(1, function(ident, time){
    console.log(`[SESSION] ID ${ident} timed-out (${time})`);
});
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

    console.log("[SESSION] Successfully retrived!");
    console.log(session);
});
```

### Create or retrive a session
```javascript
sessionHandler.createOrRetrive({
    ident: "my-session-name"

}, function(err, session, state){
    if(err){ return console.log(err); };

    if(state == 1){ console.log("Successfully created!"); }
    if(state == 2){ console.log("Successfully retrived!"); }
    
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
if(sessionManager.is_connected("my-session-name")){
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

## Session Handling
A session-object is returned by the modules ```create``` and ```retrive``` methods.

### Connect a session
```javascript
session.connect(function(err){
    if(err){ return console.log(err); };

    console.log("[SESSION] Successfully connected!");
});
```

### Disconnect a session
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
        console.log("[SESSION] Successfully retrived!");
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
    if(state == 2){ console.log("Successfully retrived!"); }

    if(!session.online()){
        session.connect(function(err){
            if(err){ return console.log(err); };
            console.log("Successfully connected!");
        });
    }

});
```
---

## Unit-Tests
The testing-framework used in this module is [Mocha](https://github.com/mochajs/mocha) with the BDD / TDD assertion library [Chai](https://github.com/chaijs/chai).

* test/test.default.js `Performs 13 tests` | [Source](../master/test/test.default.js)

Simply run those tests as you please:

### Make
```make test```

### NPM
```npm test```

---

## How to install:
Use `npm install c2b-session` 

---

## Use-case:
This module is used for a Twitch-like channel application.
