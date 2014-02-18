var ProductsApp = ProductsApp || {};


ProductsApp.init = function(){
	ProductsApp.productsCatalog.reset(ProductsApp.productData);
	ProductsApp.view = new CatalogView();
	ProductsApp.productForm = new ProductForm();
	
};

$(document).ready(function(){
	ProductsApp.init();
});

