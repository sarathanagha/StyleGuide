/**
 * Supported Browser : MSIE, Chrome , FireFox
 * 
 * Object       : userInfo.js.js
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

//회원가입에서 고객구분에 따라 다음절차로 이동
function goRegisterStep01(type){
    var frm = document.moveForm;
    //frm.frontMemberGb.value = type;
    //frm.action = "/registerStep01.do";        
    //frm.submit();
    //XecureSubmit(frm);
    goXecureLink('/registerStep01.do?frontMemberGb='+type);
}

//실명확인 및 사업자번호체크
function chkNameNumber(gb){
    var frm = document.memberForm;
    if(gb=='1'){
        var foreigner = '1';
        if(frm.foreigner.checked) foreigner = '2';
        
        if(frm.inputNm.value.trim()==null || frm.inputNm.value.trim()==""){
            frm.inputNm.value = "";
            AlertFocus(frm.inputNm, "이름을 입력해주세요");
            return;
        }
        
        if(foreigner=='1'){ //내국인 실명확인일 경우
            if(!hangulOnly(frm.inputNm)){
                frm.inputNm.value = "";
                return;
            }
            if(frm.inputNo1.value.trim()==null || frm.inputNo1.value.trim()==""){
                AlertFocus(frm.inputNo1, "주민번호 앞자리를 입력해주세요");
                return;
            }
            if(!isNumeric(frm.inputNo1)){
                return;
            }
            if(frm.inputNo1.value.length<6){
                alert("주민번호 앞자릿수를 확인해주세요");
                frm.inputNo2.focus();
                return;
            }
            if(frm.inputNo2.value.trim()==null || frm.inputNo2.value.trim()==""){
                AlertFocus(frm.inputNo2, "주민번호 뒷자리를 입력해주세요");
                return;
            }
            if(!isNumeric(frm.inputNo2)){
                return;
            }
            if(frm.inputNo2.value.length<7){
                alert("주민번호 뒷자릿수를 확인해주세요");
                frm.inputNo2.focus();
                return;
            }
            if(!CheckSsn(frm.inputNo1.value, frm.inputNo2.value)){
                frm.inputNo1.focus();
                return;
            }
        }else{  //외국인 실명확인일 경우
            if(!alphaUpperOnly(frm.inputNm)){
                frm.inputNm.value = "";
                return;
            }
            if(frm.inputNo1.value.trim()==null || frm.inputNo1.value.trim()==""){
                AlertFocus(frm.inputNo1, "외국인번호 앞자리를 입력해주세요");
                return;
            }
            if(!isNumeric(frm.inputNo1)){
                return;
            }
            if(frm.inputNo1.value.length<6){
                alert("외국인번호 앞자릿수를 확인해주세요");
                frm.inputNo1.focus();
                return;
            }
            if(frm.inputNo2.value.trim()==null || frm.inputNo2.value.trim()==""){
                AlertFocus(frm.inputNo2, "외국인번호 뒷자리를 입력해주세요");
                return;
            }
            if(!isNumeric(frm.inputNo2)){
                return;
            }
            if(frm.inputNo2.value.length<7){
                alert("외국인번호 뒷자릿수를 확인해주세요");
                frm.inputNo2.focus();
                return;
            }
            if(!CheckNo(frm.inputNo1.value, frm.inputNo2.value)){
                frm.inputNo1.focus();
                return;
            }
        }
        var today = new Date();
        var toyear = parseInt(today.getYear());
        var tomonth = parseInt(today.getMonth()) + 1;
        var todate = parseInt(today.getDate());
        var bhyear = parseInt('19' + frm.inputNo1.value.substring(0,2)); 
        var ntyear = frm.inputNo2.value.substring(0,1);
        var bhmonth = frm.inputNo1.value.substring(2,4); 
        var bhdate = frm.inputNo1.value.substring(4,6); 
        var birthyear = toyear - bhyear;

        if (ntyear == 1 || ntyear == 2 || ntyear == 5 || ntyear == 6){
            if (birthyear < 14){ 
                alert("14세 미만은 이용하실 수 없습니다");
                return; 
            }else if (birthyear == 14){
                if (parseInt(tomonth) < parseInt(bhmonth)){
                    alert("14세 미만은 이용하실 수 없습니다");
                    return;
                }else if ((parseInt(tomonth) == parseInt(bhmonth)) && (parseInt(todate) > parseInt(bhdate))){
                    alert("14세 미만은 이용하실 수 없습니다");
                    return; 
                }
            }
        }else{
            alert("14세 미만은 이용하실 수 없습니다");
            return;
        }
    }else if(gb=='2'){
        if(frm.inputNm.value.trim()==null || frm.inputNm.value.trim()==""){
            frm.inputNm.value = "";
            AlertFocus(frm.inputNm, "이름을 입력해주세요");
            return;
        }
        if(!hangulOnly(frm.inputNm)){
            frm.inputNm.value = "";
            return;
        }
        if(frm.inputNo1.value.trim()==null || frm.inputNo1.value.trim()==""){
            AlertFocus(frm.inputNo1, "주민번호 앞자리를 입력해주세요");
            return;
        }
        if(!isNumeric(frm.inputNo1)){
            return;
        }
        if(frm.inputNo1.value.length<6){
            alert("주민번호 앞자릿수를 확인해주세요");
            frm.inputNo1.focus();
            return;
        }
        if(frm.inputNo2.value.trim()==null || frm.inputNo2.value.trim()==""){
            AlertFocus(frm.inputNo2, "주민번호 뒷자리를 입력해주세요");
            return;
        }
        if(!isNumeric(frm.inputNo2)){
            return;
        }
        if(frm.inputNo2.value.length<7){
            alert("주민번호 뒷자릿수를 확인해주세요");
            frm.inputNo2.focus();
            return;
        }
        if(!CheckSsn(frm.inputNo1.value, frm.inputNo2.value)){
            frm.inputNo1.focus();
            return;
        }
        
        var today = new Date();
        var toyear = parseInt(today.getYear());
        var tomonth = parseInt(today.getMonth()) + 1;
        var todate = parseInt(today.getDate());
        var bhyear = parseInt('19' + frm.inputNo1.value.substring(0,2)); 
        var ntyear = frm.inputNo2.value.substring(0,1);
        var bhmonth = frm.inputNo1.value.substring(2,4); 
        var bhdate = frm.inputNo1.value.substring(4,6); 
        var birthyear = toyear - bhyear;

        if (ntyear == 1 || ntyear == 2 || ntyear == 5 || ntyear == 6){
            if (birthyear < 14){ 
                alert("14세 미만은 이용하실 수 없습니다");
                return; 
            }else if (birthyear == 14){
                if (parseInt(tomonth) < parseInt(bhmonth)){
                    alert("14세 미만은 이용하실 수 없습니다");
                    return;
                }else if ((parseInt(tomonth) == parseInt(bhmonth)) && (parseInt(todate) > parseInt(bhdate))){
                    alert("14세 미만은 이용하실 수 없습니다");
                    return; 
                }
            }
        }else{
            alert("14세 미만은 이용하실 수 없습니다");
            return;
        }
    }else{
        //사업자로 실명확인 할 경우
        if(frm.rpreNm.value.trim()==null || frm.rpreNm.value.trim()==""){
            frm.rpreNm.value = "";
            AlertFocus(frm.rpreNm, "대표자 이름을 입력해주세요");
            return;
        }
        if(!hangulOnly(frm.rpreNm)){
            frm.inputNm.value = "";
            return;
        }
        if(frm.inputRno1.value.trim()==null || frm.inputRno1.value.trim()==""){
            AlertFocus(frm.inputRno1, "대표자 주민번호 앞자리를 입력해주세요");
            return;
        }
        if(!isNumeric(frm.inputRno1)){
            return;
        }
        if(frm.inputRno1.value.length<6){
            alert("대표자 주민번호 앞자릿수를 확인해주세요");
            return;
        }
        if(frm.inputRno2.value.trim()==null || frm.inputRno2.value.trim()==""){
            AlertFocus(frm.inputRno2, "대표자 주민번호 뒷자리를 입력해주세요");
            return;
        }
        if(!isNumeric(frm.inputRno2)){
            return;
        }
        if(frm.inputRno2.value.length<7){
            alert("대표자 주민번호 뒷자릿수를 확인해주세요");
            return;
        }
        if(!CheckSsn(frm.inputRno1.value, frm.inputRno2.value)){
            frm.inputRno1.focus();
            return;
        }
        if(frm.inputNm.value.trim()==null || frm.inputNm.value.trim()==""){
            frm.inputNm.value = "";
            AlertFocus(frm.inputNm, "회사명을 입력해주세요");
            return;
        }
        if(frm.inputNo1.value.trim()==null || frm.inputNo1.value.trim()==""){
            frm.inputNo1.value = "";
            AlertFocus(frm.inputNo1, "사업자번호 첫번째 자리를 입력해주세요");
            return;
        }
        if(!isNumeric(frm.inputNo1)){
            return;
        }
        if(frm.inputNo1.value.length<3){
            frm.inputNo1.value = "";
            AlertFocus(frm.inputNo1, "사업자번호 첫번째 자릿수를 확인해주세요");
            return;
        }
        if(frm.inputNo2.value.trim()==null || frm.inputNo2.value.trim()==""){
            frm.inputNo2.value = "";
            AlertFocus(frm.inputNo2, "사업자번호 두번째 자리를 입력해주세요");
            return;
        }
        if(!isNumeric(frm.inputNo2)){
            return;
        }
        if(frm.inputNo2.value.length<2){
            frm.inputNo2.value = "";
            AlertFocus(frm.inputNo2, "사업자번호 두번째 자릿수를 확인해주세요");
            return;
        }
        if(frm.inputNo3.value.trim()==null || frm.inputNo3.value.trim()==""){
            frm.inputNo3.value = "";
            AlertFocus(frm.inputNo3, "사업자번호 세번째 자리를 입력해주세요");
            return;
        }
        if(!isNumeric(frm.inputNo3)){
            return;
        }
        if(frm.inputNo3.value.length<5){
            frm.inputNo3.value = "";
            AlertFocus(frm.inputNo3, "사업자번호 세번째 자릿수를 확인해주세요");
            return;
        }
        frm.bizNo.value = frm.inputNo1.value+frm.inputNo2.value+frm.inputNo3.value;
        if(!isValidBizNo(frm.bizNo)){
            frm.inputNo1.focus();
            return;
        }
        var today = new Date();
        var toyear = parseInt(today.getYear());
        var tomonth = parseInt(today.getMonth()) + 1;
        var todate = parseInt(today.getDate());
        var bhyear = parseInt('19' + frm.inputRno1.value.substring(0,2)); 
        var ntyear = frm.inputRno2.value.substring(0,1);
        var bhmonth = frm.inputRno1.value.substring(2,4); 
        var bhdate = frm.inputRno1.value.substring(4,6); 
        var birthyear = toyear - bhyear;

        if (ntyear == 1 || ntyear == 2 || ntyear == 5 || ntyear == 6){
            if (birthyear < 14){ 
                alert("14세 미만은 이용하실 수 없습니다");
                return; 
            }else if (birthyear == 14){
                if (parseInt(tomonth) < parseInt(bhmonth)){
                    alert("14세 미만은 이용하실 수 없습니다");
                    return;
                }else if ((parseInt(tomonth) == parseInt(bhmonth)) && (parseInt(todate) > parseInt(bhdate))){
                    alert("14세 미만은 이용하실 수 없습니다");
                    return; 
                }
            }
        }else{
            alert("14세 미만은 이용하실 수 없습니다");
            return;
        }
    }
    
    frm.target = "iframeName";
    XecureSubmit(frm);
}

//개인,외국인 실명확인에서 구분값 선택시에 입력양식 초기화
function setInit(){
    var frm = document.memberForm;
    frm.inputNm.value = "";
    frm.inputNo1.value = "";
    frm.inputNo2.value = "";
    frm.inputNm.focus();
}

//약관동의 후 정보입력페이지로 이동
function addMemberInfo(type){
    var frm = document.memberForm;
    
    if(document.getElementById("agree1") != null)
    {
        if(frm.agree1.checked == false)
        {
            alert("Auto Inside 이용약관에 동의해 주십시오");
            frm.agree1.focus();
            return;
        }
    }

    if(document.getElementById("agree2") != null)
    {
        if(frm.agree2.checked == false)
        {
            alert("Auto Inside 개인정보 수집 및 이용에 동의해 주십시오");
            frm.agree2.focus();
            return;
        }   }

    if(document.getElementById("agree3") != null)
    {
        if(frm.agree3.checked != false || frm.agree4.checked != false)
        {
            if(frm.agree3.checked == false)
            {
                alert("현대캐피탈(주) 인터넷 서비스 이용약관에 동의해 주십시오");
                frm.agree3.focus();
                return;
            }
            else if(frm.agree4.checked == false)
            {
                alert("현대캐피탈(주) 개인정보 수집 및 이용에 동의해 주십시오");
                frm.agree4.focus();
                return;
            }
        }   
    }

    /*
    if(frm.agree.checked == false){
        alert("Auto Inside 이용약관에 동의해주세요");
        return;
    }
    */
    frm.cmd.value = "addMemberForm";
    
    frm.action = "/member.do";
    XecureSubmit(frm);
}

