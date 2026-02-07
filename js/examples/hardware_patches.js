// MozziFlow Examples - HARDWARE CATEGORY (v7.5 Modern Architecture)
EXAMPLES['hw_ch32_pt8211'] = {
    category: "HARDWARE", title: "CH32 + PT8211 (SPI)",
    description: "Pro setup: External 16-bit Stereo DAC via SPI on CH32X035.",
    code: `v2.1.1
network/add-patch root root
patch/open root
patch/add-node root o1 mozziflow/sin Sine
node/move o1 100 100
node/set-data o1 eyJjZmdfZnJlcSI6IjQ0MC4wZiIsImNmZ19mcmVxX21vZGUiOiJmbG9hdCJ9
patch/add-node root out mozziflow/out Audio%20Out
node/move out 400 100
node/set-data out eyJjZmdfYXJjaCI6ImNoMzJ4MDM1IiwiY2ZnX21vZGUiOiJFWFRFUk5BTF9QVDgyMTFfU1BJIiwiY2ZnX2NoYW5uZWxzIjoiTU9aWklfTU9OTyIsImNmZ19waW5fd3MiOiI1IiwiY2ZnX3JlcyI6IjhiaXQifQ==
outlet/connect o1:out out:in`
};

EXAMPLES['hw_esp32_dac'] = {
    category: "HARDWARE", title: "ESP32 Internal DAC",
    description: "Configures ESP32 to use its native 8-bit DAC on GPIO 25/26.",
    code: `v2.1.1
network/add-patch root root
patch/open root
patch/add-node root o1 mozziflow/sin Sine
node/move o1 100 100
node/set-data o1 eyJjZmdfZnJlcSI6IjQ0MC4wZiIsImNmZ19mcmVxX21vZGUiOiJmbG9hdCJ9
patch/add-node root out mozziflow/out Audio%20Out
node/move out 400 100
node/set-data out eyJjZmdfYXJjaCI6ImVzcDMyIiwiY2ZnX21vZGUiOiJNT1paSV9PVVRQVVRfSU5URVJOQUxfREFDIiwiY2ZnX2NoYW5uZWxzIjoiTU9aWklfTU9OTyIsImNmZ19yZXMiOiI4Yml0In0=
outlet/connect o1:out out:in`
};