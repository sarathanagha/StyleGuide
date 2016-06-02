<!--
/*===============================================================================================*
* Supported Browser : Chrome , MSIE, FireFox													 *
* 																								 *
* Object	: JDocument.js																		 *
* Function	: Support DHTML in Multi - browser													 *
* Author	: Jang,Junghoon KWIC Inc.															 *
* Date		: 2010.04.15																		 *
* 																								 *
* caution)	Don't use browser-dependency DHTML tag. 											 *
*																								 *
*																								 *
*																								 *
* Example	:																					 *
*				document.allElements("class","TB_01",document.body);							 *
*				document.getElements("class","TB_01");											 *
* 				document.getElement("class","TB_01");											 *
* 				document.getElementsById("Div");												 *
* 				document.getElementById("Div1");												 *
* 				document.getElementsByName("Div");												 *
* 				document.getElementByName("Div1");												 *
* 				document.all("Div1");															 *
* 																								 *
=================================================================================================*/
if(String.ignoreCaseIndexOf==undefined){
	String.prototype.ignoreCaseIndexOf = function() {
		return (this.toUpperCase().indexOf(arguments[0].toUpperCase())>=0)?true:false;
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
if(String.trim==undefined){
	String.prototype.trim = function() {
		return this.replace(/(^\s*)|(\s*$)/g, "");
	}
}
if(document.viewError==undefined){
	document.viewError	= true;
}
if(document.error==undefined){
	document.error		= function(){
		if(document.viewError)
			alert(arguments[0]);
	}
}

if(document.BROWSER==undefined){
	try{
		document.BROWSER			= "MSIE";
		//browser internet explorer
		document.BROWSER_MSIE8		= "MSIE8";
		//browser internet explorer
		document.BROWSER_MSIE		= "MSIE";
		//browser mozila firefox
		document.BROWSER_FFOX		= "FIREFOX";
		//browser google Chrome
		document.BROWSER_CROM		= "CHROME";

		var agent	= new String(navigator.userAgent);
		if( agent.ignoreCaseIndexOf("msie 8") ){
			document.BROWSER	= document.BROWSER_MSIE8;
		}else if( agent.ignoreCaseIndexOf("msie") ){
			document.BROWSER	= document.BROWSER_MSIE;
		}else if( agent.ignoreCaseIndexOf("firefox") ){
			document.BROWSER	= document.BROWSER_FFOX;
		}else if( new String(agent).ignoreCaseIndexOf("chrome") ){
			document.BROWSER	= document.BROWSER_CROM;
		}else{
			//default = mozilla firefox
			document.BROWSER	= document.BROWSER_FFOX;
		}
	}catch(error){
		document.error("document.error!!! : ["+error+"] \n\n"+error.description);
		throw error;
	}
}

/**
* Search elements by given attribute and value. Returns element array.
*
* param count : 2-3
* param 1 : String				- attribute name
* param 2 : String				- attribute value
* param 3 : element				- base Element
*
* return Elements
*
* ex)	document.allElements("id","Div1");
*		document.allElements("id","Div1",document.body);
*/
if(document.allElements==undefined){
	document.allElements	= function(){
		var elements	= new Array();
		try{
			if(arguments.length==2 || arguments[2]==null){
				arguments[2]	= document.body;
			}
			var childs	= arguments[2].childNodes;
			for(var i=0;i<childs.length;i++){
				try{
					if(childs[i].getAttribute(arguments[0])==arguments[1]){
						elements.push(childs[i]);
					}
				}catch(e){
					continue;
				}
				if(childs[i].childNodes.length>0){
					var list	= document.allElements(arguments[0],arguments[1],childs[i]);
					for(var j=0;j<list.length;j++){
						elements.push(list[i]);
					}
				}
			}
		}catch(error){
			document.error("document.searchAllElement() error!!! : ["+error+"] \n\n"+error.description);
			throw error;
		}
		return elements;
	}
}

/**
* Get elements by given attribute and value. Returns element array.
*
* param count : 2
* param 1 : String				- attribute name
* param 2 : String				- attribute value
*
* return Elements
*
* @deprecated - occurs memory-overflow of browser
*
* ex)	document.getElements("id","Div1");
*/
if(document.getElements==undefined){
	document.getElements	= function(){
		var elements	= new Array();
		try{
			if(document.BROWSER == document.BROWSER_MSIE8){
				if(arguments[0].toUpperCase()=="ID"){
					elements	= document.getElementById(arguments[1]);
					if(elements.length==undefined){
						elements	= new Array(elements);
					}
				}else if(arguments[0].toUpperCase()=="NAME"){
					elements	= document.getElementsByName(arguments[1]);
					if(elements.length==undefined){
						elements	= new Array(elements);
					}
				}else{
					elements	= document.allElements(arguments[0],arguments[1]);
				}
				
			}else if( document.BROWSER != document.BROWSER_MSIE ){//chrome , firefox
				var count		= 0;
				var xpathResult	= document.evaluate("//*[@"+arguments[0]+"='"+arguments[1]+"']", document, null, XPathResult.ANY_TYPE, null );
				var element		= xpathResult.iterateNext();
				while(element){
					elements[count++]	= element;
					element		= xpathResult.iterateNext();
				}
			}else{	//MSIE
				if(arguments[0].toUpperCase()=="ID" || arguments[0].toUpperCase()=="NAME"){
					elements	= document.all(arguments[1]);
				}else{
					elements	= document.allElements(arguments[0],arguments[1]);
				}
				if(elements.nodeName!=undefined && "OPTION/RADIO".ignoreCaseIndexOf(elements.nodeName)>=0){
					elements	= new Array(elements);
				}

				if(elements==null || elements==undefined){
					elements	= new Array();
				}else if( elements.length==undefined ){
					elements	= new Array(elements);
				}
				var arr = new Array();

				for(var i=0;i<elements.length;i++){
					if(elements[i]==null){continue;}
					if(elements[i].nodeName=="OPTION"){
						elements[i]	= elements[i].parentNode;
					}
					if(elements[i].getAttribute(arguments[0])==arguments[1]){
						arr.push(elements[i]);
					}
				}
				elements	= arr;
			}
		}catch(error){
			document.error("document.getElements() error!!! : ["+error+"] \n\n"+error.description);
			throw error;
		}
		return elements;
	}
}


/**
* Get element by given attribute and value. Returns single element.
*
* param count : 1
* param 1 : String				- id value
*
* return Element
*
* ex)	document.getElement("id","Div1");
*/
if(document.getElement==undefined){
	document.getElement	= function(){
		var arr	= document.getElements(arguments[0],arguments[1]);
		if(arr.length==0){
			document.error("document.getElement() error! Node[@"+arguments[0]+"='"+arguments[1]+"'] is null.");
			throw new Error("getElement() error! Node[@"+arguments[0]+"='"+arguments[1]+"'] is null.");
		}
		return arr[0];
	}
}


/**
* Get elements array by given id-attribute. Return elements array.
*
* param count : 1
* param 1 : String				- id value
*
* return Element
*
* ex)	document.getElementsById("Div");
*/
if(document.getElementsById==undefined){
	document.getElementsById	= function(){
		return document.getElements("id",arguments[0]);
	}
}
/**
* Get element by given id-attribute. Returns single element.
*
* param count : 1
* param 1 : String				- id value
*
* return Element
*
* ex)	document.getElementById("Div1");
*/
if(document.getElementById==undefined){
	document.getElementById	= function(){
		return document.getElement("id",arguments[0]);
	}
}


/**
* Get elements array by given name-attribute. Return elements array.
*
* param count : 1
* param 1 : String				- name value
*
* return Element
*
* ex)	document.getElementsByName("Div");
*/
if(document.getElementsByName==undefined){
	document.getElementsByName	= function(){
		return document.getElements("name",arguments[0]);
	}
}

/**
* Get element by given name-attribute. Returns single element.
*
* param count : 1
* param 1 : String				- name value
*
* return Element
*
* ex)	document.getElementByName("Div1");
*/
if(document.getElementByName==undefined){
	document.getElementByName	= function(){
		return document.getElement("name",arguments[0]);
	}
}
/**
* Get elements by given [id]&[name] attribute value. Returns element array.
*
* param count : 1
* param 1 : String				- id or name value
*
* return Elements
*
* ex)	document.all("Div1");
*/
if(document.all==undefined){
	document.all	= function(){
		var arr1	= document.getElements("id",arguments[0]);
		var arr2	= document.getElements("name",arguments[0]);

		for(var i=0;i<arr2.length;i++){
			arr1.push(arr2[i]);
		}
		return arr1;
	}
}
//-->