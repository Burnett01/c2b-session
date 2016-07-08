var expect = require("chai").expect;
var sessionManager = require('../src/index');

var session_name = 'session-xyz';

describe('Session Manager [EXTENDED]', function() {

    it('sets a timeout #setTimeout', function(done) {

        expect(sessionManager).to.have.property('setTimeout');
        expect(sessionManager.setTimeout).to.be.a('function');

        sessionManager.setTimeout(1);

        done();
    });


    var _session;

    it('creates a session #createOrRetrive', function(done) {

        expect(sessionManager).to.have.property('createOrRetrive');
        expect(sessionManager.createOrRetrive).to.be.a('function');

        sessionManager.createOrRetrive({
            ident: session_name

        }, function(err, session, state){
            expect(err).to.be.null;
            if(err){ return console.log(err); };
            
            expect(session).not.to.be.null;
            expect(session).to.be.a('object');

            expect(state).to.be.a('number');
            expect(state).to.be.within(1, 2);

            expect(session).to.have.property('ident');
            expect(session.ident).to.equal(session_name);

            if(state == 1){ 
                console.log("[SESSION] Successfully created!");
                console.log(session.ident);
            }

            if(state == 2){ 
                console.log("[SESSION] Successfully retrived!");
                console.log(session.ident);
            }

            done();
        });
    });

    it('retrives the session #createOrRetrive', function(done) {

        expect(sessionManager).to.have.property('createOrRetrive');
        expect(sessionManager.createOrRetrive).to.be.a('function');

        sessionManager.createOrRetrive({
            ident: session_name

        }, function(err, session, state){
            expect(err).to.be.null;
            if(err){ return console.log(err); };
            
            expect(session).not.to.be.null;
            expect(session).to.be.a('object');

            expect(state).to.be.a('number');
            expect(state).to.be.within(1, 2);

            expect(session).to.have.property('ident');
            expect(session.ident).to.equal(session_name);

            if(state == 1){ 
                console.log("[SESSION] Successfully created!");
                console.log(session.ident);
            }

            if(state == 2){ 
                console.log("[SESSION] Successfully retrived!");
                console.log(session.ident);
            }

            _session = session;

            done();
        });
    });

    it('connects the session #connect', function(done) {
        expect(_session).not.to.be.null;
        expect(_session).to.have.property('online');
        expect(_session.online()).to.be.a('boolean');

        expect(_session).to.have.property('connect');
        expect(_session.connect).to.be.a('function');

        _session.connect(function(err){
            expect(err).to.be.null;
            if(err){ return console.log(err); };

            console.log("Successfully connected!");

            done();
        });
    });


    it('stores data into the session #put', function(done) {
        expect(_session).not.to.be.null;
        expect(_session).to.have.property('put');
        expect(_session.put).to.be.a('function');

        _session.put({
            test1: 'test data 1',
            test2: 'test data 2'

        }, function(err){
            expect(err).to.be.null;
            if(err){ return console.log(err); };

            console.log("[SESSION] Successfully stored the data!");

            done();
        });
    });

    it('queries the data by key #get', function(done) {
        expect(_session).not.to.be.null;
        expect(_session).to.have.property('get');
        expect(_session.get).to.be.a('function');

        _session.get('test1', function(err, result){
            expect(err).to.be.null;
            if(err){ return console.log(err); };

            expect(result).not.to.be.null;
            expect(result).to.be.a('string');
            expect(result).to.equal('test data 1');

            console.log("[SESSION] Successfully fetched the data!");
            console.log(result);

        });

        _session.get('test2', function(err, result){
            expect(err).to.be.null;
            if(err){ return console.log(err); };

            expect(result).not.to.be.null;
            expect(result).to.be.a('string');
            expect(result).to.equal('test data 2');

            console.log("[SESSION] Successfully fetched the data!");
            console.log(result);

            done();
        });
    });

    it('queries all data #get', function(done) {
        expect(_session).not.to.be.null;
        expect(_session).to.have.property('get');
        expect(_session.get).to.be.a('function');

        _session.get(function(err, results){
            expect(err).to.be.null;
            if(err){ return console.log(err); };

            expect(results).not.to.be.null;
            expect(results).to.be.a('object');

            expect(results).to.have.property('test1');
            expect(results.test1).to.equal('test data 1');

            expect(results).to.have.property('test2');
            expect(results.test2).to.equal('test data 2');


            console.log("[SESSION] Successfully fetched the data!");
            console.log(results);

            done();
        });
    });

    it('disconnects the session #disconnect', function(done) {
        expect(_session).not.to.be.null;
        expect(_session).to.have.property('online');
        expect(_session.online()).to.be.a('boolean');

        expect(_session).to.have.property('disconnect');
        expect(_session.disconnect).to.be.a('function');

        _session.disconnect(function(err){
            expect(err).to.be.null;
            if(err){ return console.log(err); };

            console.log("Successfully disconnected!");

            done();
        });
    });
                    
    it('destroys the session #destroy', function(done) {

        expect(sessionManager).to.have.property('destroy');
        expect(sessionManager.destroy).to.be.a('function');

        sessionManager.destroy(session_name);

        done();
    });

});