//아이디 및 닉네임중복확인 ("ID":아이디, "NICK":닉네임)
function findIdNickname(type,memNo,obj){
    //아이디,닉네임 유효성검사
    var nvlAlert = "아이디를 입력해주세요";
    
    if(type=="NICK") nvlAlert = "닉네임을 입력해주세요";
    
    if(IsNull(obj)){
        AlertFocus(obj, nvlAlert);
        return;
    }
    if(type=="ID"){
        if(!isValidUserid(obj)){
            obj.focus();
            return;
        }
    }else{
        if(!isValidNickname(obj)){
            obj.focus();
            return;
        }
    }
    
    var url = "/member.do?cmd=findIdNickname";
    if(memNo!=null){
        url += "&memberNumber="+memNo.value;
    }
    if(type=="ID"){
        url += "&find=ID&hcsEnterYn="+document.memberForm.hcsEnterYn.value;
    }else{
        url += "&find=NICK";
    }
    CenterOpenWindow(url+"&inputVal="+obj.value,"",526,420,"");
}

//우편번호찾기
function findZipcode01(){
    var url = "/member.do?cmd=findZipcode";

    pop(url,526,500,1);
}

//소유차량검사
function chkOwnCar(frm){
    if(frm.elements["memberOwnInterestCarVo.xcMkcoCd"].value.trim()==null || frm.elements["memberOwnInterestCarVo.xcMkcoCd"].value.trim()==""){
        alert("제조사를 선택해주세요");
        return false;
    }else if(frm.elements["memberOwnInterestCarVo.xcVclBrndCd"].value.trim()==null || frm.elements["memberOwnInterestCarVo.xcVclBrndCd"].value.trim()==""){
        alert("브랜드를 선택해주세요");
        return false;
    }else if(frm.elements["memberOwnInterestCarVo.xcVcmdCd"].value.trim()==null || frm.elements["memberOwnInterestCarVo.xcVcmdCd"].value.trim()==""){
        alert("모델을 선택해주세요");
        return false;
    }else if(frm.elements["memberOwnInterestCarVo.xcVclGrdCd"].value.trim()==null || frm.elements["memberOwnInterestCarVo.xcVclGrdCd"].value.trim()==""){
        alert("등급을 선택해주세요");
        return false;
    }else if(frm.elements["memberOwnInterestCarVo.xcPyyYy"].value.trim()==null || frm.elements["memberOwnInterestCarVo.xcPyyYy"].value.trim()==""){
        alert("연식을 선택해주세요");
        return false;
    }else if(frm.elements["memberOwnInterestCarVo.xcUseFuelKncd"].value.trim()==null || frm.elements["memberOwnInterestCarVo.xcUseFuelKncd"].value.trim()==""){
        alert("연료를 선택해주세요");
        return false;
    }else if(frm.elements["memberOwnInterestCarVo.xcClrCd"].value.trim()==null || frm.elements["memberOwnInterestCarVo.xcClrCd"].value.trim()==""){
        alert("색상을 선택해주세요");
        return false;
    }else if(frm.elements["memberOwnInterestCarVo.xcGboxCd"].value.trim()==null || frm.elements["memberOwnInterestCarVo.xcGboxCd"].value.trim()==""){
        alert("변속기를 선택해주세요");
        return false;
    }else if(frm.xcDvml.value.trim()==null || frm.xcDvml.value.trim()==""){
        AlertFocus(frm.xcDvml,"주행거리를 입력해주세요");
        return false;
    }else{
        frm.elements["memberOwnInterestCarVo.xcDvml"].value = RemoveComma(frm.xcDvml.value);
        return true;
    }
}

