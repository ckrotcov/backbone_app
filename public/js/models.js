var ProductsApp = ShipWireApp || {};

//Product model
var Product = Backbone.Model.extend({
	urlRoot : '/products',
	idAttribute: "_id",
	validate: function(attrs, options) {
		var errors = {};
		
		if (!attrs.name) {
		  errors.name = "Got to have name";
		}
		
		if (!attrs.description){
			errors.description = "Describe your stuff";
		}
		
		if(Object.keys(errors).length) return errors;
	}
});


var ProductCatalog = Backbone.Collection.extend({
	url: '/products',
	model: Product,
	initialize: function(){
		
	}
});


ProductsApp.productsCatalog = new ProductCatalog();

