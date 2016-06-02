/** 
 * Class Name  : ccw_map.js
 * Description : OWS 상황판 구현 스크립트
 * author      : 컨피테크 오국헌
 * since       : 2011.01.04
 * Modification Information
 *  수정일      수정자        수정내용
 * -------     --------   ---------------------------
 * 2011.01.04   오국헌        최초 생성
 * 2011.06.17   이영탁        Maker가 여러개일경우에 클릭시 말풍선 로딩 오류 수정
 * -------     --------   ---------------------------
*/
var natLocation = "America";    // 최초 맵 셋팅시 미국이 센터로 되게 설정
var map;
var geocoder;
var markers = []; 
var infowindow = new google.maps.InfoWindow();
var cm_openInfowindow;

/**
 * 구글 맵 표시
 */
function fn_map_initialize(trscId)
{
    geocoder = new google.maps.Geocoder();
    //지도 타입 select box로 변경시  
    var mapOption =
    {
        zoom: 4,
        mapTypeControl: false,
        streetViewControl: false,
        mapTypeControlOptions: {style: google.maps.MapTypeControlStyle.DROPDOWN_MENU},
        navigationControl: true,
        // navigationControlOptions: {style: google.maps.NavigationControlStyle.SMALL},
        mapTypeId: google.maps.MapTypeId.ROADMAP      
    }
    
    map = new google.maps.Map(document.getElementById("mapArea1"), mapOption);

    // 맵 로드후 중국으로 센터 설정
    geocoder.geocode({'address': natLocation}, function(results, status)
    {
        if(status == google.maps.GeocoderStatus.OK)
        {
        	if(typeof(trscId) != "string")
        	{
        		map.setCenter(results[0].geometry.location);
        	}else{ 
        		fn_click_makeMarker(trscId, 'L');
        	}
        	
        }
        else
        {
            alert("Geocode was not successful for the following reason: " + status);
        }
    });
    
    var homeControlDiv = document.createElement('DIV');   
    homeControlDiv.index = 1;
    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(homeControlDiv); 
    
    // 오픈시 Marker 그리기
    for (var i = 0; i < locations.length; i++)
    {
        //fn_makeMarker(locations[i]);
    }
}

/**
 * 클릭시 지도에 아이콘 표시 및 이벤트 부여
 * @param trscId
 */
function fn_click_makeMarker(trscId, type) //type: L-화면 load 시, C-click 클릭시
{

    var marker =new Array(locations.length);
    var mapAddress = "";
    for (var i = 0; i < locations.length; i++)
    {
        var newLoc = new google.maps.LatLng(locations[i].lat, locations[i].lng);

        if(locations[i].trscId == trscId)
        {
            var iconStyle = [];
            iconStyle = fn_icon_setting(locations[i].displayScn);
            var newLoc = new google.maps.LatLng(locations[i].lat, locations[i].lng);
            
       		map.setZoom(13);
            
        	if(locations[i].displayScn=="05") /* displayScn이 5인경우 SendtoCar이므로 Icon모양을 바꿔준다 */
        	{
        		marker[i] = new StyledMarker
                ({
                    styleIcon:new StyledIcon(StyledIconTypes.CLASS,{color:"#ff0000"}),
                    position: new google.maps.LatLng(locations[i].lat, locations[i].lng),
                    map:map
                });
        	}
        	else
        	{
                marker[i] = new StyledMarker
                ({
                    styleIcon:new StyledIcon(StyledIconTypes.CLASS,{color:iconStyle[0].color,text:iconStyle[0].text}),
                    position: new google.maps.LatLng(locations[i].lat, locations[i].lng),
                    map:map
                    /*draggable: true*/
                });
                /* 아이콘 모양 변경 */
                if(locations[i].displayScn=="01")
                {
                    marker[i].setIcon('/ccw/images/myZone/pin_green.png');
                }
                if(locations[i].displayScn=="02"){
                    marker[i].setIcon('/ccw/images/myZone/pin_red.png');
                }
                if(locations[i].displayScn=="03"){
                    marker[i].setIcon('/ccw/images/myZone/pin_blue.png');
                }
                if(locations[i].displayScn=="04"){
                    marker[i].setIcon('/ccw/images/myZone/pin_red.png');
                }
                if(locations[i].displayScn=="06"){
                    marker[i].setIcon('/ccw/images/poi/marker_gray.png');
                }
        	}
            markers.push(marker[i]);
            


            //displayScn이 4(radius의 style)인경우  반경을 그려준다
            if(locations[i].displayScn=="04")
            {
                var circle = new google.maps.Circle({
                    map: map,
                    radius: locations[i].radius
                  });
            
                circle.bindTo('center', marker[i], 'position');
            }
            
            // 주소 획득
            geocoder.geocode({'latLng': newLoc}, function(results, status) {
                if(status == google.maps.GeocoderStatus.OK)
                {
                    if(results[0])
                    {
                    	
                        mapAddress = results[0].address_components[1].long_name + "&nbsp" + results[0].address_components[0].long_name;
                    }
                }
            });

            var strContent=locations[i].content ;
            
            //click한 경우에만 풍선글 보여줌
            if(type=="C"){
                infowindow.setContent(strContent);
            }

            map.setCenter(newLoc);
            
            if(strContent != 'N'){ /* Content가 N인경우 풍선글을 보여주지 않는다 */
                markerListener(marker[i], strContent);
            }

        }
    }
}

 function markerListener(localmarker, strContent){      

	 
	 google.maps.event.addListener(localmarker, 'click', function(){ 
	     infowindow.setContent(strContent);
	     infowindow.open(map, localmarker);
	 });

 }
 
/**
 * 맵에 표시되는 ICON 설정
 * @param displayScn : 서비스 구분 
 */
function fn_icon_setting(displayScn)
{
    var iconStyle = [];
    if(displayScn == "01")
    {
        iconStyle = 
        [{

            "color":"0000ff",
            "text":"S"
        }]
    }
    else if(displayScn == "02")
    {
        iconStyle = 
        [{

            "color":"ff0000",
            "text":"V"
        }]
    }
    else if(displayScn == "03")
    {
        iconStyle = 
        [{

            "color":"00ff00",
            "text":"E"
        }]
    }
    /* geof 반경 사용*/
    else if(displayScn == "04")
    {
        iconStyle = 
        [{

            "color":"ff0000",
            "text":"V"
        }]
    }
    else if(displayScn == "05")
    {
        iconStyle = 
        [{

            "color":"ff0000",
            "text":""
        }]
    }
    else if(displayScn == "06")
    {
        iconStyle = 
        [{

            "color":"00f000",
            "text":"Radius"
        }]
    }
    else if(displayScn == "07")
    {
        iconStyle = 
        [{

            "color":"000f00",
            "text":"Radius"
        }]
    }
    else if(displayScn == "08")
    {
        iconStyle = 
        [{

            "color":"0c0d00",
            "text":"Radius"
        }]
    }
    else if(displayScn == "09")
    {
        iconStyle = 
        [{

            "color":"0a00d0",
            "text":"Radius"
        }]
    }
    else if(displayScn == "10")
    {
        iconStyle = 
        [{

            "color":"0a0000",
            "text":"Radius"
        }]
    }
    else
    {
        iconStyle = 
        [{

            "color":"000000",
            "text":"K"
        }]
    }
    
    return iconStyle;
}