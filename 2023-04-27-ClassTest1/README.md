# BirdcageBuilderJS
Douglas Brantner<sup>1</sup>, Giuseppe Carluccio<sup>1</sup>, Chih-Liang Chin<sup>2</sup>, Christopher Collins<sup>1</sup>  
<sup>1</sup>NYU Langone Health [CAI2R](https://cai2r.net) + CBI  
<sup>2</sup>??? TODO

TODO date  
TODO version


## Intro/Background
Estimates the capacitor value for building cylindrical [Birdcage Coils](https://mriquestions.com/birdcage-coil.html).  
Updated version of Birdcage Builder Android app, to run in any web browser, on any device (desktop or mobile).

### Prior Versions
- This new JavaScript version (2023) is based largely on the Java codebase from the Android version, available here:
  - [Birdcage Builder Mobile](https://cai2r.net/resources/birdcagebuilder-mobile/) (for Android)
- The original version was written in Visual Basic and released in 2002 for Windows
  - See Chin, Collins, et al. 2002 referenced below

### Caveats/Limitations
- TODO
- Does not take into account high frequency effects (Biot-Savart only)
  -   wavelength effects
-   Does not consider capacitive coupling (only mutual inductance)

## Usage

### Webapp Usage
- TODO

### Code API
Custom usage/code extendability etc.
- TODO
- freqshifttest.html
- customize # of legs etc. (basic html editing)

## Citation
If you use this webapp or our code, please cite:  
Chin CL, Collins CM, Li S, Dardzinski BJ, Smith MB. BirdcageBuilder: Design of specified-geometry birdcage coils with desired current pattern and resonant frequency. Concepts Magn Reson. 2002;15(2):156-163. doi:10.1002/cmr.10030

## DEVELOPMENT
A lot of this can probably get merged into "Usage" as time goes on...
- Code adapted from "BBuilder New Freq - android v2" folder of Android/Java app
- Tested against Java "desktop" version with minor edits from above
- Also tested against 2022 paper results and Android app results (with limited/adjusted fixed frequencies as necessary)

### Current Main file: 
- [responsiveTest03.html](responsiveTest03.html)
- Documentation: [README.md](README.md) (this file)

### Backend Heavy Lifting:
- [BBGuiHandler.js](BBGuiHandler.js) Main program flow & GUI input parsing
  - This sets up all the following objects, in the necessary order, an is the main execution of the program
  - Also parses all of the GUI user inputs 
  - AND DOES ALL UNIT CONVERSIONS FOR INPUT -> CALCULATION -> RESULTS DISPLAY
- [BirdcageBuilder.js](BirdcageBuilder.js) is the main Birdcage object/class, 
  - but is mostly just a container for global variables (coil settings) and the Leg/Endring objects
  - also does the main capacitor calculation `calculate()`
- [BCLegs.js](BCLegs.js) class containing all details of legs & inductance calculations
- [BCEndRings.js](BCEndRings.js) same, for endrings

These "pure code" files (BirdcageBuilder.js, BCLegs.js, BCEndRings.js) should be able to be used on their own for custom calculations (see "Code API" and extendability above)
- Using the control flow from BBGuiHandler.js as an example
  - UNITS must be handled correctly by the user/caller
- See also [freqshifttest.html](freqshifttest.html) for an example of a different use case extending this code
- TODO - CAD geometry creation & export to other simulation software?

### Planning/Releasing/TODOs
- TODO - License
- TODO - Documentation
- TODO - probably copy *only* the relevant files to a new repo before making anything public
  - May also be able to squash/rebase the git logs, or just start fresh with a new repo...
- TODO - web page/links & usage tracking
  - Ideally this would be as non-invasive as possible (no google, etc. tracking; in-house if possible)
  - Possible to ping a counter when 'Calculate' button is pressed?
  - How to organize the web pages/which is the main page?
    - CAI2R website could host the live HTML webapp & link to Github for the code - people can use it directly from there (?)
    - Github has the full open source code & detailed documentation (README.md - this file)
    - Add a page on Open Source Imaging pointing to both/either (maybe only to the CAI2R page, and you can find the code from there)
    - The webapp itself can link to any or all of these pages
    - All pages should mention license & citation
    - If license doesn't already have it, an "as-is/no liability/no warranty" clause

### Unit Tests
- TODO - WIP
- [QUnit.js](https://qunitjs.com) in-browser unit testing framework
- Aiming for within 5% of 2022 paper results
- Math (self, mutual inductances & capacitor values) tested against Android App, Java adaptation, and paper results

## License
TODO

Also TODO - Disclaimer/no warranty/as-is etc.

## References
1. Chin CL, Collins CM, Li S, Dardzinski BJ, Smith MB. BirdcageBuilder: Design of specified-geometry birdcage coils with desired current pattern and resonant frequency. Concepts Magn Reson. 2002;15(2):156-163. doi:10.1002/cmr.10030

### Other References
- https://en.wikipedia.org/wiki/Method_of_images
- https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design#the_viewport_meta_tag
