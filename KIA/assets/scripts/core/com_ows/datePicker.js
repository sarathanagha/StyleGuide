/*
 *		 Title: Datepicker
 *		Author: pldosa(유비스티 추풍령)
 *	LastUpdate: 2010-06-15
 */

/*
 * target 		: 값을 반환하는 객체
 * stime 		: 달력이 사라지는 시간
 * calendar 	: 생성될 달력
 */
var target;
var stime;
var calendar;
var calendarWrap;

/*
 * monSeq  	: 월 순서
 * weekSeq 	: 요일 순서(2차 배열, 일요일부터), 	[0][]:영문 [1][]:한글	[2][]:한문
 * lnag	   	: 배열 변수의 언어선택 변수, 		0: 영문  	1: 한글 	2: 한문
 */
var monSeq = new Array("1","2","3","4","5","6","7","8","9","10","11","12");
var weekSeq = new Array(["Su", "Mo", "Tu", "We", "Tu", "Fr", "Sa"],["일", "월", "화", "수", "목", "금", "토"],["日", "月", "火", "水", "木", "金", "土"]);
var tHours = new Array("hour","시","時");
var tMinutes = new Array("minute","분","分");
var lang = 0;
 
/*
 * 화살방향 이미지
 */
var imgArrowPrev 		= "<img id=\"arrow_prev\" src=\"/ccw/css/com_ows/images/datePicker_arrow_prev.gif\" border=\"0\" align=\"top\" alt=\"prev\" class=\"arrow_prev\"/>";
var imgArrowNext 		= "<img id=\"arrow_next\" src=\"/ccw/css/com_ows/images/datePicker_arrow_next.gif\" border=\"0\" align=\"top\" alt=\"next\" class=\"arrow_next\"/>";
var imgArrowPrevOver	= new Array("/ccw/css/com_ows/images/datePicker_arrow_prev_over.gif", "/ccw/css/com_ows/images/datePicker_arrow_prev.gif");
var imgArrowNextOver	= new Array("/ccw/css/com_ows/images/datePicker_arrow_next_over.gif", "/ccw/css/com_ows/images/datePicker_arrow_next.gif");

/*
 * 달력 DIV 영역
 */
document.writeln("<iframe id=\"datapicker_iframe\" style=\"position:absolute; display:none;\" frameborder=\"0\"></iframe>"); /* ie6 bug fix */
document.writeln("<div id=\"datepickerWrap\" onmouseover=\"calendarOver()\" onmouseout=\"calendarOut()\" style=\"display:none\">");
document.writeln("    <div id=\"calContent\" bgproperties=\"fixed\" oncontextmenu=\"return false\" ondragstart=\"return false\" onselectstart=\"return false\"></div>");
document.writeln("</div>");

/*
 * 달력 호출 함수
 * yyyymmdd	: 날짜가 입력될 객체
 */
function scTarget(yyyymmdd) {
	var calContent = document.getElementById("calContent");
	calendarClear(calContent);
	scCalendarCheck(yyyymmdd);
}

/*
 * 달력을 출력하기 전,
 * 유효성 체크 및 대체, location 위치 계산.
 * yyyymmdd	: 넘어온 객체 변수. 통합형 = object형, 분리형 = array(object)형.
 */
