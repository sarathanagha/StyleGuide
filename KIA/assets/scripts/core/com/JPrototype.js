<!--
/*********************************************************
자주사용되는 prototype function 구현

*@author  장정훈
*@date  2010.05.04
**********************************************************/

/*-----------------------------------------------------------------------------
* select object의 관리를 용이하게 하기위한 객체
*
* param count : 1
* param 1 : select object - select 객체
*
* ex)var select	= new JSelect(selectObj);
-----------------------------------------------------------------------------*/
function JSelect(){
	if(arguments[0].nodeName.toUpperCase()!="SELECT"){
		alert("It's not select object.");
		return;
	}
	this.select	= arguments[0];
	/*-----------------------------------------------------------------------------
	* selectbox의 value setting
	*
	* param count : 1
	* param 1 : string		- value
	* return none
	*
	* ex)setValue(2);
	-----------------------------------------------------------------------------*/
	this.setValue	= function (){
		this.select.value	= arguments[0];
	}
	/*-----------------------------------------------------------------------------
	* selectbox의 value getting
	*
	* param count : 0
	* return none
	*
	* ex)getValue();
	-----------------------------------------------------------------------------*/
	this.getValue	= function (){
		return this.select.value;
	}

	/*-----------------------------------------------------------------------------
	* selectbox의 모든 옵션 삭제
	*
	* param count : 1
	* param 1 : obj/object		- 셀렉트박스객체
	* return none
	*
	* ex)delItemsAll(selectObj);
	-----------------------------------------------------------------------------*/
	this.delItemsAll	= function (){
		try{
			for (var i=this.select.options.length; 0 < i; i--)	{
				this.select.options[i-1]	= null;
			}
			return this;
		}catch(e){
			alert("delItemsAll error : "+e+" : "+e.description);
		}
	}

	/*-----------------------------------------------------------------------------
	* selectbox의 해당 value를 가지는 옵션 삭제
	*
	* param count : 1
	* param 1 : 삭제 대상 value
	* return none
	*
	* ex)delItemByValue(29);
	-----------------------------------------------------------------------------*/
	this.delItemByValue	=function (){
		var val	= this.select.value;
		try{
			for (var i=this.select.options.length; 0 < i; i--)	{
				if(this.select.options[0].value==arguments[0]){
					this.select.options[i-1]	= null;
					break;
				}
			}
			this.select.value	= val;
			return this;
		}catch(e){
			alert("delItemByValue error : "+e+" : "+e.description);
		}
	}

	/*-----------------------------------------------------------------------------
	* selectbox의 option을 입력된 시작부터 끝 인덱스 까지 삭제
	*	만약 끝 인자를 두개만 던진다면...
	*	끝 인덱스는 selectbox의 마지막 index로 디폴트설정됨
	* param count : 1
	* param 1 : 삭제 시작 index
	* param 2 : 삭제 끝 index
	* return none
	*
	* ex)delItemByIndex(28,30);
	-----------------------------------------------------------------------------*/
	this.delItemByIndex	=function (){
		var val	= this.select.value;
		try{
			if(arguments.length==1){
				arguments	= new Array(arguments[0],this.select.options.length-1);
			}
			for (var i=arguments[1]; arguments[0] <= i; i--)	{
				this.select.options[i]	= null;
			}
			this.select.value	= val;
			return this;
		}catch(e){
			alert("delItemByIndex error : "+e+" : "+e.description);
		}
	}

	/*-----------------------------------------------------------------------------
	* selecbox에 옵션 추가
	*
	* param count : 3
	* param 1 : value/String		- 옵션의 value
	* param 2 : text/String	- 옵션의 innerText
	* return none
	*
	* ex)select.addItem("M","남자");
	-----------------------------------------------------------------------------*/
	this.addItem	=function (){
		try{
			this.select.options[this.select.options.length] = new Option(arguments[1], arguments[0], false, false);
			return this;
		}catch(e){
			alert("addItem error : "+e+" : "+e.description);
		}
	}
	/*-----------------------------------------------------------------------------
	* selecbox의 size
	*
	* param count : 3
	* param 1 : text/String		- 옵션의 value
	* param 2 : value/String	- 옵션의 innerText
	* return int
	*
	* ex)addItem(selectObj,"M","남자");
	-----------------------------------------------------------------------------*/
	this.length	=function (){
		try{
			return this.select.options.length;
		}catch(e){
			alert("length error : "+e+" : "+e.description);
		}
	}
}