//맞춤차량검사
function chkJointCar(frm){
    if(frm.elements["memberOwnInterestCarVo.xcMkcoCd2"].value.trim()==null || frm.elements["memberOwnInterestCarVo.xcMkcoCd2"].value.trim()==""){
        alert("제조사를 선택해주세요");
        return false;
    }else if(frm.elements["memberOwnInterestCarVo.xcVclBrndCd2"].value.trim()==null || frm.elements["memberOwnInterestCarVo.xcVclBrndCd2"].value.trim()==""){
        alert("브랜드를 선택해주세요");
        return false;
    }else if(frm.elements["memberOwnInterestCarVo.xcVcmdCd2"].value.trim()==null || frm.elements["memberOwnInterestCarVo.xcVcmdCd2"].value.trim()==""){
        alert("모델을 선택해주세요");
        return false;
    }else if(frm.elements["memberOwnInterestCarVo.xcVclGrdCd2"].value.trim()==null || frm.elements["memberOwnInterestCarVo.xcVclGrdCd2"].value.trim()==""){
        alert("등급을 선택해주세요");
        return false;
    }else{
        return true;
    }
    /*if(frm.elements["memberOwnInterestCarVo.xcFrVlpy"].value!=null && frm.elements["memberOwnInterestCarVo.xcToVlpy"].value !=null){
        var frYyyy = frm.elements["memberOwnInterestCarVo.xcFrVlpy"].value ; //년도 - from이 작은수 to가 큰수
        var toYyyy = frm.elements["memberOwnInterestCarVo.xcToVlpy"].value;
        
        if (frYyyy > toYyyy){
            frYyyy = frm.elements["memberOwnInterestCarVo.xcToVlpy"].value;
            toYyyy = frm.elements["memberOwnInterestCarVo.xcFrVlpy"].value ;    
        
        }
        frm.elements["memberOwnInterestCarVo.xcFrVlpy"].value = frYyyy ;
        frm.elements["memberOwnInterestCarVo.xcToVlpy"].value = toYyyy ;    
    }*/
}

