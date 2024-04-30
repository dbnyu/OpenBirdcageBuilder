# Open BirdcageBuilder
Open Source capacitor calculator for tuning Birdcage RF Coils.

Douglas Brantner<sup>1</sup>, Giuseppe Carluccio<sup>1</sup>, Chih-Liang Chin<sup>2</sup>, Christopher Collins<sup>1</sup>  
<sup>1</sup>NYU Langone Health [CAI2R](https://cai2r.net/resources/open-birdcagebuilder/) + CBI  
<sup>2</sup>Merck
- Try it now! [Live Webapp](https://dbnyu.github.io/OpenBirdcageBuilder/)
  - Runs in your web browser - no app to download or install!

- [Code & Documentation (Github)](https://github.com/dbnyu/OpenBirdcageBuilder) (this page)
- [NYU CAI2R Page](https://cai2r.net/resources/open-birdcagebuilder/)
- Listed on [Open Source Imaging](https://www.opensourceimaging.org/project/open-birdcagebuilder/)
- This is the official project repo; the previous [BirdcageBuilder2023](https://github.com/dbnyu/BirdcageBuilder2023) repo is now just a placeholder and to preserve previous issue history.
  - Please check [here](https://github.com/dbnyu/BirdcageBuilder2023/issues) before submitting a new issue
- All new issues should be submitted to this repo (OpenBirdcageBuilder).
 

## Intro/Background
Estimates the capacitor value for building cylindrical [Birdcage Coils](https://mriquestions.com/birdcage-coil.html).  
Updated version of Birdcage Builder Android app, to run in any web browser, on any device (desktop or mobile).  
This is the first fully open-source, cross-platform/cross-device version of BirdcageBuilder, released in 2023.

### Version Notes
- Version 1.0.0, 29 April 2024 - Updated for ISMRM 2024, minor clean ups, fixed unit tests- All Tests Passing.
- Version 0.0.8 Beta WIP, 02 November 2023 (new official repo & name change, no major functionality changes, as submitted to ISMRM 2024)
- Version 0.0.7 Beta WIP, 18 October 2023 (first public soft release at [NYU CAI<sup>2</sup>R i2i Conference 2023](https://cai2r.net/training/i2i-workshop/))


### Prior Versions
- This new JavaScript version (2023) is based largely on the Java codebase from the Android version, available here:
  - [Birdcage Builder Mobile](https://cai2r.net/resources/birdcagebuilder-mobile/) (for Android, 2013)
- The original version was written in Visual Basic and released in 2002 for Windows
  - See Chin, Collins, et al. 2002 referenced below

### Caveats/Limitations
- First pass capacitor prediction only
- Does not take into account high frequency effects (Biot-Savart only)
- Does not consider capacitive coupling (only mutual inductance)
- Currently only for cylindrical birdcage coils

## Usage

### Webapp Usage
- Enter all required values (including any necessary optional values for bandpass predefined capacitors or tubular leg dimensions)
- For "No Shield" enter zero for the shield radius
- For solid wire Legs or End Rings, select "Tubular" and set the Inner Diameter to 0.
- If a larger number of legs is needed, it is a simple exercise in HTML hacking to achieve any number of legs (must be a multiple of 4)
- Input errors will be highlighted in red.
- Click "Calculate!"

## Code Documentation

See ```freqshifttest.html``` for a simple commented example of how the code works.
- This also demonstrates code extendability and plotting with [Plotly.js](https://plotly.com/javascript/)

### Main Files
- ```index.html``` - Main GUI for webapp
  - ```BBGuiHandler.js``` - Handles all input/output & main functionality for ```index.html``` interactive webapp
  - Try it live here: [Live Webapp](https://dbnyu.github.io/OpenBirdcageBuilder/)
- ```BirdcageBuilder.js``` - Main class for capacitor math - see ```calc_capacitor()``` function
- ```BCLegs.js``` - Class for Birdcage Legs, self- and mutual inductance
- ```BCEndRings.js``` - Class for Birdcage End Rings, self- and mutual inductance
- Other files:
  - ```helpers.js``` - Math & unit conversion helper functions.
  - ```debug.js``` - Handles debug output to browser console and/or HTML DOM.

#### Future Possibilities include:
- Prediction of all resonances of a given coil design
- Design of non-cylindrical birdcage coils
- 3D CAD model output

### Unit Tests
Testing against 2002 paper results (1) and Android app values (run both on Android and desktop Java)
- Unit Tests require the [QUnit.js](https://qunitjs.com) in-browser testing framework

#### Unit Test Setup
Set up your working folder to match this folder structure, so that you won't have to adjust the import paths for the QUnit files (alternatively, you can use the CDN links without downloading QUnit; but please do not commit any path changes here).
```
   <parent folder>
   │
   ├── OpenBirdcageBuilder    (this repo)
   │   │
   │   └── OpenBirdcageBuilder
   │       ├── BBGuiHandler.js
   │       ├── BCEndRings.js
   │       ├── BCLegs.js
   │       ├── BirdcageBuilder.js
   │       ├── helpers.js
   │       ├── index.html
   │       ├── qunit_full_dom_tests.js
   │       ├── qunit_overview.html
   │       ├── qunit_test_all_math.html
   │       ├── qunit_test_endrings.html
   │       ├── qunit_test_helpers.html
   │       ├── qunit_test_legs.html
   │       ├── README.md
   │       └── ...
   │
   ├── qunit-2.19.4
   │   │
   │   ├── qunit-2.19.4.css
   │   ├── qunit-2.19.4.js
   │   └── ...
   │
   ├── qunit-assert-close-git
   │   │
   │   └── qunit-assert-close
   │       │
   │       ├── qunit-assert-close.js
   │       └── ...
   │
   └── qunit-composite    (optional - WIP)
       │
       └── qunit-composite
           │
           ├── qunit-composite.css
           ├── qunit-composite.js
           └── ...
```
See the ```qunit_...[.]html``` files for the current version of QUnit we are testing against, and file path structure.

1. Clone this repository onto your local machine, following the above folder structure.
2. Create additional folders (see file tree above) for QUnit files and clone these repositories:
    - [QUnit.js](https://github.com/qunitjs/qunit)
    - [QUnit Assert-Close Plugin](https://github.com/JamesMGreene/qunit-assert-close) for floating-point approximate tests
    - (Optional - WIP) [QUnit Composite](https://github.com/JamesMGreene/qunit-composite)
3. The unit tests should now run if the file paths are correct. 
    - ```qunit_overview.html``` simply links to each of the 4 main unit test files
4. Click and run each test page to ensure all tests are passing.
    - ```qunit_test_all_math.html``` - Validate output values
    - ```qunit_test_endrings.html``` - Test EndRing class
    - ```qunit_test_helpers.html``` - Test helper functions
    - ```qunit_test_legs.html``` - Test Leg class
- (Automated testing - see ```_qunit_composite_wip.html``` - WIP, not working yet)

See [In-Browser QUnit Documentation](https://qunitjs.com/intro/#in-the-browser) for more details.


## Citation
In work utilizing this webapp or associated source code, please cite:  
Chin CL, Collins CM, Li S, Dardzinski BJ, Smith MB. BirdcageBuilder: Design of specified-geometry birdcage coils with desired current pattern and resonant frequency. Concepts Magn Reson. 2002;15(2):156-163. doi:10.1002/cmr.10030  
[PubMed Free Full Text](https://pubmed.ncbi.nlm.nih.gov/23316109/)



## License
[GNU AGPL 3.0](https://www.gnu.org/licenses/agpl-3.0.en.html)

## References
1. Chin CL, Collins CM, Li S, Dardzinski BJ, Smith MB. BirdcageBuilder: Design of specified-geometry birdcage coils with desired current pattern and resonant frequency. Concepts Magn Reson. 2002;15(2):156-163. doi:10.1002/cmr.10030  
[PubMed Free Full Text](https://pubmed.ncbi.nlm.nih.gov/23316109/)
2. Brantner D, Carluccio G, Collins CM. Open BirdcageBuilder. ISMRM 2024. Poster #1569.

### Other References
- https://en.wikipedia.org/wiki/Method_of_images
- https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design#the_viewport_meta_tag
- https://www.smashingmagazine.com/2012/06/introduction-to-javascript-unit-testing/

---
All NYU, CBI, CAI2R names & logos are trademarks of NYU and may not be used without written permission.
