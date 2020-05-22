//include-file: check-Ins/check-Ins.js
//version: 1.04
if (typeof intCheckInsLimit == 'undefined') {	var intCheckInsLimit = 5; }
strUpcoming = ''; strRecent = ''; strUserNumber = '';strToken = '';strCultureName = '';strGetStarted = '';strCloud = '';strCorp = '';objFrequency = {};strConversationsJSURL = '';
var div = '';
function getConversationsWidget(mydiv) {  getCheckInsWidget(mydiv); }
function getCheckInsWidget(mydiv) {
  /*getCheckInsWidget(string div)*/
  /* J. Kaylen 2/12/2020*/
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

		strUpcoming = objResponse.data["Perf.Check-Ins.LandingPage.upcomingConversations.upcomingConversationsHeader"];
		strRecent = objResponse.data["Perf.Check-Ins.LandingPage.recentConversationsHeader"];
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
	    strCultureName = strConvo.substring(strConvo.indexOf('"cultureName"')+15,strConvo.indexOf('",',strConvo.indexOf('"cultureName"')));
	    var myRegexp = /src=\"([\w\W]{1,250}Conversations.js)\"/g;
	    var match = myRegexp.exec(strConvo);
	    if(match.length > 0) {
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
    } else if (xhr.readyState == 4 && xhr.status == 404) {	getCheckInsItems('perf-check-ins-api/v1/conversations');  }
  };
  xhr.open("GET", strPageURL, true);
  xhr.setRequestHeader('Accept', 'application/json; q=1.0, text/*; q=0.8, */*; q=0.1');
  xhr.setRequestHeader('Cache-Control', 'no-cache');
  xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
  xhr.setRequestHeader('Authorization', 'Bearer ' + strToken);
  xhr.send();
}

