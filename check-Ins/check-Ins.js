//include-file: check-Ins/check-Ins.js
//version: 1.03
if (typeof intCheckInsLimit == 'undefined') {
	var intCheckInsLimit = 5;
}
strUserNumber = '';
strToken = '';
strCultureName = '';
strGetStarted = '';
strCloud = '';
strCorp = '';
objFrequency = {};
strConversationsJSURL = '';	//Added 9/10/2019 as a fall back for the localizations/ui call.
var div = '';
function getConversationsWidget(mydiv) {
//getConversationsWidget(string div)
// J. Kaylen 6/27/2019
// Div sets the div element id that should be populated with the carousel
	div = mydiv;
	elmParentDiv = document.getElementById(div);
	var tmpDiv = document.createElement("div");
  	tmpDiv.className = "landing-page__button-container";
	var tmpButton = document.createElement("button");
	tmpButton.className = "css-1x5m317";
	tmpButton.type = "button";
	tmpButton.innerHTML = 'Launch Check-Ins';
	tmpButton.onclick = function() { window.location = '/ui/perf-check-ins/Check-Ins' };
	tmpDiv.appendChild(tmpButton);
	elmParentDiv.appendChild(tmpDiv);
	if(strUserNumber == '') {
		getCheckInsToken();
	} else {
		getCheckInsDefaults();
	}
}

function getCheckInsWidget(mydiv) {
//getCheckInsWidget(string div)
// J. Kaylen 2/12/2020
// Duplicate of above due to the name change
	div = mydiv;
	elmParentDiv = document.getElementById(div);
	var tmpDiv = document.createElement("div");
  	tmpDiv.className = "landing-page__button-container";
	var tmpButton = document.createElement("button");
	tmpButton.className = "css-1x5m317";
	tmpButton.type = "button";
	tmpButton.innerHTML = 'Launch Check-Ins';
	tmpButton.onclick = function() { window.location = '/ui/perf-check-ins/Check-Ins' };
	tmpDiv.appendChild(tmpButton);
	elmParentDiv.appendChild(tmpDiv);
	if(strUserNumber == '') {
		getCheckInsToken();
	} else {
		getCheckInsDefaults();
	}
}

function getCheckInsDefaults() {
	var strConvoURL = "/services/x/localization/v1/localizations/ui?groups=GoalPanel,DevPlanPanel,CheckIns&culture=" + strCultureName;	
	var xhrConvo = new XMLHttpRequest();
	xhrConvo.onreadystatechange = function() {
	if (xhrConvo.readyState == 4 && xhrConvo.status == 200) {	//LEP loaded, now we pull out token and user and call the correct service
	try {
		objResponse = JSON.parse(xhrConvo.responseText);
		strGetStarted = objResponse.data["Perf.Check-Ins.LandingPage.getStartedButtonLabel"];
		objFrequency['Weekly'] = objResponse.data["Perf.Check-Ins.conversationFequencyWeekly"];
		objFrequency['Biweekly'] = objResponse.data["Perf.Check-Ins.conversationFequencyBiweekly"];
		objFrequency['Monthly'] = objResponse.data["Perf.Check-Ins.conversationFequencyMonthly"];
		objFrequency['Quarterly'] = objResponse.data["Perf.Check-Ins.conversationFequencyQuarterly"];
		objFrequency['AsNeeded'] = objResponse.data["Perf.Check-Ins.conversationFequencyAsNeeded"];
		console.log(objFrequency);
		getCheckInsItems();
	}
	catch(err) {
		getConversationsJS();
	}
    }
  };
  xhrConvo.open("GET", strConvoURL);
  xhrConvo.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
  xhrConvo.setRequestHeader('Authorization', 'Bearer ' + strToken);
  xhrConvo.send();
}

function getConversationsJS() {
  strPageURL = strConversationsJSURL;
  var xhrJS = new XMLHttpRequest();
  xhrJS.onreadystatechange = function() {
    if (xhrJS.readyState == 4 && xhrJS.status == 200) {
	strConversations = xhrJS.responseText;
	var myRegexp = /firstTimeUser.getStartedButtonLabel\"\,\"([\w\W]{1,50})\"\)/g;
	var match = myRegexp.exec(strConversations);
	console.log(match[1]);
	strGetStarted = match[1];
	
	var myRegexp = /Conversations.conversationFequencyWeekly\"\,\"([\w\W]{1,50})\"\)/g;
	var match = myRegexp.exec(strConversations);
	objFrequency['Weekly'] = match[1];
	
	var myRegexp = /Conversations.conversationFequencyBiweekly\"\,\"([\w\W]{1,50})\"\)/g;
	var match = myRegexp.exec(strConversations);
      objFrequency['Biweekly'] = match[1];
      
      var myRegexp = /Conversations.conversationFequencyMonthly\"\,\"([\w\W]{1,50})\"\)/g;
	var match = myRegexp.exec(strConversations);
      objFrequency['Monthly'] = match[1];
      
      var myRegexp = /Conversations.conversationFequencyQuarterly\"\,\"([\w\W]{1,50})\"\)/g;
	var match = myRegexp.exec(strConversations);
      objFrequency['Quarterly'] = match[1];
      
      var myRegexp = /Conversations.conversationFequencyAsNeeded\"\,\"([\w\W]{1,50})\"\)/g;
	var match = myRegexp.exec(strConversations);
      objFrequency['AsNeeded'] = match[1];
      
      console.log(objFrequency);
      console.log(div);
      getCheckInsItems();
    }
  };
  xhrJS.open("GET", strPageURL, true);
  xhrJS.send();
}

