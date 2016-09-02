window.onload=function(){
	console.log("HERE first");
	var message=[];
	var socket=io.connect('http://localhost:3000');
	var content=document.getElementById("content");
	var button=document.getElementById("enable").onclick=function()
	{
		//alert('hello');
		var elem=document.getElementById("enable");
	 	if(elem.value=="Enable"){
			 elem.value="Disable";
			 socket.emit('enableJSON');
	 	}else{
	 	 elem.value="Enable";
	 	 socket.emit('disableJSON');
	 	}

	 };
	socket.on('message',function(data){
		console.log("HERE");
		var html="";
		if(data.message!=null){
			var obj=JSON.parse(data.message)
			html+='</br>'+obj.type+' </br>';
			html+='</br>'+obj.testID.toString();
			var objects=obj.objects;

			for(i=0;i<objects.length;i++){
				html+='</br> Object ID:';
				html+=objects[i].id.toString();
				html+='</br>type '+objects[i].type;
				html+='</br>x '+objects[i].x.toString();
				html+='</br>y '+objects[i].y.toString();
				html+='</br>z '+objects[i].z.toString();
			}
			content.innerHTML=html;
		}else{
			console.log("Problem",data);
		}

		
	});
}
function selectPatient(){
		alert("patient selected");
	}