function scCalendarCheck(yyyymmdd) {
	var thisNow;
	var parentName = "calContent";
	
	thisNow = yyyymmdd.value.split("/");

	checkLength = true;
	for(var i = 0; i<thisNow.length; i++){		
		if(thisNow[i]==""){
			checkLength = false;
			break;
		}
	}
	
	// 넘어온 객체를 타켓으로 지정
	target = new Array(yyyymmdd);	//***	
	// 달력의 위치 계산 및 설정
	var top = document.body.clientTop + getObjectTop(yyyymmdd);
	var left = document.body.clientLeft + getObjectLeft(yyyymmdd);
	calendar = document.getElementById("datepickerWrap");
	calendar.style.top = top + yyyymmdd.offsetHeight + "px";
	calendar.style.left = left + "px";
	calendar.style.display = "";
	
	calendarWrap = document.getElementById("datapicker_iframe");
	calendarWrap.style.top = top + yyyymmdd.offsetHeight + "px";
	calendarWrap.style.left = left + "px";
	calendarWrap.style.width = calendar.offsetWidth + "px";
	calendarWrap.style.height = calendar.offsetHeight + "px";
	calendarWrap.style.display = "";
		
	if (!checkLength) {	
		now = new Date();
		if (lang == 0)
		{
			thisNow = new Array(now.getMonth()+1,now.getDate(),now.getFullYear());//언어별 영어	
		}else{
			
			thisNow = new Array(now.getFullYear(),now.getMonth()+1,now.getDate());//한국/중국			
		}
	}
	
	// scShowCal() 함수 호출
	scShowCal(thisNow);
}

/*
 * 한개 달력 호출
 * thisNow	: 날짜 매개 변수(array)
 */
function scShowCal(thisNow){

	// 기존 달력 삭제 및 div 영역 새로 생성
	var calContent = document.getElementById("calContent");
	calendarClear(calContent);
	var divThisCalTable = document.createElement("div");
	var divBottom = document.createElement("div");

	var divThisCalTableId = "thisCal";
	var divBottomId		= "calendarBottom";

	divThisCalTable.setAttribute("id", divThisCalTableId);
	divBottom.setAttribute("id", divBottomId);

	// 각 해당 시간별 hidden 타입 지정
	var hiddenYyyy = document.createElement("input");
	hiddenYyyy.setAttribute("type","hidden");
	hiddenYyyy.setAttribute("id",divThisCalTableId+"Yyyy");
	
	if (lang == 0)
	{
		hiddenYyyy.setAttribute("value",thisNow[2]);//년월일 ->월일년 //언어별	영어
	}else{
		
		hiddenYyyy.setAttribute("value",thisNow[0]);//년월일 ->월일년 //언어별 한국/중국				
	}	

	var hiddenMm = document.createElement("input");
	hiddenMm.setAttribute("type","hidden");
	hiddenMm.setAttribute("id",divThisCalTableId+"Mm");
	

	if (lang == 0)
	{
		hiddenMm.setAttribute("value",day2(thisNow[0]));//년월일 ->월일년 //언어별	영어
	}else{		
		hiddenMm.setAttribute("value",day2(thisNow[1]));//년월일 ->월일년 //언어별	한국/중국			
	}		
	var hiddenDd = document.createElement("input");
	hiddenDd.setAttribute("type","hidden");
	hiddenDd.setAttribute("id",divThisCalTableId+"Dd");
	
	if (lang == 0)
	{
		hiddenDd.setAttribute("value",day2(thisNow[1]));//년월일 ->월일년 //언어별	영어
	}else{		
		hiddenDd.setAttribute("value",day2(thisNow[2]));//년월일 ->월일년 //언어별	한국/중국		
	}	
	divBottom.appendChild(hiddenYyyy);
	divBottom.appendChild(hiddenMm);
	divBottom.appendChild(hiddenDd);

	// 최종값 리턴을 위한 어두 지정
	var arrParentName = divThisCalTableId;

	calContent.appendChild(divThisCalTable);
	calContent.appendChild(divBottom);
	//월 일 년
    //년thisNow[0], 월thisNow[1], 일thisNow[2]
	//drawCal(thisNow[0], thisNow[1], thisNow[2], divThisCalTableId);
	if (lang == 0)
	{	
		drawCal(thisNow[2], thisNow[0], thisNow[1], divThisCalTableId);//언어별	영어
	}else{
		drawCal(thisNow[0], thisNow[1], thisNow[2], divThisCalTableId);//언어별	한국/중국		
	}
}

