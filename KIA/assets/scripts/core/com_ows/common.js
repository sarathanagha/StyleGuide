/**
 * Supported Browser : MSIE, Chrome , FireFox
 * 
 * Object       : common.js.js
 * Description  : js 파일 설명을 기술합니다.
 * Author       : davidlee
 * Since        : May 30, 2012
 * Version      : 1.0
 * 
 * Modification Information
 *     since          author              description
 *  ===========    =============    ===========================
 *  davidlee     May 30, 2012     최초 생성
 */

    /**
    관리자 UI 관련 js - 이모션 추가
    **/
var objectPrint = "";

function uf_popOpen(url, p_w, p_h) {
    window.open(url,"","width="+p_w+",height="+p_h+",toolbar=no,scrollbars=no,resizable=no" );
}

function uf_popOpen_s(url, p_w, p_h) {
    window.open(url,"","width="+p_w+",height="+p_h+",toolbar=no,scrollbars=yes,resizable=no" ); 
}

function keyNumber () {
    if ((event.keyCode<48) || (event.keyCode>57))
        event.returnValue=false;
    return true;
}

function keyNumber2 () {
    if ((event.keyCode<48) || (event.keyCode>57)) {
        if (event.keyCode == 45) {
            return true;
        }else {
            event.returnValue=false;
        }
    }
    
    return true;
}    

function keyNumber3 () {
    if ((event.keyCode<48) || (event.keyCode>57)) {
        if (event.keyCode == 46) {
            return true;
        }else {
            event.returnValue=false;
        }
    }
    
    return true;
}   

function getFileExtension( filePath ) {
    var lastIndex = -1;
    lastIndex = filePath.lastIndexOf('.');
    var extension = "";

    if ( lastIndex != -1 ) {
        extension = filePath.substring( lastIndex+1, filePath.len );
    }else {
        extension = "";
    }

    return extension;
}


function MailCheck(ObjMail) {
    ObjMail = trim(ObjMail);
    if (ObjMail.search(/(\S+)@(\S+)\.(\S+)/) == -1 ) 
    {
        return false;    
    }
    return true;
}   


function trim(str){
    var elen = str.length;
    var slen = 0;
    while( (slen < elen) && str.charAt(slen) == " " )   {   slen++; }
    while( (slen < elen) && str.charAt(elen) == " " )   {   elen --;    }
    return ((slen>0) || (elen<str.length) ) ? str.substring(slen,elen): str;
}



function autoskip(inputname, nextinputname, length) {
    if((event.keyCode == 13) || (inputname.value.length >= length))
    nextinputname.focus();

}


function IsNull(object) {
    var  obj = trim(object.value);
    if(( obj == " ")||( obj == "") || ( obj == null )){
           return false;
    }
    return true;
}


