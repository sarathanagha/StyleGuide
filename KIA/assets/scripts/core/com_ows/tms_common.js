/*
 * written by bkLove(최병국)
 * 
   Fucntion List
  -------- -------------------------------- -------- ------------------------------------------------------------------------------
           Fucntion Name                     사용유무             Description
  -------- -------------------------------- -------- ------------------------------------------------------------------------------
    001    StringBuffer                         Y       Array로 버퍼형태 생성
    002    append                               Y       append시 Array에 추가
    003    toString                             Y       toString시 Array정보 출력
    004    trim                                 Y       해당 문자열의 공백을 제거한다.
    005    fn_isNull                            Y       널인지 점검한다.
    006    fn_setAtt                            Y       속성값을 설정한다.
    007       fn_getChildNode                      Y       선택한 객체의 하위 객체중 sName에 해당하는 이름의 객체를 리턴한다.
  -------- -------------------------------- -------- ------------------------------------------------------------------------------
*/

/************************************************************************
 함수명 : StringBuffer
 설 명  : Array로 버퍼형태 생성
 사용법 : new StringBuffer()
 작성일 : 2010-07-23
 작성자 : 유비스티  bkLove(최병국)
 수정일    수정자    수정내용
 ------   ------    -------------------
************************************************************************/
var StringBuffer = function() 
{
    this.buffer = new Array();
}

/************************************************************************
 함수명 : append
 설 명  : append시 Array에 추가
 사용법 : sb.append("data")
 작성일 : 2010-07-23
 작성자 : 유비스티  bkLove(최병국)
 수정일    수정자    수정내용
 ------   ------    -------------------
************************************************************************/
StringBuffer.prototype.append = function(obj) 
{
    this.buffer.push(obj);
}

/************************************************************************
 함수명 : toString
 설 명  : toString시 Array정보 출력
 사용법 : sb.toString()
 작성일 : 2010-07-23
 작성자 : 유비스티  bkLove(최병국)
 수정일    수정자    수정내용
 ------   ------    -------------------
************************************************************************/
StringBuffer.prototype.toString = function()
{
    return this.buffer.join("");
}

/************************************************************************
 함수명 : trim
 설 명  : 해당 문자열의 공백을 제거한다.
 사용법 : str.trim()
 작성일 : 2010-07-23
 작성자 : 유비스티  bkLove(최병국)
 수정일    수정자     수정내용
 ------   ------    -------------------
************************************************************************/
String.prototype.trim = function() 
{
    return this.replace(/^\s+|\s+$/g, "");
}

/************************************************************************
 함수명 : fn_isNull
 설 명  : 널인지 점검한다.
 사용법 : fn_isNull( startDate )
 작성일 : 2010-07-23
 작성자 : 유비스티  bkLove(최병국)
 수정일    수정자    수정내용
 ------   ------    -------------------
************************************************************************/
function fn_isNull( asValue ) 
{
    if (asValue == null || asValue == undefined || asValue.toString().replace(/ /g,"") == "") 
    {
        return  true;
    }

    return false;
}

/************************************************************************
 함수명 : fn_setAtt
 설 명  : 속성값을 설정한다.
 사용법 : fn_setAtt( "startDate", "value", "" )
 작성일 : 2010-07-23
 작성자 : 유비스티  bkLove(최병국)
 수정일    수정자    수정내용
 ------   ------    -------------------
************************************************************************/
function fn_setAtt( name, att, value ) 
{
    if( fn_isNull(name) )    return;

    try 
    {
        var names = name.split(",");
        for( var i=0; i < name.split(",").length; i++ ) 
        {
            if( "true" == value || "false" == value ) 
            {
                eval( "document.getElementById('"+names[i]+"')." + att + "=" + value );
            } 
            else 
            {
                eval( "document.getElementById('"+names[i]+"')." + att + "= \"" + value + "\"" );
            }
        }
    } 
    catch(ex) 
    {
        alert(  '오류위치 = tms_common.fn_setAtt \n' +
                '오류내역 = [' + ex.description + ']' );
    }
}

