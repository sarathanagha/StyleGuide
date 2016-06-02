




















































































































































var tempSettings = {
            evaluate : /\{\[([\s\S]+?)\]\}/g,
            interpolate : /\{\{([\s\S]+?)\}\}/g
};

 var AlertModel = Backbone.Model.extend({    
     defaults: {
          alertklass:  'alert',
          alertstatus: 'base',
          imgpath:  'img/kia-uvo-logo.png',
          imgpath2: 'img/icons/original/refresh-alt.png'
     },
     initialize: function() {
         //initialize
     }
 });
 
 var alertUpdatigModel  = new AlertModel({
     alertklass:  'alert updating',
     alertstatus: 'updating',
     imgpath:  'img/icons/icons-ffffff/refresh.png',
     imgpath2: ''
});
 
var alertUpdatedModel  = new AlertModel({
     alertklass:  'alert updated',
     alertstatus: ' updated',
     imgpath:  'img/icons/icons-ffffff/check.png',
     imgpath2: ''
});

var alertErrorModel  = new AlertModel({
    alertklass:  'alert try-again',
    alertstatus: 'try again',
    imgpath:  'img/icons/icons-ffffff/error.png',
    imgpath2: 'img/icons/icons-ffffff/refresh.png'
});

var AlertView = Backbone.View.extend({

    tagName: 'div',
    className: 'alertContainer',
   // template: _.template( $('#alertTemplate').html(), null, tempSettings ),

    initialize: function() {
        _.bindAll(this, 'render');
       
    },

    refreshview: function() {
        this.remove();
        this.unbind();
    },
    
    render: function(){
       // this.refreshview();
       //  this.$el.html(this.template( this.model.toJSON() ));
        return this;
    }
});

