/*
* The MIT License (MIT)
*
* Product:      C2B Session Manager
* Description:  A minimalist session-manager for NodeJS
*
* Copyright (c) 2016-2017 Cloud2Box - IT Dienstleistungen <info@cloud2box.net>
*               2016-2017 Steven Agyekum <s-8@posteo.mx>
*
* Permission is hereby granted, free of charge, to any person obtaining a copy of this software
* and associated documentation files (the "Software"), to deal in the Software without restriction,
* including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, 
* and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so,
* subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all copies
* or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
* TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL 
* THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
* TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*
*/

const ERRORS = {
    SESSION_INVALID:            new Error('The session does not exist!')
  , SESSION_EXISTS:             new Error('The session already exist!')
  , SESSION_CONNECTED:          new Error('The session is already connected!')
  , SESSION_NOTCONNECTED:       new Error('The session is not connected!')
  , SESSION_EXPIRED:            new Error('The session expired!')

  , SESSION_DATA_KEY_INVALID:   new Error('The provided data-key is not valid!')

  , PARAM_NON_OBJECT:           new Error('The first parameter must be an object!')
  , PARAM_NON_STRING:           new Error('The first parameter must be a string!')
}


var SESSION_TPL = function() {
    return {
        t_connect: Date.now(),
        t_last_action: Date.now(),
        connected: false,
        ident: '',
        data: {},
    };
};