/*
 * 달력 그리기 및 달력 attribute 셋팅 메소드
 * sYear, sMonth, sDay: 출력할 날짜 데이터
 * parentName : 달력이 그려질 div 영역. 생성될 객체의 id와 name을 분류하기 위한 변수
 */
function drawCal(sYear, sMonth, sDay, parentName) {

	// 출력할 달력 영역 div 연결
	var calContent = document.getElementById(parentName);
	calendarClear(calContent);
	calContent.innerHTML = "";

	// 출력할 달력 스트링 생성
	var calHtml = makeCalendarString(sYear, sMonth, sDay, parentName);	
	// 달력 생성
	calContent.innerHTML = calHtml;
}

/*
 * 달력 지우기
 * parentNode	: 지울 달력 영역 Div
 */
function calendarClear(parentNode){

	if(parentNode.hasChildNodes()){
		var nodes = parentNode.childNodes;

		// 하위 노드들 remove
		for(var i=0; i<nodes.length; i++){
			if(nodes[i].hasChildNodes()) calendarClear(nodes[i]);
			parentNode.removeChild(nodes[i]);
		}
	}
}

/*
 * 달력을 그릴 String 생성 함수
 * sYear, sMonth, sDay: 출력할 날짜 데이터
 * parentName 	: 달력 영역 Id
 * return		: 달력 html 코드 반환(String)
 */
