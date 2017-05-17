/*
* The MIT License (MIT)
*
* Product:      C2B Session Manager
* Description:  A minimalist session-manager for NodeJS
*
* Copyright (c) 2016-2017 Steven Agyekum <agyekum@posteo.de>
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

var expect = require("chai").expect;
var sessionManager = require('../src/index');

var session_name = 'session-xyz';

describe('Session Manager [BASIC-TESTS]', function() {

    it('sets a timeout #setTimeout', function(done) {

        expect(sessionManager).to.have.property('setTimeout');
        expect(sessionManager.setTimeout).to.be.a('function');

        sessionManager.setTimeout(1);

        done();
    });

    it('creates a session', function(done) {

        expect(sessionManager).to.have.property('create');
        expect(sessionManager.create).to.be.a('function');

        sessionManager.create({
            ident: session_name

        }, function(err, session){
            expect(err).to.be.null;
            if(err){ return console.log(err); };

            expect(session).not.to.be.null;
            expect(session).to.be.a('object');

            expect(session).to.have.property('ident');
            expect(session.ident).to.equal(session_name);

            done();
        });
    });
    

    it('retrieves the session by ident', function(done) {

        expect(sessionManager).to.have.property('retrieve');
        expect(sessionManager.retrieve).to.be.a('function');

        sessionManager.retrieve(session_name, function(err, session){
            expect(err).to.be.null;
            if(err){ return console.log(err); };

            expect(session).not.to.be.null;
            expect(session).to.be.a('object');

            expect(session).to.have.property('ident');
            expect(session.ident).to.equal(session_name);
            
            done();
        });
    });


    it('destroys the session', function(done) {

        expect(sessionManager).to.have.property('destroy');
        expect(sessionManager.destroy).to.be.a('function');

        sessionManager.destroy(session_name);

        done();
    });
});

// Extended tests

describe('Session Manager [EXTENDED-TESTS]', function() {

    it('sets a timeout #setTimeout', function(done) {

        expect(sessionManager).to.have.property('setTimeout');
        expect(sessionManager.setTimeout).to.be.a('function');

        sessionManager.setTimeout(1);

        done();
    });


    var _session;

    it('creates a session #createOrRetrieve', function(done) {

        expect(sessionManager).to.have.property('createOrRetrieve');
        expect(sessionManager.createOrRetrieve).to.be.a('function');

        sessionManager.createOrRetrieve({
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

            done();
        });
    });

    it('retrieves the session #createOrRetrieve', function(done) {

        expect(sessionManager).to.have.property('createOrRetrieve');
        expect(sessionManager.createOrRetrieve).to.be.a('function');

        sessionManager.createOrRetrieve({
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
        });

        _session.get('test2', function(err, result){
            expect(err).to.be.null;
            if(err){ return console.log(err); };

            expect(result).not.to.be.null;
            expect(result).to.be.a('string');
            expect(result).to.equal('test data 2');

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