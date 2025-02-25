var fs = require('fs');
var path = __dirname + '/firescript2.fire';
var fire = fs.readFileSync(path, 'utf8');
//All startting functions/code
var result = `
define end_char 255
LDI r0 0 //IG its redundant, but who cares about 1/500 of a second?
//Gets r2th bit of r1
JMP .BIF_getbit_end
.BIF_getbit
    LDI r3 1        // r3 = 1 (mask thing)
	.BIF_getbit_shift_loop
		ADD r2 0 r0 //Set 'zero' to (is r1 0?)
		BRH zero .BIF_getbit_done     // If r2 == 0, exit loop
		RSH r1 r1       // Logical right shift r1 >> 1
		DEC r2
		JMP .BIF_getbit_shift_loop   // Repeat until r2 == 0

	.BIF_getbit_done
		AND r1 r3 r1
		RET
.BIF_getbit_end

//Built in function: getbit from pow of 2.
//gets log(r2)th bit of r1.
//returns 0 if the bit is 0,
//some other nunber is it isnt (NOT NECCECARLY 1)

JMP .BIF_getbit_PO2_end
.BIF_getbit_PO2
	AND r1 r2 r1 //Wont be 1 always
.BIF_getbit_PO2_end


JMP .BIF_mult_end

.BIF_mult // Multiply r1 and r2, store result in r3
    LDI r3 0       // Initialize result to 0
	LDI r4 1
	.BIF_mult_loop_start
	    ADI r2 0            // Check if r2 is zero
	    BRH zero .BIF_mult_loop_end // Exit loop if r2 == 0
		
	    AND r4 r2 r0         // Check LSB of r2
	    BRH zero .BIF_mult_shift // Skip adding if LSB is 0
	    
	    ADD r3 r1 r3        // Add r1 to result if LSB is 1
	    
	.BIF_mult_shift
	    LSH r1 r1           // Shift multiplicand left
	    RSH r2 r2           // Shift multiplier right
	    JMP .BIF_mult_loop_start

.BIF_mult_loop_end
    RET
.BIF_mult_end





`;

function isNumber(str) {
	return /^\d+$/.test(str);
}
console.log(fire);
console.log("Compiled to:\n")
var specialChars = ["=", "$"];
var specialChars = ["=", "$", "newvar ", "+", "-", "*"];
String.prototype.cut = function(start, end) {
	let len = this.length;
	// Convert negatives to positive indexes
	if (start < 0) start = len + start;
	if (end < 0) end = len + end;
	// Remove characters from start to end (inclusive)
	return this.slice(0, start) + this.slice(end + 1);
};
String.prototype.pluck = function(start, end) {
	let len = this.length;
	if (start < 0) start = len + start;
	if (end < 0) end = len + end;
	return this.slice(start, end + 1);
};

function getSpecialChars(str) {
	let res = [];
	for (let i = 0; i < str.length; i++) {
		for (let j = 0; j < specialChars.length; j++) {
			const special = specialChars[j];
			// Check if substring starting at i matches special
			if (str.substr(i, special.length) === special) {
				res.push(special);
				// Skip ahead to avoid duplicate matching of same substring
				i += special.length - 1;
				break; // Move to next index in str
			}
		}
	}
	return res;
}
var lines = fire.split("\n");
var alloced = [0] //IDs of used memIDs
function getNewMemId() {
	for (var i = 0; i < 255; i++) {
		if (!alloced.includes(i)) {
			return i;
		}
	}
	throw new Error("Ran out of memIds")
}
var variables = {
	"test": {
		location: 0,
	} //memloc 0 is test var
};
function removeTrailingSemicolon(str) {
    return str.endsWith(";") ? str.slice(0, -1) : str;
}