function checkLength(form, maxlength){
    var len = form.value.length;

    if(len > maxlength){
        return false;
    }else{
        return true;
    }
}
    /**
    작성요령
    폼 - 주의
    1. 들여쓰기 - 4칸
    2. 대괄호 끝에, function시작시점에 맞추기
    3. if도 같은 형태로.....
    **/


    /** Date 구분자 **/
    var DATE_SEPERATOR = "-";
    /** 대표번호 구분자 **/
    var NO_SEPERATOR = "-";


    /*= COMMON CONTROL ===========================================================

            1. 일반적으로 obj tag와 관계없이 사용되는 기능.
            2. Function List
                - OpenWindow(theURL, winName, features)
                : 새창 열기
                - CenterOpenWindow(theURL, winName, features)
                : 화면의중앙으로 가는 새창 열기
                - Popup_Window(theURL,winName,width,height,left,top,scrollbars,toolbar,status,resizable,menubar)
                : 사용자가 지정한 변수에 맞게 새 창 열기
                - Alert(message)
                : 메세지를 알리는 메세지박스 표시
                - AlertConfirm(message)
                : 사용자의 의사결정을 포함하는 메세지박스 표시
                - AlertFocus(element, message)
                : 메세지를 알리는 메세지박스 표시 후 Element에 지정된 obj tag 로 focus
                - ShowErrMessage(message)
                : 서버 프로그램에서 생긴 ERROR 를 보여주는 MESSAGEBOX ALERT

    ============================================================================*/

     

    /**
      * 새창열기
      * window.open 에서 사용되는 방식으로 features 설정
      * @param theURL    새창의 Url
      * @param winName   새창의 name
      * @param features  새창의 세부 설정
      * @return
      */
    function OpenWindow(theURL,winName,features) {
      var win = window.open(theURL,winName,features);
      win.focus();
    }

    /**
      * 화면중앙에 새창열기 -2004.09.05일 추가
      * window.open 에서 사용되는 방식으로 features 설정
      * @param theURL    새창의 Url
      * @param winName   새창의 name
      * @param features  새창의 세부 설정
      * @return
      */
    function CenterOpenWindow(theURL, winName, width, height, fstate ) {
        var features = "width=" + width ;
        features += ",height=" + height ;

                var state = "";

                if (fstate == "") {
               state = features + ", left=" + (screen.width-width)/2 + ",top=" + (screen.height-height)/2;
                } else {
               state = fstate + ", " + features + ", left=" + (screen.width-width)/2 + ",top=" + (screen.height-height)/2;
                }

                var win = window.open(theURL,winName,state);

        win.focus();
    }

    /**
      * 사용자가 지정한 변수에 맞게 팝업창 열기 
      * window.open 에서 사용되는 방식으로 features 설정
      * @param theURL    새창의 Url
      * @param winName   새창의 name
      * @param features  새창의 세부 설정
      * @return
      */
    function Popup_Window(theURL,winName,width,height,left,top,scrollbars,toolbar,status,resizable,menubar)
    {
        var features = "width=" + width ;
        features += ",height=" + height ;
        features += ",left=" + left ;
        features += ",top=" + top ;
        features += ",scrollbars=" + scrollbars ;
        features += ",toolbar=" + toolbar ;
        features += ",status=" + status ;
        features += ",resizable=" + resizable ;
        features += ",menubar=" + menubar ;
        var win = window.open(theURL, winName, features);
        win.focus();
    }

    /**
      * 메세지를 알리는 메세지박스 표시
      * @param message   메세지박스에 보여질 메세지
      * @return
      */
    function Alert(message){
      var iLen = message.length;
        if (iLen >= 1) {
            alert(message);
        }
    }

    /**
      * 사용자의 의사결정을 포함하는 메세지박스 표시
      * @param message   메세지박스에 보여질 메세지
      * @return 1 : 확인,  0 : 취소
     */
    function AlertConfirm(message) {
        if(confirm(message)==1) {
            return 1;
        } else {
            return 0;
        }
    }

    /**
      * 메세지를 알리는 메세지박스 표시 후 Element에 지정된 obj tag 로 focus
      * @param obj   focus 를 가질 Object
      * @param message   메세지박스에 보여질 메세지
      * @return
     */
    function AlertFocus(obj, message ) {
        if ( message != '') //alertPopup.open( message,"" );
            {
               alert(message);
            }
        obj.focus();
        if (obj.type == 'text' && obj.value.length >=1 ) obj.select();
        return ;
    }

    function AlertFocusV2(obj, message) {
        if ( message != '') 
            {
            alertPopup.open( message,"UVO");
            }
        obj.focus();
        if (obj.type == 'text' && obj.value.length >=1 ) obj.select();
        return ;
    }
    
    /**
      * 서버 프로그램에서 생긴 ERROR 를 보여주는 MESSAGEBOX ALERT
      * @param message   메세지박스에 보여질 메세지
      * @return
     */
    function ShowErrMessage(message) {
            var iLen = message.length;
            var showMessage;

        if (iLen >= 1) {
            shwoMessage=ReplaceStr(message,"<||>","\n");
            Alert(shwoMessage);
        }
    }

    /*= FORM CONTROL =============================================================

            1. 폼 관련 기본 기능을 처리.
            2. Function List
                - ChkLen(Object, Int)
                : 입력 받은 폼태그(Object)의 문자열의 길이가 특정 길이(Int)와 같은지 여부 체크
                    true - 길이가 같음
                    false - 길이가 다름
                - ChkLenMoveFocus(Object, Int, Object)
                : 입력 받은 폼태그(Object)의 문자열의 길이가 특정 길이(Int) 이면
                    다른 객체(Object)로 포커스를 이동
                - SetFocus(Object)
                : 입력 받은 객체로 포커스 이동
                - ChkLenByByte(Object, int)
                : 입력 필드의 문자 크기를 한정시킬때.. (한글까지 고려하여 계산됨)
                    ex) onBlur="return fnLessEqualLen(this, len);"
                - GetLenByByte(String)
                : 입력 필드의 문자 크기를 얻는다.. (한글까지 고려하여 계산됨)
                - disableObject(obj).
                : 대상 Object를 disable 시킨다.
                - EnableObject(obj)
                : 대상 Object를 Enable 시킨다.
                - EnableManyObjects()
                :   입력되어진 변수의 수만큼 EnableObject function 수행.
                    입력되어진 Object 들을 모두 enable 시킨다.
                    호출예 : EnableManyObjects(haengwon_no, name, center_section_code);
                - DisableManyObjects()
                :   입력되어진 변수의 수만큼 DisableObject function 수행.
                    입력되어진 Object 들을 모두 Disable 시킨다.
                    호출예 : DisableManyObjects(haengwon_no, name, center_section_code);


    ============================================================================*/

    /**
      * 입력 받은 폼태그(Object)의 문자열의 길이가 특정 길이(Int)와 같은지 여부 체크
      * @param obj   대상 폼태그(Object)
      * @param len   비교할 길이
      * @return  true : 길이가 같음, false : 길이가 다름
     */
    function ChkLen(obj, len) {
            if (obj.value.length == len) return true;
            return false;
    }

    /**
      * 입력 받은 폼태그(Object)의 문자열의 길이가 특정 길이(Int) 이면
      * 다른 객체(Object)로 포커스를 이동
      * @param obj   대상 폼태그(Object)
      * @param len   비교할 길이
      * @param dest  포커스를 이동할 폼태그(Object)
      * @return
     */
    function ChkLenMoveFocus(obj, len, dest) {
            if (obj.value.length == len)
            SetFocus(dest);
    }

    /**
      * 입력 받은 객체로 포커스 이동
      * @param obj   포커스를 이동할 폼태그(Object)
      * @return
     */
    function SetFocus(obj) {
      obj.focus();
    }

    /**
      * 입력 필드의 문자 크기를 한정시킬때.. (한글까지 고려하여 계산됨)
      * @param obj   대상 폼태그(Object)
      * @param len   비교할 길이
      * @return
     */
    function ChkLenByByte(obj, len) {
            var src    = obj.value;
            var srcLen = GetLenByByte(src);
            if (srcLen <= len) return true;
            var delLen = srcLen - len;
            obj.focus();
            Alert("이 항목은 영문 " + len + "자 (한글은 " + Math.floor(len/3) + "자) 까지만 허용합니다.");
            return false;
    }

    /**
      * 입력 필드의 문자 크기를 얻는다.. (한글까지 고려하여 계산됨)
      * @param String   문자열
      * @return int 문자열의 길이
     */
    function GetLenByByte(value) {
            var byteLength = 0;
            for (var inx = 0; inx < value.length; inx++) {
                var oneChar = escape(value.charAt(inx));
                if ( oneChar.length == 1 ) {
                        byteLength ++;
                } else if (oneChar.indexOf("%u") != -1) {
                        byteLength += 3;
                } else if (oneChar.indexOf("%") != -1) {
                        //byteLength += oneChar.length/3;
                        byteLength ++;
                }
            }
            return byteLength;
    }

    /**
      * 대상 Object를 disable 시킨다.
      * @param  obj   대상 폼태그(Object)
      * @return
     */
    function DisableObject(obj) {
        switch( obj.type ) {
            case "checkbox" :
                     obj.disabled = true;
                     break;
            case "text" :
                 obj.readOnly=true;
                     obj.style.backgroundColor = "#E9F8F2";
                     obj.style.color = "#555555";
                 break;
            default:
        }
    }

    /**
      * 대상 Object를 enable 시킨다.
      * @param obj   대상 폼태그(Object)
      * @return
     */
    function EnableObject(obj) {
        switch( obj.type ) {
            case "checkbox" :
                 obj.disabled = false;
                 break;
            case "text" :
                 obj.readOnly=false;
                     obj.style.backgroundColor = "#ffffff";
                     obj.style.color = "#000000";
                 break;
            default:
        }
    }

    /**
     * 입력되어진 변수의 수만큼 DisableObject function 수행.
     * 입력되어진 Object 들을 모두 disable 시킨다.
     * 호출예 : DisableManyObjects(haengwon_no, name, center_section_code);
     * @param obj   대상 폼태그(Object)
     * @param obj   대상 폼태그(Object)
     *  :
     */
    function DisableManyObjects() {
        var obj_receiver;
        obj_receiver = DisableManyObjects.arguments;
        for(i=0; i< obj_receiver.length; i++) {
            if (obj_receiver[i] != "") {
                DisableObject(obj_receiver[i]);
            }
        }
    }

    /**
     * 입력되어진 변수의 수만큼 EnableObject function 수행.
     * 입력되어진 Object 들을 모두 enable 시킨다.
     * 호출예 : EnableManyObjects(haengwon_no, name, center_section_code);
     * @param obj   대상 폼태그(Object)
     * @param obj   대상 폼태그(Object)
     *  :
     */
    function EnableManyObjects() {
        var obj_receiver;
        obj_receiver = EnableManyObjects.arguments;
        for(i=0; i< obj_receiver.length; i++) {
            if (obj_receiver[i] != "") {
                EnableObject(obj_receiver[i]);
            }
        }
    }

    /*= CHECKBOX CONTROL ===========================================================

            1. CHECKBOX 관련 기본 기능을 처리.
            2. Function List
                - TogleCheckAll(Object, Object)
                : checkbox들을 반복하여 선택하거나 해지한다.
                - SetAllCheckboxCancel(Object)
                : checkbox를 모두 해지한다.
                - SetAllCheckboxCheck(Object)
                : checkbox를 모두 선택 표시한다.
                - IsChecked(Object)
                : 리스트에서 하나이상의 체크박스가 선택되었는지 확인한다.
                - IsCheckedOnlyOne(Object)
                : 리스트에서 하나의 체크박스만 선택되었는지 확인한다.

    ============================================================================*/

    /**
      * 처음 obj가 선택되어진 경우 전체 checkObj를 선택하고
      * 해지되어진 경우 모두 해지한다.
      * @param obj   전체를 control하는 CHECKBOX 의 OBJECT
      * @param checkObj 해당 CHECKBOX
      * @return
     */
    function TogleCheckAll(obj, checkObj) {
        if (obj.type == "checkbox") {
            if (!obj.checked) {
                    SetAllCheckboxCancel(checkObj);
            } else {
                    SetAllCheckboxCheck(checkObj);
            }
        } else if (obj.type == "hidden") {
            if (obj.value == "Y") {
                    SetAllCheckboxCancel(checkObj);
                    obj.value = "N";
            } else {
                    SetAllCheckboxCheck(checkObj);
                    obj.value = "Y";
            }
        }
    }


    /**
      * CHECKBOX를 모두 해지한다.
      * @param obj   해당 CHECKBOX 의 OBJECT
      * @return
     */
    function SetAllCheckboxCancel(obj){

        if (obj != null)
        {

            var count = obj.length;
            if(count > 1){
                for(var i=0;i<count;i++){
                    obj[i].checked = false;
                }
            }else {
                    obj.checked = false;
                }
                return;
        }
    }


    /**
      * CHECKBOX를 모두 선택 표시한다.
      * @param obj   해당 CHECKBOX 의 OBJECT
      * @return
     */
    function SetAllCheckboxCheck(obj){

        if (obj != null)
        {
            var count = obj.length;

            if(count > 1){
                for(var i=0;i<count;i++){
                    obj[i].checked = true;
                }
            }else{
                obj.checked = true;
            }
            return;
        }
    }


    /**
      * 리스트에서 하나이상의 체크박스가 선택되었는지 확인한다.
      * @param obj   해당 CHECKBOX 의 OBJECT
      * @return
     */
    function IsChecked(obj){
        var count = obj.length;
        var iChecked = 0;
        if(count > 1){
            for(var i=0;i<count;i++){
                if (obj[i].checked) iChecked++;
            }
        } else {
            if (obj.checked) iChecked++;
        }

        if (iChecked == 0) {
            Alert("선택된 값이 없습니다");
            return false;
        }

        return true;
    }

    /**
      * 리스트에서 하나이상의 체크박스가 선택되었는지 확인한다.
      * @param obj   해당 CHECKBOX 의 OBJECT
      * @return
     */
    function IsCheckedStr(obj){
        var count = obj.length;
        var iChecked = 0;
        if(count > 1){
            for(var i=0;i<count;i++){
                if (obj[i].checked) iChecked++;
            }
        } else {
            if (obj.checked) iChecked++;
        }

        if (iChecked == 0) {
            return false;
        }

        return true;
    }

    /**
      * 리스트에서 하나의 체크박스만 선택되었는지 확인
      * @param obj   해당 CHECKBOX 의 OBJECT
      * @return
     */
    function IsCheckedOnlyOne(obj){
        var count = obj.length;
        if(count > 1){
            var iChecked = 0;
            for(var i=0;i<count;i++){
                if (obj[i].checked) iChecked++;
            }
            if (iChecked > 1) {
                Alert("하나만 선택하십시오");
                return false;
            }
        }

        return true;
    }

    /*= TEXT INPUT VALUE CONTROL ===========================================================

            1. 문자열 관련 기본 기능을 처리.
            2. Function List
                - IsNull(Object)
                : 입력값이 NULL인지 체크
                - IsEmpty(Object)
                : 입력값이 공백인지 확인하여 리턴
                - RemoveSpaces(Value)
                : 입력값에 포함된 모든 스페이스 문자를 제거 후 리턴
                - IsTrim(Value)
                : 입력값 앞뒤의 스페이스를 제거 후 리턴
                - ReplaceStr(str, find, replace)
                : 문자열에 포함된 모든 변환대상 패턴을 변경하여 리턴
                - ContainsChars(Object)
                : 입력값에 특정 문자(chars)가 있는지 체크. 특정 문자를 허용하지 않으려 할 때 사용
                - ContainsCharsOnly(Object)
                : 입력값이 특정 문자(chars)만으로 되어있는지 체크
                - IsKorean(obj)
                : 입력값이 한국어인지 체크
                - IsAlphabet(Object)
                : 입력값이 알파벳인지 체크
                - IsUpperCase(Object)
                : 입력값이 알파벳 대문자인지 체크
                - IsLowerCase(Object)
                : 입력값이 알파벳 소문자인지 체크
                - IsNumber(Object)
                : 입력된 문자열이 숫자 만을 포함하고 있는지 여부 리턴
                - IsAlphaNum(Object)
                : 입력값이 알파벳,숫자로 되어있는지 체크
                - IsNumDash(Object)
                : 입력값이 숫자,대시(-)로 되어있는지 체크
                - IsNumComma(Object)
                : 입력값이 숫자,콤마(,)로 되어있는지 체크
                - IsNumPeriod(Object)
                : 입력값이 숫자,날짜 구분자(.)로 되어있는지 체크
                - IsMoney(obj)
                : 입력값이 숫자,소숫점(.),숫자구분자(,)로 되어있는지 체크
                - IsEmailAddr(obj)
                : 입력값이 이메일을 구성할 수 있는 문자들로 구성되어 있는지 체크
                - IsNumberMessage(obj)
                : 입력된 문자열이 숫자 만을 포함하고 있는지 여부 리턴
                - StringEllipsis(str, length)
                : 문자열의 길이가 설정한 길이보다 클경우 나머지 문자열 생략
    ============================================================================*/

    /**
     * 입력값이 NULL인지 체크
     * @param obj   Object
     * @return true : Null 또는 공백
     */
    function IsNull(obj) {
            if (IsTrim(obj.value) == null || IsTrim(obj.value) == "") {
                    return true;
            }
            return false;
    }


    /**
     * 입력값에 스페이스 이외의 의미있는 값이 있는지 체크
     * @param obj   Object
     * @return true : 공백
     */
        function IsEmpty(obj) {
            if (obj.value == null || obj.value.replace(/ /gi,"") == "") {
                return true;
            }
            return false;
        }


    /**
     * 입력값에 포함된 모든 스페이스 문자를 제거 후 리턴
     * @param str   Value
     * @return ret  스페이스가 제거된 문자열
     */
    function RemoveSpaces(str) {
            var ret = "";
            if (str.length == 0) return ret;

            for (var i=0; i<str.length; i++) {
                if (str.charAt(i) != " ") ret += str.charAt(i);
            }
            return ret;
    }


    /**
     * 입력값 앞뒤의 스페이스를 제거 후 리턴
     * @param str Value
     * @return 스페이스가 제거된 문자열
     */
    function IsTrim(str) {
        var retstr = "";
        var ch;
        var lenstr = str.length;

        //문자열 앞부분의 공백 수를 센다.
        var precnt = 0;
        for ( var i=0; i<lenstr; i++ ) {
            ch = str.charAt(i);
            if ( ch == ' ' || ch == '\n' || ch == '\r' ) {
                precnt++;
            }
            else {
                break;
            }
        }
        //문자열 뒷부분의 공백 수를 센다.
        var postcnt = 0;
        for ( var i=lenstr-1; i>=0; i-- ) {
            ch = str.charAt(i);
            if ( ch == ' ' || ch == '\n' || ch == '\r' ) {
                postcnt++;
            }
            else {
                break;
            }
        }
    
        return (lenstr-postcnt)==0? "" : str.substring(precnt,lenstr-postcnt);
    }


    /**
     * 문자열에 포함된 모든 변환대상 패턴을 변경하여 리턴
     * @param str   문자열
     * @return ret  변경된 문자열
     */
        function ReplaceStr(str, find, replace) {
            var pos = 0;
            pos = str.indexOf(find);

            while(pos != -1) {
                pre_str = str.substring(0, pos);
                post_str = str.substring(pos + find.length, str.length);
                str = pre_str + replace + post_str;
                pos = str.indexOf(find);
            }
            return str;
        }


    /**
     * 입력값에 특정 문자(chars)가 포함되지 않았는지 체크
     * 특정 문자를 허용하지 않으려 할 때 사용
     * ex) if (containsChars(form.name,"!,*&^%$#@~;")) {
     *         Alert("이름 필드에는 특수 문자를 사용할 수 없습니다.");
     *     }
     * @param obj   Object
     * @return true 특정 문자가 없을 경우
     */
    function ContainsChars(obj,chars) {
            for (var inx = 0; inx < obj.value.length; inx++) {
                if (chars.indexOf(obj.value.charAt(inx)) != -1)
                return true;
            }
            return false;
    }


    /**
     * 입력값이 특정 문자(chars)만으로 되어있는지 체크
     * 특정 문자만 허용하려 할 때 사용
     * ex) if (!containsCharsOnly(form.blood,"ABO")) {
     *         Alert("혈액형 필드에는 A,B,O 문자만 사용할 수 있습니다.");
     *     }
     * @param obj   Object
     * @return true 특정 문자가 있을 경우
     */
    function ContainsCharsOnly(obj,chars) {
        for (var inx = 0; inx < obj.value.length; inx++) {
            if (chars.indexOf(obj.value.charAt(inx)) == -1) {
                return false;
            }
        }
        return true;
    }


    /**
     * 입력값이 한글인지 체크
     * @param obj   Object
     * @return true 한글인 경우
     */
    function IsKorean(obj) {
        if ((obj.value.length*2) == GetLenByByte(obj.value)) return true;
        return false;
    }


    /**
     * 입력값이 알파벳인지 체크
     * @param obj   Object
     * @return true 알파벳일 경우
     */
    function IsAlphabet(obj) {
        var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        return ContainsCharsOnly(obj,chars);
    }


    /**
     * 입력값이 알파벳 대문자인지 체크
     * @param obj   Object
     * @return true 알파벳 대문자인 경우
     */
    function IsUpperCase(obj) {
        var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        return ContainsCharsOnly(obj,chars);
    }


    /**
     * 입력값이 알파벳 소문자인지 체크
     * @param obj   Object
     * @return true 알파벳 소문자인 경우
     */
    function IsLowerCase(obj) {
        var chars = "abcdefghijklmnopqrstuvwxyz";
        return ContainsCharsOnly(obj,chars);
    }


    /**
      * 입력된 문자열이 숫자 만을 포함하고 있는지 여부 리턴
      * @param obj   Object
      * @return true - 숫자만을 포함하고 있는 경우
     */
    function IsNumber(obj) {
        var chars = "0123456789";
        return ContainsCharsOnly(obj,chars);
    }


    /**
     * 입력값이 알파벳,숫자로 되어있는지 체크
     * @param obj   Object
     * @return true 알파벳,숫자로 되어있는 경우
     */
    function IsAlphaNum(obj) {
        var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        return ContainsCharsOnly(obj,chars);
    }

    /**
     * 입력값이 알파벳,숫자,'_'로 되어있는지 체크 (파일명 체크용)
     * @param obj   Object
     * @return true 알파벳,숫자,'_' 로 되어있는 경우
     */
    function IsFileName(obj) {
        var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890_.";
        return ContainsCharsOnly(obj,chars);
    }

    /**
     * 입력값이 숫자,대시(-)로 되어있는지 체크
     * @param obj   Object
     * @return true 숫자,대시(-)로 되어있는 경우
     */
    function IsNumDash(obj) {
        var chars = "-0123456789";
        return ContainsCharsOnly(obj,chars);
    }

 
    /**
     * 입력값이 숫자,콤마(,)로 되어있는지 체크
     * @param obj   Object
     * @return true 숫자,콤마(,)로 되어있는 경우
     */
    function IsNumComma(obj) {
        var chars = ",0123456789";
        return ContainsCharsOnly(obj,chars);
    }


    /**
     * 입력값이 숫자,날짜 구분자(.)로 되어있는지 체크
     * @param obj   Object
     * @return true 숫자,날짜 구분자(.)로 되어있는 경우
     */
    function IsNumPeriod(obj) {
        var chars = ".0123456789";
        return ContainsCharsOnly(obj,chars);
    }


    /**
     * 입력값이 숫자,소숫점(.),숫자구분자(,)로 되어있는지 체크
     * @param obj   Object
     * @return true 숫자,날짜 구분자(.)로 되어있는 경우
     */
    function IsMoney(obj) {
        var chars = "-.,0123456789";
        return ContainsCharsOnly(obj,chars);
    }


    /**
     * 이메일 주소의 유효성을 확인한다.
     * @param obj   Object
     * @return true : 사용가능한 이메일 주소일 경우
     */
        function IsValidEmail(obj) {
            if (IsEmpty(obj)) return false;
            if (!IsEmailAddr(obj)) {
                AlertFocusV2(obj, "This is incorrect email type.");
                return false;
            }
            return true;
        }


    /**
     * 입력값이 이메일을 구성할 수 있는 문자들로 구성되어 있는지 체크
     * 단순한 이메일 입력포맷을 확인한다.
     * @param obj   Object
     * @return true 이메일 구성이 가능한 문자들로 구성되어 있을 경우
     */
    function IsEmailAddr(obj) {
        var format = /^((\w|[\-\.])+)@((\w|[\-\.])+)\.([A-Za-z]+)$/;
        
        if ( format.test(obj.value) ) {
            return true;
        } else {
            return false;
        }
        //return IsValidFormat(obj, format);
    }
    

    /**
      * 입력된 문자열이 숫자 만을 포함하고 있는지 여부 리턴
      * 오류가 있을 경우 메세지를 표시하고 focus 이동
      * @param obj   Object
      * @return true - 숫자만을 포함하고 있는 경우
     */
    function IsNumberMessage(obj) {
        if (!IsNumber(obj)) {
            AlertFocus(obj, '숫자만 입력하십시오');
            return false;
        }
        return true;
    }

    /**
      * 문자열의 길이가 설정한 길이보다 클경우 나머지 문자열 생략
      * @param String str, integer length
      * @return String
     */
    function StringEllipsis(str, length) {
        var rtnstr = '';
        if (str.length <= length) {
            rtnstr = str;
        } else {
            rtnstr = str.substring(0, length) + "...";
        }
        return rtnstr;
    }

    /*= NUMBER CONTROL ===========================================================

            1. 숫자 관련 기본 기능을 처리.
            2. Function List
                - AddComma(Object)
                : 입력값을 콤마가 포함된 문자열로 변환하여 리턴
                    12345 를 입력하면 12,345 로 변환하여 리턴
                - RemoveComma(String)
                : 입력값에서 콤마를 없앤다.
                - RemoveDash(String)
                : 입력값에서 구분자(-)를 없앤다.
                - RemovePeriod(String)
                : 입력값에서 날짜 구분자(.) 를 없앤다.
                - ParseInt(str)
                : 문자열을 정수로 변환하여 리턴
                - lpad(str,n,ch)
                : 문자열이 원하는 길이가 안 될때 왼쪽에 문자를 해당길이만큼 끼워넣는 함수
                - ParseInterger(Object)
                : 문자열을 정수로 변환하여 리턴 - kjs                
    ============================================================================*/

    /**
      * 입력값을 콤마가 포함된 문자열로 변환하여 리턴
      * @param obj   숫자
      * @return ret  콤마를 추가한 숫자
     */
    function AddComma(obj) {
        var ret;
        if (IsEmpty(obj)) {
            obj.value = "0";
        }
            
        if (!IsMoney(obj)) {
                AlertFocus(obj, "숫자만 입력하십시오.");
                obj.value = "0";
                return;
        }

        //숫자앞에 있는 "0"을 먼저 삭제함. - 2004.9.12
        obj.value = parseInt(RemoveComma(obj.value), 10);

        var numstr = obj.value;
        numstr = RemoveComma(numstr);
        var rxSplit = new RegExp('([0-9])([0-9][0-9][0-9][,.])');
        var arrNumber = numstr.split('.');
        arrNumber[0] += '.';
        do {
                arrNumber[0] = arrNumber[0].replace(rxSplit, '$1,$2');
        }

        while (rxSplit.test(arrNumber[0]));
        if (arrNumber.length > 1) {
                ret = arrNumber.join('');
        } else {
                ret = arrNumber[0].split('.')[0];
        }

        obj.value = ret;
    }

    /**
      * 입력값을 콤마가 포함된 문자열로 변환하여 리턴
      * @param str   숫자
      * @return ret  콤마를 추가한 숫자
     */
    function strAddComma(val) {
        var ret;

        //숫자앞에 있는 "0"을 먼저 삭제함. - 2004.9.12      
        var numstr = val + "";
        var rxSplit = new RegExp('([0-9])([0-9][0-9][0-9][,.])');
        var arrNumber = numstr.split('.');
        arrNumber[0] += '.';
        do {
                arrNumber[0] = arrNumber[0].replace(rxSplit, '$1,$2');
        }       
        while (rxSplit.test(arrNumber[0]));

        if (arrNumber.length > 1) {
                ret = arrNumber.join('');
        } else {
                ret = arrNumber[0].split('.')[0];
        }

        return ret;
    }
    

    /**
     * 입력값에서 콤마를 없앤다.
     * @param str   문자열
     * @return 변경된 문자열
     */
    function RemoveComma(str) {
        return str.replace(/,/gi,"");
    }


    /**
     * 입력값에서 구분자(-)를 없앤다.
     * @param str   문자열
     * @return 변경된 문자열
     */
    function RemoveDash(str) {
        return str.replace(/-/gi,"");
    }


    /**
     * 입력값에서 날짜 구분자(.)를 없앤다.
     * @param str   문자열
     * @return 변경된 문자열
     */
    function RemovePeriod(str) {
        return ReplaceStr(str, '.', '');
    }

    /**
     * 입력값에서 구분자(-)를 없앤다.
     * @param str 문자열
     * @return 변견된 문자열
    */

    function RemoveDash(str) {
        return  ReplaceStr(str, '-', '');
    }


    /**
     * 문자열을 정수로 변환하여 리턴
     * @param str   문자열
     * @return 정수
     */
    function ParseInt(str) {
        return parseInt(str, 10);
    }


    /**
     *문자열이 원하는 길이가 안 될때 왼쪽에 문자를 해당길이만큼 끼워넣는 함수.
     * @param str   문자열
     * @param n   길이
     * @param ch  문자열
     * @return
         */
    function lpad(str,n,ch) {
        str = String(str);
        var result = "";
        var len = str.length;
        if ( len < n ) {
            for ( var i=0; i<(n-len); i++ ) {
                result += ch;
            }
            result += str;
        }   else {
            result = str;
        }

        return result;
    }
    
    /**
     * 문자열을 정수로 변환하여 리턴
     * @param str   문자열
     * @return 정수
     */
    function ParseInterger(obj) {
        var result = 0;
        if (IsMoney(obj)) {
            if (RemoveComma(IsTrim(obj.value)) == "") {
                alert("입력한 값을 확인해 주십시오.");
                obj.focus();
            } else {
                result = RemoveComma(IsTrim(obj.value));
                return parseInt(result, 10);
            }
        } else {
            alert("입력한 값을 확인해 주십시오.");
            obj.focus();
        }
        
        return 0;
    }   



    /*= DATETIME CONTROL ===========================================================

            1. 일자와 시간 관련 기본 기능을 처리.
            2. Function List
                - IsDate(Object)
                : 입력값을 일자 Format 인지 확인
                - IsDateSixLength ( obj )
                : 입력된 문자열이 6자리 일자로 포맷
                - IsMonth(month)
                : 입력된 문자열이 일자의 월로 변환가능한지 확인
                - IsDay(year, month, day)
                : 입력된 문자열이 일자의 일로 변환가능한지 확인
                - IsDay2(day)
                : 입력된 문자열이 일자의 일로 변환가능한지 확인 (월에 관계없음)
                - GetEndDay(year, month)
                : 해당 년, 월의 마지막 일자를 가져온다
                - AddDateSeperator(Object)
                : 입력값에 일자 형식에 맞추어 DATE_SEPERATOR 를 추가한다.

    ============================================================================*/

    /**
      * 입력된 문자열이 일자 Format 확인
      * @param str   문자열
      * @return true 일자 , false
     */
    function IsDate ( obj ) {
        str = RemoveSpaces(obj.value);
        str = RemoveDash(obj.value);
        if (!IsNumDash(obj)) {
            obj.value = '';
            if ( obj.type == "hidden" ) {
                Alert("날짜는 YYYYMMDD의 형식으로 입력하십시오");
            } else {
                AlertFocus(obj, "날짜는 YYYYMMDD의 형식으로 입력하십시오");
            }
            return false;
        }

        if (str.length != 8) {
            obj.value = '';
            if ( obj.type == "hidden" ) {
                Alert("날짜는 YYYYMMDD의 형식으로 입력하십시오");
            } else {
                AlertFocus(obj, "날짜는 YYYYMMDD의 형식으로 입력하십시오");
            }
            return false;
        }

        var year  = str.substring(0,4);
        var month = str.substring(4,6);
        var day   = str.substring(6,8);

        if ( ParseInt( year ) >= 1900  && IsMonth( month ) && IsDay( year,month ,day) ) {
            return true;
        } else {
            obj.value = '';
            if ( obj.type == "hidden" ) {
                Alert("날짜는 YYYYMMDD의 형식으로 입력하십시오");
            } else {
                AlertFocus(obj, "날짜는 YYYYMMDD의 형식으로 입력하십시오");
            }
            return false;
        }
    }


    /**
      * 입력된 문자열이 6자리 일자 Format 확인
      * @param str   문자열
      * @return true 일자 , false
     */
    function IsDateSixLength ( obj ) {
        str = RemoveSpaces(obj.value);
        str = RemovePeriod(obj.value);
        if (!IsNumPeriod(obj)) {
            AlertFocus(obj, "날짜는 YYMMDD의 형식으로 입력하십시오");
            return false;
        }
        if (str.length != 6) {
            AlertFocus(obj, "날짜는 YYMMDD의 형식으로 입력하십시오");
            return false;
        }

        var year  = str.substring(0,2);
        var month = str.substring(2,4);
        var day   = str.substring(4);

        if ( IsMonth(month) && IsDay2(day) ) {
            return true;
        } else {
            AlertFocus(obj, "날짜는 YYMMDD의 형식으로 입력하십시오");
            return false;
        }
    }


    /**
      * 입력된 문자열이 일자의 월로 변환가능한지 확인
      * @param month   문자열
      * @return true : 가능할 경우
     */
    function IsMonth(month) {
        if (month.length > 2) return false;
        month = ParseInt(month);
        if ((month <= 0) || (month > 12)) return false;
        return true;
    }


    /**
      * 입력된 문자열이 일자의 일로 변환가능한지 확인
      * @param year   년
      * @param month  월
      * @param day    일
      * @return true : 가능할 경우
     */
    function IsDay(year, month, day) {
        if (day.length > 2) return false;
        year  = ParseInt(year, 10);
        month = ParseInt(month, 10);
        day   = ParseInt(day, 10);
        if ((day <= 0) || (day > GetEndDay(year, month))) return false;
        return true;
    }

    /**
      * 입력된 문자열이 일자의 일로 변환가능한지 확인 (월에 관계없음)
      * @param day 문자열
      * @return true : 가능할 경우
     */
    function IsDay2(day) {
        if (day.length > 2) return false;
        day = ParseInt(day, 10);
        if ((day <= 0) || (day > 31)) return false;
        return true;
    }


    /**
      * 해당 년, 월의 마지막 일자를 가져온다
      * @param year   년
      * @param month  월
      * @return 마지막 일자
     */
    function GetEndDay(year,month){
        if ((month==1)||(month==3)||(month==5)||(month==7)||(month==8)||(month==10)||(month==12))
            return 31;
        else {
            if(month==2) {
                if ((year%4==0) && ((year/4)%200!=0))   return 29;
                else    return 28;
            } else {
                return 30;
            }
        }
    }


    /**
     * 입력값이 유효한 일자인지 확인하고
     * 일자 형식에 맞추어 DATE_SEPERATOR 를 추가한다.
     * @param obj   Object
     * @return 구분자가 추가된 일자 형식의 문자열
     */
    function  AddDateSeperator(obj) {
        if (IsEmpty(obj)) return false;
              if (!IsDate(obj)) {
                return false;
              }
              var numstr = RemovePeriod(obj.value);
              if (numstr.length != 8) {
                        obj.value = '';
                        if ( obj.type == "hidden" ) {
                            Alert("날짜는 YYYYMMDD의 형식으로 입력하십시오");
                        } else {
                            AlertFocus(obj, "날짜는 YYYYMMDD의 형식으로 입력하십시오");
                        }
                        return false;
              }
          var rxSplit = new RegExp('([0-9][0-9][0-9][0-9])([0-9][0-9])([0-9][0-9])');
          numstr = numstr.replace(rxSplit, '$1'+DATE_SEPERATOR+'$2'+DATE_SEPERATOR+'$3');
          obj.value = numstr;
          return true;
    }


    /**
     * 처음 Object와 두번째 Object 사이의 일자를 반환한다.
     * 이경우에 두번째 Object가 처음 Object 보다 나중 일자이다.
     * @param fromObj   Object
     * @param toObj     Object
     * @return int 두 Object 사이의 일자
     */
    function GetDaysBetween(fromObj, toObj) {
        var numstr1 = RemoveDash(fromObj.value);
        var user_day1 = new Date(numstr1.substr(0,4), ParseInt(numstr1.substr(4,2))-1, ParseInt(numstr1.substr(6)));
        var numstr2 = RemoveDash(toObj.value);
        var user_day2 = new Date(numstr2.substr(0,4), ParseInt(numstr2.substr(4,2))-1, ParseInt(numstr2.substr(6)));
        user_day1 = user_day1.getTime();
        user_day2 = user_day2.getTime();
        var day_gab = Math.floor( (user_day2 - user_day1) / (60*60*24*1000) );
        return day_gab;
    }


    /**
     * 오늘까지 남은 일수를 반환한다. 오늘 이후의 일자에 대해서는 음수값을 반환한다.
     * @param obj   Object
     * @return int 남은 일수
     */
    function GetDaysToToday(obj) {
        var numstr = RemoveDash(obj.value);
        var user_day = new Date(numstr.substr(0,4), ParseInt(numstr.substr(4,2))-1, ParseInt(numstr.substr(6)));
        user_day = user_day.getTime();
        var today = new Date();
        today = today.getTime();
        var day_gab = Math.floor( (today - user_day) / (60*60*24*1000) );
        return day_gab;
    }


    /**
     * 입력된 일자가 오늘 이후의 일자인지 확인한다.
     * @param obj   Object
     * @return true : 오늘 이후의 일자일 경우, false
     */
    function IsAfterToday(obj) {
        if (IsEmpty(obj)) return false;
        if (!IsDate(obj)) {
            return false;
        }
        var day_gab = GetDaysToToday(obj);
        if( day_gab > 0) {
            AlertFocus(obj, "오늘이후의 날짜를 입력하셔야 합니다");
            obj.value = "";
            return false;
        }
        return true;
    }


    /**
     * 처음 Object의 일자가 두번째 Object의 일자보다 빠른지 확인
     * @param obj   Object
     * @return true : 오늘 이후의 일자일 경우, false
     */
    function IsSequentialDate(fromObj, toObj, isToday) {
        if (IsEmpty(fromObj)) return false;
        if (IsEmpty(toObj)) return false;
        if (!IsDate(fromObj)) {
            return false;
        }
        if (!IsDate(toObj)) {
            return false;
        }
        var day_gab = GetDaysBetween(fromObj, toObj);
        if( day_gab < 0) {
            AlertFocus(fromObj, "날짜를 바르게 입력하셔야 합니다");
            return false;
        }
        if ((!isToday)&&(day_gab == 0)) { alert('2');
            AlertFocus(fromObj, "날짜를 바르게 입력하셔야 합니다");
            return false;
        }
        return true;
    }


    /**
     * 년 or 월 or 일 만큼 증가된 일자를 리턴
     * @param sDate : 일자
     * @param sTyep : 년(Y), 월(M), 일(D)
     * @param sAddnum : 증가값
     * @return : 일자 + sType별 증가값
     */
    function IsDateAdd( sDate, sType, sAddnum ) {
        var newdate = new Date(sDate.getTime());
        var year      = sDate.getFullYear();
        var month     = sDate.getMonth() + 1;

        switch (sType) {
            case "Y" :
                newdate.setFullYear(year+sAddnum);
                break;
            case "M" :
                newdate.setFullYear(year+Math.floor((month+sAddnum)/12));
                newdate.setMonth(((month+sAddnum)%12)-1);
                break;
            case "D" :
                newdate = new Date(sDate.getTime() + sAddnum*24*3600*1000);
                break;
        }

        return newdate;
    }

    /**
     * 문자열을 날짜로 변환
     * @param str 날짜(YYYYMMDD)
     * @return
     */
    function GetStrToDate( str ) {
        var year, month, day, hour=0, min=0, sec=0;

        year    = str.substring(0,4);
        month = str.substring(4,6)
        day     = str.substring(6,8)

        if ( str.length > 8 ) {
            hour    = str.substring(8,10);
            min     = str.substring(10,12);
            sec     = str.substring(12,14);
        }

        var retdate = new Date(year,(month-1),day,hour,min,sec);
        return retdate;
    }


    /**
     * 날짜형식을 문자열로 변환.
     * @param datee
     * @param formatstr
     * @return
     */
    function GetDateFormat( datee, formatstr ) {
        var retstr = formatstr;
        retstr = retstr.replace(/YYYY/i,    lpad(datee.getFullYear(),4,"0"));
        retstr = retstr.replace(/MM/i,      lpad(datee.getMonth()+1,2,"0"));
        retstr = retstr.replace(/DD/i,      lpad(datee.getDate(),2,"0"));
        retstr = retstr.replace(/HH/i,      lpad(datee.getHours(),2,"0"));
        retstr = retstr.replace(/MI/i,      lpad(datee.getMinutes(),2,"0"));
        retstr = retstr.replace(/SS/i,      lpad(datee.getSeconds(),2,"0"));

        return retstr;
    }

    /* 날짜를 문자열로 변환
     * deprecated - dateFormat()을 사용하세요.
     * @param datee
     * @param len
     * @return
     */
    function date2str( datee, len ) {
        var str = lpad(datee.getFullYear(),4,"0") + lpad(datee.getMonth()+1,2,"0") + lpad(datee.getDate(),2,"0") + lpad(datee.getHours(),2,"0") + lpad(datee.getMinutes(),2,"0") + lpad(datee.getSeconds(),2,"0") ;

        return str.substring(0,len);
    }


    /* 문자열을 날짜로 변환 
     * @param str
     * @return
     */
    function str2date( str ) {
        var year, month, day, hour=0, min=0, sec=0;

        year = parseInt(str.substring(0,4));
        month = str.substring(4,6)
        //month = parseInt(str.substring(4,6));
        //day = parseInt(str.substring(6,8));
        day = str.substring(6,8)
        //month = parseInt(month)
        //day = parseInt(day)

        //alert(month)
        //alert(day)
        if ( str.length > 8 ) {
            hour = parseInt(str.substring(8,10));
            min = parseInt(str.substring(10,12));
            sec = parseInt(str.substring(12,14));
        }
        var retdate = new Date(year,(month-1),day,hour,min,sec);
        return retdate;
    }

    /**
     * 종료일을 기준으로 지정된 일자를 설정한다.
     * @param stdtObj
     * @param endtObj  : 기준일
     * @param stdt_displayObj
     * @param endt_displayObj
     * @param period    : 증가일(9999:전체)
     * @return
     */
    function GetApplyPeriod(stdtObj, endtObj, stdt_displayObj, endt_displayObj, period) {
        var edate = GetStrToDate(endtObj.value);
        var sdate = IsDateAdd(edate, "D", (-1)*period);

        stdtObj.value               = GetDateFormat( sdate, "YYYYMMDD" );
        stdt_displayObj.value       = GetDateFormat( sdate, "YYYY-MM-DD" );
        endtObj.value               = GetDateFormat( edate, "YYYYMMDD" );
        endt_displayObj.value       = GetDateFormat( edate, "YYYY-MM-DD" );
    }

   
    /**
     * 현재 요일을 리턴
     * @return
     * ex) alert('오늘은 ' + getDayOfWeek() + '요일입니다.');
     */
    function getDayOfWeek() {
        var now = new Date();

        var day = now.getDay(); //일요일=0,월요일=1,...,토요일=6
        var week = new Array('일','월','화','수','목','금','토');

        return week[day];
    }

    /**
     * 달력 팝업
     * 날짜와 시간 모두들 입력해야할 때
     */
    function showDateTimeCalendar(dateField, timeField)
    {
        var wid = (screen.width)/2 - 220/2 ;
        var hei = (screen.height)/2 - 295/2;
    window.open("/common/popCalendar.jsp?type=datetime&dateField=" + dateField + "&timeField=" + timeField, "Calendar", "width=220,height=295,status=no,resizable=no,top="+hei+",left="+wid);
    }

    /* 날짜만 입력해야할 때 */
    function showDateCalendar(dateField)
    {
        var wid = (screen.width)/2 - 220/2 ;
        var hei = (screen.height)/2 - 295/2;
        window.open("/common/popCalendar.jsp?type=date&dateField=" + dateField, "Calendar", "width=200,height=250,status=no,resizable=no,top="+hei+",left="+wid);
    }

        /*= TEXT INPUT VALUE VALIDATION CHECK(주민등록번호&사업자번호 등) ========

            1. TEXT 입력 값의 유효성을  확인한다.
            2. Function List
                    - IsValidJumin(oResNo)
                    : 문자열이 올바른 주민등록번호인지 확인하여 리턴
                    - IsValidSaupja(oCorpNo)
                    : 문자열이 올바른 사업자등록번호인지 확인하여 리턴
                    - IsValidBeopin(oBeopinNo)
                    : 문자열이 올바른 법인번호인지 확인하여 리턴
                    - IsValidAccountPassword(obj)
                    : 신규계좌 생성시 입력된 비밀번호의 유효성을 확인한다.
                    - checkssn(param1, param2)
                    : 두개의 파라메터를 이용한 주민등록번호 확인
                    - check_no(param1, param2)
                    : 두개의 파라메터를 이용한 외국인등록번호 확인
        ============================================================================*/

    /**
      * 문자열이 올바른 주민등록번호인지 확인하여 리턴
      * @param obj   Object
      * @return true : 바른 주민등록번호일 경우
      */
    function IsValidJumin(oResNo) {
        if(IsEmpty(oResNo)){
            return false;
        }
        var sResNo = oResNo.value;
        if(sResNo.length != 13) {
            return false;
        }

        var a = new Array(6)
        var b = new Array(7)
        var tot=0
        var c=0

        var sJumin0 = sResNo.substring(0,6);
        if (!IsMonth(sJumin0.substring(2,4))) {
            return false;
        }   else if (!IsDay2(sJumin0.substring(4,6))) {
            return false;
        }

        var sJumin1 = sResNo.substring(6,13);

        for(var i=1;i<7;i++) {
            a[i]=sJumin0.substring(i-1,i);
            b[i]=sJumin1.substring(i-1,i);

            if(i<3)
                c=Number(b[i])*(i+7);
            else
                c=Number(b[i])*((i+9)%10);

            tot = tot + Number(a[i])*(i+1) + c;
        }

        b[7]=sJumin1.substring(6,7);

        if(Number(b[7]) != ((11-(tot%11))%10)) {
            return false;
        } else {
            return true;
        }
    }


    /**
     * 문자열이 올바른 사업자등록번호인지 확인하여 리턴
     * @param oCorpNo  문자열
     * @return true : 바른 사업자등록번호일 경우
     */
    function IsValidSaupja(oCorpNo) {
        var chkRule = "137137135";
        var step1, step2, step3, step4, step5, step6, step7;

        if(oCorpNo.length != 10) {
            return false;
        }

        step1 = 0;          // 초기화

        for (i=0; i<7; i++) {
            step1 = step1 + (oCorpNo.substring(i, i+1) * chkRule.substring(i, i+1));
        }

        step2 = step1 % 10;
        step3 = (oCorpNo.substring(7, 8) * chkRule.substring(7, 8))% 10;
        step4 = oCorpNo.substring(8, 9) * chkRule.substring(8, 9);
        step5 = Math.round(step4 / 10 - 0.5);
        step6 = step4 - (step5 * 10);
        step7 = (10 - ((step2 + step3 + step5 + step6) % 10)) % 10;

        if (oCorpNo.substring(9, 10) != step7) {
            return false;
        }

        return true;
    }

    /**
         * 문자열이 올바른 법인번호인지 확인하여 리턴
         * @param obj   String
         * @return true : 바른 법인번호일 경우
     */
    function IsValidBeopinStr(oBeopinNoStr){

        var pid = RemoveDash(oBeopinNoStr);
        //공백체크
        if (oBeopinNoStr == null || oBeopinNoStr.replace(/ /gi,"") == "") {
            return false;
        }
        //13자리
        if(pid.length != 13) {
            return false;
        }
        
        var number = "0123456789";
        var szChkDgt = "121212121212";
        var pidono = "";

        for (var nCol=0; nCol < pid.length ; nCol++) {
            if (number.indexOf(pid.charAt(nCol)) >= 0) {
                    pidono += pid.charAt(nCol);
            }
        }
        var lastpid = pidono.substring(12,13);
        var i = 0;
        var j = 0;
        var nV1 = 0;
        var nV2 = 0;
        var nV3 = 0;
        for( i=0 ; i<12 ; i++) {
            nV1 = pidono.substring(i, i+1) * szChkDgt.charAt(i);
            if(nV1 > 9) {
                nV2 += nV1 % 10;
            } else {
                nV2 += nV1;
            }
        }
        nV3 = nV2 % 10;
        if( nV3 > 0 ) {
            nV3 = 10 - nV3;
        } else {
            nV3 = 0;
        }
        if (lastpid == nV3) {
            return true;
        } else {
            return false;
        }
        return true;
    }
        

    /**
         * 문자열이 올바른 법인번호인지 확인하여 리턴
         * @param obj   Object
         * @return true : 바른 법인번호일 경우
     */
    function IsValidBeopin(oBeopinNo){
        if (IsEmpty(oBeopinNo)) return false;
        var pid = RemoveDash(oBeopinNo.value);
        if(pid.length != 10) {
                return AlertFocus( oBeopinNo, "올바른 법인등록번호가 아닙니다.");
            }
        var pid = removeChar(oBeopinNo.value, "-");
        var number = "0123456789";
        var szChkDgt = "121212121212";
        var pidono = "";
        if (oBeopinNo.value.length < 1) {
            return;
        }
        for (var nCol=0; nCol < pid.length ; nCol++) {
            if (number.indexOf(pid.charAt(nCol)) >= 0) {
                    pidono += pid.charAt(nCol);
            }
        }
        var lastpid = pidono.substring(12,13);
        var i = 0;
        var j = 0;
        var nV1 = 0;
        var nV2 = 0;
        var nV3 = 0;
        for( i=0 ; i<12 ; i++) {
            nV1 = pidono.substring(i, i+1) * szChkDgt.charAt(i);
            if(nV1 > 9) {
                nV2 += nV1 % 10;
            } else {
                nV2 += nV1;
            }
        }
        nV3 = nV2 % 10;
        if( nV3 > 0 ) {
            nV3 = 10 - nV3;
        } else {
            nV3 = 0;
        }
        if (lastpid == nV3) {
            oBeopinNo.value= pid.substring(0, 7) + "-" + pid.substring(7, 13);
        } else {
            AlertFocus( oBeopinNo, "올바른 법인등록번호가 아닙니다.");
            return;
        }
    }


    /**
     * 신규계좌 생성시 입력된 비밀번호의 유효성을 확인한다.
     * @param obj   Object
     * @return true : 사용가능한 비밀번호일 경우
     */
    function IsValidAccountPassword(obj) {
        if (IsEmpty(obj)) return;
        if (!IsNumer(obj)) {
            AlertFocus(obj, "숫자만 입력하십시오.");
            return;
        }
        if (numstr.length != 4) {
            AlertFocus(obj, "비밀번호는 4자리입니다.");
            return;
        }
    }


    /**
     * 주민등록번호의 유효성을 확인한다.
     * @param strReg1   Object
     * @param strReg2   Object
     * @return true : 사용가능한 주민등록번호일 경우
     */
    function CheckSsn(strReg1,strReg2)
    {
        if ( strReg1.length != 6 ) return false;
        if ( strReg2.length != 7 ) return false;

        sGender = strReg2.substring(0,1);
        sYear = strReg1.substring(0,2);
        
        if(sGender >= 1 && sGender <= 4){
        // CheckSum 체크
            if (chksumID(strReg1,strReg2) == false){
                alert("주민번호를 올바로 입력해 주세요.")
                return false;
            }else {
                return true;
            }
        }
        else if(sGender >= 5 && sGender <= 8){
            if(CheckNo(strReg1,strReg2) == false){
                return false;
            }else {
                return true;
            }
        }       
        else {
            return false;
        }

        // 두번째 단락 첫번째 숫자는 4보다 클 수 없다.
//      if (sGender > 4) {
//          return false;
//      }

        // 2000년도 이전은 남자는 1, 여자는 2
        // 2000년도 이후는 남자는 3, 여자는 4
//      if (sYear != '00') {
//          if ((sGender != '1') && (sGender != '2')) {
//              return false;
//          }
//      } else {
//          if ((sGender != '3') && (sGender != '4')) {
//              return false;
//          }
//      }

        // 생성기로 만든게 아닌가 생년월일 체크
//      if ( !ValidRegNo(strReg1) )
//          return false;

//      return true;
    }


    /**
     * 주민등록번호의 유효성을 확인한다.
     * @param strReg1   Object
     * @param strReg2   Object
     * @return true : 사용가능한 주민등록번호일 경우
     */
    function chksumID(strReg1,strReg2)
    {
        //숫자로만구성되어 있는지 Test할 정규표현.
        var regExpr = /^[0-9]+$/;

        var li_lastid,li_mod,li_minus,li_last;
        var value0,value1,value2,value3,value4,value5,value6;
        var value7,value8,value9,value10,value11,value12;

        if (regExpr.test(strReg1) &&  regExpr.test(strReg2)) {
            li_lastid    = parseFloat(strReg2.substring(6,7));
            value0  = parseFloat(strReg1.substring(0,1))  * 2;
            value1  = parseFloat(strReg1.substring(1,2))  * 3;
            value2  = parseFloat(strReg1.substring(2,3))  * 4;
            value3  = parseFloat(strReg1.substring(3,4))  * 5;
            value4  = parseFloat(strReg1.substring(4,5))  * 6;
            value5  = parseFloat(strReg1.substring(5,6))  * 7;
            value6  = parseFloat(strReg2.substring(0,1))  * 8;
            value7  = parseFloat(strReg2.substring(1,2))  * 9;
            value8  = parseFloat(strReg2.substring(2,3))  * 2;
            value9  = parseFloat(strReg2.substring(3,4))  * 3;
            value10 = parseFloat(strReg2.substring(4,5))  * 4;
            value11 = parseFloat(strReg2.substring(5,6))  * 5;
            value12 = 0;

            value12 = value0+value1+value2+value3+value4+value5+value6+value7+value8+value9+value10+value11+value12 ;

            li_mod = value12 %11;
            li_minus = 11 - li_mod;
            li_last = li_minus % 10;
            if (li_last != li_lastid){
                return false;
            } else
                return true;
        }
        else
            return false;
    }


    /**
     * 주민등록번호의 유효성을 확인한다.( YYMMDD가 맞는지 확인한다.)
     * @param strReg1   Object
     * @return true : 사용가능한 주민등록번호일 경우
     */
    function ValidRegNo(strReg1)
    {
        a = new String(strReg1);

        if(a == '') return false;
        if(a.length != 6 ) return false;

        intYear = parseInt(a.substring(0,2) , 10);
        intMonth = parseInt(a.substring(2,4) , 10);
        intDay = parseInt(a.substring(4,6) , 10);

        if(intMonth < 0 || intMonth > 12){
            return false;
        }

        switch(intMonth){
            case 2 :
                if(intDay < 0 || intDay > 29){
                    return false;
                    breake;
                }
            case 4 :
                if(intDay < 0 || intDay > 30){
                    return false;
                    breake;
                }
            case 6 :
                if(intDay < 0 || intDay > 30){
                    return false;
                    breake;
                }
            case 9 :
                if(intDay < 0 || intDay > 30){
                    return false;
                    breake;
                }
            case 11 :
                if(intDay < 0 || intDay > 30){
                    return false;
                    breake;
                }
            default :
                if(intDay < 0 || intDay > 31){
                    return false;
                    breake;
                }
        }

        return true;
    }


    /**
     * 외국인등록번호의 유효성을 확인
     * @param obj      Object
     * @param format   String
     * @return true  올바른 포맷 형식일 경우
     */
    function CheckNo(jumin1, jumin2) {
        var fgn_reg_no = jumin1 + jumin2;
        if (fgn_reg_no == ''){
            alert('외국인등록번호를 입력하십시오.');
            return false;
        }

        if (fgn_reg_no.length != 13) {
            alert('외국인등록번호 자리수가 맞지 않습니다.');
            return false;
        }
            if ((fgn_reg_no.charAt(6) == "5") || (fgn_reg_no.charAt(6) == "6")){
                birthYear = "19";
            }else if ((fgn_reg_no.charAt(6) == "7") || (fgn_reg_no.charAt(6) == "8")){
                birthYear = "20";
            }else if ((fgn_reg_no.charAt(6) == "9") || (fgn_reg_no.charAt(6) == "0")){
                birthYear = "18";
            }else{
                alert("등록번호에 오류가 있습니다. 다시 확인하십시오.");
                return false;
            }
            birthYear += fgn_reg_no.substr(0, 2);
            birthMonth = fgn_reg_no.substr(2, 2) - 1;
            birthDate = fgn_reg_no.substr(4, 2);
            birth = new Date(birthYear, birthMonth, birthDate);

            if ( birth.getYear() % 100 != fgn_reg_no.substr(0, 2) ||
                     birth.getMonth() != birthMonth ||
                     birth.getDate() != birthDate) {
                alert('생년월일에 오류가 있습니다. 다시 확인하십시오.');
                return false;
            }

            if (fgn_no_chksum(fgn_reg_no) == false){
                    return false;
            }
            else {
                    return true;
            }
     }
     
     function fgn_no_chksum(reg_no) {
        var sum = 0;
        var odd = 0;
    
        buf = new Array(13);
    
        for (i = 0; i < 13; i++) buf[i] = parseInt(reg_no.charAt(i));
    
        odd = buf[7]*10 + buf[8];
    
        if (odd%2 != 0) {
            return false;
        }
    
        if ((buf[11] != 6)&&(buf[11] != 7)&&(buf[11] != 8)&&(buf[11] != 9)) {
            return false;
        }
    
        multipliers = [2,3,4,5,6,7,8,9,2,3,4,5];
        for (i = 0, sum = 0; i < 12; i++) sum += (buf[i] *= multipliers[i]);
    
        sum = 11-(sum%11);
    
        if (sum>=10) sum-=10;
    
        sum += 2;
    
        if (sum>=10) sum-=10;
    
        if ( sum != buf[12]) {
            return false;
        }
        else {
            return true;
        }
    }

    /**
     * 문자열 공백제거 함수.
     */
    function trim(str) {
      var count = str.length;
      var len = count;                
      var st = 0;
                
      while ((st < len) && (str.charAt(st) <= ' ')) {
         st++;
      }
      while ((st < len) && (str.charAt(len - 1) <= ' ')) {
         len--;
      }                
      return ((st > 0) || (len < count)) ? str.substring(st, len) : str ;   
   }

    /*==TEXT INPUT VALUE FORMAT================================================

            1. TEXT 입력 값의 기준 포맷을 따라 변경한다
            2. Function List
                    - AddSeperatorToAccountNo(Object)
                    : 11자리의 계좌번호를 입력받아 자동으로 '-'를 더하여 리턴(ex)
                    - AddSeperatorToJuminNo(Object)
                    : 13자리의 주민등록번호를 입력받아 자동으로 '-'를 더하여 리턴(ex)123456-7890123
                    - AddSeperatorToSaupjaNo(Object)
                    : 10자리의 사업자번호를 입력받아 자동으로 '-'를 더하여 리턴(ex)123-45-67890
                    - AddSeperatorToCardNo(Object)
                    : 입력되는 카드번호의 4자리마다 '-'를 더하여 리턴 (ex)1234-5678-9012-3456

    ==============================================================================*/

    /**
     * 11자리의 계좌번호를 입력받아 자동으로 '-'를 더하여 리턴
     * @param obj   Object
     * @return acct 계좌번호
     */
    function AddSeperatorToAccountNo(obj) {
        if (IsEmpty(obj)) return;
        if (!IsNumDash(obj)) {
            AlertFocus(obj, "숫자만 입력하십시오.");
            return;
        }
        var numstr = RemoveDash(obj.value);
        if (numstr.length != 11) {
            AlertFocus(obj, "계좌번호는 11자리입니다");
            return;
        }
        var rxSplit = new RegExp('([0-9][0-9][0-9])([0-9][0-9])([0-9][0-9][0-9][0-9][0-9][0-9])');
        numstr = numstr.replace(rxSplit, '$1-$2-$3');
        obj.value = numstr;
    }


    /**
     * 13자리의 주민등록번호를 입력받아 자동으로 '-'를 더하여 리턴
     * @param obj   Object
     * @return acct 주민등록번호
     */
    function AddSeperatorToJuminNo(obj) {
        if (IsEmpty(obj)) return;
        if (!IsNumDash(obj)) {
            AlertFocus(obj, "숫자만 입력하십시오.");
            return false;
        }
        if (!IsValidJumin(obj)) {
            return false;
        }
        var numstr = RemoveDash(obj.value);
        var rxSplit = new RegExp('([0-9][0-9][0-9][0-9][0-9][0-9])([0-9][0-9][0-9][0-9][0-9][0-9][0-9])');
        numstr = numstr.replace(rxSplit, '$1-$2');
        obj.value = numstr;
    }


    /**
     * 10자리의 사업자번호를 입력받아 자동으로 '-'를 더하여 리턴
     * @param obj   Object
     * @return acct 사업자번호
     */
    function AddSeperatorToSaupjaNo(obj) {
        if (IsEmpty(obj)) return;
        if (!IsNumDash(obj)) {
            AlertFocus(obj, "숫자만 입력하십시오.");
            return false;
        }
        if (!IsValidSaupja(obj)) {
            return false;
        }
        var numstr = RemoveDash(obj.value);
        var rxSplit = new RegExp('([0-9][0-9][0-9])([0-9][0-9])([0-9][0-9][0-9][0-9][0-9])');
        numstr = numstr.replace(rxSplit, '$1-$2-$3');
        obj.value = numstr;
    }


    /**
     * 10자리 혹은 13자리의 사업자번호,주민번호를 입력받아 자동으로 '-'를 더하여 리턴
     * @param obj   Object
     * @return acct 사업자번호, 주민번호
     */
    function AddSeperatorToSilmyungNo(obj) {
        if (IsEmpty(obj)) return;
        var numstr = RemoveDash(obj.value);
        if (numstr.length == 10) {
            AddSeperatorToSaupjaNo(obj);
        } else if (numstr.length == 13){
            AddSeperatorToJuminNo(obj);
        } else {
            AlertFocus(obj, "잘못된 형식의 실명번호입니다");
        }
    }


    /*
     * 10자리 혹은 13자리의 사업자번호,주민번호를 입력받아 자동으로 '-'를 더하여 리턴
     * @param obj1   Object
     * @param obj2   Object
     * @return acct 사업자번호, 주민번호
     */
    function checkSilmyungNo(obj1, obj2) {
        var obj = obj1.value+obj2.value;
        if (IsEmpty(obj)) return;
        if (obj.length == 10) {
            AddSeperatorToSaupjaNo(obj);
        } else if (obj.length == 13){
            AddSeperatorToJuminNo(obj);
        } else {
            AlertFocus(obj, "잘못된 형식의 실명번호입니다");
        }
    }


    /**
     * 카드번호 입력시 4자리마다 NO_SEPERATOR(-) 추가한다
     * @param obj   Object
     * @return
     */
    function AddSeperatorToCardNo(obj) {
        if (IsEmpty(obj)) return;
            if (!IsNumDash(obj)) {
                obj.value = obj.value.substr(0, obj.value.length-1);
                AlertFocus(obj, "숫자만 입력하십시오.");
                return false;
            }
            var numstr = RemoveDash(obj.value);
            if (numstr.length != 16) {
                AlertFocus(obj, "카드번호는 16자리입니다");
                return;
            }
            var numstr = obj.value;
            var num = numstr;
            var rxSplit = new RegExp('([0-9][0-9][0-9][0-9])([0-9])');

            do {
                numstr = numstr.replace(rxSplit, '$1-$2');
            } while (rxSplit.test(numstr));

        obj.value = numstr;
    }


    /**
     * 숫자만 입력되었는지 체크한다.
     * @param obj Object
     * @return
     */
    function checkNum(obj) {
        if (IsEmpty(obj)) return;
        if(IsNumber(obj) == false) {
            AlertFocus(obj, "숫자만 입력하십시오.");
            return false;
        }
    }



    /*= 기타 JAVASCRIPT FUNCTION ================================================

            1. 팝업창을 이용한 값
            2. Function List
                    - SearchAddress(form, zip1, zip2, address, addrdetail)
                    : 팝업창을 이용한 우편번호 검색
                    - regform(f)
                    : tag를 사용한 폼체크
    ============================================================================*/

     /**
     * 우편번호 검색을 한다.
     * @param form              폼명
     * @param zip1              우편번호(앞)필드명
     * @param zip2              우편번호(뒤)필드명
     * @param address           우편주소필드명
     * @param addrdetail    기타주소필드명
     * @return
     */
    function SearchAddress(form, zip1, zip2, address, addrdetail) {
        var state = "width=450,height=303,scrollbars=1,toolbar=0,status=0,resizable=0,menubar=0,left="+screen.width/5+",top="+screen.height/4;
        var url = "/include/addr_search.asp?form="+form+"&zip1="+zip1+"&zip2="+zip2+"&address="+address+"&addrdetail="+addrdetail;
        var win = window.open(url,'popupAddress',state);

        win.focus();
    }


    /**
     * tag를 사용한 폼체크
     * @param f             this
     * @return
     */
    function regform(f) {
        var j = f.elements.length
        var i;
        var re;
        var args;
        var result;

        for (i=0; i<j; i++) {
            if (typeof(f.elements[i].tag) == "undefined") continue;

            args = f.elements[i].tag.split("||", 3);
        if (args[0]=='C') {
                result = eval(args[1]);
            } else if ((args[0]=='M') || ((args[0]=='O')&& (f.elements[i].value.length>0))) {
                re = new RegExp(args[1], "gi");
                result = f.elements[i].value.match(re);
            }

            if (!result) {
                f.elements[i].select();
                alert(args[2]);
                return false;
            }
        }

        return true;
    }


    /**
     * 상품이미지 이외의 기타 이미지 업로드 팝업창
     * @param category      "group", "event", "brand", "card"
     * @param formname      form name
     * @param txtname           return field name
     * @return
     */
    function uploadImage(category, formname, txtname) {
        var state = "width=450,height=250,scrollbars=0,toolbar=0,status=0,resizable=0,menubar=0,left="+(screen.width/5)+",top="+(screen.height/4);
        var url = "/include/image_upload.asp?category="+category+"&formname="+formname+"&txtname="+txtname;
        var win = window.open(url,'ImageUpload',state);
        win.focus();
    }


    /**
     * 특수문자사용금지
     * @param field     
     * @return
     */
    function stringFilter(field) {
        s = field.value;

        filteredValues = " !@#$%^&*()_+|\=-'?><{}[],./＃＆＊＠※☆★○●";
        var i;
        var returnString = "";
        for (i = 0; i < s.length; i++) {
                var c = s.charAt(i);
                if (filteredValues.indexOf(c) == -1) returnString += c;
        }
        field.value = returnString;
    }


    /**
     * 이메일 @이후의 도메인종류만 select박스로 출력
     * @param val(해당하는 @이후의 도메인값)     
     * @return
     */
    function eMailList(val){
        var TempVal;
        var strUrl = "chol.com/dreamwiz.com/empal.com/freechal.com/hanmail.net/hanmir.com/hitel.net/hotmail.com/intizen.com/korea.com/lycos.co.kr/nate.com/naver.com/netian.com/netsgo.com/orgio.net/paran.com/simmani.com/weppy.com/yahoo.co.kr";

        splitMail = strUrl.split("/");
        splitUrl = strUrl.split("/");

        for(var i = 0; i < splitUrl.length; i++){
            if (val==splitUrl[i]){
                TempVal = " selected ";
            }else{
                TempVal = "";
            }
            document.writeln("<option value='"+ splitUrl[i] +"'"+ TempVal +">"+ splitMail[i] +"</option>");
        }
    }


    /**
     * 이메일 @이후의 도메인종류만 select박스의 옵션 문자열로 리턴
     * @param val(해당하는 @이후의 도메인값)     
     * @return
     */
    function return_eMailList(val){
        var TempVal;
        var strUrl = "chol.com/dreamwiz.com/empal.com/freechal.com/hanmail.net/hanmir.com/hitel.net/hotmail.com/intizen.com/korea.com/lycos.co.kr/nate.com/naver.com/netian.com/netsgo.com/orgio.net/paran.com/simmani.com/weppy.com/yahoo.co.kr";
        var rtnVal="";

        splitMail = strUrl.split("/");
        splitUrl = strUrl.split("/");

        for(var i = 0; i < splitUrl.length; i++){
            if (val==splitUrl[i]){
                TempVal = " selected ";
            }else{
                TempVal = "";
            }
            rtnVal = rtnVal + "<option value='"+ splitUrl[i] +"'"+ TempVal +">"+ splitMail[i] +"</option>";
        }
        return rtnVal;
    }


    
    /**
     * 이메일 @이후의 도메인 추가 등록하는 팝업창 띄움
     * @param form(해당하는 @이후의 도메인값)     
     * @return
     */
    function eMailInsert(form){

        var emailId = form.emailId.value;
        var emailAddr = form.emailAddr.value;
        var emailAddrSelect = form.emailAddrSelect.value;

        if (emailAddrSelect == "etc"){
        document.form1.emailAddr.style.backgroundColor = "";
        document.form1.emailAddr.readOnly = false;
        document.form1.emailAddr.value = "";
        }
        else
        {
        document.form1.emailAddr.style.backgroundColor = "#EFEFEF";
        document.form1.emailAddr.readOnly = true;
        form.emailAddr.value = emailAddrSelect;
        }
        /*
        if (emailAddr == "etc"){
          popup_window("/include/eMail_insert.asp?emailId="+ emailId,"email",400,220,0,0,"auto");
        }
        */
    }


    /**
     * 입력된 값이 지정된 길이만큼 됐을때 지정한 Item으로 Focus 이동
     * @param num  
     * @param fromform  
     * @param toform  
     * @return
     */
    function moveFocus(num,fromform,toform){
        var str = fromform.value.length;
        if(str == num)
           toform.focus();
    }



    function dateAdd( sType, sAddnum, sDate ) {
        return IsDateAdd(sDate,sType.toUpperCase(),sAddnum);
    }


    function dateFormat( datee, formatstr ) {
        return GetDateFormat(datee, formatstr);
    }



    /**
     * 일 단위로 기간을 적용한다. 기준은 종료일 기준이다.
     * @param stdt  
     * @param endt  
     * @param stdt_display  
     * @param endt_display  
     * @param period  
     * @return
     */
    function applyPeriod(stdt,endt,stdt_display,endt_display,period)
    {
        var edate = str2date(endt.value);
        var sdate = dateAdd("d", (-1)*period, edate);
        stdt.value = GetDateFormat( sdate, "YYYYMMDD" );
        stdt_display.value = GetDateFormat( sdate, "YYYY-MM-DD" );
        endt.value = GetDateFormat( edate, "YYYYMMDD" );
        endt_display.value = GetDateFormat( edate, "YYYY-MM-DD" );
    }


    /*
    *년, 일, 시간을 각각 선택하는 <SELECT> 태그에서 년 또는 월을 변경하는 경우.
    * @param syear  
    * @param smonth  
    * @param sday  
    * sample:
    * <select name="year" onchange="monthday(year,month,day);"></select> 년
    * <select name="month" onchange="monthday(year,month,day);"></select> 월
    * <select name="day"></select> 일
    */
    function monthday(syear,smonth,sday) {
        selectedmonth = smonth.selectedIndex;
        selectedday = sday.selectedIndex;

        var selectedyear = syear.value;

        var lastday;
        switch (selectedmonth) {
            case 0: case 2: case 4: case 6: case 7: case 9: case 11:
                lastday = 31;
                break;
            case 1:
                if (((selectedyear%4 == 0) && (selectedyear%100 != 0)) || (selectedyear%400 == 0))
                    lastday=29
                else
                    lastday=28
                break;
            default : lastday = 30;
        }
        for ( i = 0; i < sday.length; i++ )
            sday.options[i] = null;

        sday.length = 0;

        for ( i = 0; i < lastday; i++ ) {
            if (selectedday == i){
                sday.options[i] = new Option(lpad(String(i+1),2,'0'), String(i+1), true, true);
            }
            else {
                sday.options[i] = new Option(lpad(String(i+1),2,'0'), String(i+1), false, false);
            }
        }
    }


    /**
     * 쿠키 설정(name이름의 value 값의 쿠키설정기간이 expiredays인 쿠키를 생성한다)
     * @param name  
     * @param value  
     * @param expiredays  
     * @return
     */
    function setCookie( name, value, expiredays ) {
        var todayDate = new Date();
        todayDate.setDate( todayDate.getDate() + expiredays );
        document.cookie = name + "=" + escape( value ) + "; path=/; expires=" + todayDate.toGMTString() + ";"
    }


    /**
     * varname의 쿠키값이 있는지 확인
     * @param varname  
     * @param expiredays  
     * @return
     */
    function getCookie(varname) {
        varname += "=";
        startpos = document.cookie.indexOf(varname);
        if (startpos >= 0) {
            startpos += varname.length;
            endpos = document.cookie.indexOf(";", startpos);
            if (endpos == -1) endpos = document.cookie.length;
            return unescape(document.cookie.substring(startpos, endpos));
        }
    }
    
    /**
     * 등록 가능한 이미지 파일 검사 
    */
    
    function checkedImageType(str) {
        var regExp = /\.(gif|jpg)/;
        if ( ! regExp.test(str) ) {
            Alert("등록 가능한 이미지 파일은 JPG, GIF Type만 가능합니다.");
            return false;
        }
        return true;
    }
    
    /**
     * @param str 파일명
     * @param fileType 체크할 파일 Type ex) \.(xls|cvs), \.xls ....<b>
     * @return 
    */
    function checkExcelFileType( str ) { 
        var regExp = /\.xls/;
        if ( ! regExp.test(str) ) {
            Alert("등록 가능한 파일은 " + fileType + " Type만 가능합니다.");
            return false;
        }
        return true;
    }
    
    function validation_object(obj,insert_type){
    

    //   제목   :  VALIDATION OBJECT
    //
    //   사용법
    //
    //   해당객체의 유효성을 확인한다.
    //   확인 가능 객체는 <input type="text,password">,<textarea>두가지 객체를 지원한다.
    //   유효성 체크를 완료한경우 true를 체크도중 오류발생시 false를 반환
    //   체크방법은 insert_type,essential_type를 확인하여 이로 유효성여부를 확인
    //
    //   Attribute종류
    //  
    //   minlength : 최소 입력길이 (minlength = "숫자" 형태로 기록)
    //   insert_type : 입력문자열의 type 
    //                 kor : 한글만 입력
    //                 eng : 영어만 입력
    //                 num : 숫자만 입력
    //                 kornum : 한글과 숫자만 입력
    //                 engnum : 영어와 숫자만 입력
    //                 engkor : 한글과 영어만 입력
    //
    //   obj : 유효성을 확인한 객체 (this형태로 입력)
    //
    
    minlength = obj.minlength; // 최소 입력길이
    
    target_text = obj.value;  // 확인 대상 문자열
    
    target_text = replace_empty_string(target_text); //  문자열에서 공백 제거
        
    if (minlength != null) // attribute의 존재 여부검사
    {
        if (new Number(minlength) > target_text.length) // 최소 입력길이와 대상문자열의 길이 비교
        {
            alert("해당항목은 " + minlength + "글자 이상 입력하여야 합니다."); // 오류 메세지 출력
            obj.value = "" 
            obj.focus(); // 확인 대상 객체로 focus이동
            return false; // false반환
        }
    }
    if (insert_type != null)// attribute의 존재 여부검사
    {
        // insert type에 따라 switch문 실행
        switch(insert_type)
        {
            case "kor" : // 한글만 입력
                
                status = 1; // 에러 확인 코드
                
                l1 = target_text.length;  // 문자열 길이
                
                // 문자열을 한개씩 분리하여 type확인
                for (i=0;i<l1;i++)
                {
                    test_string = target_text.substring(i,i+1);  // 문자열 분리
                    test_string_code = test_string.charCodeAt(0); // type확인
                 
                    if (test_string_code > 44031 && test_string_code < 63087)
                    {
                        // 한글
                        status = 1;
                    }
                    else
                    {
                        // 한글이 아닐경우
                        status = 2; // 상태 변경
                        break;// LOOP종료
                    }
                    
                }
                if (status == 2) // 에러 상태 확인
                {
                    // 오류발생
                    
                    alert("해당 입력란은 한글만 입력할수 있습니다."); // 오류메세지 출력
                    obj.value = ""; // 입력 객체 초기화
                    obj.focus(); // 입력 객체 포커스 이동
                    return false; // false반환
                }
                break; // switch문 종료
                
            case "eng" : // 영어만 입력
                status = 1; // 에러 확인 코드
                
                l1 = target_text.length; // 문자열 길이
                
                // 문자열을 한개씩 분리하여 type확인
                
                for (i=0;i<l1;i++)
                {
                    test_string = target_text.substring(i,i+1); // 문자열 분리
                    test_string_code = test_string.charCodeAt(0); // type확인
                 
                    if ((test_string_code > 64 && test_string_code < 91)||(test_string_code > 96 && test_string_code < 123))
                    {
                        // 영문
                        status = 1;
                    }
                    else
                    {
                        //영문이 아닐경우
                        status = 2; // 상태 변경
                        break; // LOOP종료
                    }
                    
                }
                if (status == 2) // 에러 상태 확인
                {
                    // 오류발생
                    
                    alert("해당 입력란은 영어만 입력할수 있습니다."); // 오류메세지 출력
                    obj.value = ""; // 입력 객체 초기화
                    obj.focus(); // 입력 객체 포커스 이동
                    return false; // false반환
                }       
                break; // switch문 종료
                    
            case "num" : // 숫자만 입력
                status = 1; // 에러 확인 코드
                
                target_text = obj.value;    // 숫자체크시 공백이 있을시 error처리
                l1 = target_text.length; // 문자열 길이
                
                // 문자열을 한개씩 분리하여 type확인
                
                for (i=0;i<l1;i++)
                {
                    test_string = target_text.substring(i,i+1); // 문자열 분리
                    test_string_code = test_string.charCodeAt(0); // type확인
                 
                    if (test_string_code > 47 && test_string_code < 58)
                    {
                        // 숫자
                        status = 1;
                    }
                    else
                    {
                        // 숫자가 아닐 경우
                        status = 2; // 상태 변경
                        break; // LOOP종료
                    }
                    
                }
                if (status == 2) // 에러 상태 확인
                {
                    // 오류발생
                    alert("해당 입력란은 숫자만 입력할수 있습니다."); // 오류메세지 출력
                    obj.value = ""; // 입력 객체 초기화
                    obj.focus(); // 입력 객체 포커스 이동
                    return false; // false반환
                }       
                break; // switch문 종료
                            
            case "engnum" : // 영어와 숫자만 입력
            
                status = 1; // 에러 확인 코드
                
                l1 = target_text.length; // 문자열 길이
                
                // 문자열을 한개씩 분리하여 type확인
                
                for (i=0;i<l1;i++)
                {
                    test_string = target_text.substring(i,i+1); // 문자열 분리
                    test_string_code = test_string.charCodeAt(0); // type확인
                 
                    if ((test_string_code > 64 && test_string_code < 91)||(test_string_code > 96 && test_string_code < 123) || (test_string_code > 47 && test_string_code < 58))
                    {
                        // 영어와 숫자
                        status = 1;
                    }
                    else
                    {
                        // 영어와 숫자가 아닐경우
                        status = 2; // 상태 변경
                        break; // LOOP종료
                    }
                    
                }
                if (status == 2)// 에러 상태 확인
                {
                    // 오류발생
                    alert("해당 입력란은 영어와 숫자만 입력할수 있습니다."); // 오류메세지 출력
                    obj.value = ""; // 입력 객체 초기화
                    obj.focus(); // 입력 객체 포커스 이동
                    return false; // false반환
                }       
                break; // switch문 종료
                
            case "kornum" : // 한글과 숫자만 입력
                status = 1; // 에러 확인 코드
                
                l1 = target_text.length; // 문자열 길이
                
                // 문자열을 한개씩 분리하여 type확인
                
                for (i=0;i<l1;i++)
                {
                    test_string = target_text.substring(i,i+1); // 문자열 분리
                    test_string_code = test_string.charCodeAt(0); // type확인
                 
                    if ((test_string_code > 47 && test_string_code < 58) || (test_string_code > 44031 && test_string_code < 63087))
                    {
                        // 한글과 숫자
                        status = 1;
                    }
                    else
                    {
                        // 한글과 숫자가 아닐경우
                        status = 2; // 상태 변경
                        break; // LOOP종료
                    }
                    
                }
                if (status == 2) // 에러 상태 확인
                {
                    // 오류발생
                    
                    alert("해당 입력란은 한글과 숫자만 입력할수 있습니다."); // 오류메세지 출력
                    obj.value = ""; // 입력 객체 초기화
                    obj.focus(); // 입력 객체 포커스 이동
                    return false; // false반환
                }       
                break; // switch문 종료
                        
            case "engkor" : // 영어와 한글만 입력
                status = 1; // 에러 확인 코드
                
                l1 = target_text.length; // 문자열 길이
                
                // 문자열을 한개씩 분리하여 type확인
                
                for (i=0;i<l1;i++)
                {
                    test_string = target_text.substring(i,i+1); // 문자열 분리
                    test_string_code = test_string.charCodeAt(0); // type확인
                 
                    if ((test_string_code > 64 && test_string_code < 91)||(test_string_code > 96 && test_string_code < 123) || (test_string_code > 44031 && test_string_code < 63087))
                    {
                        //영어와 한글
                        status = 1;
                    }
                    else
                    {
                        //영어와 한글이 아닐경우
                        status = 2; // 상태 변경
                        break; // LOOP종료
                    }
                    
                }
                if (status == 2) // 에러 상태 확인
                {
                    // 오류발생
                    alert("해당 입력란은 한글과 영어만 입력할수 있습니다.");// 오류메세지 출력
                    obj.value = ""; // 입력 객체 초기화
                    obj.focus(); // 입력 객체 포커스 이동
                    return false; // false반환
                }       
                break; // switch문 종료
        }
    }   
    
    return true;
}

