import {CANCELLED, UNRECOGNIZED, TIMEOUT} from '../../constants';

async function ConfirmCustomize(bumblebee) {
	const yes_or_no = [
		{
			text: 'Yes',
			matches: ['okay', 'yeah', 'ya', 'affirmative'],
			value: true
		},
		{
			text: 'No',
			matches: ['nope', 'na', 'negative'],
			value: false
		}
	];
	
	let customizeYesOrNo = await bumblebee.choose( "Do you want to customize Bumblebee?", yes_or_no, {
		style: 'yes_or_no',
		timeout: 5000,
		retryTimeout: true,
		retryUnrecognized: true,
		maximumRetries: 2,
		// unrecognizedText: "Sorry, I didn't understand"
	});
	
	if (customizeYesOrNo.error) {
		if (customizeYesOrNo.error === CANCELLED) {
			await bumblebee.say("Cancelled");
		}
		else if (customizeYesOrNo.error === UNRECOGNIZED) {
			await bumblebee.say("Sorry, your response was not recognized");
		}
		else if (customizeYesOrNo.error === TIMEOUT) {
			await bumblebee.say("Sorry, time is up");
		}
		return false;
	}
	if (customizeYesOrNo.value) {
		return bumblebee.launch('Customize');
	}
	else {
		return false;
	}
}


async function SayProfile(bumblebee) {
	bumblebee.console("SayProfile()");
	
	await bumblebee.say("Which voice do you prefer?");
	
	const profiles = [
		{
			number: 1,
			text: 'Jack',
			value: 'Jack'
		},
		{
			number: 2,
			text: 'Cylon',
			matches: ['silan', 'silo'],
			value: 'Cylon'
		},
		{
			number: 3,
			text: 'Zhora',
			matches: ['zora'],
			value: 'Zhora'
		}
	];
	
	// await bumblebee.say("The options are...");
	
	for (const profile of profiles) {
		await bumblebee.say(profile.number + ': ' + profile.text, {
			profile: profile.value,
			ttsOutput: false
		});
	}
	
	
	let profileChoice = await bumblebee.choose(null, profiles, {
		style: 'confirm',
		timeout: 25000,
		retryTimeout: true,
		retryUnrecognized: true,
		maximumRetries: 1,
		// unrecognizedText: "Sorry, I didn't understand",
		narrateChoices: false,
		numberize: true
	});
	
	if (profileChoice.error) {
		await bumblebee.console("No response, exiting");
		// bumblebee.sound('cancel')
		return false;
	}
	
	debugger;
	bumblebee.setSayProfile(profileChoice.value);
	// debugger;
	
	await bumblebee.say("You selected " + profileChoice.text);
	
	return true;
}

export default async function main(bumblebee) {
	// await bumblebee.say("Settings Menu");
	bumblebee.console("Settings.main()");
	return loop(bumblebee);
}

async function loop(bumblebee) {
	bumblebee.console("Settings.loop()");
	
	let r = await bumblebee.recognize();
	bumblebee.console('Settings: '+r.text);
	
	if (r.text === 'exit') {
		await bumblebee.say("Exiting...");
		return true;
	}
	if (r.text === 'change voice') {
		await SayProfile(bumblebee);
		await bumblebee.console("Say Profile done");
	}
	
	return loop(bumblebee);
}
