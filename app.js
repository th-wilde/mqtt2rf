const _mqtt = require('mqtt');
const config = require('./config');
const { exec } = require('child_process');

var isSending = false;
var rfQuere = [];

class rfPayload {
  constructor(systemCode, unitCode, onOff) {
    this.systemCode = systemCode;
    this.unitCode = unitCode;
    this.onOff = onOff;
  }
}

function sendRfFromQuere() {
	if (mqtt.connected==true && rfQuere.length > 0 && !isSending){
		isSending = true;
		var payload = rfQuere.shift();
		rfSend(payload.systemCode, payload.unitCode, payload.onOff);
		setTimeout(function(){isSending = false; sendRfFromQuere(); }, 1000);
	}
}

function rfSend (systemCode, unitCode, onOff){
	var systemCodeString = parseInt(systemCode).toString(2);
	systemCodeString = "0".repeat(5-systemCodeString.length)+systemCodeString;
	var unitCodeString = parseInt(unitCode).toString();
	var onOffString = onOff ? 1 : 0;
	console.log('nice -20 ./send -s -b '+systemCodeString+' '+unitCodeString+' '+onOffString);
	exec('nice -20 ./send -s -b '+systemCodeString+' '+unitCodeString+' '+onOffString, (err, stdout, stderr) => { });
}

var mqtt = _mqtt.connect(config.mqtt.server, mqttOptions=config.mqtt.options);

mqtt.on('connect', (connack) => {console.log('Connected to MQTT server'); mqtt.subscribe("rf/+/+");});

mqtt.on('message', (topic, message) => {
	if(topic.startsWith("rf/")){
		var parts = topic.split("/");
		if(parts[1] >= 0 && parts[1] <= 31 && parts[2] >= 0 && parts[2] <= 31){
			rfQuere.push(new rfPayload(parts[1], parts[2], message.toString().toLowerCase() == "on"))
			sendRfFromQuere();
			//rfSend(parts[1], parts[2], message.toString().toLowerCase() == "on");
		}
	}
});
process.on('exit', () => mqtt.end(true));
process.on('SIGINT', () => process.exit(0));
process.on('SIGTERM', () => process.exit(0));