//매매단지찾기
function findComplex01(type){
    var url = "/member.do?cmd=findMarketComplex&type="+type;

    pop(url,526,500,1);
}

// 이메일 도메인 선택
function setEmailDomain(obj) {
    var selectedValue = getSelectBoxValue(obj);
    var domainValue = obj.options[obj.selectedIndex].value;
    var domainArea = document.getElementById("emlAddr");
    if (selectedValue!="99" && selectedValue!="00") {
        domainArea.value = domainValue;
        domainArea.readOnly = true;
    } else {
        domainArea.value = "";
        if(selectedValue=="99"){
            domainArea.readOnly = false;
            domainArea.focus();
        }
    }
}

/********************* 숫자 세자리마다 자동 콤마 찍기 ***********************/
function FormatNumber2(num){
        fl=""
        if(isNaN(num)) { alert("Please input the number."); return ""}
        if(num==0) return num
        
        if(num<0){ 
                num=num*(-1)
                fl="-"
        }else{
                num=num*1 //처음 입력값이 0부터 시작할때 이것을 제거한다.
        }
        num = new String(num)
        temp=""
        co=3
        num_len=num.length
        while (num_len>0){
                num_len=num_len-co
                if(num_len<0){co=num_len+co;num_len=0}
                temp=","+num.substr(num_len,co)+temp
        }
        return fl+temp.substr(1)
}

function FormatNumber(num){
        num=new String(num)
        num=num.replace(/,/gi,"");
        return putComma(num)
}

function num_check() {
        // ie에서만 작동
        var keyCode = event.keyCode;
        if(keyCode < 48 || keyCode > 57){
            if(keyCode==8 || keyCode==9 || keyCode==13 || keyCode==16 || keyCode==18 || keyCode==37 || keyCode==39 || keyCode==46){
            }else{
                alert("Please input the number.");
                event.returnValue=false;
            }
        }
}

function putComma(input) {
    var num = input;

    if (num < 0) {
        num *= -1;
        var minus = true
    }else{
        var minus = false
    }

    var dotPos = (num+"").split(".")
    var dotU = dotPos[0]
    var dotD = dotPos[1]
    var commaFlag = dotU.length%3

    if(commaFlag) {
        var out = dotU.substring(0, commaFlag)
        if (dotU.length > 3) out += ","
    }
    else var out = ""

    for (var i=commaFlag; i < dotU.length; i+=3) {
        out += dotU.substring(i, i+3)
        if( i < dotU.length-3) out += ","
    }

    if(minus) out = "-" + out
    if(dotD) return out + "." + dotD
    else return out
}
/********************* 숫자 세자리마다 자동 콤마 찍기 ***********************/

/**
 SelectBox의 값을 가져온다.
**/
function getSelectBoxValue(obj) {
    var result = "";
    try {
        result = obj.options[obj.selectedIndex].value
    } catch (e) { }
    return result;
}

/**
 validator
 폼객체 유효성 검사
******************************************************************************/

/// 에러메시지 포멧 정의 ///
var NO_BLANK = "{name+을를} 입력해주세요";
var NO_SELECT = "{name+을를} 선택해주세요";
var NOT_VALID = "{name+을를} 정확히 입력해주세요";
var TOO_LONG = "{name}의 길이가 초과되었습니다 (최대 {maxbyte}바이트)";
var TOO_SHORT = "{name}의 길이가 부족합니다 (최소 {minbyte}바이트)";

/// 스트링 객체에 메소드 추가 ///
String.prototype.trim = function(str) { 
    str = this != window ? this : str; 
    return str.replace(/^\s+/g,'').replace(/\s+$/g,''); 
}

String.prototype.hasFinalConsonant = function(str) {
    str = this != window ? this : str; 
    var strTemp = str.substr(str.length-1);
    return ((strTemp.charCodeAt(0)-16)%28!=0);
}

function josa(str,tail) {
    return (str.hasFinalConsonant()) ? tail.substring(0,1) : tail.substring(1,2);
}

