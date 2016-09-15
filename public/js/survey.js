//var fs = require('fs');

$(window).load(function() {
  var clickOne = 1;
  var continueTrue = false;
  var selected = false;
  var exerciseNum = sessionStorage.getItem("exerciseNum");
  if (exerciseNum === null) {
    exerciseNum = 1;
  }

  $('#questionOne').empty();
  $('#questionTwo').empty();
  $('#questionThree').empty();

/*  var one = Math.floor((Math.random() * 8) + 0);
  var two = Math.floor((Math.random() * 8) + 0);
  while (one == two) {
    two = Math.floor((Math.random() * 8) + 0);
  }
  var three = Math.floor((Math.random() * 8) + 0);
  while (one == two || two == three || one == three) {
    three = Math.floor((Math.random() * 8) + 0);
  }

  var secondQuestionChoices = [surveyOptions[one], surveyOptions[two],
                                  surveyOptions[three]];*/


  /*$('#questionOneDiv').on("tap", function(){
    fs.appendFile('message.txt', 'data to append', (err) => {
        if (err) throw err;
        console.log('The "data to append" was appended to file!');
});
  })*/

exerciseNum = parseInt(exerciseNum);
var choices = [];
switch (exerciseNum) {
  case 1:
    choices = ["Pressing  or pushing a button"
    ,"Picking up phone","Closing a container"];
    break;
  case 2:
    choices = ["Grasping a cup or top"
    ,"Wipe off a surface"
    ,"Turning a key"];
    break;
  case 3:
    choices = ["Comb hair"
    ,"Drinking from a glass"
    ,"Opening a fridge door"];
    break;
  case 4:
    choices = ["Put on makeup or shave"
    ,"Using a fork or knife"
    ,"Writing"];
    break;
  case 5:
    choices = ["Opening a fridge door"
    ,"Use a remote control"
    ,"Using a fork or knife"
    ];
    break;
  case 6:
    choices = ["Wipe off a surface"
    ,"Pressing and pushing buttons"
    ,"Tidying"
    ];
    break;
  case 7:
    choices = ["Putting on a jacket"
    ,"Writing"
    ,"Turning on a light switch"];
    break;
  case 8:
    choices = ["Folding a towel"
    ,"Dressing"
    ,"Put on makeup or shave"];
    break;
  case 9:
    choices = ["Putting on a jacket"
    ,"Tidying"
    ,"Comb hair"];
    break;
  case 10:
    choices = ["Picking up phone"
    ,"Closing a container"
    ,"Grasping a cup or top"];
    break;
  case 11:
    choices = ["Dressing"
    ,"Turning a key"
    ,"Use a remote control"];
    break;
  case 12:
    choices = ["Folding a towel"
    ,"Turning on a light switch"
    ,"Drinking from a glass"];
    break;
}

console.log(exerciseNum);
console.log(choices);

$('#questionOne').append(choices[0]);
$('#questionTwo').append(choices[1]);
$('#questionThree').append(choices[2]);

// tapping on any of the options records what was selected and
// proceeds to question two.
$('.questionDivs').on("tap", function() {
  socket.emit("THIS IS STARTING");
  if (clickOne == 1) {
console.log(event.target.id);
var output = $('#'+event.target.id).text();
console.log(output);
var second = [];
for (i in choices) {
  if (choices[i] != output) {
    second.push(choices[i]);
  }
}
console.log(second);
$('.surveyMessage').empty();
$('#topMessage').empty();
$('#Q1').css('visibility', 'hidden');
$('#topMessage').append("Consider how you might use the object(s) on the mat to act out any of the following activities:");
// Set this timeout to avoid double tapping the first options
setTimeout(function(){

$('#questionOne').css('visibility', 'visible');
$('#questionTwo').css('visibility', 'visible');

$('#questionOne').text(second[0]);
$('#questionOne').css('color', 'black');
$('#questionOne').css('font-weight', '700');
$('#questionOne').css('font-size', '25px');

$('#questionTwo').text(second[1]);
$('#questionTwo').css('color', 'black');
$('#questionTwo').css('font-weight', '700');
$('#questionTwo').css('font-size', '25px');


$('#questionThree').css('visibility', 'visible');
$('#questionThree').empty();
$('#questionThree').append("Select one of the activities above to perform.");
$('#questionThree').css('color', 'red');
$('#questionThree').css('font-weight', '700');
$('#questionThree').css('font-size', '30px');
clickOne++;}, 400);
}

else if (clickOne == 2){
  $('#topMessage').text("Place the object(s) on the mat to setup the activity you would like to perform.");
  $('#questionOne').css('visibility', 'hidden');
  $('#questionTwo').css('visibility', 'hidden');
  $('#questionThree').css('visibility', 'hidden');
  //clickOne++;
  selected = true;
}


});

$(document).on("tap", function() {
  console.log(clickOne);
  if (selected || continueTrue) {
    clickOne++;
  }
  if (clickOne == 4 && selected) {
    $('#topMessage').text("Sit with your back against the chair. Place your right arm in the start position. Press the green button to continue.");
    $('#continue').css('visibility', 'visible');
    selected = false;
    //clickOne++;
  }

  if (clickOne == 6 && continueTrue) {
    $('#topMessage').text("System recording. Press the sceen when  done");
    continueTrue = false;
    selected = true;
  }

  if (clickOne == 7) {
    $('#topMessage').text("You are now ready to move to the next activity. Please allow a couple seconds");
    exerciseNum++;
    sessionStorage.setItem("exerciseNum", exerciseNum.toString());
    setTimeout(function(){
    location.replace('/taskgo');}, 3000);
  }
})

$('#continue').on("tap", function() {
  $('#continue').css('visibility', 'hidden');
  $('#topMessage').text("Press the screen before performing the activity.");
  continueTrue = true;
})


$('#done').on("tap", function(){
  //history.go(-1);
  location.href = '/taskgo';
});
})
