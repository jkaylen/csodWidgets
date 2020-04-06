//include-file: lxp/carousellepV2.js
//version: 2.02
var intRecordCount = 20;
strUserNumber = '';
strToken = '';

function getLXPWidget(service,div) {
  getLEPWidget(service,div);
}
function getLEPWidget(service,div) {
//getLEPWidgets(string service, string div)
// J. Kaylen 3/13/2018
// Service entries that are valid:
//   TopPicks, Position, Subjects, Popularity, Playlists (recommendedtrianing)
//   Featured, Suggested, Required (adminSelectedtraining)
//   Continue, Saved
// Div sets the div element id that should be populated with the carousel
  if(strUserNumber == '') {
    getLXPToken(service, div);
  } else {
    getLXPLOs(service, div);
  }
}
function getLXPToken(service, div) {
  strLXPURL = "/ui/lms-learner-home/home";	//Need to call LXP first to get Token and User Numeric ID. Takes about 2s
  var xhrLXP = new XMLHttpRequest();
  xhrLXP.onreadystatechange = function() {
    if (xhrLXP.readyState == 4 && xhrLXP.status == 200) {	//LXP loaded, now we pull out token and user and call the correct service
      strLXP = xhrLXP.responseText;
      strUserNumber = strLXP.substring(strLXP.indexOf('"user":')+7,strLXP.indexOf(",",strLXP.indexOf('"user"')));
      strToken = strLXP.substring(strLXP.indexOf('"token"')+9,strLXP.indexOf('",',strLXP.indexOf('"token"')));
      console.log('UserNumber ' + strUserNumber);
      console.log('Token ' + strToken);
      getLXPLOs(service, div);		//Now we are ready to call the actual service to get the LO's
    }
  };
  xhrLXP.open("POST", strLXPURL, true);
  xhrLXP.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
  xhrLXP.send();
}
function getLXPLOs(service, div) {
  //Generate URL based off of Service, record limit, and user numeric id
  if((service == 'Featured') || (service == 'Suggested') || (service == 'Required')) {
    strPageURL = "/services/api/lms/user/" + strUserNumber + "/adminSelectedtraining?type=" + service + "&sortCriteria=MostRecentModified&pageSize=" + intRecordCount + "&pageNum=1";
  } else if((service == 'Continue')) {
    strPageURL = "/services/api/lms/user/" + strUserNumber + "/transcript?isCompleted=false&isArchived=false&isRemoved=false&isStandAlone=true&sortCriteria=StatusChangeDate&pageSize=20&pageNum=1";
  } else if(service == 'Saved') {
    strPageURL = "/services/api/lms/user/" + strUserNumber + "/savedforlater?pageSize=20&pageNum=0";
  } else {
    strPageURL = "/services/api/lms/user/" + strUserNumber + "/recommendedtraining?type=" + service + "&pageSize=" + intRecordCount + "&pageNum=1";
  }
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
      buildCarousel(div, xhr.responseText, service);
    }
  };
  xhr.open("GET", strPageURL, true);
  xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
  xhr.setRequestHeader('Authorization', 'Bearer ' + strToken);
  xhr.send();
}
function buildCarousel(div, strRawData, service) {
  objTraining = JSON.parse(strRawData);
  console.log(objTraining);
  strHTML = ''
  strHTML = strHTML + '<div class="p-carouselmobile" style="width: 100%;">\n';
  strHTML = strHTML + '<div class="p-carouselmobile-container" style="height: auto;">\n';
  strHTML = strHTML + '<ul class="carousel">\n';
  if(objTraining.data.length > 5) { strLength = 5; } else {strLength=objTraining.data.length; }
  for (var i = 0; i < strLength; i++) {
  	if(objTraining.data[i].thumbnailImage.substring(0,2) == '..') {
          strThumbnail = "/LMS" + objTraining.data[i].thumbnailImage.substring(2);
    } else {
          strThumbnail = objTraining.data[i].thumbnailImage;
    }
  	strHTML = strHTML + '  <li class="p-carouselitem" style="width: 204px;">\n';
  	strHTML = strHTML + '  <div class="p-panel p-p-r-sm">\n';
  	strHTML = strHTML + '    <div>\n';
  	strHTML = strHTML + '      <div class="p-actiontile" aria-live="polite" style="height: 270px;">\n';
  	strHTML = strHTML + '        <div class="p-panel p-bg-white p-bw-sm p-bc-grey70 p-bs-solid" style="height: 100%; overflow: hidden;">\n';
  	strHTML = strHTML + '          <div>\n';
  	strHTML = strHTML + '            <div class="p-actiontile-body">\n';
  	strHTML = strHTML + '              <div class="p-panel" data-tag="p-image">\n';
  	strHTML = strHTML + '                <div>\n';
  	strHTML = strHTML + '                  <a class="p-link" href="' + objTraining.data[i].trainingDetailsUrl + '" title="' + objTraining.data[i].title + '" data-tag="p-image-link"><div class="p-panel position-center-center style-cover" style="background-image: url(\'' + strThumbnail + '\'); height: 100%; overflow: hidden;"><div></div></div></a>\n';
  	strHTML = strHTML + '                </div>\n';
  	strHTML = strHTML + '              </div>\n';
  	strHTML = strHTML + '              <div class="p-panel p-p-md" data-tag="p-course-description">\n';
  	strHTML = strHTML + '                <div>\n';
  	strHTML = strHTML + '		  <span class="p-text p-f-sz-sm p-t-meta  p-f-w-n p-t-wr-el" title="' + objTraining.data[i].trainingType + '">' + objTraining.data[i].trainingType + '</span>\n';
  	strHTML = strHTML + '                  <a class="p-link p-link-def" href="' + objTraining.data[i].trainingDetailsUrl + '" title="' + objTraining.data[i].title + '" data-tag="p-title-link"><div class="p-panel p-p-t-xs p-p-b-xs" style="min-height: 40px; overflow: hidden;"><div><div class="p-MultiLineFade p-t-default  p-f-w-b p-f-sz-lg fader-2-lines">' + objTraining.data[i].title + '<div class="fader fader-push-1-lines fader-bg-white"></div></div></div></div></a>\n';
	  if(service == 'Continue') {
		  strHTML = strHTML + '		  <span title="' + objTraining.data[i].status + '" class="p-text p-f-sz-sm p-t-meta  p-f-w-n p-t-wr-el">' + objTraining.data[i].status + '</span>\n';
	  } else {
	  	strHTML = strHTML + '		  <span title="' + objTraining.data[i].durationString + '" class="p-text p-f-sz-sm p-t-meta  p-f-w-n p-t-wr-el">' + objTraining.data[i].durationString + '</span>\n';
	  }
  	strHTML = strHTML + '                </div>\n';
  	strHTML = strHTML + '              </div>\n';
  	strHTML = strHTML + '            </div>\n';
  	strHTML = strHTML + '            <div class="p-actiontile-footer">\n';
  	strHTML = strHTML + '              <div class="p-panel p-p-t-xs p-p-r-md p-p-l-md" style="height: 100%; overflow: hidden;">\n';
  	strHTML = strHTML + '                <div>\n';
  	strHTML = strHTML + '                  <div class="p-gridlayout middle-device-none gutter-horizontal-xs-device-none">\n';
  	strHTML = strHTML + '                    <div class="p-gridcol col-auto-device-none">\n';
  	strHTML = strHTML + '                      <div class="p-button-dropdown">\n';
  	strHTML = strHTML + '                        <a id="' + objTraining.data[i].id + '" onclick="showLOMenu(this);" title="Actions" data-id="' + i + '" data-inTranscript="' + objTraining.data[i].isInUserTranscript + '" class="p-icon-three-dots"><span></span></a>\n';
  	strHTML = strHTML + '                      </div>\n';
  	strHTML = strHTML + '                    </div>\n';
  	strHTML = strHTML + '                    <div class="p-gridcol col-fill-device-none">\n';
  	if(objTraining.data[i].isInUserTranscript == true) {
  		strHTML = strHTML +'<a class="p-link p-f-sz-d p-link-def p-t-full-hv-primary50 p-f-w-6 p-t-wr-el p-bl-ib" id="PrimaryAction_' + i + '" onclick=\"processAction(this);\" title="Launch">Launch</a>';
  	} else if(("averageRating" in objTraining.data[i]) && (objTraining.data[i].averageRating != 0.0)) {
  		strHTML = strHTML + '		      <div title="' + objTraining.data[i].ratingString + '" class="p-icongauge p-f-sz-lg p-t-warning50">\n';
  		strHTML = strHTML + '			<div aria-hidden="true">\n';
  		for (var j = 1; j < 6; j++) {
  			if(objTraining.data[i].averageRating >= j) {
  				strHTML = strHTML + '			  <i class="p-icon-star"></i>\n';
  			} else {
  				strHTML = strHTML + '			  <i class="p-icon-star-empty"></i>\n';
  			}
  		}
  		strHTML = strHTML + '			</div>\n';
  		strHTML = strHTML + '		      </div>\n';
  	}
  	strHTML = strHTML + '		    </div>\n';
  	strHTML = strHTML + '                  </div>\n';
  	strHTML = strHTML + '                </div>\n';
  	strHTML = strHTML + '              </div>\n';
  	strHTML = strHTML + '            </div>\n';
  	strHTML = strHTML + '          </div>\n';
  	strHTML = strHTML + '        </div>\n';
  	strHTML = strHTML + '      </div>\n';
  	strHTML = strHTML + '    </div>\n';
  	strHTML = strHTML + '  </div>\n';
  	strHTML = strHTML + '</li>\n';
  	if(objTraining.data[i].isInUserTranscript == true) {
	  	getLOActionItems(objTraining.data[i].id, i, objTraining.data[i].isInUserTranscript);
	  }
  }
  strHTML = strHTML + '</ul>\n';
  strHTML = strHTML + '</div>\n';
  strHTML = strHTML + '</div>\n';
  strHTML = strHTML + '<div class="p-button-dropdown-list no-max-height jkHideMenu" id="LOMenu" style="display: none;"><ul role="menu" id="LOMenuItems"></ul></div>\n';
  strHTML = strHTML + '<div id="responsiveWelcomePageModal" class="lxpmodal"><div class="lxpmodal-content"><div id="lxpModalContent"><p>Processing</p></div></div></div>\n';
  document.getElementById(div).innerHTML = '';
  document.getElementById(div).innerHTML = strHTML;
  ps = new PerfectScrollbar('#' + div + ' .p-carouselmobile-container',{suppressScrollY: true});
}
function getLOActionItems(LOID, intCounterID, bolTranscript) {
	strPageURL = "/services/api/LMS/TrainingActionForUser/Actions/?isInUserTranscript=" + bolTranscript + "&trainingIds=" + LOID;
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
	    if (xhr.readyState == 4 && xhr.status == 200) {		//Service has returned, need to display results
	      //WIP: Need to actually build out the UI based off of the returned array
	      buildMenu(xhr.responseText, intCounterID);
	    }
	  };
	xhr.open("GET", strPageURL, true);
	xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
	xhr.setRequestHeader('Authorization', 'Bearer ' + strToken);
	xhr.send();
}
function buildMenu(strData, intCounterID) {
	objMenuActions = JSON.parse(strData);
	console.log(objMenuActions);
	elmMenuItems = document.getElementById('LOMenuItems');
	elmMenuItems.innerHTML = '';
	for (var i = 0; i < objMenuActions.data[0].trainingActionsForUser.length; i++) {
		if(objMenuActions.data[0].trainingActionsForUser[i].actionName != 'Add to Playlist') {
			if(objMenuActions.data[0].trainingActionsForUser[i].isPrimary == true) {
				document.getElementById("PrimaryAction_" + intCounterID).innerHTML = objMenuActions.data[0].trainingActionsForUser[i].actionName;
				document.getElementById("PrimaryAction_" + intCounterID).title = objMenuActions.data[0].trainingActionsForUser[i].actionName;
				document.getElementById("PrimaryAction_" + intCounterID).setAttribute("data-LOID", objMenuActions.data[0].id);
				document.getElementById("PrimaryAction_" + intCounterID).setAttribute("data-url", objMenuActions.data[0].trainingActionsForUser[i].actionUrl);
				document.getElementById("PrimaryAction_" + intCounterID).setAttribute("data-actionId", objMenuActions.data[0].trainingActionsForUser[i].actionId);
			}
			var elmLI = document.createElement('li');
			elmLI.innerHTML = "<button id=\"menuItem" + i + "\" data-LOID=\"" + objMenuActions.data[0].id + "\" data-url=\"" + objMenuActions.data[0].trainingActionsForUser[i].actionUrl + "\" data-actionId=\"" + objMenuActions.data[0].trainingActionsForUser[i].actionId + "\" onclick=\"processAction(this);\">" + objMenuActions.data[0].trainingActionsForUser[i].actionName + "</button>";
			elmMenuItems.appendChild(elmLI);
			document.getElementById("menuItem" + i).addEventListener("click", function(event){ event.preventDefault() });
		}
	}
}
function processAction(elm) {
	document.getElementById('responsiveWelcomePageModal').style.display = "block";
	strURL = elm.getAttribute("data-url");
	strActionId = elm.getAttribute("data-actionId");
	strLOID = elm.getAttribute("data-LOID");
	strPageURL = strURL;
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
	    if (xhr.readyState == 4 && xhr.status == 200) {
	      processActionResults(xhr.responseText);
	    }
	  };
	xhr.open("POST", strPageURL, true);
	xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
	xhr.setRequestHeader('Authorization', 'Bearer ' + strToken);
	xhr.send('{"actionId":' + strActionId + ',"trainingId":"' + strLOID + '","viewSource":2}');
}
function processActionResults(strData) {
	var objMenuResults = JSON.parse(strData);
	if(objMenuResults.data.length > 0) {
		if(objMenuResults.data[0].url) {
			var strURL = objMenuResults.data[0].url;
			strURL = strURL.substring(1);
			location.assign(strURL);
		} else {
			document.getElementById('responsiveWelcomePageModal').style.display = "none";
		}
	} else {
		document.getElementById('responsiveWelcomePageModal').style.display = "none";
	}
}
function showLOMenu(obj) {
	document.getElementById("mainContainer").removeEventListener("click", hideMenu);
	window.removeEventListener("scroll", hideMenu);
	var LOID = obj.id;
	var intCounterID = obj.getAttribute('data-id');
	var bolTranscript = obj.getAttribute('data-inTranscript');
	var rect = obj.getBoundingClientRect();
	var elmMenu = document.getElementById('LOMenu');
	document.getElementById('LOMenuItems').innerHTML = '<li><button>Loading...</button></li>';
	getLOActionItems(LOID, intCounterID, bolTranscript);
	//document.getElementById('LOMenuLaunch').onclick = function() {location.assign("/DeepLink/ProcessRedirect.aspx?module=launchtraining&lo=" + LOID); }
	//document.getElementById('LOMenuSave').onclick = function() {location.assign("/services/api/lms/user/" + strUserNumber + "/saveforlater/" + LOID); }
	elmMenu.style.display = "block";
	elmMenu.style.top = parseInt(rect.y + 25) + 'px';
	elmMenu.style.left = parseInt(rect.x + 10) + 'px';
	setTimeout(function(){ document.getElementById("mainContainer").addEventListener("click", hideMenu);
	window.addEventListener("scroll", hideMenu); }, 1000);
}
function hideMenu(e) {
	if((e.target.localName != 'li') && (e.target.localName != 'ul')) {
		document.getElementById("mainContainer").removeEventListener("click", hideMenu);
		window.removeEventListener("scroll", hideMenu);
		document.getElementById("LOMenu").style.display = "none";
	}
}
