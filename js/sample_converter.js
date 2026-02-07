// Mozzi Audio Converter Utility
// Handles reading audio files, resampling to Mozzi rate (16384Hz), and converting to int8_t tables.

var MozziSampleConverter = {
    
    // Config
    targetRate: 16384,

    processFile: function(file, callback) {
        var reader = new FileReader();
        var context = new (window.AudioContext || window.webkitAudioContext)();

        reader.onload = function(e) {
            context.decodeAudioData(e.target.result, function(buffer) {
                MozziSampleConverter.resampleAndFormat(buffer, callback);
            }, function(e) {
                console.error("Error decoding audio data", e);
                if(callback) callback(null, "Error decoding audio file.");
            });
        };
        reader.readAsArrayBuffer(file);
    },

    resampleAndFormat: function(sourceBuffer, callback) {
        // We use OfflineAudioContext to resample
        var offlineCtx = new OfflineAudioContext(1, sourceBuffer.duration * MozziSampleConverter.targetRate, MozziSampleConverter.targetRate);
        var source = offlineCtx.createBufferSource();
        source.buffer = sourceBuffer;
        source.connect(offlineCtx.destination);
        source.start(0);

        offlineCtx.startRendering().then(function(resampledBuffer) {
            var rawData = resampledBuffer.getChannelData(0); // Get Mono
            var int8Data = [];
            var hexData = "";
            var tableBody = "";
            
            // Convert Float32 (-1.0 to 1.0) to Int8 (-128 to 127)
            for (var i = 0; i < rawData.length; i++) {
                // Clamp and scale
                var s = Math.max(-1, Math.min(1, rawData[i]));
                var val = Math.floor(s * 127);
                int8Data.push(val);
                
                tableBody += val + ",";
                if ((i + 1) % 20 === 0) tableBody += "\n";
            }

            // Remove trailing comma
            if (tableBody.endsWith(",")) tableBody = tableBody.slice(0, -1);
            if (tableBody.endsWith(",\n")) tableBody = tableBody.slice(0, -2);

            var sizeBytes = int8Data.length;
            var sizeInfo = (sizeBytes / 1024).toFixed(2) + " KB (" + sizeBytes + " bytes)";

            var result = {
                data: int8Data,
                tableString: tableBody,
                size: sizeBytes,
                info: sizeInfo
            };

            if (callback) callback(result);

        }).catch(function(err) {
            console.error("Resampling error", err);
            if(callback) callback(null, "Error resampling audio.");
        });
    },

    generateHeader: function(varName, tableData) {
        var code = "";
        code += "#include <pgmspace.h>\n";
        code += "const int8_t " + varName + "_table [] PROGMEM = {\n";
        code += tableData;
        code += "\n};\n";
        code += "#define " + varName.toUpperCase() + "_NUM_CELLS " + tableData.split(',').length + "\n";
        return code;
    }
};