/*-----------------------------------------------------------------------------
* Date object의 관리를 용이하게 하기위한 객체
* 생성시 인자가 없을경우 금일을 default로 설정한다.
*
* param count : 0 or 3
* param 1 : select object - select 객체
*
* ex)	var date	= new JDate(2008,08,18);
*		var date	= new JDate();
*		var date	= new Date(true,'20090401');
*		var date	= new Date(new Date(2009,03,01));
-----------------------------------------------------------------------------*/

function JDate(){
	this.date		= null;
	this.weekKor	= new Array("일요일","월요일","화요일","수요일","목요일","금요일","토요일");
	this.weekEng	= new Array("Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday");

	try{
		if(arguments.length==0){
			this.date	= new Date();	//현재시각으로 새로운 date생성

		}else if(arguments.length==1){
			this.date	= arguments[0];	//date객체 입력

		}else if(arguments.length==2 && arguments[0]==true){

			arguments[1]	= arguments[1].replaceAll(".","").replaceAll("-","").replaceAll("/","");
			if(arguments[1].length>8){
				arguments[1]	= arguments[1].substring(0,8);
			}
			if(arguments[1].trim().length!=8){
				alert("Invalid date format.["+arguments[1]+"]");
			}

			var yyyy	= parseInt(arguments[1].substring(0,4));
			var mm		= parseInt(arguments[1].substring(4,6))-1;
			var	dd		= parseInt(arguments[1].substring(6));

			this.date	= new Date(yyyy,mm,dd);	//년월입력

		}else if(arguments.length==2){
			this.date	= new Date(arguments[0],(arguments[1]*1)-1,1);	//년월입력

		}else if(arguments.length==3){
			this.date	= new Date(arguments[0],(arguments[1]*1)-1,arguments[2]);//년월일 입력
		}
	}catch( e ){
		alert("JDate Arguments Error! \n\n ex) new JDate(2008,08,18);\n     new JDate(new Date(2008,07,18));\n     new JDate();");
		return;
	}

	/*-----------------------------------------------------------------------------
	* 설정일의 년도 반환
	*
	* param count : 0
	* return int
	*
	* ex)getYear();
	-----------------------------------------------------------------------------*/
	this.getYear		= function(){
		return this.date.getYear();
	}
	/*-----------------------------------------------------------------------------
	* 설정일의 월 반환
	*
	* param count : 0
	* return int
	*
	* ex)getMonth();
	-----------------------------------------------------------------------------*/
	this.getMonth		= function(){
		return this.date.getMonth()+1;
	}
	/*-----------------------------------------------------------------------------
	* 설정일의 일 반환
	*
	* param count : 0
	* return int
	*
	* ex)getDate();
	-----------------------------------------------------------------------------*/
	this.getDate		= function(){
		return this.date.getDate();
	}
	/*-----------------------------------------------------------------------------
	* 설정일의 요일 반환
	*
	* param count : 0
	* return int
	*
	* ex)getDay();
	-----------------------------------------------------------------------------*/
	this.getDay		= function(){
		return this.date.getDay();
	}
	/*-----------------------------------------------------------------------------
	* 설정일의 시각 반환
	*
	* param count : 0
	* return int
	*
	* ex)getHours();
	-----------------------------------------------------------------------------*/
	this.getHours		= function(){
		return this.date.getHours();
	}
	/*-----------------------------------------------------------------------------
	* 설정일의 분 반환
	*
	* param count : 0
	* return int
	*
	* ex)getMinutes();
	-----------------------------------------------------------------------------*/
	this.getMinutes		= function(){
		return this.date.getMinutes();
	}
	/*-----------------------------------------------------------------------------
	* 설정일의 초 반환
	*
	* param count : 0
	* return int
	*
	* ex)getSeconds();
	-----------------------------------------------------------------------------*/
	this.getSeconds		= function(){
		return this.date.getSeconds();
	}
	/*-----------------------------------------------------------------------------
	* 설정일의 밀리초 반환
	*
	* param count : 0
	* return int
	*
	* ex)getMilliseconds();
	-----------------------------------------------------------------------------*/
	this.getMilliseconds		= function(){
		return this.date.getMilliseconds();
	}
	/*-----------------------------------------------------------------------------
	* 설정일의 월별 최종일 반환
	*
	* param count : 0
	* return 연관배열
	*
	* ex)getDaysOfYear();
	-----------------------------------------------------------------------------*/
	this.getDaysOfYear	= function(){
		var monObj	= {
			1: 31,2: 28,3: 31,4: 30,5: 31,6: 30
			,7: 31,8: 31,9: 30,10: 31,11: 30,12: 31
		};
		if (((this.getYear() % 4 == 0) && (this.getYear() % 100 != 0)) || (this.getYear() % 400 == 0)){
			monObj[2]	= 29;
		}else{
			monObj[2]	= 28;
		}
		return monObj;
	}
	/*-----------------------------------------------------------------------------
	* 설정년월 또는 입력 년월의 월별 최종일 반환
	*
	* param count : 0/1/2
	* return int
	*
	* ex)	getDayOfMonth();
	*		getDayOfMonth(02);
	*		getDayOfMonth(2008,02);
	-----------------------------------------------------------------------------*/
	this.getDaysOfMonth	= function(){
		var monObj	= {
			1: 31,2: 28,3: 31,4: 30,5: 31,6: 30
			,7: 31,8: 31,9: 30,10: 31,11: 30,12: 31
		};
		if(arguments.length==2){
			//입력된 년월의 최종일 검색
			if (((this.getYear() % 4 == 0) && (this.getYear() % 100 != 0)) || (this.getYear() % 400 == 0)){
				monObj[2]	= 29;
			}else{
				monObj[2]	= 28;
			}
			arguments		= new Array(arguments[1],0);
		}else{
			//설정 년월의 최종일 검색
			if (((this.getYear() % 4 == 0) && (this.getYear() % 100 != 0)) || (this.getYear() % 400 == 0)){
				monObj[2]	= 29;
			}else{
				monObj[2]	= 28;
			}
			if(arguments.length==0){
				arguments		= new Array(this.getMonth(),0);
			}
		}
		return monObj[arguments[0]];
	}
	/*-----------------------------------------------------------------------------
	* 생성시간을 입력받은 format의 문자열로 반환
	*		yyyy	Year - 2007
	*		yy		Year - 07
	*		mm		Month in year - 01~12
	*		dd		Day in month - 01~31
	*		hh		Hour in day - 0-23
	*		kk		Hour in day - 1-24
	*		hk		Hour in day - 0-11
	*		kh		Hour in day - 1-12
	*		kap		Am/Pm marker - 오전/오후
	*		eap		Am/Pm marker - PM/AM
	*		mi		Minute in hour - 00~59
	*		ss		Second in minute - 00~59
	*		mls		Millisecond - 000~999
	*		kwf		Day Of Week(korean) - 일요일~토요일
	*		kw		Day Of Week(korean) - 일~토
	*		ewf		Day Of Week(English) - Sun~Sat
	*		ew		Day Of Week(English) - sunday~Saturday
	* @return : String
	*
	* ex) format('yyyy-mm-dd, {hk kap}{hk eap} hh:mi:ss mls [kwf][kw] [ewf][ew]');
	----------------------------------------------------------------------------*/
	this.format = function(){
		if(arguments[0]==null || arguments[0].length==0){ alert("Input Date Format, Please.");return null;}
		arguments[0]	= arguments[0].toLowerCase();

		var yyyy	= this.getYear()+"";
		var yy		= yyyy.substring(2);
		var mm		= (this.getMonth())+"";
		var dd		= this.getDate()+"";
		var hh		= this.getHours()+"";
		var hk		= (this.getHours()%12==0)?"12":((this.getHours()%12)+"");
		var kk		= hh=="0"?"24":hh;
		var kap		= this.getHours()>11?"오후":"오전";
		var eap		= this.getHours()>11?"PM":"AM";
		var mi		= this.getMinutes()+"";
		var ss		= this.getSeconds()+"";
		var mls		= this.getMilliseconds()+"";
		var kwf		= this.weekKor[this.getDay()];
		var kw		= kwf.substring(0,1);
		var ewf		= this.weekEng[this.getDay()];
		var ew		= ewf.substring(0,3);

		mm			= mm.length==1?"0"+mm:mm;
		dd			= dd.length==1?"0"+dd:dd;
		hh			= hh.length==1?"0"+hh:hh;
		hk			= hk.length==1?"0"+hk:hk;
		kk			= kk.length==1?"0"+kk:kk;
		mi			= mi.length==1?"0"+mi:mi;
		ss			= ss.length==1?"0"+ss:ss;
		while(mls.length<3){mls = "0"+mls;}

		return arguments[0].replaceAll("yyyy",yyyy)
			.replaceAll("yy",yy)
			.replaceAll("mm",mm)
			.replaceAll("dd",dd)
			.replaceAll("hh",hh)
			.replaceAll("hk",hk)
			.replaceAll("kk",kk)
			.replaceAll("kap",kap)
			.replaceAll("eap",eap)
			.replaceAll("mi",mi)
			.replaceAll("ss",ss)
			.replaceAll("mls",mls)
			.replaceAll("kwf",kwf)
			.replaceAll("kw",kw)
			.replaceAll("ewf",ewf)
			.replaceAll("ew",ew)
		;
	}
	/*-----------------------------------------------------------------------------
	* 현재일자와 파라미터의 일자간의 차이를 반환한다.
	* 파라미터가 없을경우 현재일자와의 차이를 계산한다.
	*
	*@ return 날짜 간격(일 단위)
	*@ ex)  jdate.betweenDay(new Date(2009,01,02));
	*       jdate.betweenDay();
	----------------------------------------------------------------------------*/
	this.betweenDay = function(){

		var tDate	= new Date();

		if(arguments.length!=0 && arguments[0]!=null){
			tDate	= arguments[0];
		}
		var times1	= this.date.getTime();
		var times2	= tDate.getTime();
		return parseInt((times2-times1)/(1000*3600*24));

	}
}


