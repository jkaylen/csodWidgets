//include-file: widgetHeightMatch.js
//version: 1.00
var arrWidgetsToMatch = [];
window.onload = function(){findWidgetConfiguration();};
function findWidgetConfiguration() {
	if((document.getElementById("LayoutCSS")) && (document.getElementById("LayoutCSS").value !='')) {
		var strLayoutConfig = document.getElementById("LayoutCSS").href;
		strLayoutConfig = strLayoutConfig.substring(strLayoutConfig.indexOf("dynamicLayout.php?")+18);
		var arrLayoutConfig = strLayoutConfig.split('&');
		var intWidgetNumber = 1;
		for(var i=0; i<arrLayoutConfig.length;i++) {
			if(arrLayoutConfig[i].indexOf('=1') > 0) {
				intWidgetNumber++;
			} else if (arrLayoutConfig[i].indexOf('=2M') > 0) {
				intWidgetNumber++;
				intWidgetNumber++;
				arrWidgetsToMatch.push({start: intWidgetNumber-1, end: intWidgetNumber});
			} else if (arrLayoutConfig[i].indexOf('=2') > 0) {
				intWidgetNumber++;
				intWidgetNumber++;
			}
		}
		if(arrWidgetsToMatch.length > 0) { processWidgetHeightList(arrWidgetsToMatch); }
	}
}
function processWidgetHeightList(arrWidgetsToMatch) {
	for(var i=0; i<arrWidgetsToMatch.length;i++) {
		matchWidgetHeight(arrWidgetsToMatch[i]);
		addMutationObserverForHeight(arrWidgetsToMatch[i]);
	}
}
function matchWidgetHeight(objWidgetPair) {
	//Reset heights
	document.querySelector('.widgetDropped:nth-of-type(' + objWidgetPair.end + ') .Panel_footer').style.height = '0px';
	document.querySelector('.widgetDropped:nth-of-type(' + objWidgetPair.start + ') .Panel_footer').style.height = '0px';
	intStartHeight = document.querySelector('.widgetDropped:nth-of-type(' + objWidgetPair.start + ') .Panel').clientHeight;
	intEndHeight = document.querySelector('.widgetDropped:nth-of-type(' + objWidgetPair.end + ') .Panel').clientHeight;
	console.log('Start Height: ' + intStartHeight + ' End Height: ' + intEndHeight);
	if((intStartHeight - intEndHeight > 3) || (intStartHeight - intEndHeight < -3)) {
		if(intStartHeight > intEndHeight) {
			var intSetHeight = 9 + intStartHeight-intEndHeight;
			document.querySelector('.widgetDropped:nth-of-type(' + objWidgetPair.end + ') .Panel_footer').style.height = intSetHeight + 'px';
		} else if(intEndHeight > intStartHeight) {
			var intSetHeight = 9 + intEndHeight-intStartHeight;
			document.querySelector('.widgetDropped:nth-of-type(' + objWidgetPair.start + ') .Panel_footer').style.height = intSetHeight + 'px';
		}
	}
}
function addMutationObserverForHeight(objWidgetPair) {
	//NOTE: Not optimized. It goes mutation observer detects a change in any of the widgets and re does process for all of them
	var targetNode = document.querySelector('.widgetDropped:nth-of-type(' + objWidgetPair.start + ') .Panel');
	var config = { childList: true, subtree: true };
	var callback = function(mutationsList, tmpobserver) { for(var i=0; i<arrWidgetsToMatch.length;i++) { matchWidgetHeight(arrWidgetsToMatch[i]); }};
	observerGet = new MutationObserver(callback);
	// Start observing the target node for configured mutations
	observerGet.observe(targetNode, config);
	var targetNode2 = document.querySelector('.widgetDropped:nth-of-type(' + objWidgetPair.end + ') .Panel');
	var config2 = { childList: true, subtree: true };
	var callback2 = function(mutationsList, tmpobserver) { for(var i=0; i<arrWidgetsToMatch.length;i++) { matchWidgetHeight(arrWidgetsToMatch[i]); }};
	observerGet2 = new MutationObserver(callback2);
	// Start observing the target node for configured mutations
	observerGet2.observe(targetNode2, config2);
}