C2B_SESSION = {

    _timeout: 3,
    _timeout_cb: undefined,

    setTimeout: function(timeout, callback){
        if(!timeout){ return; }
        
        C2B_SESSION._timeout = timeout;

        if(callback && typeof callback === 'function'){
            C2B_SESSION._timeout_cb = callback;
        }
    },

    sessions: {},

    exists: function(ident){
        if(!ident || (ident && typeof ident !== 'string')){
            return callback(ERRORS.PARAM_NON_STRING);
        }
        return (C2B_SESSION.sessions.hasOwnProperty(ident)) ? true: false;
    },

    is_connected: function(ident){
        if(!ident || (ident && typeof ident !== 'string')){
            return callback(ERRORS.PARAM_NON_STRING);
        }
        if(!C2B_SESSION.exists(ident)){
            return callback(ERRORS.SESSION_INVALID);
        }
        if(!C2B_SESSION.sessions[ident].hasOwnProperty('connected')){
            return callback(ERRORS.PARAM_NON_OBJECT);
        }
        return (C2B_SESSION.sessions[ident].connected === true) ? true : false;
    },

    getAll: function(){
        return C2B_SESSION.sessions;
    },

    getOnline: function(){
        var sessions = C2B_SESSION.getAll();
        var online_sessions = [];

        if(typeof sessions === 'object' && Object.keys(sessions).length > 0){
            for (var ident in sessions) {
                if(!sessions.hasOwnProperty(ident)) continue;
                if(sessions[ident].hasOwnProperty('t_last_action')
                && _has_timeout(sessions[ident].t_last_action, C2B_SESSION._timeout)){
                    C2B_SESSION.destroy(ident);
                    continue;
                }
                if (C2B_SESSION.is_connected(ident)){
                    online_sessions.push(sessions[ident]);
                }
            }
        }
        
        return online_sessions;
    },

    retrive: function(ident, _callback){
        if(!ident || (ident && typeof ident !== 'string')){
            return _callback(ERRORS.PARAM_NON_STRING, null);
        }
        if(!C2B_SESSION.exists(ident)){ 
            return _callback(ERRORS.SESSION_INVALID, null); 
        }
        if(C2B_SESSION.sessions[ident].hasOwnProperty('t_last_action')
        && _has_timeout(C2B_SESSION.sessions[ident].t_last_action, C2B_SESSION._timeout)){
            C2B_SESSION.destroy(ident);
            return _callback(ERRORS.SESSION_EXPIRED, null);
        }

        return _callback(null, Object.assign({

            connect: function(callback){
                if(!C2B_SESSION.exists(ident)){ 
                    return callback(ERRORS.SESSION_INVALID); 
                }
                if(C2B_SESSION.is_connected(ident)){
                    return callback(ERRORS.SESSION_CONNECTED);
                }
                
                C2B_SESSION.sessions[ident].connected = true;

                return callback(null);
            },

            disconnect: function(callback){
                if(!C2B_SESSION.exists(ident)){ 
                    return callback(ERRORS.SESSION_INVALID); 
                }
                if(!C2B_SESSION.is_connected(ident)){
                    return callback(ERRORS.SESSION_NOTCONNECTED);
                }
                
                C2B_SESSION.sessions[ident].connected = false;

                return callback(null);
            },

            put: function(data, callback){
                if(!data || (data && typeof data !== 'object')){
                    return callback(ERRORS.PARAM_NON_OBJECT);
                }
                if(!C2B_SESSION.exists(ident)){ 
                    return callback(ERRORS.SESSION_INVALID); 
                }
                if(!C2B_SESSION.is_connected(ident)){
                    return callback(ERRORS.SESSION_NOTCONNECTED);
                }

                Object.assign(C2B_SESSION.sessions[ident].data, data);
                C2B_SESSION.sessions[ident].t_last_action = Date.now();

                return callback(null);
            },

            get: function(data, callback){
                if(typeof data === 'function'){
                    callback = data;
                }
                if(!C2B_SESSION.exists(ident)){ 
                    return callback(ERRORS.SESSION_INVALID, null); 
                }
                if(!C2B_SESSION.is_connected(ident)){
                    return callback(ERRORS.SESSION_NOTCONNECTED, null);
                }
                if(typeof data === 'string'){
                    if(!C2B_SESSION.sessions[ident].data.hasOwnProperty(data)){
                        return callback(ERRORS.SESSION_DATA_KEY_INVALID, null);
                    }
                    return callback(null, C2B_SESSION.sessions[ident].data[data]);
                }

                return callback(null, C2B_SESSION.sessions[ident].data);
            },

            online: function(){
                if(!C2B_SESSION.exists(ident)){ 
                    return callback(ERRORS.SESSION_INVALID); 
                }
                return (C2B_SESSION.is_connected(ident)) ? true : false; 
            }

        }, C2B_SESSION.sessions[ident]));
    },

    create: function(config, callback) {
        if(!config || (config && typeof config !== 'object')){
             return callback(ERRORS.PARAM_NON_OBJECT);
        }
        if(C2B_SESSION.exists(config.ident)){
             return callback(ERRORS.SESSION_EXISTS);
        }

        C2B_SESSION.sessions[config.ident] = Object.assign(Object.assign({}, SESSION_TPL()), config);

        C2B_SESSION.retrive(config.ident, function(err, session){
            if(err){ return callback(err, null); }
            return callback(null, session);
        });
    },

    createOrRetrive: function(config, callback) {
        if(!config || (config && typeof config !== 'object')){
            return callback(ERRORS.PARAM_NON_OBJECT, null, null);
        }

        return C2B_SESSION.retrive(config.ident, function(err, session){

            if(!err){ return callback(null, session, 2); }

            if(err !== ERRORS.SESSION_INVALID){
                return callback(err, null, null);
            }

            return C2B_SESSION.create(config, function(err, session){
                if(err){ return callback(err, null, null); }
                return callback(null, session, 1);
            });
            
        });
    },

    destroy: function(ident){
        if(!C2B_SESSION.exists(ident)){
            return;
        }
        delete C2B_SESSION.sessions[ident];
        if(C2B_SESSION._timeout_cb && typeof C2B_SESSION._timeout_cb === 'function'){
            C2B_SESSION._timeout_cb(ident, Date.now());
        }
    },

};

module.exports = C2B_SESSION;



function _has_timeout(time, minutes){
    return ((Math.round(((new Date() - time) / 1000) / 60) % 60) >= minutes) ? true : false;
}