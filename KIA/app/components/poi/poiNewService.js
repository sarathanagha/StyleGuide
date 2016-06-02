'use strict';

module.exports = /*@ngInject*/ function() {
 
  //for setting the  index of delete dropdown
  var newindex;
  function setIndex(index){
       newindex=index;

  }
  function getIndex(){
       return newindex;
  }
  var modalData;
  function setModalData(data){
      modalData = data;
  }
  function getModalData(){
    return modalData;
  }
  var isShow = '';
  function savePoishow(data){
   isShow = data;
  }
  function getPoishow(){
           return isShow;
  }
  
	return{
    setIndex:setIndex,
    getIndex:getIndex,
    setModalData:setModalData,
    getModalData:getModalData,
    getPoishow : getPoishow,
    savePoishow : savePoishow,
	};

};
