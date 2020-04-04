//include-file: searchBar.js
//version: 1.00
var strUserNumber;
var strToken;
function checkSubmit(e) {
   if(e && e.keyCode == 13) {
      document.forms[0].submit();
   }
}
function getLEPToken() {
	strLEPURL = "/ui/lms-learner-home/home";	//Need to call LEP first to get Token and User Numeric ID. Takes about 2s
	var xhrLEP = new XMLHttpRequest();
	xhrLEP.onreadystatechange = function() {
		if (xhrLEP.readyState == 4 && xhrLEP.status == 200) {	//LEP loaded, now we pull out token and user and call the correct service
			strLEP = xhrLEP.responseText;
			strUserNumber = strLEP.substring(strLEP.indexOf('"user"')+9,strLEP.indexOf(",",strLEP.indexOf('"user"')));
			strToken = strLEP.substring(strLEP.indexOf('"token"')+9,strLEP.indexOf('",',strLEP.indexOf('"token"')));
		}
	};
	xhrLEP.open("POST", strLEPURL, true);
	xhrLEP.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
	xhrLEP.send();
}


function funcGetLOList(val, inp) {
	strPageURL = "/services/api/lms/TrainingPredictiveSearch?numResults=10&SearchText=" + val;
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && xhr.status == 200) {		//Service has returned, need to display results
			funcBuildList(val, inp, xhr.responseText);
  		}
	};
	xhr.open("GET", strPageURL, true);
	xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
	xhr.setRequestHeader('Authorization', 'Bearer ' + strToken);
	xhr.send();
}

function funcBuildList(val, inp, strRawData) {
	objTraining = JSON.parse(strRawData);
	console.log(objTraining);
	/*close any already open lists of autocompleted values*/
	closeAllLists();
	currentFocus = -1;
	/*create a DIV element that will contain the items (values):*/
	a = document.createElement("DIV");
	a.setAttribute("id", inp.id + "autocomplete-list");
	a.setAttribute("class", "autocomplete-items");
	/*append the DIV element as a child of the autocomplete container:*/
	inp.parentNode.appendChild(a);
	/*for each item in the array...*/
	console.log(objTraining.data.length)
	for (i = 0; i < objTraining.data.length; i++) {
		strTitle = objTraining.data[i].title;
		strID = objTraining.data[i].id
		/*create a DIV element for each matching element:*/
		b = document.createElement("DIV");
		b.innerHTML = '<span onclick="window.open(\'/LMS/LoDetails/DetailsLo.aspx?loid=' + strID + '\',\'_top\');">' + strTitle + "</span>";
          	a.appendChild(b);
	}
}



function funcSetupSearch() {
	document.getElementById('aspnetForm').action = "/ui/lms-learner-search/search";
	document.getElementById('aspnetForm').method = "Get";
}

function autocomplete(inp) {
	//funcSetupSearch();
	/*the autocomplete function takes two arguments, the text field element and an array of possible autocompleted values:*/
	var currentFocus;
	/*execute a function when someone writes in the text field:*/
	inp.addEventListener("input", function(e) {
	if(e && e.keyCode == 13) {
		document.getElementById('aspnetForm').action = "/ui/lms-learner-search/search";
		document.getElementById('aspnetForm').method = "Get";
		document.forms[0].submit();
	}
		var val = this.value;
		if ((!val) || (val.length<3)) { return false;}
		funcGetLOList(val, inp);
	});
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function(e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        /*If the arrow DOWN key is pressed, increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 38) { //up
        /*If the arrow UP key is pressed, decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        window.open("/ui/lms-learner-search/search?query=" + encodeURIComponent(document.getElementById("searchbox2").value),"_top")
        if (currentFocus > -1) {
          /*and simulate a click on the "active" item:*/
          if (x) x[currentFocus].click();
        }
      }
  });

/*execute a function when someone clicks in the document:*/
document.addEventListener("click", function (e) {
    closeAllLists(e.target);
});
}
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document, except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
      x[i].parentNode.removeChild(x[i]);
    }
  }
}
getLEPToken();
inp = document.getElementById("searchbox2");
autocomplete(document.getElementById("searchbox2"));