function makeCalendarString(sYear, sMonth, sDay, parentName){

	/*
	 * intThisYear,intThisMonth,intThisDay	: 선택한 날짜(넘어온 날짜)
	 * nowThisYear,nowThisMonth,nowThisDay	: 오늘 날짜
	 */	
	var intThisYear;
	var intThisMonth;
	var intThisDay;

	var datToday = new Date();
	var nowThisYear = datToday.getFullYear();
	var nowThisMonth = datToday.getMonth()+1;
	var nowThisDay = datToday.getDate();

	// 들어온 변수 날짜의 오류체크
	var checkDate = new Date(sYear,sMonth-1,sDay).getDate();

	// 체크된 날짜 저장
	var selectYear = parseInt(document.getElementById(parentName+"Yyyy").value,10);
	var selectMonth = parseInt(document.getElementById(parentName+"Mm").value,10);
	var selectDay = parseInt(document.getElementById(parentName+"Dd").value,10);

	/*
	 * 오류 체크 비교
	 * 값이 정상일 경우(if),		선택한 날짜를 치환
	 * 값이 비정상일 경우(else), 	오늘 날짜를 치환
	 */
	if(!isNaN(checkDate)){
		intThisYear = parseInt(sYear,10);
		intThisMonth = parseInt(sMonth,10);
		intThisDay = parseInt(sDay,10);
	}else{
		if (intThisYear == 0) intThisYear = datToday.getFullYear();
		if (intThisMonth == 0) intThisMonth = parseInt(datToday.getMonth(),10)+1;
		if (intThisDay == 0) intThisDay = datToday.getDate();
	}

	/*
	 * endDay					: 해당 월 마지막 일
	 * intFirstWeekday 			: 해당 월 첫주의 시작 요일
	 * intPrevYear,intPrevMonth : 해당 날짜의 전년,전월
	 * intNextYear,intNextMonth : 해당 날짜의 내년,차월
	 */	
	var endDay = new Date(intThisYear,intThisMonth,0).getDate();
	var intFirstWeekday = new Date(intThisYear,intThisMonth-1,1).getDay();
	var intPrevYear = intThisYear - 1;
	var intPrevMonth = new Date(intThisYear,intThisMonth-1,0).getMonth()+1;
	var intNextYear = intThisYear + 1;
	var intNextMonth = new Date(intThisYear,intThisMonth+1,0).getMonth()+1;

	/*
	 * 달력 그리기 시작
	 * calHtml	: 달력 String 변수
	 */
	var calHtml = "<table id=\""+parentName+"calTable\" class=\"api_datepicker\">";
	calHtml += "<tr>";
	calHtml += "<th class=\"selection_year_month\" colspan=\"7\">";

	// 년차 이동 이벤트
	calHtml += "<a href=\"#\" onmouseover=\"changeImgPrevOver()\" onmouseout=\"changeImgPrevOut()\" onclick=\"drawCal("+intPrevYear+","+intThisMonth+","+intThisDay+",\'"+parentName+"\');\">"+imgArrowPrev+"</a>";
	calHtml += intThisYear;
	calHtml += "<a href=\"#\" onmouseover=\"changeImgNextOver()\" onmouseout=\"changeImgNextOut()\" onclick=\"drawCal("+intNextYear+","+intThisMonth+","+intThisDay+",\'"+parentName+"\');\">"+imgArrowNext+"</a>";

	/*
	// 월차 이동 이벤트
	calHtml += "<a href=\"#\" onclick=\"drawCal("+intThisYear+","+intPrevMonth+","+intThisDay+",\'"+parentName+"\');\">"+imgArrowPrev+"</a> ";
	calHtml += "&nbsp;"+monSeq[intThisMonth-1]+"&nbsp;";
	calHtml += "<a href=\"#\" onclick=\"drawCal("+intThisYear+","+intNextMonth+","+intThisDay+",\'"+parentName+"\');\">"+imgArrowNext+"</a>";

	calHtml += "</th></tr>";
	*/

	calHtml += "<tr><td colspan=\"7\" class=\"selection_month\">";

	for(var k = 0; k<monSeq.length; k++){
		if((k+1)==intThisMonth)
			calHtml += "<span class=\"selected\">" + monSeq[k] + "</span>";
		else
			calHtml += "<a href=\"#\" onclick=\"drawCal("+intThisYear+","+(k+1)+","+intThisDay+",\'"+parentName+"\');\">"+monSeq[k]+"</a>";
	}

	calHtml += "</tr>";

	calHtml += "<tr>";

	// 요일 title 컬럼
	for (var intLoopDay=1; intLoopDay <= 7; intLoopDay++) {
		calHtml += "<th class=\"selection_week\">";
		calHtml += weekSeq[lang][intLoopDay-1]+"</th>";
	}
	calHtml += "</tr>";

	// startingDay	: 시작일, 1부터 해당월 마지막일까지 index 역할
	var startingDay = 1;

	// 주별 단위 loop , 최대 주는 < ((마지막 일 + 시작 요일번수) / 요일개수) + 1 >
	for (var intLoopWeek=1; intLoopWeek < ((endDay+intFirstWeekday)/7)+1; intLoopWeek++) {
		calHtml += "<tr>";

		// 요일별 단위 loop
		for (var intLoopDay=1; intLoopDay <= 7; intLoopDay++) {

			// 시작전, 시작요일까지 공백처리
			if (startingDay ==1 && intLoopDay < intFirstWeekday+1) {
				calHtml += "<td>";
			} else {
				// 날짜 출력(마지막일+1보다 작을때까지)
				if (startingDay < endDay+1) {
					calHtml += "<td onclick=\"calendarClick(this,\'"+parentName+"\')\" title="+intThisYear+"-"+day2(intThisMonth)+"-"+day2(startingDay)+" class=\"";
					if(intThisYear == selectYear && intThisMonth==selectMonth && startingDay==selectDay){
						calHtml += "dateprintout_selected"; // 선택한날짜
					/*
					}else if (intThisYear == nowThisYear && intThisMonth==nowThisMonth && startingDay==nowThisDay) {
						calHtml += "dateprintout_today"; // 오늘날짜
					*/
					}else
						calHtml += "dateprintout"; // 그외날짜

					// 일별 셀마다 hidden 객체와 name을 지정. 배열 형태를 유지한다
					calHtml += "\">"+startingDay++;

				// 최대일수가 지났을 경우, 공백 처리
				} else {
					calHtml += "<td>";
				}
			}
			calHtml += "</td>";
		}
		calHtml += "</tr>";
	}
	calHtml += "</table>";

	return calHtml;
}

