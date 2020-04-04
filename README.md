# CSOD: Welcome Page Builder Widget & Design Includes
This project contains all of the Includes a Cornerstone Partner would need to host to support designs and widgets from the Welcome Page Builder Tool. Not all designs/widgets will use every Include.

NOTE: These files are provided **without warranty**. I will make my best effort to keep them up to date and run test scripts against staging to alert me of any breaks related to Releases & Updates. Fixes will be pushed to this github project. However, it will ultimately be the Partner's responsibility to keep the code updated for any designs they offer clients.

## JavaScript Includes
The majority of Includes are CSS files and unlikely to be impacted by any Updates or Releases. There are several JavaScript Includes, which have been stable, but could break with an Update or Release.
- lxp/carousellepV3.js: LxP Widget
- skillsmatrix/skillsmatrixResponsive.js: Skills Matrix Widget
- checks-Ins/Check-Ins.js: Check-Ins/Conversations Widget
- searchBar.js: LxP Searchbar Widget

## Minor Updates
All updates to CSS files and JavaScript files will be compatible with any existing HTML Code generated by the Welcome Page Builder Tool Designs and Widgets. If an Include file retains the same name, it will work with existing Designs and you can safely update your copy of the Include without impacting your client's designs.

## Major Updates
New Include files (for example, if we were to add *lxp/carousellepV3.js*) can be added to your server, however will not generally be backwards compatible with existing designs that reference the prior major version (ie: *lxp/carousellepV2.js*). You will want to retain both files, to support existing designs and support new designs.
