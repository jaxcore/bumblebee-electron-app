const BumblebeeAPI = require('bumblebee-api');

class BumblebeeAssistant extends BumblebeeAPI.Assistant {
	constructor() {
		// an instance of the assistant is created when the websocket has connected
		// each time the socket is started or stopped, a new instance of the assistant will be created
		super(...arguments);
		console.log('constructor()');
		
		this.on('hotword', (hotword) => {
			// hotword events are triggered immediately when the hotword is detected
			this.bumblebee.console('hotword detected: '+hotword);
		});
		
		this.on('command', (recognition) => {
			// command events are speech-to-text recognition that was processed at the same time the hotword was detected
			this.bumblebee.say('your command was: '+recognition.text);
			this.bumblebee.console('command detected: '+recognition.text);
		});
	}
	
	async main(args) {
		// main is called once when the assistant is started or called upon using the hotword
		console.log('main()');
		
		this.bumblebee.console('Bumblebee Main Menu');
		await this.bumblebee.say('Bumblebee Ready');
	}
	
	async loop() {
		// loop is called repeatedly after main until it returns true or an error is thrown
		console.log('loop()');
		
		let recognition = await this.bumblebee.recognize();
		if (recognition) {
			// received a speech-to-text recognition
			console.log('recognition:', recognition);
			this.bumblebee.console(recognition);
			
			if (recognition.text === 'error') {
				throw new Error('oops');
			}
			
			// respond with a text-to-speech instruction
			await this.bumblebee.say('You said: ' + recognition.text);
			
			// say "exit" to shut down the assistant
			if (recognition.text === 'exit') {
				await this.bumblebee.say('Exiting...');
				return true; // return out of the loop to shut down the assistant
			}
		}
	}
}

BumblebeeAPI.connectAssistant('bumblebee', BumblebeeAssistant, {
	autoStart: true
});