function replace_empty_string(text)
{

    //   제목   :  REPLACE EMPTY STRING
    //
    //   사용법
    //
    //   문자열 내부에 포함된 공백을 제거한다.
    //   공백을 제거한 문자열을 반환한다.
    //
    //   text : 공백을 제거할 대상 문자열
    //
    
    while(text.indexOf(" ") != "-1")
    {   
        text = text.replace(" ","");
    }
    return text;
}

    //   제목   :  RADIO CHECKED OBJECT GET VALUE
    //
    //   사용법
    //
    //   특정 Radio객체중 체크된 Radio버튼의 Value를 반환한다.
    //
    //   obj_name : 데이터를 가져올 Radio 객체의 Name
    //
    //   return value에 value값 리턴
    //   Radio버튼중 선택된것이 없거나 입력된 객체명이 페이지내에 존재하지 않을때는 false반환
    //

function get_radio_value(obj_name)
{
    // 입력된 객체이름을 객체로 생성
    if (obj_name != "") // 객체명이 공백인지 검사
    {
        select_obj = eval("document.forms[0]." + obj_name); 
        if (select_obj != null) // 입력한 객체가 존재하는지 여부 검사
        {
            if (select_obj.length != null) //입력한 객체명을 가진 객체가 한개인지 여러개 인지 검사
            {
                //입력한 객체명을 가진 객체가 여러개 일때
                l1 = select_obj.length; // 입력된 객체명을 가진 Radio버튼의 갯수 확인
                r_value = ""; // 반환값 초기화
                for (i=0;i<l1;i++) // 객체수만큼 LOOP
                {
                    if(select_obj.item(i).checked) // 객체의 check상태확인
                    {
                        r_value = select_obj.item(i).value; // 반환값 설정
                        break; // LOOP Exit
                    }
                }
                if(r_value == "0")
                {
                    return true; 
                }
                else if (r_value != "") // 반환값이 있는지 여부 확인
                {
                    // 반환값이 있으므로 반환값반환
                    return r_value;
                }
                else
                {
                    // check된 Radio 버튼이 없어 반환값이 없음으로 false 반환
                    return false;
                }
            }
            else
            {
                //입력한 객체명을 가진 객체가 한개 일때
                if (select_obj.checked) //객체의 check상태확인
                {
                    return select_obj.value;  // 반환값 설정
                }
                else
                {
                    // check된 Radio 버튼이 없어 반환값이 없음으로 false 반환
                    return false;
                }
            }
        }
        else
        {
            // 입력된 객체명을가진 Radio버튼이 존재하지 않음으로 false반환
            return false;
        }
    }
}

