window.onload=function(){
	console.log("HERE first");
	var taskLoad=false;
	var socket=io();
	var start=document.getElementById("nextStepTest").onclick=function(){
		socket.emit("startTask");
	}	
	var reset=document.getElementById("centeredPatientTest").onclick=function(){
		socket.emit("resetTask");
	}
	var taskname=document.getElementById("backTest").onclick=function(){
		socket.emit("endTask");
	}

	socket.on('message',function(data){
		if(data.message!=null){
			console.log("got message");
			console.log(data.message);

		}else{
			console.log("Problem",data);
		}
		
	});
}