/*-----------------------------------------------------------------------------
* 문자열 치환.
*
* param count : 2
* param 1 : String		- 치환 전 문자열
* param 2 : String		- 치환 후 문자열
*
* return String			- 치환된 문자열
*
* ex)	var k	= "AA".replaceAll("A","a");
-----------------------------------------------------------------------------*/
if(!String.prototype.replaceAll){
	String.prototype.replaceAll = function() {
		if(arguments.length!=2){
			return null;
		}
		var v_regstr = arguments[0];
		v_regstr = v_regstr.replace(/\\/g, "\\\\");
		v_regstr = v_regstr.replace(/\^/g, "\\^");
		v_regstr = v_regstr.replace(/\$/g, "\\$");
		v_regstr = v_regstr.replace(/\*/g, "\\*");
		v_regstr = v_regstr.replace(/\+/g, "\\+");
		v_regstr = v_regstr.replace(/\?/g, "\\?");
		v_regstr = v_regstr.replace(/\./g, "\\.");
		v_regstr = v_regstr.replace(/\(/g, "\\(");
		v_regstr = v_regstr.replace(/\)/g, "\\)");
		v_regstr = v_regstr.replace(/\|/g, "\\|");
		v_regstr = v_regstr.replace(/\,/g, "\\,");
		v_regstr = v_regstr.replace(/\{/g, "\\{");
		v_regstr = v_regstr.replace(/\}/g, "\\}");
		v_regstr = v_regstr.replace(/\[/g, "\\[");
		v_regstr = v_regstr.replace(/\]/g, "\\]");
		v_regstr = v_regstr.replace(/\-/g, "\\-");
		var re = new RegExp(v_regstr, "g");
		return this.replace(re, arguments[1]);
	}
}
/*-----------------------------------------------------------------------------
* 대소문자 구분없는 비교.
*
* param count : 1
* param 1 : String		- 비교문자열
*
* return boolean		- whether they are same or not
*
* ex)	if("aa".equalsIgnoreCase("AA")){}
-----------------------------------------------------------------------------*/
if(!String.prototype.equalsIgnoreCase){
	String.prototype.equalsIgnoreCase = function() {
		if(arguments.length!=1){
			return false;
		}
		if(this.toUpperCase()==arguments[0].toUpperCase()){
			return true;
		}
		return false;
	}
}