//아이디 중복확인
function onChkMemberId(formNm, memberId, passwd) {
    var form = document.forms[formNm];
    if(IsNull(form.elements[memberId])){
        alert("사용할 아이디를 입력해주세요.\nID는 4~12자의 영문과 숫자를 사용하실 수 있습니다.");
        form.elements[memberId].focus();
        return;
    }
    if(form.elements[memberId].value.length < 4 || form.elements[memberId].value.length > 12){
        alert("아이디는 4~12자의 영문과 숫자를 사용하실 수 있습니다.");
        form.elements[memberId].focus();
        return;
    }
    var goUrl = "/member.do?cmd=checkDuplicateID&forms=" + formNm+"&memberId="+memberId+"&passwd="+passwd+"&memberIdChk=" +form.elements[memberId].value;
    CenterOpenWindow( goUrl ,'newWin', "420", "300", "toolbar=no,scrollbars=no");
    form.elements[memberId].value = "";
}

//첨부파일 확장자 확인
function getFileExtension( filePath )
{
    var lastIndex = -1;
    lastIndex = filePath.lastIndexOf('.');
    var extension = "";

    if ( lastIndex != -1 )
    {
        extension = filePath.substring( lastIndex+1, filePath.len );
    } else {
        extension = "";
    }
    return extension;
}

    //첨부파일 이름 가져오기
    function getFileNameExtension( filePath )
    {
        var lastIndex = -1;
        lastIndex = filePath.lastIndexOf('\\');
        var extension = "";
    
        if ( lastIndex != -1 )
        {
            extension = filePath.substring( lastIndex+1, filePath.len );
        } else {
            extension = "";
        }
        return extension;
    }

