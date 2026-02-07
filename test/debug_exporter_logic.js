

const MOZZI_VOID_METHODS = ["set", "setLimits", "setSmoothness", "setFreq", "setBPM", "setCentreFreq", "setResonance", "setCutoffFreqAndResonance", "setADLevels", "setTimes", "start", "noteOn", "noteOff", "digitalWrite", "shiftOut", "update"];

function process(code, target, rate) {
    if (!code) return null;
    var lines = code.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    var lastLine = lines[lines.length - 1];
    var isVoid = MOZZI_VOID_METHODS.some(m => lastLine.includes(m + "("));
    
    console.log("Code:", code);
    console.log("Last Line:", lastLine);
    console.log("Is Void:", isVoid);
    console.log("Target:", target);

    if (target && target !== "return" && !isVoid) {
        var expr = lastLine.replace(/^return\s+/, "").replace(/;$/, "");
        console.log("Expression extracted:", expr);
        // nodeExpressions[target] = expr; 
        
        // Mocking needsGlobal logic: assume it needs global for this test
        var needsGlobal = true; 
        var isPerfMode = true;
        var isInline = false; // Smooth is NOT inline in definition? Let's check.

        // if (isPerfMode && isInline && !needsGlobal) return null;

        lines[lines.length - 1] = target + " = " + expr + ";";
        console.log("REPLACED!");
    } else {
        console.log("NOT REPLACED because:", target ? (target==="return" ? "Target is return" : "isVoid is true") : "Target is null");
    }

    return lines.map(l => l + (l.endsWith(';') || l.endsWith('}') || l.includes('if(') ? "" : ";")).join('\n    ');
}

// Simulating the Smooth node code
var v = "Smooth_sm";
var i_smooth = "0.95";
var i_in = "node_fil_band";
var code = "if((float)" + i_smooth + " != "+v+"_last) { "+v+".setSmoothness(" + i_smooth + "); "+v+"_last="+i_smooth+"} \nreturn " + v + ".next(" + i_in + ");"; 

var res = process(code, "node_sm_out", "CONTROL");
console.log("\nRESULT:\n ", res);