/************************************************************************
함수명 : f_getChildNode
설 명  : 선택한 객체의 하위 객체중 sName에 해당하는 이름의 객체를 리턴한다.
사용법 : f_getChildNode( form, "startDate" )
작성일 : 2010-07-26
작성자 : 유비스티  bkLove(최병국)
수정일    수정자    수정내용
------   ------    -------------------
************************************************************************/
function fn_getChildNode( oTarget, sName )
{
    var f = oTarget.getElementsByTagName("*");
    var arrR  = null;
    sName = fn_isNull(sName) ? "" : sName;

     for( p in f )
     {
        if( f[p].name == sName || f[p].id == sName ) 
        {
             arrR = f[p];
             break;
        }
     }
    return arrR;
}
/************************************************************************
함수명 : fn_GetEvent
설 명  : 키코드 정보 획득
사용법 : fn_GetEvent(event)
작성일 : 2010-08-04
작성자 : 컨피테크 오국헌
수정일    수정자    수정내용
------   ------    -------------------
************************************************************************/
function fn_GetEvent(e)
{
    if(navigator.appName == 'Netscape')
    {
        keyVal = e.which;
    }
    else
    {
        keyVal = event.keyCode ;
    }
    return keyVal;
}
/************************************************************************
함수명 : fn_numbersonly
설 명  : 숫자만 입력되게 한다.
사용법 : onkeydown="fn_numbersonly(event);" style="ime-mode:disabled"
	     onkeypress는 아스키코드라서 키코드값이 틀리니 onkeydown으로 해야함
작성일 : 2010-08-04
작성자 : 컨피테크 오국헌
수정일    수정자    수정내용
------   ------    -------------------
************************************************************************/
function fn_numbersonly(evt)
{
    var myEvent = window.event ? window.event : evt;
    var isWindowEvent = window.event ? true : false;
    var keyVal = fn_GetEvent(evt);
    var result = false;
    if(myEvent.shiftKey)
    {
        result = false;
    }
    else
    {
    	if((keyVal >= 48 && keyVal <=57) || (keyVal >= 96 && keyVal <=105) || (keyVal == 8) || (keyVal == 9) || (keyVal == 37) || (keyVal == 39) || (keyVal == 46))
        {
            result = true;
        }
        else
        {
            result = false;
        }
    }
    if(!result)
    {
        if(!isWindowEvent)
        {
            myEvent.preventDefault();
        }
        else
        {
            myEvent.returnValue=false;
        }
    }
}
/************************************************************************
함수명 : fn_stronly
설 명  : 문자&숫자만 입력되게 한다.
사용법 : onkeydown="fn_stronly(event);" style="ime-mode:disabled"
작성일 : 2010-08-04
작성자 : 컨피테크 오국헌
수정일    수정자    수정내용
------   ------    -------------------
************************************************************************/
function fn_stronly(evt)
{
    var myEvent = window.event ? window.event : evt;
    var isWindowEvent = window.event ? true : false;
    var keyVal = fn_GetEvent(evt);
    var result = false;
    if(myEvent.shiftKey)
    {
        result = false;
    }
    else
    {
        if((keyVal > 32 && keyVal < 37 || keyVal > 57 && keyVal < 65) || (keyVal > 90 && keyVal < 97) || (keyVal > 105 && keyVal < 223))
        {
            result = false;
        }
        else
        {
            result = true;
        }
    }
    if(!result)
    {
        if(!isWindowEvent)
        {
            myEvent.preventDefault();
        }
        else
        {
            myEvent.returnValue=false;
        }
    }
}
/************************************************************************
함수명 : fn_checkAll(obj1,obj2)
설 명  : 체크박스 전체 선택
사용법 : onClick="fn_checkAll(testFrom.chk_All, testForm.chkUserID)"
         isy/icc/ComCdProcess.jsp 참고
작성일 : 2010-08-09
작성자 : 컨피테크 오국헌
수정일   수정자    수정내용
------   ------    -------------------
************************************************************************/
function fn_checkAll(obj1, obj2)
{
    if (obj1 == null || obj2 == null) return;

    var isCheck = obj1.checked;

    if (obj2.length > 1)
    {
        for (var i=0; i<obj2.length; i++)
        {
           obj2[i].checked = isCheck;
        }
    }
    else
    {
        obj2.checked = isCheck;
    }
}
/************************************************************************
함수명 : fn_checkBytes(expression)
설 명  : 한글(2Byte), 영문,숫자(1Byte)로 계산된 문자열의 실제 바이트수를 리턴하는 함수
사용법 : fn_checkBytes(value);
         isy/usm/UserRegist.jsp 참고
작성일 : 2010-08-09
작성자 : 컨피테크 오국헌
수정일   수정자    수정내용
------   ------    -------------------
************************************************************************/
function fn_checkBytes(expression)
{
    var VLength=0;
    var temp = expression;
    var EscTemp;
    if(temp!="" & temp !=null)
    {
        for(var i=0;i<temp.length;i++)
        {
            if (temp.charAt(i)!=escape(temp.charAt(i)))
            {
                EscTemp=escape(temp.charAt(i));
                if (EscTemp.length>=6)
                {
                    VLength+=2;
                }
                else
                {
                    VLength+=1;
                }
            }
        }
    }
    else
    {
        VLength+=1;
    }
    return VLength;
}
/************************************************************************
함수명 : fn_check_browser()
설 명  : 브라우저 체크
사용법 : fn_check_browser();
작성일 : 2010-11-17
작성자 : 컨피테크 오국헌
수정일   수정자    수정내용
------   ------    -------------------
************************************************************************/
function fn_check_browser()
{
    var chkBrs = "";
    if (navigator.appName.indexOf("Microsoft") != -1)
    {
        chkBrs = "ie"; // Internet Explorer
        return chkBrs; 
    }
    else if(navigator.appName.indexOf("Netscape") != -1)
    {
        if(navigator.appVersion.indexOf("Chrome") != -1)
        {
            chkBrs = "cr"; // Chrome
            return chkBrs; 
        }
        else if(navigator.appVersion.indexOf("Safari") != -1)
        {
        	chkBrs = "sa"; // Safari
            return chkBrs;
        }
        else
        {
        	chkBrs = "ff"; // Mozilla Firefox
            return chkBrs;
        }
    }
    else
    {
    	return chkBrs; 
    }
}