function validate(form) {
    var i=0;

    for (i = 0; i < form.elements.length; i++ ) {
        var el = form.elements[i];
        if(el.tagName.toUpperCase() != "OBJECT") {
            el.value = el.value.trim();
    
            if (el.getAttribute("REQUIRED") != null) {
                //select 구문 처리
                if(el.type.indexOf("select")>-1){
                    if (el.options[el.selectedIndex].value == "" ) {
                        return doError(el,NO_SELECT);
                    }
                }else{
                    if (el.value == null || el.value == "") {
                        return doError(el,NO_BLANK);
                    }
                }
            }
    
            if (el.getAttribute("MAXBYTE") != null && el.value != "") {
                var len = 0;
                for(j=0; j<el.value.length; j++) {
                    var str = el.value.charAt(j);
                    len += (str.charCodeAt() > 128) ? 2 : 1
                }
                if (len > parseInt(el.getAttribute("MAXBYTE"))) {
                    maxbyte = el.getAttribute("MAXBYTE");
                    return doError(el,TOO_LONG,"",maxbyte);
                }
            }
            if (el.getAttribute("MINBYTE") != null && el.value != "") {
                var len = 0;
                for(j=0; j<el.value.length; j++) {
                    var str = el.value.charAt(j);
                    len += (str.charCodeAt() > 128) ? 2 : 1
                }
                if (len < parseInt(el.getAttribute("MINBYTE"))) {
                    minbyte = el.getAttribute("MINBYTE");
                    return doError(el,TOO_SHORT,"",minbyte);
                }
            }
    
            if (el.getAttribute("OPTION") != null && el.value != "") {
                if (!funcs[el.getAttribute("OPTION").toLowerCase()](el)) return false;
            }
    
            if (el.getAttribute("FILETYPE") != null && el.value != "") {
                var validFileType = el.getAttribute("FILETYPE").split(",");
                var nFileType = el.value.substring(el.value.lastIndexOf(".")+1,el.length);
                var isValidFileType = false;
                for (j=0; j<validFileType.length ; j++) {
                    if (nFileType.toUpperCase()==validFileType[j].toUpperCase().replace(/\s/g,"")) {
                        isValidFileType = true;
                    }
                }
                if (!isValidFileType) {
                    var nameString = "";
                    if (el.getAttribute("hname") != null && el.getAttribute("hname") != "") {
                        nameString = "{name+이가} ";
                    }
                    return doError(el,nameString+"적절한 파일 포맷이 아닙니다.");
                }
            }
        }
    }
    return true;
}

function doError(el,type,action,byte) {
    var pattern = /{([a-zA-Z0-9_]+)\+?([가\-힣]{2})?}/;
    var name = (hname = el.getAttribute("HNAME")) ? hname : el.getAttribute("NAME");
    pattern.exec(type);
    var tail = (RegExp.$2) ? josa(eval(RegExp.$1),RegExp.$2) : "";
    alert(type.replace(pattern,eval(RegExp.$1) + tail).replace(pattern,byte));
    if (action == "sel") {
        el.select();
    } else if (action == "del") {
        el.value = "";
    }
    if (el.getAttribute("UNFOCUSED") == null) {
        if(el.type!="hidden"&&el.style.display.toUpperCase()!="NONE"){      
            el.focus();
        }
    }   
    return false;
}   

/// 특수 패턴 검사 함수 매핑 ///
var funcs = new Array();
funcs['nospace'] = isNoSpace;
funcs['email'] = isValidEmail;
funcs['emailfirst'] = isValidEmailFirst;
funcs['emaildomain'] = isValidEmailDomain;
funcs['phone'] = isValidPhone;
funcs['userid'] = isValidUserid;
funcs['hangul'] = hasHangul;
funcs['number'] = isNumeric;
funcs['numberengonly'] = numberAlphaOnly;
funcs['number2'] = isNumeric2;
funcs['engonly'] = alphaOnly;
funcs['hangulonly'] = hangulOnly;
funcs['hangulengonly'] = hangulAlphaOnly;
funcs['jumin'] = isValidJumin;
funcs['bizno'] = isValidBizNo;
funcs['date'] = isValidDate;
funcs['pw'] = isValidPassword;

/// 패턴 검사 함수들 ///
function isNoSpace(el) {
    var pattern = /[\s]/;
    return (!pattern.test(el.value)) ? true : doError(el,"{name+은는} 띄어쓰기 없이 입력해주시기 바랍니다");
}

function isValidEmail(el) {
    var pattern = /^[_a-zA-Z0-9-\.]+@[\.a-zA-Z0-9-]+\.[a-zA-Z]+$/;
    return (pattern.test(el.value)) ? true : doError(el,"E-mail을 정확히 입력해주세요");
}

function isValidEmailFirst(el) {
    var pattern = /^[_a-zA-Z0-9-\.]+$/;
    return (pattern.test(el.value)) ? true : doError(el,NOT_VALID);
}

function isValidEmailDomain(el) {
    var pattern = /[\.a-zA-Z0-9-]+\.[a-zA-Z]+$/;
    return (pattern.test(el.value)) ? true : doError(el,NOT_VALID);
}



//수정 필요
function isValidUserid(el) {
    var pattern = /^[a-zA-Z0-9]{6,12}$/;
    return (pattern.test(el.value)) ? true : doError(el,"아이디는 6~12자의 영문, 숫자만 사용할 수 있으며\n첫글자는 반드시 영문이어야합니다.");
}

//닉네임검사
function isValidNickname(el) {
    var pattern = /^[가\-힣a-zA-Z0-9]{3,6}$/;
    return (pattern.test(el.value)) ? true : doError(el,"닉네임은 3~6자의 한글 및 영문, 숫자만 사용할 수 있습니다.");
}

function isValidPasswd(el) {
    var pattern = /^[a-zA-Z]{1}[a-zA-Z0-9]{5,12}$/;
    return (pattern.test(el.value)) ? true : doError(el,"비밀번호는 6~12자의 영문, 숫자만 사용할 수 있습니다.");
}

function hasHangul(el) {
    var pattern = /[가\-힣]/;
    return (pattern.test(el.value)) ? true : doError(el,"{name+은는} 반드시 한글을 포함해야 합니다");
}

function hangulOnly(el) {
    var pattern = /^[가\-힣]+$/;
    return (pattern.test(el.value)) ? true : doError(el,"이름은 한글만 입력해주세요");
}

