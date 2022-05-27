/**
* @module LogLevel
* @summary TODO
*/


const declarations = {
	applyVerbosityLevel,
	debug
};


function debug(valueAccessor: () => object[] | object) {
	if (LogSettings.verbosity !== "verbose")
		return;

	let returnValue = valueAccessor();
	if (!Array.isArray(returnValue))
		returnValue = [returnValue];

	console.debug(...(returnValue as object[]));
}


type Verbosity = "normal" | "verbose";

type LogSettings = {
	verbosity: Verbosity;
}

const logSettings: LogSettings = {
	verbosity: "normal"
};
function applyVerbosityLevel(level: Verbosity) {
	logSettings.verbosity = level;

	if (level !== 'verbose')
		console.debug = () => { };
}


export const LogSettings = logSettings;
export default declarations;