function getCheckInsToken() {
  var strConvoURL = "/ui/perf-check-ins/Check-Ins";	//Need to call Convo first to get Token and User Numeric ID. Takes about 2s
  var xhrConvo = new XMLHttpRequest();
  xhrConvo.onreadystatechange = function() {
    if (xhrConvo.readyState == 4 && xhrConvo.status == 200) {	//Convo loaded, now we pull out token and user and call the correct service
      strConvo = xhrConvo.responseText;
      strUserNumber = strConvo.substring(strConvo.indexOf('"user":')+7,strConvo.indexOf(",",strConvo.indexOf('"user"')));
      strToken = strConvo.substring(strConvo.indexOf('"token"')+9,strConvo.indexOf('",',strConvo.indexOf('"token"')));
      strCloud = strConvo.substring(strConvo.indexOf('"cloud"')+9,strConvo.indexOf('",',strConvo.indexOf('"cloud"')));
      strCorp = strConvo.substring(strConvo.indexOf('"corp"')+8,strConvo.indexOf('",',strConvo.indexOf('"corp"')));
	console.log(strCorp);
	strCultureName = strConvo.substring(strConvo.indexOf('"cultureName"')+15,strConvo.indexOf('",',strConvo.indexOf('"cultureName"')));
	var myRegexp = /src=\"([\w\W]{1,250}Conversations.js)\"/g;
	var match = myRegexp.exec(strConvo);
	if(match.length > 0) {
		console.log(match[1]);
	      strConversationsJSURL = match[1];
	} else {
		strConversationsJSURL = '';
	}
      getCheckInsDefaults();
      getCheckInsItems();		//Now we are ready to call the actual service to get the LO's
    }
  };
  xhrConvo.open("POST", strConvoURL, true);
  xhrConvo.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
  xhrConvo.send();
}

function getCheckInsItems(strPageURL) {
	strPageURL = strPageURL || 'perf-conversations-api/v1/conversations';
  strPageURL = strCloud + "perf-conversations-api/v1/conversations";
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
      console.log(JSON.parse(xhr.responseText));
      buildConversationsList(xhr.responseText);
    } else if (xhr.readyState == 4 && xhr.status == 404) {
    	getCheckInsItems('perf-check-ins-api/v1/conversations');
    }
  };
  xhr.open("GET", strPageURL, true);
  xhr.setRequestHeader('Accept', 'application/json; q=1.0, text/*; q=0.8, */*; q=0.1');
  xhr.setRequestHeader('Cache-Control', 'no-cache');
  xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
  xhr.setRequestHeader('Authorization', 'Bearer ' + strToken);
  xhr.send();
}