function getFileSize(filePath) 
{ 
    var len = 0; 
    if ( navigator.appName.indexOf("Netscape") != -1) 
    { 
        try { 
            netscape.security.PrivilegeManager.enablePrivilege('UniversalXPConnect'); 
        } catch(e) { 
            alert("signed.applets.codebase_principal_support를 설정해주세요!\n"+e); 
            return -1; 
        } 
        try { 
            var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile); 
            file.initWithPath ( filePath ); 
            len = file.fileSize; 
        } catch(e) { 
            alert("에러 발생:"+e); 
        } 
    } 
    else if (navigator.appName.indexOf('Microsoft') != -1) 
    { 
        var img = new Image(); 
        img.dynsrc = filePath; 
        len = img.fileSize; 
    } 
    return len; 
} 

function checkFileSize(obj, size) 
{ 
    var len = getFileSize(obj.value);
    var size1024 = parseInt(size)*1024;
    // 아래 빨간색 부분이 파일사이즈 지정해 주는 부분입니다. 
    // 상황에 맞게 아래 부분을 수정해서 사용하시면 됩니다. 
    //alert(len+'    '+ size1024);
    if (len >= size1024) 
    { 
        return -1;
    } 
    return len;
} 


function add_date(i) {
    var currentDate; // 계산된 날
    currentDate = this.getDate() + i * 1;  // 현재 날짜에 더해(빼)줄 날짜를 계산
    this.setDate(currentDate);  // 계산된 날짜로 다시 세팅
}