if(String.ignoreCaseIndexOf==undefined){
	String.prototype.ignoreCaseIndexOf = function() {
		return (this.toUpperCase().indexOf(arguments[0].toUpperCase())>=0)?true:false;
	}
}

/*-----------------------------------------------------------------------------
* 좌우공백제거
*
* return String
*
* ex) " aa   ".trim()
-----------------------------------------------------------------------------*/
if(!String.prototype.trim){
	String.prototype.trim = function() {
		return this.replace(/(^\s*)|(\s*$)/g, "");
	}
}
/*-----------------------------------------------------------------------------
* null 처리
*
* return String
*
* ex) " aa   ".nvl()
-----------------------------------------------------------------------------*/
if(!String.prototype.nvl){
	String.prototype.nvl = function() {
		if(this==null || this=='null'){
			return '';
		}else{
			return this;
		}
	}
}
/*-----------------------------------------------------------------------------
* 문자열의 시작부위 비교
*
* return boolean
*
* ex) "아름다운".startsWith("아")
-----------------------------------------------------------------------------*/
if(!String.prototype.startsWith){
	String.prototype.startsWith = function() {
		var tmp	= this.substring(0,arguments[0].length);
		if(tmp	== arguments[0]){
			return true;
		}
		return false;
	}
}
/*-----------------------------------------------------------------------------
* 문자열의 끝부위 비교
*
* return boolean
*
* ex) "아름다운".endsWith("다운")
-----------------------------------------------------------------------------*/
if(!String.prototype.endsWith){
	String.prototype.endsWith = function() {

		var tmp	= this.substring(this.length-arguments[0].length);

		if(tmp	== arguments[0]){
			return true;
		}
		return false;
	}
}
/*-----------------------------------------------------------------------------
* 다음의 comma로 구분된 문자열에 포함되는지여부 조사
*
* return boolean
*
* ex) "다운".contained("아,름,다운")
-----------------------------------------------------------------------------*/
if(!String.prototype.contained){
	String.prototype.contained = function() {
		if(arguments[0].indexOf(this)>=0){
			return true;
		}
		return false;
	}
}
/*-----------------------------------------------------------------------------
* 다음의 comma로 구분된 문자열에 포함되는지여부 조사
*
* return boolean
*
* ex) "아,름,다운".contain("름")
-----------------------------------------------------------------------------*/
if(!String.prototype.contain){
	String.prototype.contain = function() {
		if(this.indexOf(arguments[0])>=0){
			return true;
		}
		return false;
	}
}


