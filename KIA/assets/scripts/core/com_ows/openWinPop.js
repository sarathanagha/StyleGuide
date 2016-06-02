function popWin(url, target, width, height) {
	// window open property set
	var sURL		= url;
	var sTarget		= target;
	var sStatus		= ""
	var bReplace	= false;

	if(sURL == ""){
		alert("주소가 잘못되었습니다..");
		return;
	}

	//sStatus property set
	var vWidth	= "height=" + height;
	var vHeight	= "width=" + width;

	//sStatus default set
	var vlocation = "location=no"
	var scrollbar = "scrollbars=yes";
	var toolbar = "toolbar=no";
	var menubar = "menubar=no";
	var resizeStatus = "resizable=no";
	var statusBar = "status=yes"
	sStatus = vlocation + "," + statusBar + "," + scrollbar + "," + menubar + "," + toolbar + "," + resizeStatus + "," + vWidth + "," + vHeight;
	var newWin = window.open(sURL, sTarget, sStatus, bReplace);
	
	newWin.focus();
	//newWin.dom.disable_window_open_feature.resizable = false;
}


/************************************************************************
함수명 : fn_open_popCen(theURL,winName,w,h,features)
설 명  : 팝업창 오픈(센터)
사용법 : onClick="fn_open_popCen('/xxx/xxx.do', 'xxname', '500', '600', 'toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,status=yes')"
작성일 : 2010-09-08
작성자 : 컨피테크 오국헌
수정일   수정자    수정내용
------   ------    -------------------
************************************************************************/
function fn_open_popCen(theURL,winName,w,h,features) {
	var winl = (screen.width - w) / 3;
	var wint = (screen.height - h) / 3;
	features = 'width='+w+',height='+h+',left='+winl+',top='+wint+','+features;
	var newWin = window.open(theURL,winName,features);
	newWin.focus();
}