window.onload=function(){
	var taskLoad=false;
	var gardenQuotes=["It looks like your garden is beginning to grow. </br>Continue on to the next exercise.",
						"Another flower has appeared in your garden. </br>Continue on to the next exercise.",
						"Another flower has appeared in your garden. </br>Continue on to the next exercise.",
						"Look at how much your garden has grown today. </br>Click to exit and have a nice day!"

						]
	var setupTime=50; // This should be set to 6000 originally but sped up to 50 for testing
	var maxErrors=5;
	var error=0;
	var scoreTime=50; // Same deal as above.
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
	var count=4; //changed to 2 instead of 3
	var total=2;
	var checkForErrors=false;
	var showGarden=false;
	var done =false;
	var scoretimedout=false;
	var endReady=false;
	var rep=3-count;
	// Reload last loaded index for error values
	var index = sessionStorage.getItem("index");
	if (index === null) {
		index = 0;
	}
	var userNum = sessionStorage.getItem("userNum");
	if (userNum === null) {
		userNum = 1;
	}
// Accesses session storage to maintain variables
var exercise = sessionStorage.getItem("exercise");
//var exercise = 12;
	if (exercise === null || parseInt(exercise) > 12){
		exercise = 1;
	}
//	var exercise = 1;
	var diagramOn=true;
	//document.getElementById("count").innerHTML=total;
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
//	var objects=svgCont.getElementsByClassName("ex1");
	var lastObjects=[];
	var goodDataRuns = true;
	//lastObjects.push(objects[0]);
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
		if (count > 2) {
			$('#video').css('visibility', 'visible');
		}
		diagScreen.style.visibility="visible";
		firstDiagram.style.visibility="hidden";
		document.getElementById("objectsUsed").style.visibility="hidden" //CHANGED //This is a hack, but roll with it for now
	}
	function hideDiagram(){
		console.log("hideDiagram");
		$('#video').css('visibility', 'hidden');
		diagScreen.style.visibility="hidden";
		taskArea.style.visibility="visible";
	}
	function showObjectSetup(){
		console.log("showObjectSetup");
		objectSetup.style.visibility="visible";
		taskArea.style.visibility="hidden";
		document.getElementById("garden").style.display="NONE";
		document.getElementById("objectsUsed").style.visibility="visible" //CHANGED //ADDED
		document.getElementById("objectsUsed").src="../img/empty/Ex"+exercise.toString()+".png";
		$('#objectsUsed').css('width', '40%');
		$('#objectsUsed').css('height', '25%');
	}
	function taskScreenOn(){
		console.log("taskScreenOn");
		intask.style.zIndex="13";
		intask.style.visibility="visible";
		pretask.style.visibility="hidden";
	}
	function showReps(){
		console.log("showReps");
		$('#diagIMG').css('visibility', 'hidden');
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
		//if (exercise == 13) {
		//	location.replace('/thankyou');
		//}
		document.getElementById("objectsUsed").src="../img/empty/Ex"+exercise.toString()+".png";
		$('#objectsUsed').css("width", "40%");
		$('#objectsUsed').css("height", "25%");
		$('#headerContent').text('Activity ' + exercise + ' setup');
		console.log("highlightObject");
		while(lastObjects.length>0){
			var lastObj=lastObjects.pop();
			lastObj.style.fill="none";
		}
		var svgfile=document.getElementById("objectsUsed");
		var svgContent=svgfile.contentDocument;
	//	var objects=svgContent.getElementsByClassName("ex"+exercise.toString());
	/*	for(var i=0;i<objects.length;i++){
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
		}*/

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
				document.getElementById("firstSetup").src="../img/startingpos/diagrams-start"+exercise.toString()+".png";
				diagramLayout=true;
				firstDiagram.style.width="85%";
			}else{
				//socket.emit("json",taskSetupReq+exercise.toString()+"}");
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
		$('#headerContent').text('');
		$('#noticeContent').text('');
		//diagram goes to setup
		if(showGarden){
			showGarden=false;
			createGarden();

		}else if(diagramLayout){
			//console.log("NOW");
			systemSetup();
			diagramLayout=false;
		}
		else if(diagramOn){
			console.log('diagram on screen');
			updateVideo();
			document.getElementById("diagIMG").src="../img/instructions/diagrams-ex"+exercise.toString()+ ".png";
			$("#scoreResponse").css('visibility', 'hidden');
			$('#headerContent').text('');
			diagramOn=false;
			objectSetup.style.visibility="hidden";
			firstDiagram.style.visibility="visible";
			document.getElementById("SetupText").innerHTML="You will be using the highlighted object(s) in the upcoming task";
			document.getElementById("objectsUsed").style.visibility="hidden";
			document.getElementById("firstSetup").src="../img/startingpos/diagrams-start"+exercise.toString()+".png";
			//need to request setup here
			setup=true;

			//taskReady=false;
		}else if(setup){
			//console.log('second click');
			$('#diagIMG').css('visibility', 'visible');
			if (count == 2 || count == 1) {
				$('#headerContent').text('Activity ' + exercise.toString() +  ' Error Instructions');
				$('#noticeContent').text(getError(exercise));
				// May have to reshow this image if I cant get the localstorage working...
				//$('#diagIMG').css('visibility', 'hidden');
			}
			else {
				$('#headerContent').text('Activity ' + exercise.toString() + ' Instructions');
			}
			//socket.emit("json",taskSetupReq+exercise.toString()+"}");
			setup=false;
			showLoading();
			checkForErrors=true;
			attempt=0;
			//setup=true;
			notChecked=true;
			setTimeout(setUpTimeOut,setupTime);
		}
		else if(!taskReady){
			console.log('task is ready');
			taskReady=true;
			taskScreenOn();
			if(count==total){
				//clearCircles();
			}
			//socket.emit("json",systemReady+exercise.toString()+", \"iteration\" :  " +(4-count).toString()+"}");
		}else if(repsScreen){
			$('#headerContent').text('Activity ' + exercise.toString() + ' Setup');
			console.log('reps screen?');
			var exUsed=exercise;
			if(exercise==5){
				exUsed=1;
			}
			//socket.emit("json",taskDone+exUsed.toString()+", \"iteration\" :  " +(4-count).toString()+"}");
		//			document.getElementById("resetObjects").innerHTML="Score is loading.";
			document.getElementById("centeredPatient").style.width="85%";
			document.getElementById("taskArea").style.width="85%";
			document.getElementById("key").style.display="none";
			document.getElementById("image").style.display="none";
			// This should allow for 12 exercises with 2 good runs and two error runs.
			if(exercise<=12){
				//console.log("EXERCISE " + exercise);
				repsScreen=false;
				diagramOn=true;
				// This is where the total is determined...
				if(count==total){
					clearCircles();
				}
				showObjectSetup();
			}else{
				sessionStorage.setItem("exercise", "1");
				userNum++;
				sessionStorage.setItem("userNum", userNum.toString());
				console.log("FINISHED?");
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
		video.setAttribute("src","../img/movies/INR-Exercise"+exercise.toString()+".MOV");
	}
	function updateCountScreen(){
		console.log("updateCountScreen");
		console.log("LAUNCHED");
		count--;
		console.log("EXERCISE " + exercise);
		console.log("COUNT " + count);
		if (count <= 2) {
			goodDataRuns = false;
		}
		if(count>0){
			goodDataRuns = true;

			//document.getElementById("resetObjects").innerHTML="Reset your objects.";
		}else{
			//localStorage.clear();
			//exercise++;
			done=true;
			// Do not change images or videos until you have done the exercise twice good and twice poorly.
			//if (!goodDataRuns) {
			showGarden=false;
			highlightObject();
			updateVideo();
			console.log("SWITCHING");
			//document.getElementById("diagIMG").src="../img/instructions/diagrams-ex"+exercise.toString()+ ".png";
			//document.getElementById("exerciseTitle").innerHTML="Exercise "+exercise.toString();
			//showGarden=true;
			//document.getElementById("resetObjects").innerHTML="Task is done.";
			// increment exercise only after two good runs and two bad runs.
			goodDataRuns = true;
			console.log("EXERCISE " + exercise);
			//}
			//else {
			//	goodDataRuns = false;
			//}
			//count=2;
			//count --;
			count = 4;
		}
		//document.getElementById("count").innerHTML=count;
	}
	function clearCircles(){
		console.log("clearCircles");
		var svgfile=document.getElementById("scoreImage");
/*		var svgContent=svgfile.contentDocument;
		for( i=1;i<=total;i++){
			var cirID="circle"+i.toString();
			svgContent.getElementById(cirID).style.fill="#ffffff";
		}*/
	}
	function updateCurrentScore(score){
		console.log("updateCurrentScore");
		scores.push(score);
		var svgfile=document.getElementById("scoreImage");
	//	var svgContent=svgfile.contentDocument;
		var cirID="circle"+rep.toString();
		var hexResp=scoreToValues(score);
		var hex=hexResp.hex;
		var response=hexResp.response;
	//	svgContent.getElementById(cirID).style.fill=hex;
	//	document.getElementById("scoreValue").innerHTML=response;
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
					$('#headerContent').set("Place the object(s) on the highlighted area of the mat");//JKLFDNJFKLDSFJDSKLFNJSDKLFJLDSKFNJDSLFNSDKF
					document.getElementById("firstSetup").style.display="block";
					document.getElementById("firstSetup").src="../img/startingpos/diagrams-start"+exercise.toString()+".png";
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
		document.getElementById("tasktext").innerHTML="Activity running. Press the screen when done";
		$('#task').css('background-color', 'red');
		$('#tasktext').css('color', 'black');
		$('.head').css('background-color', 'red');
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
		//document.getElementById("scoreValue").innerHTML="Hold on";
		//document.getElementById("scoreValue").style.left="30%"; //CHANGED //Try this
		//document.getElementById("resetObjects").innerHTML="Score is loading.";
		//document.getElementById("centeredPatient").style.width="65%";
		//document.getElementById("taskArea").style.width="65%";
		//document.getElementById("key").style.display="block";
		//document.getElementById("image").style.display="block";
		//$("#scoreImage").css('visibility', 'hidden'); //CHANGED //Gets rid of the scoring circle
		intask.style.backgroundColor='#97e157';
		intask.style.zIndex="9";
		pretask.style.visibility="visible";
		intask.style.visibility="hidden";
		setTimeout(scoreTimeout,scoreTime);
	}

	function resetStartScreen(){
		console.log("resetStartScreen");
		$('#tasktext').css('color', 'white');
		document.getElementById("tasktext").innerHTML="Press the screen before starting the activity";
		intask.style.backgroundColor="#97e157";
		document.getElementById("centeredTask").style.color="#FFFFFF";
		start=false;
	}

	task.onclick=function(){
		console.log("task.onclick");
		console.log("");
		if(!start){
			//socket.emit("json",startTask+exercise.toString()+"}");
			endScreenOn();
		}else if(endReady){
			//count-=1;
			// Sets the header for the end screen
			$('#headerContent').text('Thank you!');
			console.log("GOOD DATA RUN " + goodDataRuns);
			$('.head').css('background-color', '#c0c0c0');
			if (count == 4) {//goodDataRuns) {
				$('#noticeContent').text('You will now repeat this activity again.');
			}
			else if (count == 3) {
				$('#noticeContent').text('You will now repeat this activity with some specific errors. ');
			}

			else if (count == 2) {
				$('#noticeContent').text('You will now repeat this activity with a different error. ');
			}

			else if (count == 1) {
				$('#noticeContent').text('You will now complete a short survey about this activity. ');
				exercise++;
				sessionStorage.setItem("exercise", exercise.toString());
				sessionStorage.setItem("index", index.toString());
				setTimeout(function(){
				location.replace('/survey');}, 2000);
			}
			scoreLoadingScreen();
			resetStartScreen();
			gotScore=false;
			//socket.emit("json",endTask);
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
		$('#video').css('visibility', 'hidden');
		//$('#video').load('/survey');
		//location.replace('/survey');
		//$(document.doumentElement).html('http://172.30.138.197:3000/survey');
	})

	//document.getElementById("exit").onclick=function(){
	$( '#exit' ).on("tap", function() {
		$('#video').css('visibility', 'visible');
		console.log("exit.onclick");
		console.log("");
		popup.style.display="none";
	})


function getError() {
	var er;
	switch (parseInt(userNum)) {
		case 1:
			er = [4,4,6,4,3,6,3,4,5,5,2,1,2,6,4,3,5,4,4,1,3,4,3,3];
			break;
		case 2:
			er = [5,5,5,6,4,6,2,6,1,3,1,5,2,1,2,5,2,2,5,4,6,1,3,4];
			break;
		case 3:
			er = [4,5,1,2,1,6,5,5,1,3,1,3,5,4,5,4,5,6,4,2,4,1,6,1];
			break;
		case 4:
			er = [4,5,4,2,5,1,4,4,2,2,1,1,2,6,1,6,1,6,2,4,6,6,2,4];
			break;
		case 5:
			er = [6,6,1,2,5,1,1,3,6,6,1,4,6,6,6,6,5,1,4,2,5,6,2,6];
			break;
		case 6:
			er = [2,6,5,5,6,2,2,4,5,6,3,1,1,3,5,2,5,4,1,5,6,3,6,1];
			break;
	}
	var num = er[index];
	index++;

	switch (num){
		case 1:
				return "Do the entire activity slowly";
		case 2:
				return "Use an indirect path to reach towards or move the object(s)";
		case 3:
				return "Drop an object during the activity";
		case 4:
				return "Put the object(s) in the incorrect place during the activity";
		case 5:
				return "Do not fully complete the activity";
		case 6:
				return "Lean forward in your chair during the activity";
	}
}

}
