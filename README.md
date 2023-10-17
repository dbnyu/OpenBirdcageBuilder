# BirdcageBuilder2023
Douglas Brantner<sup>1</sup>, Giuseppe Carluccio<sup>1</sup>, Chih-Liang Chin<sup>2</sup>, Christopher Collins<sup>1</sup>  
<sup>1</sup>NYU Langone Health [CAI2R](https://cai2r.net) + CBI  
<sup>2</sup>Merck

18 October 2023  
Version 0.0.7 BETA WIP


## Intro/Background
Estimates the capacitor value for building cylindrical [Birdcage Coils](https://mriquestions.com/birdcage-coil.html).  
Updated version of Birdcage Builder Android app, to run in any web browser, on any device (desktop or mobile).

### Prior Versions
- This new JavaScript version (2023) is based largely on the Java codebase from the Android version, available here:
  - [Birdcage Builder Mobile](https://cai2r.net/resources/birdcagebuilder-mobile/) (for Android)
- The original version was written in Visual Basic and released in 2002 for Windows
  - See Chin, Collins, et al. 2002 referenced below

### Caveats/Limitations
- Does not take into account high frequency effects (Biot-Savart only)
- Does not consider capacitive coupling (only mutual inductance)
- WIP to be continued...

## Usage

### Webapp Usage
- Enter all required values (including any necessary optional values for bandpass predefined caps or tubular leg dimensions)
- For "No Shield" enter zero for the shield radius
- Click "Calculate!"

### Code API
Custom usage/code extendability etc.
- WIP
- See freqshifttest.html
- Customize # of legs etc. (basic html editing)

## Citation
If you use this webapp or our code, please cite:  
Chin CL, Collins CM, Li S, Dardzinski BJ, Smith MB. BirdcageBuilder: Design of specified-geometry birdcage coils with desired current pattern and resonant frequency. Concepts Magn Reson. 2002;15(2):156-163. doi:10.1002/cmr.10030


### Unit Tests
- WIP
- [QUnit.js](https://qunitjs.com) in-browser unit testing framework
- Testing against 2002 paper results and Android app values (run on Android and desktop Java)

## License
TODO

## References
1. Chin CL, Collins CM, Li S, Dardzinski BJ, Smith MB. BirdcageBuilder: Design of specified-geometry birdcage coils with desired current pattern and resonant frequency. Concepts Magn Reson. 2002;15(2):156-163. doi:10.1002/cmr.10030

### Other References
- https://en.wikipedia.org/wiki/Method_of_images
- https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design#the_viewport_meta_tag
