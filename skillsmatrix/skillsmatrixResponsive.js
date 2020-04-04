//include-file: skillsmatrix/skillsmatrixResponsive.js
//version: 1.00
function skillsmatrixInit(user, role) {
  var myData = '{"vm":{"OptionsCriteria":[{"Id":1,"Title":"Self"},{"Id":2,"Title":"Select Criteria"}],"OptionsRole":[{"Id":0,"Title":"All Roles for Users"},{"Id":1,"Title":"Roles by OU"},{"Id":2,"Title":"Select Role(s)"}],"OptionsOu":[{"Id":2,"Title":"Division"},{"Id":4,"Title":"Position"},{"Id":16,"Title":"Cost Center"},{"Id":32,"Title":"Location"},{"Id":524291,"Title":"Employee Type"},{"Id":128,"Title":"Group"},{"Id":0,"Title":"User"}],"RoleOuOptions":[{"Id":2,"Title":"Division"},{"Id":4,"Title":"Position"},{"Id":16,"Title":"Cost Center"},{"Id":32,"Title":"Location"},{"Id":524291,"Title":"Employee Type"},{"Id":128,"Title":"Group"}],"SelectedCriteriaId":1,"SelectedRoleId":0,"SelectedOuId":2,"SelectedRoleOuTypeId":2,"IncludeIndirectReports":false,"Criteria":[],"Roles":[],"DataRequested":false,"Grid":{"Roles":[],"Users":[],"UserCount":0,"RoleCount":0,"State":0}}}';
  // construct an HTTP request
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
      objSkillsMatrix = JSON.parse(xhr.responseText);
      intRoles = objSkillsMatrix.d.Users[0].UserRoles.length;
      strHTML = "<div class=\"Rtable Rtable--" + intRoles + "cols Rtable--collapse\">\n";
      for (var i = 0, l = objSkillsMatrix.d.Users[0].UserRoles.length; i < l; i++) {
        strHTML = strHTML + "      <div style=\"order:0;\" class=\"Rtable-cell Rtable-cell--head\"><h3>" + objSkillsMatrix.d.Roles[i].Title + "</h3></div>\n";
        strHTML = strHTML + "      <div style=\"order:1;\" class=\"Rtable-cell Rtable-cell--foot\"><a href=\"/EPM/SkillsMatrix/User/RoleUserCompetencyDetails.aspx?TargetUserId=" + objSkillsMatrix.d.Users[0].UserIdEncrypted  + "&RoleId=" + objSkillsMatrix.d.Roles[i].RoleIdEncrypted + "\" title=\"Completed: " + objSkillsMatrix.d.Users[0].UserRoles[i].ProgressPercent + "%\">\n";
        if(objSkillsMatrix.d.Users[0].UserRoles[i].ProgressPercent == 100) {
          strHTML = strHTML + "          <div class=\"cso-icon stat s grn\">\n";
        } else if(objSkillsMatrix.d.Users[0].UserRoles[i].ProgressPercent == 0) {
          strHTML = strHTML + "          <div class=\"cso-icon stat s red\">\n";
        } else {
          strHTML = strHTML + "          <div class=\"cso-icon stat s ylw\">\n";
        }
        strHTML = strHTML + "            <span class=\"hdntxt\">Completed: " + objSkillsMatrix.d.Users[0].UserRoles[i].ProgressPercent + "%</span>\n";
        strHTML = strHTML + "          </div>\n";
        strHTML = strHTML + "        </a>\n";
        strHTML = strHTML + "      </div>\n";
      }
      strHTML = strHTML + "</div>\n";
      document.getElementById("skillsmatrix").innerHTML = strHTML;
    }
  };
  xhr.open("POST", "/EPM/SkillsMatrix/Services/SkillsMatrixService.asmx/ViewMatrix", false);
  xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
  xhr.send(myData);
}