/*
 * 마우스 오버시, 달력형태 유지
 */
function calendarOver() {
	window.clearTimeout(stime);
}

/*
 * 마우스 아웃시, 달력형태 숨기기
 */
function calendarOut() {	
	stime=window.setTimeout("calendar.style.display=\"none\";calendarRemove();", 200);
	
}

function calendarRemove(){
	var calContent = document.getElementById("calContent");
	calendarClear(calContent);
	document.getElementById("datapicker_iframe").style.display = "none";
}

/*
 * 날짜 클릭시, 정보를 span창에 출력 및 hidden에 저장
 * e	: 데이터 정보를 가지고 있는 객체
 * parentName : hidden 값을 찾기 위한 어두
 */
function calendarClick(e,parentName) {

	var yyyy = document.getElementById(parentName+"Yyyy");
	var mm = document.getElementById(parentName+"Mm");
	var dd = document.getElementById(parentName+"Dd");
	calDay = e.title.split("-");
	yyyy.value = calDay[0];
	mm.value = calDay[1];
	dd.value = calDay[2];
	targetingDate(parentName);
}

function targetingDate(parentName){
	var nowParentName = parentName.split(":");
	for(var k = 0; k<nowParentName.length; k++){
		var date;
		var yyyy = document.getElementById(nowParentName[k]+"Yyyy");
		var mm = document.getElementById(nowParentName[k]+"Mm");
		var dd = document.getElementById(nowParentName[k]+"Dd");

		date = new Array(yyyy.value,mm.value,dd.value);
		//date = yyyy.value + "-" + mm.value + "-" + dd.value;
		if (lang == 0)
		{
			date =   mm.value + "/" + dd.value+ "/" +yyyy.value;//언어별	영어
		}else{
			date = yyyy.value + "/" + mm.value + "/" + dd.value;//언어별	한국/중국
		}
		
		target[k].value = date;
	}
	calendarOut();
}

/*
 * 1자리 숫자일 경우, 2자리 숫자형태(ex:01)로 변경 함수
 * d			= 넘어온 정수
 * return 	str	= 변환된 문자
 */
function day2(d) {
	var str = new String();

	if (parseInt(d,10) < 10) {
		str = "0" + parseInt(d,10);
	} else {
		str = "" + parseInt(d,10);
	}
	return str;
}

/*
 * 해당 객체의 위치 구하는 함수
 * obj		: 위치를 계산할 객체
 * return 	: 계산값
 */
function getObjectTop(obj)
{
	var rect = obj.getBoundingClientRect();
    return rect.bottom + (document.documentElement.scrollTop || document.body.scrollTop) - 15;
}

function getObjectLeft(obj)
{
	var rect = obj.getBoundingClientRect();
    return rect.left + (document.documentElement.scrollLeft || document.body.scrollLeft);
}

function changeImgPrevOver()
{
	var preImg = document.getElementById("arrow_prev");
	preImg.src = imgArrowPrevOver[0];
}

function changeImgPrevOut()
{
	var preImg = document.getElementById("arrow_prev");
	preImg.src = imgArrowPrevOver[1];
}

function changeImgNextOver()
{
	var preImg = document.getElementById("arrow_next");
	preImg.src = imgArrowNextOver[0];
}

function changeImgNextOut()
{
	var preImg = document.getElementById("arrow_next");
	preImg.src = imgArrowNextOver[1];
}

/* datePicker 호출 함수
 *
 * 사용방법)
 * <input type="text" name="date" /> //데이터가 입력될 필드
 * <input type="button" onclick="callDatePicker('date');" /> //달력 호출 함수 실행
 *
 * obj		: 값을 반환하는 객체
 */
function callDatePicker(obj) {
	var tempObj = document.getElementsByName(obj)[0];
	scTarget(tempObj);
}