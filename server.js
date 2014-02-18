var express = require('express');
var handlebars = require('handlebars');
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/backbone_app');

var app = express();
app.use(express.bodyParser());

app.configure(function(){
	app.use('/css', express.static(__dirname + '/public/css'));
	app.use('/js', express.static(__dirname + '/public/js'));	
});



app.get('/', function (req, res) {
    res.sendfile(__dirname + '/public/index.html');
});

app.put('/products/:id', function(req, res){
	console.log("PUT");
	var product_id = req.param("id");
	
	var product = {
		name: req.param("name") || "",
		description: req.param("description") || "",
		width: req.param("width") || 0,
		height: req.param("height") || 0,
		value: req.param("value") || 0.0
	};

	var products = db.get('products');

	products.updateById(product_id, product, function (err, doc) {
	    if (err) {
	        // If it failed, return error
	        res.status(500).send({ok: 0});
	    }
	    else {
	        res.json({ok: 1})
	    }
	});

});
app.post('/products', function(req, res){
	console.log("POST");
	var product = {
		name: req.param("name") || "",
		description: req.param("description") || "",
		width: req.param("width") || 0,
		height: req.param("height") || 0,
		value: req.param("value") || 0.0
	};

	var products = db.get('products');	
	products.insert(product, function (err, doc) {
	    if (err) {
	        // If it failed, return error
	        res.status(500).send({ok: 0});
	    }
	    else {
	        res.json(doc);
	    }
	});

});

app.delete('/products/:id', function(req, res){
	var product_id = req.param("id");
	var products = db.get('products');
	var oid = products.id(product_id);
	products.remove({_id: oid}, function(err){
		if (err) {
	        // If it failed, return error
	        res.status(500).send({ok: 0});
	    }
	    else {
	        res.json({ok: 1})
	    }
	});
		
});


app.get('/products', function(req, res){
	console.log("GET");
	var productsData = handlebars.compile(productsTemplate);
	var products = db.get('products');
	
	products.find({}, function (err, data){
		console.log(data);
		res.send(productsData(
			{data: JSON.stringify(data)}
		));
	});
});



app.listen(8000);
console.log('Listening on port 8000');

//Templates
var productsTemplate = "var ShipWireApp = ShipWireApp || {}; " 
				+ "ShipWireApp.productData = {{{data}}};";



var data = [{
	"_id": "2342353462364",
	"name" : "Test Item",
	"description": "The best item in the world",
	"width": 0,
	"length": 0,
	"height": 0,
	"weight": 0,
	"value": 0
}];