function buildConversationsList(strRawData) {
	var monthNames = ["Jan", "Feb", "Mar", "April", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
  objConversations = JSON.parse(strRawData);
  elmParentDiv = document.getElementById(div);
  elmParentDiv.innerHTML = '';
  if(objConversations.length > 0) {
  	 if(objConversations.length > 20) { strLength = 20; } else {strLength=objConversations.length; }
  	 objConversations.sort(function(a, b) {
		a = new Date(a.lastMeetingDate);
		b = new Date(b.lastMeetingDate);
		return a-b;
	 });
  	 strDisplayed = 0;
	 for (var i = 0; i < strLength; i++) {
	 	if(objConversations[i].isArchived == true) {
	 		continue;
	 	}
	 	for (var j = 0; j < objConversations[i].participants.length; j++) {
	 		if(objConversations[i].participants[j].id != strUserNumber) { intParticipant = j; }
	 	}
	 	var tmpParentDiv = document.createElement("div");
	 	tmpParentDiv.setAttribute('data-tag','recent-conversation-row-id-' + objConversations[i].id);
	 	tmpParentDiv.setAttribute('data-id',objConversations[i].id);
	 	tmpParentDiv.onclick = function() { window.location = '/ui/perf-check-ins/Check-Ins/view/' + this.getAttribute('data-id') };
	 	tmpDiv = document.createElement("div");
	 	tmpDiv.className = 'divider';
	 	tmpParentDiv.appendChild(tmpDiv);
	 	tmpDiv = document.createElement("div");
	 	tmpDiv.className = 'recent-conversations-row';
	 	tmpDivAvatar = document.createElement("div");
	 	tmpDivAvatar.className = 'recent-conversations-row__avatar';
	 	if(objConversations[i].participants[intParticipant].pictureUrl != '') {
	 		tmpDivAvatarSub = document.createElement("div");
	 		tmpDivAvatarSub.className = 'css-c8f728';
	 		tmpDivAvatarSub.style.backgroundImage = "url('/clientimg/" + strCorp + "/users/photos/100/" + objConversations[i].participants[intParticipant].pictureUrl +"')";
	 	} else {
	 		tmpDivAvatarSub = document.createElement("div");
	 		tmpDivAvatarSub.className = 'css-c8f728';
	 		tmpDivAvatarSub.innerHTML = objConversations[i].participants[intParticipant].firstName.substring(0,1) + objConversations[i].participants[intParticipant].lastName.substring(0,1);
	 	}
	 	tmpDivAvatar.appendChild(tmpDivAvatarSub);
	 	tmpDiv.appendChild(tmpDivAvatar);
	 	tmpDivMiddle = document.createElement("div");
	 	tmpDivMiddle.className = 'recent-conversations-row__middle-container';
	 	tmpDivMiddleSub = document.createElement("div");
	 	tmpDivMiddleSub.className = 'recent-conversations-row__name';
	 	tmpDivMiddleSub.innerHTML = objConversations[i].participants[intParticipant].firstName + ' ' + objConversations[i].participants[intParticipant].lastName;
	 	tmpDivMiddle.appendChild(tmpDivMiddleSub);
	 	tmpDivMiddleSub = document.createElement("div");
	 	tmpDivMiddleSub.className = 'recent-conversations-row__conversation-name';
	 	tmpDivMiddleSub.innerHTML = objConversations[i].title;
	 	tmpDivMiddle.appendChild(tmpDivMiddleSub);
	 	tmpDivMiddleSub = document.createElement("div");
	 	tmpDivMiddleSub.className = 'recent-conversations-row__conversation-frequency';
	 	tmpDivMiddleSubSub = document.createElement("div");
	 	tmpDivMiddleSubSub.className = "frequency-chip frequency-chip--grey";
	 	tmpDivMiddleSubSub.innerHTML = objFrequency[objConversations[i].frequency];
	 	tmpDivMiddleSub.appendChild(tmpDivMiddleSubSub);
	 	tmpDivMiddle.appendChild(tmpDivMiddleSub);
	 	tmpDiv.appendChild(tmpDivMiddle);
	 	tmpDivDate = document.createElement("div");
	 	tmpDivDate.className = "recent-conversations-row__conversation-date";
	 	var strDateOrig = objConversations[i].lastMeetingDate;
	 	var dateLastMeeting = new Date(strDateOrig)
	 	tmpDivDate.innerHTML = monthNames[dateLastMeeting.getMonth()] + ' ' + pad(dateLastMeeting.getDate());
	 	tmpDiv.appendChild(tmpDivDate);
	 	tmpParentDiv.appendChild(tmpDiv);
	 	elmParentDiv.appendChild(tmpParentDiv);
	 	strDisplayed++;
	 	if(strDisplayed >= intCheckInsLimit) {
	 		break;
	 	}
	 }
	 if(strDisplayed == 0) {
	 	var tmpDiv = document.createElement("div");
  		tmpDiv.className = "landing-page__button-container";
	  	var tmpButton = document.createElement("button");
	  	tmpButton.className = "css-1x5m317";
	  	tmpButton.type = "button";
	  	tmpButton.innerHTML = strGetStarted;
	  	tmpButton.onclick = function() { window.location = '/ui/perf-check-ins/Check-Ins/create/select-participant' };
	  	tmpDiv.appendChild(tmpButton);
	  	elmParentDiv.appendChild(tmpDiv);
	 }
  } else {
  	var tmpDiv = document.createElement("div");
  	tmpDiv.className = "landing-page__button-container";
  	var tmpButton = document.createElement("button");
  	tmpButton.className = "css-1x5m317";
  	tmpButton.type = "button";
  	tmpButton.innerHTML = strGetStarted;
  	tmpButton.onclick = function() { window.location = '/ui/perf-check-ins/Check-Ins/create/select-participant' };
  	tmpDiv.appendChild(tmpButton);
  	elmParentDiv.appendChild(tmpDiv);
  }
}

function pad(n) {
    return n<10 ? '0'+n : n;
}