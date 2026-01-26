
#include <Mozzi.h>
#include <Oscil.h>
#include <tables/sin2048_int8.h>
#include <tables/saw2048_int8.h>
#include <WaveFolder.h>


volatile int mozzisin_s1_out = 0;
volatile int mozzisaw_l2_out = 0;
volatile int mozzimap_map_out = 0;
volatile int mozziwavefolder_folder_out = 0;
Oscil<SIN2048_NUM_CELLS, AUDIO_RATE> mozzisin_s1(SIN2048_DATA);
Oscil<SAW2048_NUM_CELLS, AUDIO_RATE> mozzisaw_l2(SAW2048_DATA);
WaveFolder<int> mozziwavefolder_folder;

void setup() {
	startMozzi(CONTROL_RATE);
}

void updateControl() {
	mozzisin_s1.setFreq((float)440);
	mozzisaw_l2.setFreq((float)0.2);
	mozziwavefolder_folder.setLimits((int)-128, (int)127);
}

AudioOutput updateAudio() {
	mozzisin_s1_out = mozzisin_s1.next();
	mozzisaw_l2_out = mozzisaw_l2.next();
	mozzimap_map_out = map((int)mozzisaw_l2_out, (int)-128, (int)127, (int)15, (int)120);
	mozziwavefolder_folder_out = mozziwavefolder_folder.next((int)mozzisin_s1_out);
	return MonoOutput::from8Bit((int)mozziwavefolder_folder_out);
}

void loop() {
	audioHook();
}
