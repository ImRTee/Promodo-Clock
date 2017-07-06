/**
 * Created by ImRTee on 30/06/2017.
 */
var clockApp = angular.module('clockApp',[])

clockApp.controller('timerCtrl',function($scope,$rootScope){
    $scope.boxShadowColor = 'rgba(0,0,0,1)'
    var isPlaying = false; //for playing stoping effect
    var timeLoop;
    var isWorking = true; //for alternating between session and break clock
    var fillHeightAccum = 0;
    var originalTimeLength;
    var currentSecAccum = 0;
    $scope.projectName = '';
    //Clocktype
    $scope.clockType = 'Session Clock';
    //Defaut time
    $scope.sessionTime='25';
    $scope.breakTime ='05';

    //Update time after editting
    $rootScope.$on('updateTime', function(event,msg){
        $scope.sessionTime = msg[0];
        $scope.breakTime = msg[1];
        $scope.minutes = $scope.sessionTime;
        $scope.seconds = '00';
        $scope.fillHeight ='0%';
        currentSecAccum = 0;

    });
    //Display time
    $scope.minutes =  $scope.sessionTime;
    $scope.seconds = '00';
    //State button
    $scope.state = 'play';



    $scope.triggerButton = function(){
        //Check if project's name area is filled
        console.log($scope.projectName);

        //Ignite and eliminate running interface
        $('.clock').toggleClass('isRunning');
        $('.clock').toggleClass('isActive');
        //if the clock is not playing
        if ( isPlaying === false) {
            $scope.state = 'pause'; //change the state button
            //start clock system
            timeLoop = setInterval(function () {
                if ($scope.projectName === ''){
                    $('label.animated').toggleClass('bounce');
                } else {
                    $('label.animated').removeClass('bounce');
                }
                //if seconds = zero
                if( Number($scope.seconds) === 0 ) {
                    //if minute = 0
                    if ( Number($scope.minutes) <= 0 ){
                        // if this is session clock
                        if ( $scope.clockType === 'Session Clock'){
                            //reset current second for filling effect
                            currentSecAccum = 0;
                            //Notification sound
                            var breakSound = new Audio('http://www.pacdv.com/sounds/people_sound_effects/applause-4.mp3');
                            breakSound.play();
                            //Change into break clock's interface
                            $scope.clockType = "Break Clock";
                            //Manage the data
                            $scope.minutes = $scope.breakTime;

                            $scope.minutes = num2str( Number($scope.minutes) - 1); //Decreae the minutes view by 1
                            $scope.seconds = '60'; //reset seconds view to 60
                        } else{ //if this is break clock
                            //reset current second for filling effect
                            currentSecAccum = 0;
                            //workSound
                            var workSound = new Audio('http://www.pacdv.com/sounds/interface_sound_effects/sound3.mp3');
                            workSound.play();
                            //Change into session'sinterface first
                            $scope.clockType = "Session Clock";
                            $scope.minutes = $scope.sessionTime;

                            $scope.minutes = num2str( Number($scope.minutes) - 1);
                            $scope.seconds = '60';
                        }
                    }else{ //if the minutes view is not equal to 0
                        $scope.minutes = num2str( Number($scope.minutes) - 1); //Decrease the minutes view
                        $scope.seconds = '60'; //Reset the seconds view
                    }
                }
                //Code for filling effect;
                //if this is sessionClock
                if ( $scope.clockType === 'Session Clock'){
                    $scope.fillColor = 'blue';
                    $scope.borderColor = 'blue';
                    originalTimeLength = Number($scope.sessionTime) * 60;
                    currentSecAccum += 1;
                    var perc =(currentSecAccum/originalTimeLength)*100 ;
                    console.log(perc);
                    $scope.fillHeight = perc + '%';

                }else{
                    $scope.fillColor = 'red';
                    $scope.borderColor = 'red';
                    originalTimeLength = Number($scope.breakTime) * 60;
                    currentSecAccum += 1;
                    var perc =(currentSecAccum/originalTimeLength)*100 ;
                    console.log(perc);
                    $scope.fillHeight = perc + '%';
                }



                //The seconds view is continuously decresed by 1
                var currentSec = Number($scope.seconds);
                currentSec -= 1;
                $scope.$apply(function(){
                    $scope.seconds = num2str(currentSec);
                });
            }, 1000);
            isPlaying = true; //we are now in playing state
        } else{ //if we are in playing state, the clock is clicked
            clearInterval(timeLoop); //stop the interval
            isPlaying = false; //we are now in pause state
            $scope.state = 'play'; //the state button becomes play
        }
    };

    $scope.edit = function(){
        //Reset clock system and interface
        clearInterval(timeLoop);
        $scope.state = 'play';
        $('.clock').removeClass('isRunning');
        $('.clock').removeClass('isActive');
        isPlaying = false;
        //Display pop-up window
        $('.edit-modal').css('display','block');
        $('.edit-modal-content').removeClass('closing');
        $('.edit-modal-content').addClass('opening');
        $('.edit-modal-content').on('webkitAnimationEnd',function(){
            $('.edit-modal').css('display','block');
        });
    };
    //Reset button
    $scope.reset = function(){
        //Reset interface to session clock
        $scope.fillColor = '0%';
        $scope.borderColor = 'blue';
        $scope.clockType = 'Session Clock';
        currentSecAccum = 0;
        //Stop running effect
        $('.clock').removeClass('isRunning');
        $('.clock').removeClass('isActive');
        $scope.minutes =  $scope.sessionTime;

        //Reset timer interface
        $scope.seconds = '00';
        $scope.state = 'play';
        isPlaying = false;
        clearInterval(timeLoop);
        //if the we are in the break clock
        if ($('.clock').hasClass('sessionTitle') === false){
            $('.clock').addClass('sessionTitle');
        }
    }

})//end of timerCtrl

clockApp.controller('userInputCtrl',function($scope,$rootScope){
    $scope.sessionInput='25';
    $scope.breakInput='5';


    $scope.addTime = function(inputType){
        if (inputType === 'sessionInput'){
            var current = Number($scope.sessionInput);
            current += 1;
            if (current > 60){
                $scope.sessionInput = '1';
            } else{
                $scope.sessionInput = current;
            }
        }else{
            var current = Number($scope.breakInput);
            current += 1;
            if (current > 60){
                $scope.breakInput = '1';
            } else{
                $scope.breakInput = current;
            }
        }
    };

    $scope.minusTime = function(inputType){
        if (inputType === 'sessionInput'){
            var current = Number($scope.sessionInput);
            current -= 1;
            if (current < 1){
                $scope.sessionInput = 60;
            } else{
                $scope.sessionInput = current;
            }
        }else{
            var current = Number($scope.breakInput);
            current -= 1;
            if (current < 1){
                $scope.breakInput = 60;
            } else{
                $scope.breakInput = current;
            }
        }
    };

    $scope.accept = function (){

        var newTimeInputs =[num2str(Number($scope.sessionInput)),num2str(Number($scope.breakInput))];

        $rootScope.$broadcast('updateTime', newTimeInputs);

        $('.edit-modal-content').removeClass('opening');
        $('.edit-modal-content').addClass('closing');
        $('.edit-modal-content').on('webkitAnimationEnd',function(){
            $('.edit-modal').css('display','none');
        })

    }
    $scope.close =function(){
        $('.edit-modal').css('display','none');
    }

})//end Of userInput controller



function num2str(num){
    var str;
    if (num < 10){
        str = '0' + JSON.stringify(num);
    }else{
        str = JSON.stringify(num);
    }
    return str
}
