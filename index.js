/**
 * Created by d23 on 25.11.15.
 */

var http = require('http');
var https = require('https');
var email   = require("emailjs");

var url = "https://ws.ovh.com/dedicated/r2/ws.dispatcher/getAvailability2";

var options = {
    host: 'ws.ovh.com',
    port: 80,
    path: '/dedicated/r2/ws.dispatcher/getAvailability2'
};

function sendEmail() {

    // setup email server
    var server  = email.server.connect({
        user:    "xxx",
        password:"xxx",
        host:    "smtp.gazeta.pl",
        port:    465,
        ssl:     true
    });

    server.send({
        text:    "KS3 available",
        from:    "david <xxxx>",
        to:      "david <xxxx>",
        cc:     '',
        subject: "KS3 available"
    }, function(err, message) {
        console.log("sent");
        console.log(err || message);

        // email sent, exit process
        //process.exit();
    });

}

setInterval(function() {
    http.get(options, function(res) {

        var body = '';
        res.on('data', function(chunk) {
            body += chunk;
        });

        res.on('end', function() {
            var results = JSON.parse(body);
            var availabilityArray = results.answer.availability;

            loop:
            for(var i = 0; i < availabilityArray.length; i++) {

                if(availabilityArray[i].reference === "150sk30") {



                    //check if zone is available
                    for(var j = 0; j < availabilityArray[i].zones.length; j++) {
                        if(availabilityArray[i].zones[j].availability !== 'unknown') {
                            console.log("Wolne!");
                            sendEmail();
                            break loop;
                        }
                    }

                    //check if metazone(?) is available
                    for(var j = 0; j < availabilityArray[i].metaZones.length; j++) {
                        if(availabilityArray[i].metaZones[j].availability !== 'unknown') {
                            console.log("Wolne!");
                            sendEmail();
                            break loop;
                        }
                    }

                    console.log("Nie ma wolnych...");
                }
            }
        });


    });
}, 60000);