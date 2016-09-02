window.onload=function(){
	var taskLoad=false;
	var gardenQuotes=["It looks like your garden is beginning to grow. </br>Continue on to the next exercise.",
						"Another flower has appeared in your garden. </br>Continue on to the next exercise.",
						"Another flower has appeared in your garden. </br>Continue on to the next exercise.",
						"Look at how much your garden has grown today. </br>Click to exit and have a nice day!"

						]
	var setupTime=6000;
	var maxErrors=5;
	var errorCount=0;
	var scoreTime=6000;
	var checkForErrors=false;
	var startTask="{\"type\" : \"startTask\", \"task\" : ";
	var resetTask="{\"type\" : \"resetTask\"}";
	var endTask="{\"type\" : \"endTask\"}";
	var systemReady="{\"type\" : \"SystemReady\",\"task\" : ";
	var taskSetupReq="{\"type\" : \"TaskSetup\",\"task\" : ";
	var taskDone="{\"type\" : \"TaskDone\",\"task\" : ";
	var intask=document.getElementById("task");
	var pretask=document.getElementById("pretask");
	var diagScreen=document.getElementById("diagram");
	var taskArea=document.getElementById("taskArea");
	var objectSetup=document.getElementById("objectSetup");
	var firstDiagram=document.getElementById("firstDiagram");
	var popup=document.getElementById("popupBoxOnePosition");
	var socket=io();
	var scores=[];
	var count=3;
	var total=3;
	var checkForErrors=false;
	var showGarden=false;
	var done =false;
	var scoretimedout=false;
	var endReady=false;
	var rep=3-count;
	var exercise=1;
	var diagramOn=true;
	document.getElementById("count").innerHTML=total;
	var gotScore=false;
	var start=false;
	var scorewaiting=false;
	var taskReady=false;
	var repsScreen=false;
	var notChecked = false;
	var nextExercise=false;
	var diagramLayout=false;
	var svg=document.getElementById("objectsUsed");
	var svgCont=svg.contentDocument;
	var objects=svgCont.getElementsByClassName("ex1");
	var lastObjects=[];
	lastObjects.push(objects[0]);
	var setup=false;
	highlightObject();
	var attempt=0;

	function systemSetup(){
		console.log("systemSetup");
		showReps();
		hideDiagram();
		taskReady=false;
		setup=false;
		document.getElementById("start").style.display="";
		firstDiagram.style.width="85%";
	}
	function errorScreen(error){
		console.log("errorScreen");
		document.getElementById("start").style.display="";
		firstDiagram.style.width="85%";
		var msg="";
		document.getElementById("firstSetup").style.display="block";
		if(error==1){
			msg="Hand not in start zone";
		}else if(error==2){
			msg="Incorrect object placed on the mat";
		}else{
			msg="Object placed at incorrect location on the mat";
		}
		document.getElementById("firstDiagramText").innerHTML=msg;
	}

	function showDiagram(){
		console.log("showDiagram");
		diagScreen.style.visibility="visible";
		firstDiagram.style.visibility="hidden";
		document.getElementById("objectsUsed").style.visibility="hidden" //CHANGED //This is a hack, but roll with it for now
	}
	function hideDiagram(){
		console.log("hideDiagram");
		diagScreen.style.visibility="hidden";
		taskArea.style.visibility="visible";
	}
	function showObjectSetup(){
		console.log("showObjectSetup");
		objectSetup.style.visibility="visible";
		taskArea.style.visibility="hidden";
		document.getElementById("garden").style.display="NONE";
		document.getElementById("objectsUsed").style.visibility="visible" //CHANGED //ADDED
	}
	function taskScreenOn(){
		console.log("taskScreenOn");
		intask.style.zIndex="13";
		intask.style.visibility="visible";
		pretask.style.visibility="hidden";
	}
	function showReps(){
		console.log("showReps");
		$("#scoreImage").css('visibility', 'visible');
		$("#scoreImage").css('position', 'fixed');
		$("#scoreImage").css('left', '6%');
		$("#scoreImage").css('top', '25%');
		$("#scoreImage").css('opacity', '0.4');
		$("#scoreImage").css('width', '77%');
		$("#scoreImage").css('height', '77%');

		$("#repetitions").css("visibility", "visible");
		$("#repetitions").css("position", "fixed");
		$("#repetitions").css("left", "35%");


	  $("#prep").css('visibility', 'visible');
		$('#prep').css('position', 'fixed');
		$('#prep').css('top', '10%');
		$('#prep').css('left', '2%');

		$("#scoreResponse").css('visibility', 'hidden');
	}
	function hideSetup(){
		console.log("hideSetup");
		objectSetup.style.visibility="hidden";
		taskArea.style.visibility="visible";
	}
	function highlightObject(){
		console.log("highlightObject");
		while(lastObjects.length>0){
			var lastObj=lastObjects.pop();
			lastObj.style.fill="none";
		}
		var svgfile=document.getElementById("objectsUsed");
		var svgContent=svgfile.contentDocument;
		var objects=svgContent.getElementsByClassName("ex"+exercise.toString());
		for(var i=0;i<objects.length;i++){
			var id=objects[i].id;
			var fill=""
			if(id=="blue")
				fill="#4ea7f1"
			else if(id=="green")
				fill="#B3DD5F";
			else{
				fill="#b9dfff";
			}
			objects[i].style.fill=fill;
			lastObjects.push(objects[i]);
		}

	}
	function setUpTimeOut(){
		console.log("setUpTimeOut");
		if(notChecked){
			attempt++;
			setTimeout(setUpTimeOut,setupTime);
			if(attempt==3){
				attempt=0;
				notChecked=false;
				checkForErrors=false;
				diagramLayout=true;
				showDiagram();
				document.getElementById("objectsUsed").style.visibility="hidden"; //CHANGED //LOOK HERE
				document.getElementById("start").style.display="";
				document.getElementById("firstDiagramText").innerHTML="Set up your object(s) and hand";
				document.getElementById("firstSetup").style.display="block";
				document.getElementById("firstSetup").src="../img/icons-all/diagrams-start"+exercise.toString()+".png";
				diagramLayout=true;
				firstDiagram.style.width="85%";
			}else{
				socket.emit("json",taskSetupReq+exercise.toString()+"}");
			}
		}
	}
	function showLoading(){
		console.log("showLoading");
		firstDiagram.style.width="100%";
		document.getElementById("firstDiagramText").innerHTML="Loading";
		document.getElementById("firstSetup").style.display="none";
		document.getElementById("start").style.display="none";
	}
	function addFlowerToGarden(score){
		console.log("addFlowerToGarden");
		var source="../img/icons-all/flower"+score.toString()+".svg";
		var flowers=document.getElementById("flower"+(exercise-1).toString());
		flowers.src=source;
		flowers.style.visibility="visible";
	}
	function createGarden(){
		console.log("createGarden");
		var phrase=gardenQuotes[exercise-2];

		document.getElementById("flowers").innertHTML;
		var totalScores=0;
		var avg;
		taskArea.style.visibility="hidden";
		document.getElementById("garden").style.display="block";
		for(var i=0;i<scores.length;i++){
			var curScore=scores[i];
			if(curScore>0){
				totalScores+=curScore;
			}

		}
		avg=Math.round((totalScores*1.0)/total);

		if(avg==0){
			avg=1;
		}
		var values=scoreToValues(avg);
		document.getElementById("storyText").innerHTML=values.response+". "+phrase;
		addFlowerToGarden(avg);
		scores=[];
	}

	document.getElementById("start").onclick=function(){
		console.log("start.onclick");
		console.log("");
		//diagram goes to setup
		if(showGarden){
			showGarden=false;
			createGarden();

		}else if(diagramLayout){
			systemSetup();
			diagramLayout=false;
		}
		else if(diagramOn){
			$("#scoreResponse").css('visibility', 'hidden');
			diagramOn=false;
			objectSetup.style.visibility="hidden";
			firstDiagram.style.visibility="visible";
			document.getElementById("SetupText").innerHTML="You will be using the highlighted object(s) in the upcoming task";
			document.getElementById("objectsUsed").style.visibility="hidden";
			document.getElementById("firstSetup").src="../img/icons-all/diagrams-start"+exercise.toString()+".png";
			//need to request setup here
			setup=true;

			//taskReady=false;
		}else if(setup){
			socket.emit("json",taskSetupReq+exercise.toString()+"}");
			setup=false;
			showLoading();
			checkForErrors=true;
			attempt=0;
			//setup=true;
			notChecked=true;
			setTimeout(setUpTimeOut,setupTime);
		}
		else if(!taskReady){
			taskReady=true;
			taskScreenOn();
			if(count==total){
				//clearCircles();
			}
			socket.emit("json",systemReady+exercise.toString()+", \"iteration\" :  " +(4-count).toString()+"}");
		}else if(repsScreen){
			var exUsed=exercise;
			if(exercise==5){
				exUsed=1;
			}
			socket.emit("json",taskDone+exUsed.toString()+", \"iteration\" :  " +(4-count).toString()+"}");
					document.getElementById("resetObjects").innerHTML="Score is loading.";
			document.getElementById("centeredPatient").style.width="85%";
			document.getElementById("taskArea").style.width="85%";
			document.getElementById("key").style.display="none";
			document.getElementById("image").style.display="none";
			if(exercise<=4){
				repsScreen=false;
				diagramOn=true;
				if(count==total){
					clearCircles();
				}
				showObjectSetup();
			}else{
				window.location.href="/thankyou";
			}

		}
	}

	function enableEnd(){
		console.log("enableEnd");
		endReady=true;
	}
	function scoreTimeout(){
		console.log("scoreTimeout");
		if(!gotScore){
			rep=total-count;
			updateCurrentScore(-1);
			repsScreen=true;
		}

	}
	function updateVideo(){
		console.log("updateVideo");
		var video = document.getElementById('videodiag');
		video.setAttribute("src","../img/INR-Exercise"+exercise.toString()+".mp4");
	}
	function updateCountScreen(){
		console.log("updateCountScreen");
		if(count>0){
			document.getElementById("resetObjects").innerHTML="Reset your objects.";
		}else{
			done=true;
			count=total;
			exercise+=1;

			showGarden=true;
			highlightObject();
			updateVideo();
			document.getElementById("diagIMG").src="../img/icons-all/diagrams-ex"+exercise.toString()+ ".png";
			document.getElementById("exerciseTitle").innerHTML="Exercise "+exercise.toString();
			//showGarden=true;
			document.getElementById("resetObjects").innerHTML="Task is done.";
		}
		document.getElementById("count").innerHTML=count;
	}
	function clearCircles(){
		console.log("clearCircles");
		var svgfile=document.getElementById("scoreImage");
		var svgContent=svgfile.contentDocument;
		for( i=1;i<=total;i++){
			var cirID="circle"+i.toString();
			svgContent.getElementById(cirID).style.fill="#ffffff";
		}
	}
	function updateCurrentScore(score){
		console.log("updateCurrentScore");
		scores.push(score);
		var svgfile=document.getElementById("scoreImage");
		var svgContent=svgfile.contentDocument;
		var cirID="circle"+rep.toString();
		var hexResp=scoreToValues(score);
		var hex=hexResp.hex;
		var response=hexResp.response;
		svgContent.getElementById(cirID).style.fill=hex;
		document.getElementById("scoreValue").innerHTML=response;
		updateCountScreen();
		repsScreen=true;
	}
	function scoreToValues(score){
		console.log("scoreToValues");
		var hex="";
		var response="";
		if(score==1){
			hex="#eddb72";
			response="Could improve";
		}else if(score==2){
			hex="#b3dd5f";
			response="That was OK";
		}else if(score==3){
			response="Nicely Done";
			hex="#55e5b5";
		}else if(score==4){
			response="Great Job";
			hex="#27b4f2";
		}else if(score==5){
			response="Excellent work";
			hex="#6b86db";
		}else {
			response="No score available";
			hex="#ffffff";
		}
		return {
			hex: hex,
			response: response
		};
	}
	var score;
	socket.on('message',function(data){
		console.log("message");
		if(data.message!=null){
			var obj=JSON.parse(data.message);
			if(!checkForErrors){
				gotScore=true;
				score=obj.score3;
				rep=total-count;
				if(score!=null){
					updateCurrentScore(score);
				}
			}else{
				errorCount+=1;
				notChecked=false;
				var errorType=0;
				if(obj.error1!=1){
					errorType=1;
				}else if(obj.error2!=1){
					errorType=2;
				}else if(obj.error3!=1){
					errorType=3;
				}
				if(errorType==0||errorCount>=5){
					attempt=0;
					notChecked=false;
					checkForErrors=false;
					diagramLayout=true;
					showDiagram();
					document.getElementById("objectsUsed").style.visibility="hidden"; //CHANGED //This is a hack, but roll with it for now
					document.getElementById("start").style.display="";
					document.getElementById("firstDiagramText").innerHTML="Place the object(s) in on the highlighted area of the mat";
					document.getElementById("firstSetup").style.display="block";
					document.getElementById("firstSetup").src="../img/icons-all/diagrams-start"+exercise.toString()+".png";
					diagramLayout=true;
					firstDiagram.style.width="85%";
					errorCount=0;
					//systemSetup();
				}else{
					setup=true;
					errorScreen(errorType);
				}

			}
		}

	});

	function endScreenOn(){
		console.log("endScreenOn");
		start=true;
		intask.style.backgroundColor="#e9e9f4";
		intask.style.color="#59595B";
		setTimeout(enableEnd,300);
		document.getElementById("tasktext").innerHTML="Task running. Tap the screen when done";
		document.getElementById("centeredTask").style.color="#59595B";

	}

	function scoreLoadingScreen(){
		console.log("scoreLoadingScreen");
		start=true;
		$("#repetitions").css("visibility", "hidden"); //hide repetitions
	  $("#prep").css('visibility', 'hidden'); //hide prep
		$("#scoreResponse").css('visibility', 'visible');
		//$("#scoreResponse").css('position', 'fixed');
		//$("#scoreResponse").css('left', '50%');
		document.getElementById("scoreValue").innerHTML="Hold on";
		//document.getElementById("scoreValue").style.left="30%"; //CHANGED //Try this
		document.getElementById("resetObjects").innerHTML="Score is loading.";
		document.getElementById("centeredPatient").style.width="65%";
		document.getElementById("taskArea").style.width="65%";
		document.getElementById("key").style.display="block";
		document.getElementById("image").style.display="block";
		$("#scoreImage").css('visibility', 'hidden'); //CHANGED //Gets rid of the scoring circle
		intask.style.backgroundColor='#97e157';
		intask.style.zIndex="9";
		pretask.style.visibility="visible";
		intask.style.visibility="hidden";
		setTimeout(scoreTimeout,scoreTime);
	}

	function resetStartScreen(){
		console.log("resetStartScreen");
		document.getElementById("tasktext").innerHTML="Press the screen before starting the task";
		intask.style.backgroundColor="#97e157";
		document.getElementById("centeredTask").style.color="#FFFFFF";
		start=false;
	}

	task.onclick=function(){
		console.log("task.onclick");
		console.log("");
		if(!start){
			socket.emit("json",startTask+exercise.toString()+"}");
			endScreenOn();
		}else if(endReady){
			count-=1;
			scoreLoadingScreen();
			resetStartScreen();
			gotScore=false;
			socket.emit("json",endTask);
		}
	}
	//document.getElementById("video").onclick=function(){
	$( '#video' ).on("tap", function() {
		console.log("video.onclick");
		console.log("");
		var video = document.getElementById('videodiag');
		video.currentTime=0;
		video.play();
		popup.style.display="block";
	})

	//document.getElementById("exit").onclick=function(){
	$( '#exit' ).on("tap", function() {
		console.log("exit.onclick");
		console.log("");
		popup.style.display="none";
	})

}
