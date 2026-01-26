const fs = require('fs');
const path = require('path');

const samples = JSON.parse(fs.readFileSync(path.join(__dirname, 'temp_samples.json'), 'utf8'));

function getSampleObj(filename) {
    const table = samples[filename].split(',').map(Number);
    return {
        sampleInfo: {
            data: table,
            tableString: samples[filename],
            size: table.length,
            info: (table.length / 1024).toFixed(2) + " KB"
        }
    };
}

const kickB64 = Buffer.from(JSON.stringify(getSampleObj('kick.wav'))).toString('base64');
const snareB64 = Buffer.from(JSON.stringify(getSampleObj('snare-m.wav'))).toString('base64');
const hatB64 = Buffer.from(JSON.stringify(getSampleObj('hihat-closed.wav'))).toString('base64');

const patch = `v2.1.1
network/add-patch dm LinnDrum_Set
patch/open dm
patch/add-node dm kick wave/mozzi_sample Mozzi Sample
patch/add-node dm snare wave/mozzi_sample Mozzi Sample
patch/add-node dm hat wave/mozzi_sample Mozzi Sample
patch/add-node dm m1 signal/mozzi_metronome Mozzi Metronome
patch/add-node dm m2 signal/mozzi_metronome Mozzi Metronome
patch/add-node dm m3 signal/mozzi_metronome Mozzi Metronome
patch/add-node dm mix1 signal/mozzi_mixer2 Mozzi Mixer 2
patch/add-node dm mix2 signal/mozzi_mixer2 Mozzi Mixer 2
patch/add-node dm out output/mozzi_out Mozzi Output
node/turn-on kick
node/turn-on snare
node/turn-on hat
node/turn-on m1
node/turn-on m2
node/turn-on m3
node/turn-on mix1
node/turn-on mix2
node/turn-on out
node/move m1 50 50
node/move m2 50 250
node/move m3 50 450
node/move kick 250 50
node/move snare 250 250
node/move hat 250 450
node/move mix1 500 150
node/move mix2 700 300
node/move out 900 300
node/set-data kick ${kickB64}
node/set-data snare ${snareB64}
node/set-data hat ${hatB64}
node/update-inlet m1 bpm 120
node/update-inlet m1 start 1
node/update-inlet m2 bpm 60
node/update-inlet m2 start 1
node/update-inlet m3 bpm 240
node/update-inlet m3 start 1
node/update-inlet kick freq 1.0
node/update-inlet snare freq 1.0
node/update-inlet hat freq 1.0
outlet/connect m1:out kick:trig
outlet/connect m2:out snare:trig
outlet/connect m3:out hat:trig
outlet/connect kick:out mix1:ch1
outlet/connect snare:out mix1:ch2
outlet/connect mix1:out mix2:ch1
outlet/connect hat:out mix2:ch2
outlet/connect mix2:out out:audio_in`;

fs.writeFileSync(path.join(__dirname, '../drum_patch.txt'), patch, 'utf8');
console.log("Generated drum_patch.txt in parent folder");
