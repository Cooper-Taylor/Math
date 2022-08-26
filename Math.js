var objectArray = [];

var mathGameObject = {
    correctCount : 0,
    problemId : 0,
    solution : 0,
    question : 0,
    Mode : 0,
    problemType : 0,
    questionInfo : {},
    gameID : 0,

    startGame : ()=>{
        //redefining variables for whatever reason
        this.gameID = objectArray.length;
        //redefining variables for whatever reason
        this.questionInfo = {};
        this.correctCount = 0;
        this.problemId = 0;
        //this.questionInfo[this.problemId] = [true];
        //objectArray.push(this.mathGameObject);
        document.getElementById("startingScreen").childNodes[1].classList.add("bobAnimation");
        addStartingEventListener();
        [this.solution, this.question] = createProblem(decideProblemType(this.Mode));
    },

    //Serves for checking user response and administering new question
    questionLoop : ()=>{
        console.log(this.questionInfo)
        response = document.getElementById("answer").value;
        //Not accepting blank responses
        console.log(response);
        if(this.response == ""){
            console.log("This is blank");
            return;
        }
        
        if(checkAnswer(this.response,this.solution)){
            this.correctCount ++;
            console.log("This is correct");
            console.log(this.response);
            console.log(this.questionInfo);
            //Putting response in questionInfo map
            this.questionInfo[this.problemId] = [this.question, this.response, this.solution, true]; //correctness = true
            console.log("passed")
        } else{ 
            console.log("This is not correct")
            this.questionInfo[this.problemId] = [this.question, this.response, this.solution, false]; // correctness = false
        }

        this.problemId++;

        //Sets the answer box back to blank value
        document.getElementById("answer").value = "";

        //Create new problem
        [this.solution, this.question] = createProblem(decideProblemType(this.Mode));
    },
    
    endLoop : ()=>{
        End(this.questionInfo);
        //create new mathGameObject
    }

};

var currentGame = Object.create(mathGameObject);
objectArray.push(currentGame);
currentGame.startGame();

//addStartingEventListener();
//Look at this!! We got the countdown into the actual question screen working :)

function addStartingEventListener(){
    document.getElementById('startingScreen').addEventListener("click", clickyevent);
}

function clickyevent(){
    //Removing bobbing animation from starting screen
    document.getElementById("startingScreen").childNodes[1].classList.remove("bobAnimation");

    //This function is going to create a timer and use it for the screen & text change color for the countdown :>
    var count = 2;

    document.getElementById('startingScreen').style.display = "none";
    document.getElementById('countdownScreen').style.display = "block";
    inheritDisplay(document.getElementById('countdownScreen'),"block");

    var screen = document.getElementById('countdownScreen');
    var text = document.getElementById('countdownDisplay');

    //Creating object to reduce if statement usage
    colorMap = {3:'#EC5433',2:'#F9E146',1:'#A5E127'};

    //First update the display of the divs on HTML
    for (element of document.getElementsByClassName("header")){
        element.style.display = "none";
    }

    //Make entire div statement visible
    text.style.display = "initial";

    //There is an important difference between innerHTML and textContent : https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent
    //We use childNodes[0] so we change the content of the H1 element inside the div statement
    text.childNodes[0].textContent = "3";
    screen.style.backgroundColor = colorMap[3];
    
    //Adding the in-out animation class to the text:
    text.childNodes[0].classList.add("enlargeTextAnimation");

    var timer = setInterval(() => {
        screen.style.backgroundColor = colorMap[count];
        text.childNodes[0].textContent = count;

        count--;
        if(count < 0){
            console.log("We got here boyz");
            reset = true;
            screen.style.display = "none";
            document.getElementById("questions").style.display = "initial";
            clearInterval(timer);
            createGameTimer();
            document.getElementById("startingScreen").removeEventListener("click", clickyevent);
        }
    }, 1500)
};

//Creating arethemetic problem i.e +,-,*,/
//problemType = decideProblemType();
//console.log(problemType);

//createProblem returns solution, gives us string of question, and displays string
//[solution, question] = createProblem(problemType);

function displayGrade(problemId, correctCount){
    var gradePerc = 100 * (correctCount / problemId);
    var gradeFrac = `${correctCount} / ${problemId}`;
    //Selecting h2 element inside the div "Grade" element
    document.getElementById("Grade").childNodes[0].innerHTML = `Grade is: ${Math.round(gradePerc)} or ${gradeFrac}`;
}

function decideProblemType(Mode){
    if (!Mode){
        var temp = Math.random();
        if (temp < .25){
            problemType = "+";
        }
        if (temp >=.25 && temp <.50){
            problemType = "-";;
        }
        if (temp >=.50 && temp <.75){
            problemType = "x";
        }
        if (temp >= .75){
            problemType = "/";
        }
    }
    return problemType;
}