//날짜 선택시 YYYYMMDD형식으로 변환
function onSelect(day) {
    var today = new Date();
    Date.prototype.addDate = add_date; // Date 객체에 메서드 정의
    today.addDate(-day);        // 검색할 시작 날짜에 계산된 값 대입
    var year = today.getFullYear();
    var mon = today.getMonth() + 1; 
    var sday = today.getDate();    
    var date = year + String(padZero(mon, 2)) + String(padZero(sday, 2));
    return date;
}

function padZero(num, leng) {
       var zero = leng - ("" + num).length;
       if (typeof(num) == "number" && zero > 0) {
           var tmp = "";
           for (var i = 0; i < zero; i++) tmp += "0";
           return tmp + num;
       } else return num;
   }
   
   //현재 날짜를 YYYYMMDD형식으로 변환
function onToday() {
    var today = new Date();
    var year = today.getFullYear();
    var mon = today.getMonth() + 1;
    var sday = today.getDate();
    var date = year + String(padZero(mon, 2)) + String(padZero(sday, 2));
    return date;
}

//날짜입력 폼 해제
function setNoDate2(obj, varName ) {
    var val = eval("obj." + varName);
    val.value = "";
}
//기간별 조회 날짜입력 폼 해제(기간별 조회 단위 선택시)
function setNoDate(obj,day) {
    //var form = document.forms["itemForm"];
    
    // 조회하지 않음
    if(day == "0") {
        obj.startSearchDate.value = "";
        obj.endSearchDate.value = "";
    } else {    // 체크된 값만큼 날짜를 지정
        obj.endSearchDate.value = onToday();            
        obj.startSearchDate.value = onSelect(day);
    }
}

