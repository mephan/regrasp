window.onload=function(){
	console.log("HERE first");
	var taskLoad=false;
	var socket=io();
	var taskname=document.getElementById("taskName");
	socket.emit("endTask");
	socket.on('message',function(data){
		console.log("HERE");
		var html="";
		if(data.message!=null){
			var obj=JSON.parse(data.message);
			alert(data.message);
		}else{
			console.log("Problem",data);
		}
		
	});
}