/*-----------------------------------------------------------------------------
*  전화번호 체크 - arguments[0] : 전화번호 구분자
*
*  @return : boolean
*
* ex)" aa".isPhone()
-----------------------------------------------------------------------------*/
if(!String.prototype.isPhone){
	String.prototype.isPhone = function() {
		 var arg = arguments[0] ? arguments[0] : "";
		 return eval("(/(02|0[3-9]{1}[0-9]{1})" + arg + "[1-9]{1}[0-9]{2,3}" + arg + "[0-9]{4}$/).test(this)");
	}
}
/*-----------------------------------------------------------------------------
* 이메일의 유효성을 체크
*
*  @return : boolean
*
* ex)" aa".isEmail()
-----------------------------------------------------------------------------*/
if(!String.prototype.isEmail){
	String.prototype.isEmail = function() {
		 return (/\w+([-+.]\w+)*@\w+([-.]\w+)*\.[a-zA-Z]{2,4}$/).test(this.trim());

	}
}
/*-----------------------------------------------------------------------------
* 특정문자(열) 모두 제거
*
* return String
*
* ex) " aa   ".remove( "<",">","'",... )
-----------------------------------------------------------------------------*/
if(!String.prototype.remove){
	String.prototype.remove = function() {
		var rstStr	= this;
		for(var i=0;i<arguments.length;i++){
			rstStr	= rstStr.replaceAll(arguments[i],"");
		}
		return rstStr;
	}
}

if(Array.push==undefined){
	Array.prototype.push=function(){
		for(var i=0;i!=arguments.length;i++){
			this[this.length]=arguments[i];
		}
		return this.length;
	}
}



/*-----------------------------------------------------------------------------
* 해당 페이지의 모든 select/input 필드에 prototype을 첨가한다.
*
* param count : 0
*
* ex)	setComponentProtorype();
-----------------------------------------------------------------------------*/
function setComponentProtorype(){
	setSelectProtorype();
	setInputProtorype();
}