//Remove problemType variable and just use "temp" to reduce redundancies
//Used to create mathematical problem as well as display it
function createProblem(problemType){
    //a & b being used to represent mathematical variables for problems
    if (problemType == "+"){
        var a = Math.floor(Math.random()*50);
        var b = Math.floor(Math.random()*50);
        var solution = a + b;
        console.log(solution);
        document.getElementById("question").innerHTML = `${a} + ${b}`;
        return [solution, `${a} + ${b}`];
    }
    if (problemType == "-"){
        var a = Math.floor(Math.random()*50);
        var b = Math.floor(Math.random()*50);
        var solution = a - b;
        console.log(solution);
        document.getElementById("question").innerHTML = `${a} - ${b}`;
        return [solution, `${a} - ${b}`];
    }
    if (problemType == "x"){
        var a = Math.floor(Math.random()*15);
        var b = Math.floor(Math.random()*15);
        var solution = a * b;
        console.log(solution);
        document.getElementById("question").innerHTML = `${a} x ${b}`;
        return [solution, `${a} x ${b}`];
    }
    if (problemType == "/"){
        //a little different to ensure an integer solution is produced
        var a = Math.floor(Math.random()*15);
        var b = Math.floor(Math.random()*15);
        //denominator is not zero
        while (b == 0){
            b = Math.floor(Math.random()*15);
        }
        //Basically just making sure both a and b are a factor of the numerator (solution will always = a)
        var numerator = a * b;
        console.log(a);
        document.getElementById("question").innerHTML = `${numerator} / ${b}`;
        return [a, `${numerator} / ${b}`];
    }
}

function checkAnswer(response,solution){
    if(parseInt(response) == solution){
        return true;
    }
    return false;
}


function End(questionInfo){
    //loop through entry in object and each entry has array with 4 elements
    console.log(questionInfo);
    for (let key in questionInfo){
        var row = document.createElement("div");
        row.classList.add("row")
        //If true (correct) green else red
        var color = questionInfo[key][3] ? "#A5E127" : "#E34141"
        //Style the row background with correct color
        row.style.backgroundColor = color;

        row.style.height = "2.5vw";
        row.style.fontSize = "2vw";
        row.style.borderBottom = "4px solid black";

        //append row to questionList div
        document.getElementById("questionList").appendChild(row);

        for(let arrayData of questionInfo[key]){
            //Create div element
            var node = document.createElement("div");

            //Create text to insert into div element
            var textnode = document.createTextNode(arrayData);

            //Append text into node (which is the div element)
            node.appendChild(textnode);

            //Add the "col-3" class to allow 25% of screen to be taken by text
            node.classList.add("col-3");

            //Take problemId and append all information for that problemId onto the corresponding row (in childNodes)
            document.getElementById("questionList").childNodes[key].appendChild(node);
        }
    }

    //Changing Screen

    document.getElementById("questions").style.display = "none";
    document.getElementById("review").style.display = "initial";
    //inheritDisplay(document.getElementById("review"),"block");
}

function inheritDisplay(element,display_){
    for(let childElement of element.childNodes){
        console.log(childElement,display_);
        //skip if the node type is text (or whitespace in html) or a comment
        if(childElement.nodeType != 3 && childElement.nodeType != 8){
            childElement.style.display = display_;
            if(childElement.childNodes.length != 0){
                inheritDisplay(childElement,display_);
            }
        }
    }
}

function resetGame(){
    //resetting screen visibility
    document.getElementById("startingScreen").style.display = "block";
    inheritDisplay(document.getElementById("startingScreen"),"inherit");

    document.getElementById("countdownDisplay").style.display = "none";
    document.getElementById("questions").style.display = "none";
    document.getElementById("review").style.display = "none";

    //removing child nodes of questionlist
    while (document.getElementById("questionList").firstChild){
        document.getElementById("questionList").removeChild(document.getElementById("questionList").firstChild);
    }

    console.log(`CHILD OBJECTS LEFT:` + document.getElementById("questionList").childNodes.length);
    // document.getElementById("questionList").removeChild(document.getElementById("questionList").childNodes[0]);
    // console.log(`CHILD OBJECTS LEFT:` + document.getElementById("questionList").childNodes.length);

    currentGame = Object.create(mathGameObject);
    objectArray.push(currentGame);
    currentGame.startGame();
    console.log(objectArray);

    //Avoiding delay in interval for timer
    document.getElementById("displayTimer").innerHTML = `${60}`;
}

//Function for Timer
function createGameTimer(){
    var sec = 60;
    var gametimer = setInterval(function(){
        document.getElementById("displayTimer").innerHTML = `${sec}`;
        sec--;
        if (sec < 0){
            clearInterval(gametimer);
            //Run some 'End' function;
            currentGame.endLoop();

            displayGrade(problemId, correctCount);
            //End(questionInfo);
        }
    }, 1000);
}

//Random Comment