function alphaUpperOnly(el) {
    var pattern = /^[A-Z\s]+$/;
    return (pattern.test(el.value)) ? true : doError(el,"이름은 영문대문자만 입력해주세요");
}

function alphaOnly(el) {
    var pattern = /^[a-zA-Z]+$/;
    return (pattern.test(el.value)) ? true : doError(el,NOT_VALID);
}

function hangulAlphaOnly(el) {
    var pattern = /^[가\-힣a-zA-Z]+$/;
    return (pattern.test(el.value)) ? true : doError(el,"{name+은는} 한글과 영문만 입력가능 합니다");
}

function hangulAlphaUpperOnly(el) {
    var pattern = /^[가\-힣A-Z]+$/;
    return (pattern.test(el.value)) ? true : doError(el,"이름은 한글과 영문대문자만 입력해주세요");
}

function numberAlphaOnly(el) {
    var pattern = /^[0-9a-zA-Z]+$/;
    return (pattern.test(el.value)) ? true : doError(el,"{name+은는} 숫자와 영문만 입력가능 합니다");
}

function isNumeric(el) {
    var pattern = /^[0-9]+$/;
    return (pattern.test(el.value)) ? true : doError(el,"Please input the number.");
}

function isNumeric2(el) {
    var pattern = /^[0-9,.]+$/;
    return (pattern.test(el.value)) ? true : doError(el,"{name+은는} 반드시 숫자로만 입력해야 합니다");
}


function isValidJumin(el) {
    var pattern = /^([0-9]{6})-?([0-9]{7})$/; 
    var num = el.value;
    if (!pattern.test(num)) return doError(el,NOT_VALID); 
    num = RegExp.$1 + RegExp.$2;

    var sum = 0;
    var last = num.charCodeAt(12) - 0x30;
    var bases = "234567892345";
    for (var i=0; i<12; i++) {
        if (isNaN(num.substring(i,i+1))) return doError(el,NOT_VALID);
        sum += (num.charCodeAt(i) - 0x30) * (bases.charCodeAt(i) - 0x30);
    }
    var mod = sum % 11;
    return ((11 - mod) % 10 == last) ? true : doError(el,NOT_VALID);
}

function isValidBizNo(el) { 
    var pattern = /([0-9]{3})-?([0-9]{2})-?([0-9]{5})/; 
    var num = el.value;
    if (!pattern.test(num)) return doError(el,NOT_VALID); 
    num = RegExp.$1 + RegExp.$2 + RegExp.$3;
    var cVal = 0; 
    for (var i=1; i<8; i++) { 
        var cKeyNum = parseInt(((_tmp = i % 3) == 0) ? 1 : ( _tmp  == 1 ) ? 3 : 7); 
        cVal += (parseInt(num.substring(i,i+1)) * cKeyNum) % 10; 
    } 
     
    cVal += parseFloat(num.substring(0,1)) + Math.floor(parseInt(num.substring(i,i+1)) * 5 / 10); 
    cVal += parseInt(num.substring(i,i+1)) * 5 % 10;
    cVal += parseInt(num.substring(9,10));
    return (cVal % 10 == 0) ? true : doError(el,NOT_VALID); 
}

/*
function isValidPhone(el) {
    var pattern = /^([0]{1}[0-9]{1,2})-?([1-9]{1}[0-9]{2,3})-?([0-9]{4})$/;
    if (pattern.exec(el.value)) {
        if(RegExp.$1 == "011" || RegExp.$1 == "016" || RegExp.$1 == "017" || RegExp.$1 == "018" || RegExp.$1 == "019") {
            el.value = RegExp.$1 + "-" + RegExp.$2 + "-" + RegExp.$3;
        }
        return true;
    } else {
        return doError(el,NOT_VALID);
    }
}
*/

function isValidPhone(el) {
    var pattern = /^[0-9-]+$/;
    return (pattern.test(el.value)) ? true : doError(el,"{name+은는} 반드시 숫자로만 입력해야 합니다");
}

function isValidDate(el) {
    var oDateStr = el.value;

    var oDate = new Date(oDateStr.substr(0,4),oDateStr.substr(4,2)-1,oDateStr.substr(6,2));

    var oYearStr=oDate.getFullYear();

    var oMonthStr=(oDate.getMonth()+1).toString();
        
    oMonthStr = (oMonthStr.length ==1) ? "0"+ oMonthStr: oMonthStr; 
    var oDayStr=oDate.getDate().toString();
    oDayStr = (oDayStr.length ==1) ? "0"+ oDayStr: oDayStr; 

    return  (oDateStr == oYearStr+oMonthStr+oDayStr) ? true : doError(el,NOT_VALID); 
}

function isValidPassword(el) {
    var errorMsg = "비밀번호는 6~12자의 영문,Please input the number.";
    var pattern1 = /^[A-Za-z0-9]{6,12}$/;
    var pattern2 = /[a-zA-Z]/;  // 영문 포함 체크
    var pattern3 = /[0-9]/;     // 숫자 포함 체크
    if (!pattern1.test(el.value)){  //||!pattern2.test(el.value)||!pattern3.test(el.value)) {
        return doError(el,errorMsg);
    }
    return true;
}


function makeValidationDate(obj,obj_year,obj_month,obj_day){
    if(obj_month.value.length==1)
        obj_month.value = "0" + obj_month.value;
    if(obj_day.value.length==1)
        obj_day.value = "0" + obj_day.value;

    obj.value = obj_year.value+obj_month.value+obj_day.value;
}

function makeValidationDate_Sel(obj,obj_year,obj_month,obj_day){
    if(obj_month.options[obj_month.selectedIndex].value.length==1)
        var t_month = "0" + obj_month.options[obj_month.selectedIndex].value;
    else
        var t_month = obj_month.options[obj_month.selectedIndex].value;

    if(obj_day.options[obj_day.selectedIndex].value.length==1)
        var t_day = "0" + obj_day.options[obj_day.selectedIndex].value;
    else
        var t_day = obj_day.options[obj_day.selectedIndex].value;

    obj.value = obj_year.options[obj_year.selectedIndex].value+t_month+t_day;
}