/*-----------------------------------------------------------------------------
* 해당 페이지의 모든 select 필드에 prototype을 첨가한다.
*
* param count : 0
*
* ex)	setSelectProtorype();
-----------------------------------------------------------------------------*/
function setSelectProtorype(){
	if(arguments.length==0 || arguments[0]==null){
		arguments	= new Array(document.getElementsByTagName("select"));
	}
	for(var i=0;i<arguments[0].length;i++){
		AddSelectProtorype(arguments[0][i]);
	}
}
/*-----------------------------------------------------------------------------
* Input object의 관리를 용이하게 하기위한 객체
* argument input object에 prototype function을 첨가한다.
*
* param count : 1
* param 1 : input object - input 객체
*
* ex)	AddProtorype(inputObj);
-----------------------------------------------------------------------------*/
function AddSelectProtorype(){
	this.select	= arguments[0];
	this.select.setValueJ = function() {
		this.value	= arguments[0];
	}
	this.select.getValueJ = function() {
		return this.value;
	}
	this.select.delItemsAllJ	= function (){
		for (var i=this.options.length; 0 < i; i--)	{
			this.options[i-1]	= null;
		}
		return this;
	}
	this.select.delItemByValueJ	=function (){
		var val	= this.value;
		for (var i=this.options.length; 0 < i; i--)	{
			if(this.options[0].value==arguments[0]){
				this.options[i-1]	= null;
				break;
			}
		}
		this.value	= val;
		return this;
	}
	this.select.delItemByIndexJ	=function (){
		var val	= this.value;
		if(arguments.length==1){
			arguments	= new Array(arguments[0],this.options.length-1);
		}
		for (var i=arguments[1]; arguments[0] <= i; i--)	{
			this.options[i]	= null;
		}
		this.value	= val;
		return this;
	}
	this.select.addItemJ	=function (){
		this.options[this.options.length] = new Option(arguments[1], arguments[0], false, false);
		return this;
	}
	this.select.lengthJ	=function (){
		return this.options.length;
	}
}


/*-----------------------------------------------------------------------------
* 해당 페이지의 모든 input text/hidden 필드에 prototype을 첨가한다.
*
* param count : 0
*
* ex)	setInputProtorype();
*		setInputProtorype(document.frm.testInput);
-----------------------------------------------------------------------------*/
function setInputProtorype(){
	if(arguments.length==0 || arguments[0]==null){
		arguments	= new Array(document.getElementsByTagName("input"));
	}else{
		arguments	= new Array(arguments[0]);
	}
	for(var i=0;i<arguments[0].length;i++){
		if(arguments[0][i].type.toUpperCase()=="TEXT" || arguments[0][i].type.toUpperCase()=="HIDDEN" || arguments[0][i].tagName.toUpperCase()=="TEXTAREA"){
			AddInputProtorype(arguments[0][i]);
		}
	}
}

/*-----------------------------------------------------------------------------
* Input object의 관리를 용이하게 하기위한 객체
* argument input object에 prototype function을 첨가한다.
*
* param count : 1
* param 1 : input object - input 객체
*
* ex)	AddProtorype(inputObj);
-----------------------------------------------------------------------------*/
function AddInputProtorype(){
	this.input	= arguments[0];
	this.input.replaceAllJ = function() {
		this.value	= this.value.replaceAll(arguments[0],arguments[1]);
	}
	this.input.pureDateJ = function() {
		this.value	= this.value.remove("-",".","/");
	}
	this.input.formatDateJ	= function(){
		this.pureDateJ();
		if(this.value.length!=8){
			return;
		}
		this.value	= this.value.substring(0,4)
					+arguments[0]+this.value.substring(4,6)
					+arguments[0]+this.value.substring(6);
	}
	this.input.equalsIgnoreCaseJ = function() {
		return this.value.equalsIgnoreCase(arguments);
	}
	this.input.ignoreCaseIndexOfJ = function() {
		return this.value.ignoreCaseIndexOf(arguments);
	}
	this.input.trimJ = function() {
		this.value	= this.value.trim();
	}
	this.input.nvlJ = function() {
		this.value	= this.value.nvl();
	}
	this.input.startsWithJ = function() {
		return this.value.startsWith(arguments);
	}
	this.input.endsWithJ = function() {
		return this.value.endsWith(arguments);
	}
	this.input.containedJ = function() {
		return this.value.contained(arguments);
	}
	this.input.containJ = function() {
		return this.value.contain(arguments);
	}
	this.input.isPhoneJ = function() {
		return this.value.isPhone(arguments);
	}
	this.input.isEmailJ = function() {
		return this.value.isEmail(arguments);
	}
	this.input.removeJ = function() {
		this.value	= this.value.remove(arguments);
	}
}



//-->