//기간별 조회 날짜입력 폼 해제(기간별 조회 단위 선택시)
function setNoDateObj(obj,obj1,day) {
    //var form = document.forms["itemForm"];
    
    // 조회하지 않음
    if(day == "0") {
        obj.value = "";
        obj1.value = "";
    } else {    // 체크된 값만큼 날짜를 지정
        obj1.value = onToday();         
        obj.value = onSelect(day);
    }
}

// 오늘로부터 지정일 이후의 날짜 
function getAfterday(day) {
    var today = new Date();
    Date.prototype.addDate = add_date; 
    today.addDate(day);         
    var year = today.getFullYear();
    var mon = today.getMonth() + 1; 
    var sday = today.getDate();    
    var date = year + String(padZero(mon, 2)) + String(padZero(sday, 2));
    return date;
}

function setDateAfterObj(obj,obj1,day) {
    //var form = document.forms["itemForm"];
    
    // 조회하지 않음
    if(day == "0") {
        obj.value = "";
        obj1.value = "";
    } else {    // 체크된 값만큼 날짜를 지정
        obj1.value = getAfterday(day);          
        obj.value = onToday();
    }
}
/********************************************************************************************************
    공통Popup 정의
    변수 정의 : pop - 파일명, width - 가로사이즈, height - 세로사이즈, flag - 0:스크롤없음, 1:스크롤있음
********************************************************************************************************/
function pop(pop,width,height,flag)
{
  var url = pop;
  var wd = width;
  var he = height;

  if ((window.navigator.userAgent.indexOf("SV1") != -1) || (window.navigator.userAgent.indexOf("MSIE 7") != -1)) {
    wd = wd + 8;
    he = he + 10;
        
    if (flag == "0" )    {  
      window.open(url,"","toolbar=0,menubar=0,scrollbars=no,resizable=no,width=" + wd + ",height=" + he + ";");  }
    else  {  
      window.open(url,"","toolbar=0,menubar=0,scrollbars=yes,resizable=no,width=" + wd + ",height=" + he + ";");  }
  }
  
  else {
  if (flag == "0" )    {  
    window.open(url,"","toolbar=0,menubar=0,scrollbars=no,resizable=no,width=" + wd +",height=" + he + ";");  }
  else  {  
    window.open(url,"","toolbar=0,menubar=0,scrollbars=yes,resizable=no,width=" + wd +",height=" + he + ";");  }  
  }
}