Date.prototype.toY4MDString = function(delim) {
    if (delim == undefined) delim = "";
    var year = this.getFullYear().toString();
    var month = this.getMonth() + 1;
    var day = this.getDate();
    month = (month < 10 ? "0" : "") + month;
    day = (day < 10 ? "0" : "") + day;
    return year + delim + month + delim + day;
}





/**
 허용된 byte만큼 입력도중 실시간으로 string자르기
 <textArea>등에 사용하면 됩니다.
 onKeyup="checkByte(this,제한할byte수,"현재byte정보뿌려줄영역의ID");"
 마지막 인자는 선택사항입니다.
 ex)  onKeyup="checkByte(this,200,'nowByteShowArea');"
******************************************************************************/

function getBytes(sString) {
    var c = 0;
    for (var i=0; i<sString.length; i++) {
        c += parseInt(getByte(sString.charAt(i)));
    }
    return c;
}
function getByte(sChar) {
    var c = 0;
    var u = escape(sChar);
    if (u.length < 4) { // 반각문자 : 기본적인 영문, 숫자, 특수기호
        c++; // + 1byte
    } else {
        var s = parseInt(sChar.charCodeAt(0));
        if (((s >= 65377)&&(s <= 65500))||((s >= 65512)&&(s <= 65518))) // 반각문자 유니코드 10진수 범위 : 한국어, 일본어, 특수문자
            c++; // + 1byte
        else // 전각문자 : 위 조건을 제외한 모든 문자
            c += 2; // + 2byte
    }
    return c;
}
function cutOverText(obj,maxByte,viewAreaID) {
    var sString = obj.value;
    var c = 0;
    for (var i=0; i<sString.length; i++) {
        c += parseInt(getByte(sString.charAt(i)));
        if (c>maxByte) {
            obj.value = sString.substring(0,i);
            break;
        }
    }
    showNowByte(obj.value,viewAreaID);
}
function showNowByte(sString,viewAreaID) {
    var vArea = document.getElementById(viewAreaID);
    if (vArea) {
        var nBytes = getBytes(sString);
        try {
            vArea.innerHTML = nBytes;
        } catch(e) {
            vArea.value = nBytes;
        }
    }
}
function checkByte(obj,maxByte,viewAreaID) {
    var sString = obj.value;
    showNowByte(sString,viewAreaID);
    if (getBytes(sString) > maxByte) {
        alert("최대 "+maxByte+"Bytes(한글 "+(maxByte/2)+"자/영문 "+maxByte+"자)까지만 입력하실 수 있습니다.");
        cutOverText(obj,maxByte,viewAreaID);
    }
}








/**
 기타 유틸
******************************************************************************/

/**
 SelectBox의 값을 가져온다.
**/
function getSelectBoxValue(obj) {
    var result = "";
    try {
        result = obj.options[obj.selectedIndex].value
    } catch (e) { }
    return result;
}

/**
 다음 폼으로 이동
**/
function goNext(obj,nextObj) {
    try {
        var maxLength = obj.getAttribute("MAXLENGTH");
        if (maxLength>0&&obj.value.length==maxLength) {
            nextObj.focus();
        }
    } catch (e) { }
}


/**
 비동기 ActiveX Write
**/
function writeActiveX(obj) {
    try {
        if (obj) obj.innerHTML = sTagOfActiveX;
    } catch(e) { }
}

/**
 Object가 배열일경우와 아닐경우 구분해서 반환한다.
**/
function getArrayObject(obj,nIndex) {
    if (obj.length>1) {
        return obj[nIndex];
    } else {
        return obj;
    }
}

/**
 숫자를 MoneyFormat(#,###)으로 반환한다.
**/
function getMoneyFormat(sNumber) {
    sNumber = "" + parseInt(sNumber);
    var sResult = "";
    var sTemp = "";
    var nLength = sNumber.length;
    var nCount = 0;
    for (var i=(nLength-1); i>=0; i--) {
        if (nCount>0&&nCount%3==0) {
            sTemp += ",";
        }
        sTemp += "" + sNumber.charAt(i);
        nCount++;
    }
    nLength = sTemp.length;
    for (var i=(nLength-1); i>=0; i--) {
        sResult += "" + sTemp.charAt(i);
    }
    return sResult;
}

/**
CapsLock체크한다.
**/
function checkCapsLock(part,e) {
    var myKeyCode=0;
    var myShiftKey=false;
    var myMsg="현재 대문자로 입력되고 있습니다.";
    
    // Internet Explorer 4+
    if (document.all) {
        myKeyCode=e.keyCode;
        myShiftKey=e.shiftKey;
    
    // Netscape 4
    } else if (document.layers) {
        myKeyCode=e.which;
        myShiftKey=(myKeyCode == 16) ? true : false;

    // Netscape 6
    } else if (document.getElementById) {
        myKeyCode=e.which;
        myShiftKey=(myKeyCode == 16) ? true : false;

    }
    
    // Upper case letters are seen without depressing the Shift key, therefore Caps Lock is on
    if((myKeyCode >= 65 && myKeyCode <= 90) && !myShiftKey){
        if(part=="10"){
            document.getElementById("perUpper").innerText = myMsg;
        }else{
            document.getElementById("bizUpper").innerText = myMsg;
        }
    // Lower case letters are seen while depressing the Shift key, therefore Caps Lock is on
    }else if(( myKeyCode >= 97 && myKeyCode <= 122 ) && myShiftKey){
        if(part=="10"){
            document.getElementById("perUpper").innerText = myMsg;
        }else{
            document.getElementById("bizUpper").innerText = myMsg;
        }
    }else{
        if(part=="10"){
            document.getElementById("perUpper").innerText = " ";
        }else{
            document.getElementById("bizUpper").innerText = " ";
        }   
    }
}

