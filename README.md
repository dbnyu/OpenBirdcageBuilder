# Open BirdcageBuilder
Open Source capacitor calculator for tuning Birdcage RF Coils.

Douglas Brantner<sup>1</sup>, Giuseppe Carluccio<sup>1</sup>, Chih-Liang Chin<sup>2</sup>, Christopher Collins<sup>1</sup>  
<sup>1</sup>NYU Langone Health [CAI2R](https://cai2r.net) + CBI  
<sup>2</sup>Merck
- [Live Webapp (Beta)](https://dbnyu.github.io/OpenBirdcageBuilder/)
  - Runs in your web browser - no app to download or install!
  - Version 0.0.8 Beta WIP, 02 November 2023 (new official repo & name change, no major functionality changes, as submitted to ISMRM 2024)
  - Version 0.0.7 Beta WIP, 18 October 2023 (first public soft release at [NYU CAI<sup>2</sup>R i2i Conference 2023](https://cai2r.net/training/i2i-workshop/))
- [Code & Documentation (Github)](https://github.com/dbnyu/OpenBirdcageBuilder)
- This is the official project repo; the previous [BirdcageBuilder2023](https://github.com/dbnyu/BirdcageBuilder2023) repo is now just a placeholder and to preserve previous issue history.
- Please check [here](https://github.com/dbnyu/BirdcageBuilder2023/issues) before submitting a new issue
- All new issues should be submitted to this repo (OpenBirdcageBuilder).
 

## Intro/Background
Estimates the capacitor value for building cylindrical [Birdcage Coils](https://mriquestions.com/birdcage-coil.html).  
Updated version of Birdcage Builder Android app, to run in any web browser, on any device (desktop or mobile).  
This is the first fully open-source, cross-platform/cross-device version of BirdcageBuilder (2023).  


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
All documentation is very much BETA WIP and very much under construction! Thank you for your patience!  
under_construction.gif

### Webapp Usage
- Enter all required values (including any necessary optional values for bandpass predefined caps or tubular leg dimensions)
- If a larger number of legs is needed, it is a simple exercise in HTML hacking to achieve any number of legs (must be a multiple of 4)
- For "No Shield" enter zero for the shield radius
- For solid wire Legs or End Rings, select "Tubular" and set the Inner Diameter to 0.
- Click "Calculate!"

### Code API
Custom usage/code extendability etc.
- WIP
- See freqshifttest.html
- Customize # of legs etc. (basic html editing)

## Citation
If you use this webapp or our code, please cite:  
Chin CL, Collins CM, Li S, Dardzinski BJ, Smith MB. BirdcageBuilder: Design of specified-geometry birdcage coils with desired current pattern and resonant frequency. Concepts Magn Reson. 2002;15(2):156-163. doi:10.1002/cmr.10030  
[PubMed Free Full Text](https://pubmed.ncbi.nlm.nih.gov/23316109/)


### Unit Tests
- WIP
- [QUnit.js](https://qunitjs.com) in-browser unit testing framework
- Testing against 2002 paper results and Android app values (run on Android and desktop Java)

## License
[GNU AGPL 3.0](https://www.gnu.org/licenses/agpl-3.0.en.html)

## References
1. Chin CL, Collins CM, Li S, Dardzinski BJ, Smith MB. BirdcageBuilder: Design of specified-geometry birdcage coils with desired current pattern and resonant frequency. Concepts Magn Reson. 2002;15(2):156-163. doi:10.1002/cmr.10030  
[PubMed Free Full Text](https://pubmed.ncbi.nlm.nih.gov/23316109/)

### Other References
- https://en.wikipedia.org/wiki/Method_of_images
- https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design#the_viewport_meta_tag


---
All NYU, CBI, CAI2R names & logos are trademarks of NYU and may not be used without written permission.
