/**

 */
var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'youcantknowthis';


encrypt = function(input)
{
    var cipher = crypto.createCipher(algorithm,password);
    var crypted = cipher.update(input,'utf8','hex');
    crypted = crypted + cipher.final('hex');
    return crypted;
}



var passport = require("passport");
var mq_client = require('../rpc/client');
var LocalStrategy = require("passport-local").Strategy;
//var mongo = require('./db/mongo');
var loginDatabase = "mongodb://localhost:27017/ebay";

module.exports = function(passport) {
    passport.use('login', new LocalStrategy(function(username, password, done) {

        var newPassword = encrypt(password);

        var msg_payload = {"username":username, "password":newPassword};

            process.nextTick(function(){

                mq_client.make_request('ebay_login_queue', msg_payload, function(error, user){
                    if(error) {
                        return done(err);
                    }
                    else
                    {
                        done(null, user);
                    }
                });
        
/*
                loginCollection.findOne(whereParams, function(error, user) {

                    if(error) {
                        return done(err);
                    }

                    if(!user) {
                        return done(null, false);
                    }

                    if(user.password != password) {
                        done(null, false);
                    }

                    connection.close();
                    console.log(user.username);
                    done(null, user);
                });*/
            });
        
    }));
}


