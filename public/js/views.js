var ProductsApp = ShipWireApp || {};

//Application views
var CatalogView = Backbone.View.extend({
	el: '#product-catalog',
	
	initialize:function () {
		this.template = Handlebars.compile($("#products-tpl").html());
		this.render();
		this.listenTo(ProductsApp.productsCatalog, "add", this.render);
		this.listenTo(ProductsApp.productsCatalog, "remove", this.render);
		this.listenTo(ProductsApp.productsCatalog, "sync", this.render);
	},
	
	render:function () {
		this.$("#product-table").html(this.template({products: ProductsApp.productsCatalog.toJSON()}));
		return this;
	},
    
    events: {
		'click #add-new': 'createNew',
		'click span.edit-button': 'editItem',
		'click span.delete-button': 'deleteItem',
		'click a': 'showDetails',
    },
    
    showDetails: function(e){
    	var model_id = $(e.target).attr("data-id");
		var product = ProductsApp.productsCatalog.get(model_id);
		this.detailsTemplate = Handlebars.compile($("#product-view").html());
		$(this.detailsTemplate(product.toJSON())).modal(); 
    },
    
    editItem: function(e){
    	this.$("#product-table tr").removeClass();
    	$(e.target).parent().parent().addClass("info");
    	var model_id = $(e.target).attr("data-id");
    	ProductsApp.productForm.product = ProductsApp.productsCatalog.get(model_id);
    	ProductsApp.productForm.render();
    },
    
    deleteItem: function(e){
	    if(confirm("Are you sure you want to delete?")){
		   var model_id = $(e.target).attr("data-id");
		   var product = ShipWireApp.productsCatalog.get(model_id);
		   ProductsApp.productsCatalog.remove(product).destroy();
		   ProductsApp.productForm.render();
		   ProductsApp.productForm.trigger("reset");
	    }
    }
});

var ProductForm = Backbone.View.extend({
	id: 'product-form',
	product: new Product(),
	initialize: function(){
		this.template = Handlebars.compile($("#product-form-tpl").html());
		this.listenTo(ProductsApp.productsCatalog, "reset", this.reset);
		this.render();
	},
	
	render: function(){
	
		this.$el.html(this.template(this.product.toJSON()));
		$('#form-container').append(this.$el);
		return this;
	},
	
	events: {
		'click #product-save': 'productSave',
		'click #product-cancel': 'productClear'
	},
	
	productSave: function(){
		
		this.product.set("name", this.$("#name").val());
		this.product.set("description", this.$("#description").val());
		this.product.set("width", this.$("#width").val());
		this.product.set("height", this.$("#height").val());
		this.product.set("value", this.$("#value").val());
		
		this.product.save(null, {
			success: function(product){
				
				ProductsApp.productsCatalog.add(product);
				ProductsApp.productForm.productClear();
			}, 
			error: function(){
				alert("error");
			}
		});
		if (!this.product.isValid()) {
			//Render error fields
		  	console.log(this.product.validationError);
		}
	},
	
	reset: function(){
		this.product = new Product();
		this.$el.find("input").val("");
	},
	
	productClear: function(){
		this.reset();
		ProductsApp.productsCatalog.trigger("sync");
		
	}
});
