var express = require('express')
	, routes = require('./routes');
var stormpath = require('express-stormpath');
var app = express();
var http=require('http').Server(app);
var socket = require('socket.io')(http);
var net = require('net');
var client=new net.Socket();
var curTaskID=-1;
//var ak='128.237.208.246';
/*var client = net.connect(8888,'128.237.166.175',function(){
	console.log('Connected');
});*/
var HOST='128.173.21.172'; //Change this back to localhost
var PORT=8888;
//var HOST='128.237.221.1';
//var HOST='128.237.208.246';
//handle send or receive failures and connection
client.connect(PORT,HOST,function(){
	console.log('Connected');
});
var io = require('socket.io').listen(app.listen(3000));
client.on('data', function(data) {
  console.log(data.toString());
  io.emit('message', { message: data.toString() });
});
client.on('error',function(err){
	console.log(err);
	if(err.code == 'ECONNREFUSED'||'ECONNRESET'){
		console.log("HERE");
		client.setTimeout(1000,function(){
			client.connect(PORT,HOST,function(){
			});
		});
	}
	//setTimeout(setupConnection,10000);
});
app.use(express.static(__dirname+"/public"));
app.set('views', './views');
app.set('view engine', 'jade');
app.engine('jade', require('jade').__express);
app.get('/', function(req, res) {
  res.render('home', {
    title: 'Welcome'
  });
});
app.get('/patienthome/',routes.patienthome);
app.get('/showPatient/', routes.showPatient);
app.get('/beginsetup/', routes.beginsetup);
app.get('/devicesetup/', routes.devicesetup);
app.get('/syncing/', routes.syncing);
app.get('/complete/',routes.complete);
app.get('/removehands/',routes.removehands);
app.get('/calibrate/',routes.calibrate);
app.get('/completecalibrate/',routes.completecalibrate);
app.get('/begintask/',routes.begintask);
app.get('/starttask/',routes.starttask);
app.get('/tasktest/',routes.taskTest);
app.get('/taskgo/',routes.gotask);
app.get('/thankyou/',routes.endscreen);
app.get('/survey/', routes.survey);
var startTask="{\"type\" : \"startTask\"}";
var resetTask="{\"type\" : \"resetTask\"}";
var endTask="{\"type\" : \"endTask\"}";
var enable="{\"type\" : \"request\",\"enableEvent\": true}";
var quit="{\"type\" : \"quit\"}";
var disable="{\"type\" : \"request\",\"enableEvent\": false}";
var caseConnect="{\"type\" : \"CaseConnected\"}";
var objectplaced="{\"type\" : \"ObjectsPlaced\"}";
var beginTask="{\"type\" : \"BeginTask\"}";
io.on('connection', function (socket) {
	console.log("CONNECTIONS");
	socket.on('enableJSON',function(){
		console.log("enable");
		client.write(enable);

	});

	socket.on('json',function(data){
		console.log(data);
		client.write(data);
	});

	socket.on('startTask',function(){
		client.write(startTask);
		console.log(startTask);

	});
	socket.on('resetTask',function(){
		client.write(resetTask);
		console.log(resetTask);

	});
	socket.on('endTask',function(){
		client.write(endTask);
		console.log(endTask);

	});
	socket.on('quit',function(){
		client.write(quit);
		console.log(quit);

	});




});
/*function myIP(){ var vi="uses java to get the users local ip number"
    var yip2=java.net.InetAddress.getLocalHost();
    var yip=yip2.getHostAddress();
  return yip;
}//end myIP
*/
/*var mysql      = require('mysql');
var connection = mysql.createConnection({
  user     : 'root',
  password : 'root',
  host     : 'localhost:3306',
  database: 'Regrasp',
  socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
});

connection.connect(function(err) {
 if(err){
 	console.log('db_connection_err',err);
 	return;
 }
  console.log("HI");
});
var post  = "select * from TestTable";
var query = connection.query(post, function(err, result) {
	if(err){
		console.log('db_connection_err',err);
	}else{
		console.log("this is result ",result);
	}
  // Neat!
});
//console.log(query.sql);
console.log("worked"); // INSERT INTO posts SET `id` = 1, `title` = 'Hello MySQL'
*/