/**
    페이지 이동
**/
function goPage(url){
    document.location.href=url;
}

/**
    마이페이지 정보수정페이지이동
**/
function goEdit(tp){
    var frm = document.moveForm;
    frm.editType.value = tp;
    frm.submit();
}

//휴대폰인증팝업
function openMobileAutc(cmd){
    window.name = cmd;
    var frm = "";
    if(cmd.indexOf("car")>-1){
        frm = document.itemForm;
    }else{
        frm = document.memberForm;
    }
    if(cmd=="addMemberInfo"){
        if(frm.elements["memberOptNormalVo.xcCgnm"].value.trim()==null || frm.elements["memberOptNormalVo.xcCgnm"].value.trim()==""){
            alert("담당자 이름을 입력해주세요");
            frm.elements["memberOptNormalVo.xcCgnm"].focus();
            return;
        }
        if(frm.elements["memberOptNormalVo.xcCrgMidn"].value==""){
            alert("담당자 휴대폰 국번을 선택해주세요");
            return;
        }
        if(frm.elements["memberOptNormalVo.xcCrgMten"].value.trim()==null || frm.elements["memberOptNormalVo.xcCrgMten"].value.trim()==""){
            alert("담당자 휴대폰 앞자리를 입력해주세요");
            frm.elements["memberOptNormalVo.xcCrgMten"].focus();
            return;
        }
        if(frm.elements["memberOptNormalVo.xcCrgMten"].value.length<3){
            alert("담당자 휴대폰 앞자릿수를 확인해주세요");
            frm.elements["memberOptNormalVo.xcCrgMten"].value = "";
            frm.elements["memberOptNormalVo.xcCrgMten"].focus();
            return;
        }
        if(frm.elements["memberOptNormalVo.xcCrgMgnn"].value.trim()==null || frm.elements["memberOptNormalVo.xcCrgMgnn"].value.trim()==""){
            alert("담당자 휴대폰 뒷자리를 입력해주세요");
            frm.elements["memberOptNormalVo.xcCrgMgnn"].focus();
            return;
        }
        if(frm.elements["memberOptNormalVo.xcCrgMgnn"].value.length<4){
            alert("담당자 휴대폰 뒷자릿수를 확인해주세요");
            frm.elements["memberOptNormalVo.xcCrgMgnn"].value = "";
            frm.elements["memberOptNormalVo.xcCrgMgnn"].focus();
            return;
        }
    }
    if(cmd=="editNomalInfo"){
        if(frm.No1.value!=frm.elements["memberOptNormalVo.xcMidn"].value || frm.No2.value!=frm.elements["memberOptNormalVo.xcMten"].value || frm.No3.value!=frm.elements["memberOptNormalVo.xcMgnn"].value){
            frm.No1.value = frm.elements["memberOptNormalVo.xcMidn"].value;
            frm.No2.value = frm.elements["memberOptNormalVo.xcMten"].value;
            frm.No3.value = frm.elements["memberOptNormalVo.xcMgnn"].value;
        }
    }
    if(cmd=="eidtBizInfo"){
        if(frm.No1.value!=frm.elements["memberOptNormalVo.xcCrgMidn"].value || frm.No2.value!=frm.elements["memberOptNormalVo.xcCrgMten"].value || frm.No3.value!=frm.elements["memberOptNormalVo.xcCrgMgnn"].value){
            frm.No1.value = frm.elements["memberOptNormalVo.xcCrgMidn"].value;
            frm.No2.value = frm.elements["memberOptNormalVo.xcCrgMten"].value;
            frm.No3.value = frm.elements["memberOptNormalVo.xcCrgMgnn"].value;
        }
    }
    if(cmd=="editDealerInfo"){
        if(frm.No1.value!=frm.elements["memberOptDealerVo.xcMidn"].value || frm.No2.value!=frm.elements["memberOptDealerVo.xcMten"].value || frm.No3.value!=frm.elements["memberOptDealerVo.xcMgnn"].value){
            frm.No1.value = frm.elements["memberOptDealerVo.xcMidn"].value;
            frm.No2.value = frm.elements["memberOptDealerVo.xcMten"].value;
            frm.No3.value = frm.elements["memberOptDealerVo.xcMgnn"].value;
        }
    }
    var auth = window.open("","win","width=526,height=500,scrollbars=yes");//   pop(url,526,500,1);
    
    frm.cmd.value = cmd;
    frm.action = "/mobileAuth01.do";
    frm.target = "win";
    //frm.submit();
    XecureSubmit(frm);
}

//지점약도 팝업
function goBranch(office){
    url = "http://www.hyundaicapital.com/cs/branch/popup_branch.jsp?officeName=" + office;
    window.open(url,"","width=616,height=600");
}

//소유차량, 맞춤차량 이동
function goCarPage(cmd){  
    location.href="/mypage.do?cmd="+cmd;
}

//공인인증처리
function isUserVaildSign(){
    var frm = document.memberForm;
    frm.cmd.value = "checkCertAuth";
    frm.target="_self";
    frm.action="/member.do";
    if( fnSign(frm,srvcert) ){
         XecureSubmit(frm);
    }
}

function fnSign(frm,_srvcert){
    var idn = frm.inputSsn.value; 
    var rtn = Sign_with_vid_web(0, idn, _srvcert, idn);
    frm.vid_msg.value = send_vid_info();
    
    if( rtn == null || rtn=='' || rtn=='undefined'){
        return false;
    }else {
        return frm.signed_msg.value = rtn;
    }
}

// 시작연식과 끝연식 비교
function setYyyy(obj) {
    var frm = document.memberForm;
    var toYyyy = getSelectBoxValue(obj);
    var frYyyy = frm.elements["memberOwnInterestCarVo.xcFrVlpy"].value ; //년도 - from이 작은수 to가 큰수
    if (frYyyy > toYyyy){
        alert("시작 년도보다 크거나 같아야 합니다");
        return;
    }
}