for (var i = 0; i < lines.length; i++) {
	var line = lines[i];
	var lineRes = "";
	
	line = removeTrailingSemicolon(line);
	var debugData = getSpecialChars(line);
	//Only '=' (Load Command)
	//Convert to string because the arrays are diff memlocs (because ["="] != ["="])
	if (getSpecialChars(line).toString() == ["="].toString()) {
		var varName = line.split("=")[0].trim();
		var val = line.split("=")[1].trim();
		var varLocation = variables[varName].location;
		lineRes = `
//Set the variable ${varName} to ${val}, with memloc ${varLocation}
LDI r1 ${val}
STR r0 r1 ${varLocation}
`
	} else if (getSpecialChars(line).includes("newvar ")) {
		line = line.replace("newvar", "").trim()
		var varName = line.split("=")[0].trim();
		var val = line.split("=")[1].trim();
		var varLocation = getNewMemId();
		variables[varName] = {
			location: varLocation
		}
		alloced.push(varLocation);
		lineRes = `
//Set the variable ${varName} to ${val}, with memloc ${varLocation}
LDI r1 ${val}
STR r0 r1 ${varLocation}
`
	} else if (getSpecialChars(line).includes("+")) {
		//Were doing some adding operation
		//writing to a variable
		if (getSpecialChars(line).includes("=") && !getSpecialChars(line).includes("newvar ")) {
			var writingVarName = line.split("=")[0].trim();
			var writingVarLocation = variables[writingVarName].location;
			var expression = line.split("=")[1].trim();
			//get the 2 values of the expression.
			var expressionVal1 = expression.split("+")[0].trim();
			var expressionVal2 = expression.split("+")[1].trim();
			/* Set r3 and r4 to their respective values */
			{
				if (isNumber(expressionVal1)) {
					//its number + X
					lineRes += `
LDI r3 ${expressionVal1} //Load ${expressionVal1} to reg3
	`
				} else {
					//its variable + X
					var expressionVal1ID = variables[expressionVal1].location;
					lineRes += `
LOD r0 r3 ${expressionVal1ID} //Get the variable ${expressionVal1} and write/load it to r3
	`
				}
				if (isNumber(expressionVal2)) {
					//its number + X
					lineRes += `
LDI r4 ${expressionVal2} //Load ${expressionVal2} to reg3
	`
				} else {
					//its variable + X
					var expressionVal2ID = variables[expressionVal2].location;
					lineRes += `
LOD r0 r4 ${expressionVal2ID} //Get the variable ${expressionVal2} and write/load it to r3
	`
				}
			}
			//Is the num1 a variable?
			lineRes += `
ADD r3 r4 r2 //add regs r3 and r4 and write it to r2
//Set the variable ${writingVarName} to the result, with memloc ${varLocation}
STR r0 r2 ${varLocation}
`
		} else {
			console.log("Err line " + i)
			procces.exit(1);
		}
	} else if (getSpecialChars(line).includes("-")) {
		//Were doing some adding operation
		//writing to a variable
		if (getSpecialChars(line).includes("=") && !getSpecialChars(line).includes("newvar ")) {
			var writingVarName = line.split("=")[0].trim();
			var writingVarLocation = variables[writingVarName].location;
			var expression = line.split("=")[1].trim();
			//get the 2 values of the expression.
			var expressionVal1 = expression.split("-")[0].trim();
			var expressionVal2 = expression.split("-")[1].trim();
			/* Set r3 and r4 to their respective values */
			{
				if (isNumber(expressionVal1)) {
					//its number + X
					lineRes += `
LDI r3 ${expressionVal1} //Load ${expressionVal1} to reg3
	`
				} else {
					//its variable + X
					var expressionVal1ID = variables[expressionVal1].location;
					lineRes += `
LOD r0 r3 ${expressionVal1ID} //Get the variable ${expressionVal1} and write/load it to r3
	`
				}
				if (isNumber(expressionVal2)) {
					//its number + X
					lineRes += `
LDI r4 ${expressionVal2} //Load ${expressionVal2} to reg3
	`
				} else {
					//its variable + X
					var expressionVal2ID = variables[expressionVal2].location;
					lineRes += `
LOD r0 r4 ${expressionVal2ID} //Get the variable ${expressionVal2} and write/load it to r3
	`
				}
			}
			//Is the num1 a variable?
			lineRes += `
SUB r3 r4 r2 //add regs r3 and r4 and write it to r2
//Set the variable ${writingVarName} to the result, with memloc ${varLocation}
STR r0 r2 ${varLocation}
`
		}
	} else if (getSpecialChars(line).includes("*")) {
		//Were doing some adding operation
		//writing to a variable
		if (getSpecialChars(line).includes("=") && !getSpecialChars(line).includes("newvar ")) {
			var writingVarName = line.split("=")[0].trim();
			var writingVarLocation = variables[writingVarName].location;
			var expression = line.split("=")[1].trim();
			//get the 2 values of the expression.
			var expressionVal1 = expression.split("*")[0].trim();
			var expressionVal2 = expression.split("*")[1].trim();
			/* Set r1 and r2 to their respective values */
			{
				if (isNumber(expressionVal1)) {
					//its number + X
					lineRes += `
LDI r1 ${expressionVal1} //Load ${expressionVal1} to reg1
	`
				} else {
					//its variable + X
					var expressionVal1ID = variables[expressionVal1].location;
					lineRes += `
LOD r0 r1 ${expressionVal1ID} //Get the variable ${expressionVal1} and write/load it to r1
	`
				}
				if (isNumber(expressionVal2)) {
					//its number + X
					lineRes += `
LDI r2 ${expressionVal2} //Load ${expressionVal2} to reg2
	`
				} else {
					//its variable + X
					var expressionVal2ID = variables[expressionVal2].location;
					lineRes += `
LOD r0 r2 ${expressionVal2ID} //Get the variable ${expressionVal2} and write/load it to r2
	`
				}
			}
			//Is the num1 a variable?
			lineRes += `
CAL .BIF_mult
MOV r3 r2
//Set the variable ${writingVarName} to the result, with memloc ${varLocation}
STR r0 r2 ${varLocation}
`
		} else {
			console.log("Err line " + i)
			procces.exit(1);
		}
	} else if (line[0] == "$") {
		//$[LINE] means [LINE] is pure assembly.
		lineRes = line.cut(0, 0);
	}
	if (debugData) console.log(debugData);
	result += lineRes + "\n";
}
result +=
	`
HLT
`
console.log(result);
/** --- Made By SilverNickelStudios/Agni --- **/