function buildConversationsList(strRawData) {
   objConversations = JSON.parse(strRawData);
   elmParentDiv = document.getElementById(div);
   elmParentDiv.innerHTML = '';
	 document.getElementById(div).previousElementSibling.innerHTML = '';
	 if(strRecent == undefined) { strRecent = 'RECENT CHECK-INS' }
	 if(strUpcoming == undefined) { strUpcoming = 'UPCOMING CHECK-INS' }
	 elmParentDiv.innerHTML = '<div class="sc-kAdXeD irJdGX"><ul role="tablist" class="sc-cCVOAp fyCuaq"><li id="liRecent" role="presentation" class="liInActive"><a id="linkRecent" onclick="checkinChange(\'recent\')" role="tab" tabindex="0" class="igTcYW"><span class="txtInActive recent-conversations__header" id="txtRecent">' + strRecent + '</span></a></li><li role="presentation" id="liUpcoming" class="liActive"><a id="linkUpcoming" onclick="checkinChange(\'upcoming\')" role="tab" tabindex="-1" class="igTcYW"><span class="txtActive recent-conversations__header" id="txtUpcoming">' + strUpcoming + '</span></a></li></ul></div><div id="tabRecent" style="display: none;"></div><div id="tabUpcoming"></div>';
   if(objConversations.length > 0) {
  	if(objConversations.length > 20) { strLength = 20; } else {strLength=objConversations.length; }
		strDisplayedRecent = 0;
		strDisplayedUpcoming = 0;
		//Recent first
  	objConversations.sort(function(a, b) {
		  a = new Date(a.lastMeetingDate);
		  b = new Date(b.lastMeetingDate);
		  return a-b;
	  });
	  for (var i = 0; i < strLength; i++) {
	 	  if(objConversations[i].isArchived == true) {continue;	}
			if(objConversations[i].lastMeetingDate == '') { continue; }
			var myDate = new Date(objConversations[i].lastMeetingDate);
			if(myDate > new Date) { continue; }
	 	  var tmpParentDiv = buildConvoRow(objConversations[i],false);
	 	  document.getElementById('tabRecent').appendChild(tmpParentDiv);
	 	  strDisplayedRecent++;
	 	  if(strDisplayedRecent >= intCheckInsLimit) { break;	}
	  }

		objConversations.sort(function(a, b) {
		  a = new Date(a.nextMeetingDate);
		  b = new Date(b.nextMeetingDate);
		  return a-b;
	  });
	  for (var i = 0; i < strLength; i++) {
	 	  if(objConversations[i].isArchived == true) {continue;	}
			if(objConversations[i].nextMeetingDate == '') { continue; }
			var myDate = new Date(objConversations[i].nextMeetingDate);
			if(myDate < new Date) { continue; }
	 	  var tmpParentDiv = buildConvoRow(objConversations[i],true);
	 	  document.getElementById('tabUpcoming').appendChild(tmpParentDiv);
	 	  strDisplayedUpcoming++;
	 	  if(strDisplayedUpcoming >= intCheckInsLimit) { break;	}
	  }

	  if(strDisplayedUpcoming == 0) {
  	  var tmpDiv = document.createElement("div");
  	  tmpDiv.className = "landing-page__button-container";
	    var tmpButton = document.createElement("button");
	    tmpButton.className = "css-1x5m317";
	    tmpButton.type = "button";
	    tmpButton.innerHTML = strGetStarted;
	    tmpButton.onclick = function() { window.location = '/ui/perf-check-ins/Check-Ins/create/select-participant' };
	    tmpDiv.appendChild(tmpButton);
	    document.getElementById('tabUpcoming').appendChild(tmpDiv);
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
function buildConvoRow(objConvo,bolUpcoming) {
	var monthNames = ["Jan", "Feb", "Mar", "April", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
	for (var j = 0; j < objConvo.participants.length; j++) {
		if(objConvo.participants[j].id != strUserNumber) { intParticipant = j; }
	}
	var tmpParentDiv = document.createElement("div");
	tmpParentDiv.setAttribute('data-tag','recent-conversation-row-id-' + objConvo.id);
	tmpParentDiv.setAttribute('data-id',objConvo.id);
	tmpParentDiv.onclick = function() { window.location = '/ui/perf-check-ins/Check-Ins/view/' + this.getAttribute('data-id') };
	tmpDiv = document.createElement("div");
	tmpDiv.className = 'divider';
	tmpParentDiv.appendChild(tmpDiv);
	tmpDiv = document.createElement("div");
	tmpDiv.className = 'recent-conversations-row';
	tmpDivAvatar = document.createElement("div");
	tmpDivAvatar.className = 'recent-conversations-row__avatar';
	if(objConvo.participants[intParticipant].pictureUrl != '') {
		tmpDivAvatarSub = document.createElement("div");
		tmpDivAvatarSub.className = 'css-c8f728';
		tmpDivAvatarSub.style.backgroundImage = "url('/clientimg/" + strCorp + "/users/photos/100/" + objConvo.participants[intParticipant].pictureUrl +"')";
	} else {
		tmpDivAvatarSub = document.createElement("div");
		tmpDivAvatarSub.className = 'css-c8f728';
		tmpDivAvatarSub.innerHTML = objConvo.participants[intParticipant].firstName.substring(0,1) + objConvo.participants[intParticipant].lastName.substring(0,1);
	}
	tmpDivAvatar.appendChild(tmpDivAvatarSub);
	tmpDiv.appendChild(tmpDivAvatar);
	tmpDivMiddle = document.createElement("div");
	tmpDivMiddle.className = 'recent-conversations-row__middle-container';
	tmpDivMiddleSub = document.createElement("div");
	tmpDivMiddleSub.className = 'recent-conversations-row__name';
	tmpDivMiddleSub.innerHTML = objConvo.participants[intParticipant].firstName + ' ' + objConvo.participants[intParticipant].lastName;
	tmpDivMiddle.appendChild(tmpDivMiddleSub);
	tmpDivMiddleSub = document.createElement("div");
	tmpDivMiddleSub.className = 'recent-conversations-row__conversation-name';
	tmpDivMiddleSub.innerHTML = objConvo.title;
	tmpDivMiddle.appendChild(tmpDivMiddleSub);
	tmpDivMiddleSub = document.createElement("div");
	tmpDivMiddleSub.className = 'recent-conversations-row__conversation-frequency';
	tmpDivMiddleSubSub = document.createElement("div");
	tmpDivMiddleSubSub.className = "frequency-chip frequency-chip--grey";
	tmpDivMiddleSubSub.innerHTML = objFrequency[objConvo.frequency];
	tmpDivMiddleSub.appendChild(tmpDivMiddleSubSub);
	tmpDivMiddle.appendChild(tmpDivMiddleSub);
	tmpDiv.appendChild(tmpDivMiddle);
	tmpDivDate = document.createElement("div");
	tmpDivDate.className = "recent-conversations-row__conversation-date";
	var strDate = '';
	if(bolUpcoming) {
		var dateLastMeeting = new Date(objConvo.nextMeetingDate);
	} else {
		var dateLastMeeting = new Date(objConvo.lastMeetingDate);
	}
	tmpDivDate.innerHTML = monthNames[dateLastMeeting.getMonth()] + ' ' + pad(dateLastMeeting.getDate());
	tmpDiv.appendChild(tmpDivDate);
	tmpParentDiv.appendChild(tmpDiv);
	return tmpParentDiv;
}
function checkinChange(change) {
	if(change == 'recent') {
		document.getElementById('liRecent').className = 'liActive';
		document.getElementById('txtRecent').className = "txtActive recent-conversations__header";
		document.getElementById('liUpcoming').className = 'liInActive';
		document.getElementById('txtUpcoming').className = "txtInActive recent-conversations__header";
		document.getElementById('tabUpcoming').style.display = 'none';
		document.getElementById('tabRecent').style.display = 'block';
	} else {
		document.getElementById('liUpcoming').className = 'liActive';
		document.getElementById('txtUpcoming').className = "txtActive recent-conversations__header";
		document.getElementById('liRecent').className = 'liInActive';
		document.getElementById('txtRecent').className = "txtInActive recent-conversations__header";
		document.getElementById('tabRecent').style.display = 'none';
		document.getElementById('tabUpcoming').style.display = 'block';
	}
}
function pad(n) {  return n<10 ? '0'+n : n;}
