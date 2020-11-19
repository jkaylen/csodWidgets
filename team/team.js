//include-file: team/team.js
//version: 0.08

if (typeof strUserNumber == 'undefined') {	var strUserNumber = ''; }
if (typeof strToken == 'undefined') {	var strToken = ''; }
if (typeof strCultureName == 'undefined') {	var strCultureName = ''; }
if (typeof strCloud == 'undefined') {	var strCloud = ''; }
if (typeof strCorp == 'undefined') {	var strCorp = ''; }

var div = '';
function getTeam() {
  /*getCheckInsWidget(string div)*/
  /* J. Kaylen 2/12/2020*/
	if(strUserNumber == '') {
		getCheckInsToken();
	} else {
		getParticipants();
	}
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
       getParticipants();
    }
  };
  xhrConvo.open("POST", strConvoURL, true);
  xhrConvo.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
  xhrConvo.send();
}

function getParticipants() {
  strPageURL = strCloud + "perf-conversations-api/v1/conversations/participants";
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
      console.log(JSON.parse(xhr.responseText));
      buildParticipants(xhr.responseText);
    }
  };
  xhr.open("GET", strPageURL, true);
  xhr.setRequestHeader('Accept', 'application/json; q=1.0, text/*; q=0.8, */*; q=0.1');
  xhr.setRequestHeader('Cache-Control', 'no-cache');
  xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
  xhr.setRequestHeader('Authorization', 'Bearer ' + strToken);
  xhr.send();
}

function buildParticipants(strRawData) {
  objParticipants = JSON.parse(strRawData);
  elmParentDiv = document.getElementById('divTeam');
  elmParentDiv.innerHTML = '';

  for(var i=0;i<objParticipants.directReports.length; i++) {
    var elmLI = document.createElement('li');
    elmLI.className = "flex-item";
    var elmUserContainer = document.createElement('div');
    elmUserContainer.className = "userContainer";
    var elmImageContainer = document.createElement('div');
    elmImageContainer.className = "imageContainer";
    if(!objParticipants.directReports[i].pictureUrl || objParticipants.directReports[i].pictureUrl == '' || objParticipants.directReports[i].pictureUrl == null) {
      strPicture = '/phnx/images/nophoto.png'
    } else {
      strPicture = '/clientimg/' + strCorp + "/users/photos/100/" + objParticipants.directReports[i].pictureUrl;
    }
    elmImageContainer.innerHTML = '<div class="image"><a href="/phnx/driver.aspx?routename=Social/UniversalProfile/Bio&TargetUser=' + objParticipants.directReports[i].id + '" title="Open Profile"><img src="' + strPicture + '" alt="Open Profile" title="Open Profile" rel="tooltip"></a></div>';
    elmUserContainer.appendChild(elmImageContainer);

    var elmInfoContainer = document.createElement('div');
    elmInfoContainer.className = "informationContainer";
    elmInfoContainer.innerHTML = '<div class="userName"><a href="/phnx/driver.aspx?routename=Social/UniversalProfile/Bio&TargetUser=' + objParticipants.directReports[i].id + '" title="Open Profile">' + objParticipants.directReports[i].firstName + ' ' + objParticipants.directReports[i].lastName + '</a><br><span class="userPosition">' + objParticipants.directReports[i].position + '</span></div><div class="userActions"><a href="/phnx/driver.aspx?routename=Social/UniversalProfile/Snapshot/Goals&TargetUser=' + objParticipants.directReports[i].id + '" title="Open Goals">Goals</a> | <a href="/phnx/driver.aspx?routename=Social/UniversalProfile/Snapshot/DevPlanNew&targetUser=' + objParticipants.directReports[i].id + '" title="Open Dev Plans">Dev Plans</a> | <a href="/phnx/driver.aspx?routename=Social/UniversalProfile/Transcript&TargetUser=' + objParticipants.directReports[i].id + '" title="Open Transcript">Learning</a></div>';
    elmUserContainer.appendChild(elmInfoContainer);
    elmLI.appendChild(elmUserContainer);
    elmParentDiv.appendChild(elmLI);
  }
}
