var expect = require("chai").expect;
var sessionManager = require('../src/index');

var session_name = 'session-xyz';

describe('Session Manager [BASIC]', function() {

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

            console.log("[SESSION] Successfully created!");
            console.log(session.ident);

            done();
        });
    });
    

    it('retrives the session by ident', function(done) {

        expect(sessionManager).to.have.property('retrive');
        expect(sessionManager.retrive).to.be.a('function');

        sessionManager.retrive(session_name, function(err, session){
            expect(err).to.be.null;
            if(err){ return console.log(err); };

            expect(session).not.to.be.null;
            expect(session).to.be.a('object');

            expect(session).to.have.property('ident');
            expect(session.ident).to.equal(session_name);

            console.log("[SESSION] Successfully retrived!");
            console.log(session.ident);
            
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