//우편번호찾기
function findZipcode01(){
    var url = "/member.do?cmd=findZipcode";

    pop(url,526,500,1);
}



    /**
     * 입력값이 숫자,대시(-)로 되어있는지 체크 하는 관련 메세지
     * @param obj   Object
     * @return true 숫자,대시(-)로 되어있는 경우
     */
    function IsNumDashMessage(obj) {
        
        if (!IsNumDash(obj)) {
            AlertFocus(obj, '숫자 및 (-)로 입력하십시오');
            return false;
        }
        return true;
    }
 
//업로드중 화면 호출    
function setWaitStart()
{
    valWidth  = 250;
    valHeight = 100;
    var sFeatures = "Width="+valWidth+",Height="+valHeight+",toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=0,resizable=0";
    waitWin = window.open("/aiAdmin/common/wait/wait.jsp","popwait", sFeatures);
    sizeX =  window.screen.width/2-(valWidth/2);
    sizeY =  window.screen.height/2-(valHeight/2);
    //window.showModalDialog("/aiAdmin/common/wait/wait.jsp",window, "dialogWidth:400px; dialogHeight:300px; status:no;scroll:no;");
    waitWin.moveTo(sizeX, sizeY);
    waitWin.focus();
    
    
}

//업로드중 화면 닫기
function setWaitEnd()
{
    try
    {
        waitWin.close();
    }catch(e){}

    try
    {
        parent.waitWin.close();
    }catch(e){}
}


function deleteDataValue(obj)
{

    for(i=0; i<obj.length; i++)
    {
        obj[i].value="";    
    }
} 
  
//오브젝트 값 비교 
function compareObjs(minObj, maxObj) 
{
    var minValue;
    var maxValue;
    if(minObj.value ==null)
    {
        minValue=0;
    }
    else
    {
        minValue = parseInt( minObj.value);
    }
    
    if(maxObj.value == null)
    {
        maxValue=999999999999;
    }
    else
    {
        maxValue = parseInt(maxObj.value);
    }
    
    if(minValue > maxValue)
    {
        return false;
    }
    else
    {
        return true;
    }
}

/**
 * startDate => 'yyyymmdd', endDate => 'yyyymmdd'
 * 두 날짜간의 차이일수를 계산한다.
 */
function getBetweenDays(startDate, endDate){
    var sdate = getDateObject(startDate);
    var edate = getDateObject(endDate);
    var days = (edate.getTime() - sdate.getTime()) / 1000 / 60 / 60 / 24;
    return days;
}

/**
 * string형태의 날짜를 Date 객체로 돌려준다.
 * dateStr => 'yyyymmdd'
 */
function getDateObject(dateStr){
    var date = new Date();
    date.setYear(dateStr.substr(0, 4));
    date.setMonth(dateStr.substr(4, 2)-1);
    date.setDate(dateStr.substr(6, 2));
    return date;        
}

function onEnterKeySearch(name){ 
    if ( event.keyCode == 13) eval(name)();                 
}



/**
 * 해당 subimt이 더블클릭인지 여부를 체크하여 더블클릭일 경우 true를 반환한다.
 * 전역변수를 사용하므로 submit를 보낼때... 
 * 해당 페이지가 갱신되지 않는 경우에는 이 메소드를 사용하면 안된다...!!!!
 */
var isDoubleClicked = true;
function checkDoubleClick(){
    if(isDoubleClicked == true){
        isDoubleClicked = false;
        return true;
    }
    else{
        return false;
    }
}

function isMobile() {
    return /(iphone|ipod|android|blackberry|windows ce|palm|symbian)/i.test(navigator.userAgent); // Removed "|ipad"
}

function formatAddress(street, city, state, zip) {
    var address = [];
    if (street) address.push(street);
    if (city) address.push(city);
    if (state) address.push(state);
    
    address = address.length ? [address.join(", ")] : [];
    if (zip) address.push(zip);
    return address.join(" ");
}

/**
 * Append string b to a only if a is not empty
 */
function appendCond(a, b) {
    return a ? (a + b) : a; 
}

/**
 * Prepend string b to a only if a is not empty
 */
function prependCond(a, b) {
    return a ? (b + a) : a;
}
//-->