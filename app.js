var express      = require("express"),
    app          = express(),
    bodyParser   = require("body-parser"),
    mongoose     = require("mongoose"),
    random       = require("mongoose-simple-random"),
    faker        = require("faker"),
    $ = require("jquery");

mongoose.connect("mongodb://localhost/easy_live");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static("public"));


var tenantSchema = new mongoose.Schema({
    name: String,
    gender: String,
    email: String
});
tenantSchema.plugin(random);

var residenceSchema = new mongoose.Schema({
    name: String,
    address: String,
    district: String,
    rent: Number,
    email: String,
    bedroom: Number
});
residenceSchema.plugin(random);

var roommateSchema = new mongoose.Schema({
    gender: String,
    name: String,
    address: String,
    district: String,
    rent: Number,
    email: String,
    bedroom: Number
});
roommateSchema.plugin(random);

var Tenant = mongoose.model("Tenant", tenantSchema);
var Roommate = mongoose.model("Roomate", roommateSchema);
var Residence = mongoose.model("Residence", residenceSchema);

for (let i = 0; i < 20; i++){
    var name = faker.name.findName();
    var email = faker.internet.exampleEmail();
    var gender = "Male";
    var testTenant = {name,gender,email};
    Tenant.create(testTenant);
}


for (let i = 0; i < 20; i++){
    var name = faker.name.findName();
    var address = faker.address.streetAddress();
    var email = faker.internet.exampleEmail();
    var district = "Shady Side";
    var rent = 800;
    var bedroom = 2;
    var testResidence = {name, address, district, rent, email, bedroom};
    Residence.create(testResidence);
}


app.get("/", function(req, res){
    res.render("index");
});

app.get("/landlordPage", function(req, res) {
   res.render("landlordPage"); 
});

app.get("/contact", function(req, res) {
   res.render("contact"); 
});

app.get("/populararea", function(req, res) {
   res.render("populararea"); 
});

app.get("/TenantPage", function(req, res) {
   res.render("TenantPage"); 
});

app.get("/RoommatePage", function(req, res) {
   res.render("RoommatePage"); 
});

app.get("/tenantshow", function(req, res) {
    Tenant.findRandom({}, {}, {limit: 3}, function(err, results) {
        if (err){
            console.log(err);
        } else {
            res.render("tenantshow", {results: results});
        }
    });
});

app.get("/residenceshow", function(req, res) {
    Residence.findRandom({}, {}, {limit: 3}, function(err, results) {
        if (err){
            console.log(err);
        } else {
            res.render("residenceshow", {results: results});
        }
    });
});

app.post("/landlordPage", function(req, res) {
    var name = req.body.name;
    var address = req.body.address;
    var district = req.body.district;
    var rent = req.body.rent;
    var email = req.body.email;
    var bedroom = req.body.bedroom;
    var newResidence = {name, address, district, rent, email, bedroom};
    Residence.create(newResidence, function(err, newAdded){
        if (err) {
            console.log(err);
        }else {
            res.redirect("/tenantshow");
        }
    });
});

app.post("/TenantPage", function(req, res) { 
    var name = req.body.name;
    var gender = req.body.gender;
    var email = req.body.email;
    var newTenant = {name, gender, email};
    Tenant.create(newTenant, function(err, newAdded){
        if (err) {
            console.log(err);
        }else {
            res.redirect("/residenceshow");
        }
    });
});

app.post("/RoommatePage", function(req, res) { 
    var gender = req.body.gender;
    var name = req.body.name;
    var address = req.body.address;
    var district = req.body.district;
    var rent = req.body.rent;
    var email = req.body.email;
    var bedroom = req.body.bedroom;
    var newRoommate = {gender, name, address, district, rent, email, bedroom};
    Roommate.create(newRoommate, function(err, newAdded){
        if (err) {
            console.log(err);
        }else {
            res.redirect("/tenantshow");
        }
    });
});

app.listen("8080", "127.0.0.1", function(){
    console.log("Server started...");
});