function bluring(){
if(event.srcElement.tagName=="A"||event.srcElement.tagName=="IMG"||event.srcElement.tagName=="INPUT" && (event.srcElement.type=="radio" || event.srcElement.type=="checkbox" || event.srcElement.type=="button" || event.srcElement.type=="image")) document.body.focus();
}
/* 프리로드이미지 */
function MM_swapImgRestore() { //v3.0
  var i,x,a=document.MM_sr; for(i=0;a&&i<a.length&&(x=a[i])&&x.oSrc;i++) x.src=x.oSrc;
}
function MM_preloadImages() { //v3.0
  var d=document; if(d.images){ if(!d.MM_p) d.MM_p=new Array();
    var i,j=d.MM_p.length,a=MM_preloadImages.arguments; for(i=0; i<a.length; i++)
    if (a[i].indexOf("#")!=0){ d.MM_p[j]=new Image; d.MM_p[j++].src=a[i];}}
}

function MM_findObj(n, d) { //v4.01
  var p,i,x;  if(!d) d=document; if((p=n.indexOf("?"))>0&&parent.frames.length) {
    d=parent.frames[n.substring(p+1)].document; n=n.substring(0,p);}
  if(!(x=d[n])&&d.all) x=d.all[n]; for (i=0;!x&&i<d.forms.length;i++) x=d.forms[i][n];
  for(i=0;!x&&d.layers&&i<d.layers.length;i++) x=MM_findObj(n,d.layers[i].document);
  if(!x && d.getElementById) x=d.getElementById(n); return x;
}

function MM_swapImage() { //v3.0
  var i,j=0,x,a=MM_swapImage.arguments; 
  document.MM_sr=new Array;
  for(i=0;i<(a.length-2);i+=3)
   if ((x=MM_findObj(a[i]))!=null)
   {
	   document.MM_sr[j++]=x;
	   if(!x.oSrc) x.oSrc=x.src; 
	               x.src=a[i+2];
   }
}

	
/************************************************************************
함수명 : verScroll()
설 명  : 스크롤바를 버튼으로 ...
사용법 : verScroll("left", "1")   onMouseOver에 사용할경우 자동으로 이동 됩니다
                                 dir: 이동할방향 "left", "right"
                                 spd: 이동속도(높을수록 빠름)
        stopScroll()             onMouseOut에 사용할경우 자동으로 멈춥니다        
작성일 : 2011-07-01
작성자 : 컨피테크 이영탁
수정일   수정자    수정내용
------   ------    -------------------
************************************************************************/
function verScroll(dir, spd) 
{ 
    loop = true; 
    direction = "left"; 
    speed = 10; 
    scrolltimer = null; 
    if (document.layers)
	{ 
        var page = eval(document.contentLayer); 
    } 
    else
	{ 
        if (document.getElementById) { 
            var page= eval("document.getElementById('contentLayer').style"); 
        } 
        else
	    { 
            if (document.all)
		    { 
                var page = eval(document.all.contentLayer.style); 
            } 
        } 
    } 
    direction = dir; 
    speed = parseInt(spd); 
    var x_pos = parseInt(page.left); 
    var y_pos = parseInt(page.left)+550;
    if (loop == true) 
	{ 
        if (direction == "right" && y_pos > 600) 
		{ 
            page.left = (x_pos - (speed)); 
        }
		else
		{ 
            if (direction == "left" && x_pos < 70) { 
                page.left = (x_pos + (speed)); 
            }
        } 
        scrolltimer = setTimeout("verScroll(direction,speed)", 1); 
    } 
} 

function stopScroll() { 
    loop = false; 
    clearTimeout(scrolltimer); 
} 

/************************************************************************
함수명 : fn_printPage()
설 명  : 영역 프린트
사용법 : fn_printPage(idName)
        idName: 프린트 할 영역의 ID
작성일 : 2011-12-12
작성자 : 컨피테크 이영탁
수정일   수정자    수정내용
------   ------    -------------------
************************************************************************/
function fn_printPage(idName){

 var printpop = window.open(
 ''
 ,'prt'
 ,'dependent,location=no,toolbar=yes, menubar=yes, resizable=yes,scrollbars=yes,width=800,height=500'
 );
 
 var tmp = printpop.document;
 tmp.write(document.getElementById(idName).outerHTML);
 tmp.close();
 printpop.print();
 printpop.close();
} 
