var awsIot = require('aws-iot-device-sdk');

//
// Replace the values of '<YourUniqueClientIdentifier>' and '<YourCustomEndpoint>'
// with a unique client identifier and custom host endpoint provided in AWS IoT cloud
// NOTE: client identifiers must be unique within your AWS account; if a client attempts 
// to connect with a client identifier which is already in use, the existing 
// connection will be terminated.
//
var device = awsIot.device({
   keyPath: './3f9f538734-private.pem.key',
  certPath: './3f9f538734-certificate.pem.crt',
    caPath: './root-CA.crt',
  clientId: 'HermesModuleTest',
      host: 'a2vl9qu270bg23.iot.eu-west-2.amazonaws.com'
});

//
// Device is an instance returned by mqtt.Client(), see mqtt.js for full
// documentation.
//
device
  .on('connect', function() {
    console.log('connect');
    device.subscribe('topic_1');
    device.publish('topic_2', JSON.stringify({ test_data: 1}));
  });

device
  .on('message', function(topic, payload) {
    console.log('message', topic, payload.toString());
  });