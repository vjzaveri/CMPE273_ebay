/**

 */
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var mongo = require('./db/mongo');
var loginDatabase = "mongodb://localhost:27017/ebay";

module.exports = function(passport) {
    passport.use('login', new LocalStrategy(function(username, password, done) {

        mongo.connect(loginDatabase, function(connection) {

            var loginCollection = mongo.connectToCollection('customer', connection);
            var whereParams = {
                email:username,
                password:password
            }

            process.nextTick(function(){
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
                });
            });
        });
    }));
}


