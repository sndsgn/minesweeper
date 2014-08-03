//JavaScript MINESWEEPER

//Board Size
var rows = 8;
var ind = 8;
var mines = 10;

//Populates a matrix with the number of rows and the number of ind (columns)
var popMatrix = function(rows,ind,mines) {
  var mineArray = [];
  for(var i = 0; i < mines; i++) {
    mineArray.push("&#9762;");
  }

  //For loop to randomize the adding of mines or zeros to the rowArr and then pushed to the matrix array
  var rowFill = function(ind) {
    var rowArr = [];
    for(var n = 0; n < ind; n++) {
      rowArr.push(0);
    }
    return rowArr;
  };
  
  //Matrix to be populated by number of rows indicated        
  var matrix = []; 
  for(var j = 0; j < rows; j++) { 
    matrix.push(rowFill(ind));
  }
  
  //Remove a mine and add it to the matrix array        
  while(mineArray[0] === "&#9762;") {
    var randomRow = Math.floor(Math.random() * rows);
    var randomInd = Math.floor(Math.random() * ind);

    if(matrix[randomRow][randomInd] === 0) {
      matrix[randomRow][randomInd] = mineArray.shift();
    } else if(matrix[randomRow][randomInd] === "&#9762;") {
      matrix[randomRow][randomInd] = "&#9762;"; 
    } else {
      matrix[randomRow][randomInd] = 0; 
    }               
  }
  return matrix;
};

//Function for initiating loss if mine left clicked and built in function for clearing zeros in proximity recurisvely 
var clickLossClear = function(td) {
  var recursiveClear = function(clickedCell) {
    var trLength = $("tr:eq(0)").children().length;
    var trCount = $("tr").length;
    var u = 0;
    var foundZeros = {};
    var rowIter = $(clickedCell).parent().index();
    var cellIter = $(clickedCell).index();
    for(var p = -1; p <= 1; p++) {
      for(var q = -1; q <= 1; q++) {
        if((((rowIter + q) >= 0) && ((cellIter + p) >= 0) && ((rowIter + q) < trCount) && ((cellIter + p) < trLength))) {
          if($("tr:eq("+(rowIter + q)+") td:eq("+(cellIter + p)+")").text() !== "0" && $("tr:eq("+(rowIter + q)+") td:eq("+(cellIter + p)+")").text() !== "☢") {
            $("tr:eq("+(rowIter + q)+") td:eq("+(cellIter + p)+")").removeClass("f0");
            $("tr:eq("+(rowIter + q)+") td:eq("+(cellIter + p)+")").removeClass("bg-f47503");
            $("img", $("tr:eq("+(rowIter + q)+") td:eq("+(cellIter + p)+")")).remove();
          }                      
          else  if($("tr:eq("+(rowIter + q)+") td:eq("+(cellIter + p)+")").text() === "0"  && $("tr:eq("+(rowIter + q)+") td:eq("+(cellIter + p)+")").has("img").length !== 0) {
            $("tr:eq("+(rowIter + q)+") td:eq("+(cellIter + p)+")").addClass("f0");
            $("img", "tr:eq("+(rowIter + q)+") td:eq("+(cellIter + p)+")").remove();
            foundZeros[u] = $("tr:eq("+(rowIter + q)+") td:eq("+(cellIter + p)+")")[0];
            u = u + 1;
          }
        }
      }
    }
    for(var prop in foundZeros) {
      var zerosRanFunc = [];
      if(foundZeros.hasOwnProperty(prop) && zerosRanFunc.length === 0) {
        zerosRanFunc.push(foundZeros[prop]);
        recursiveClear(foundZeros[prop]);
      }
      else if(zerosRanFunc.length !== 0) {
        for(var i = 0; i < zerosRanFunc.length; i++) {
          if(zerosRanFunc[i] === foundZeros[prop]) {
            break;
          }
        }
      }
    }
  };
  if(td.textContent === "☢") {
    $("img", "td:contains('☢')").hide();
    $("td:contains('☢')").removeClass('f0');
    $("td:contains('☢')").addClass('bg-000000');
    $("#controls").addClass("fm bg-000000 ff tac fc-FFFFFF b").text("Sorry, you just blew up, but not in a good way! You'll do better next time!"); 
    $("#game-check").attr("disabled", "disabled");  
    $("#minesweeper").attr("disabled", "disabled");  
    window.scrollTo(0,0);
    setTimeout(function(){
      location.reload();
    }, 3000);
  }
  if(td.textContent !== "0") {
    $(td).removeClass("f0");
    $(td).removeClass("bg-f47503");
    $("img", td).remove();
  }
  else if(td.textContent === "0") {
    recursiveClear(td);
  }
};

//Adds click functionality for removing the image, showing text, clearing free cells,
//adding flags and losing if mine clicked.
var clickAction = function(event) {
  document.oncontextmenu = function() {return false;};
  $('td').mousedown(function(event) {
    var imgSrc = $("img", this).attr("src");
    switch (event.which) {
      case 1:
        clickLossClear(this);
        break;
      case 2:
        alert('Middle Mouse button pressed.');
        break;
      case 3:
        if(imgSrc === "thumbtack.svg") {  
          $("img", this).attr("src", "thumbtack_reverse.svg");
          $(this).addClass("bg-f47503");
        }
        if(imgSrc === "thumbtack_reverse.svg") {
          $("img", this).attr("src", "question_mark.svg");
          $(this).addClass("bg-f47503");
        }
        if(imgSrc === "question_mark.svg") {
          $("img", this).attr("src", "thumbtack.svg");
          $(this).removeClass("bg-f47503");
        }
        if(imgSrc === "") {
          $(this).removeClass("bg-f47503");
        }
        break;
      default:
        alert('You have a interesting mouse!');
    }
  });
};

//Creates the visual game board and populate it with the values from the popMatrix function. 
var visualMatrixJS = function(rows, ind, matrix) {
  for(var i = 0; i < rows; i++) { 
    document.getElementById("minesweeper").insertRow(i);
    for(j = 0; j < ind; j++) { 
      var tableRow = document.getElementById("minesweeper").getElementsByTagName("tr")[i];
      tableRow.insertCell(j).className="fsm b ff minw minh pt pb phl phr tac brdr-sld brdr-sp0 cp f0 fc-F47503 hl";
      tableRow.getElementsByTagName("td")[j].setAttribute("onclick", "clickAction(this)");
      tableRow.getElementsByTagName("td")[j].innerHTML=matrix[i][j];
    }
  }
};

//Adds the nearby minecount.
var mineProximity = function(rows, ind, matrix) {
  for(var i = 0; i < rows; i++) {
    for(var j = 0; j < ind; j++) {
      for(var m = -1; m <= 1; m++) {
        for(var n = -1; n <= 1; n++) {
          if(matrix[i][j] === "&#9762;") {
            if((((i + m) >= 0) && ((j + n) >= 0) && ((i + m) < rows) && ((j + n) < ind))) {
              if(matrix[i + m][j + n] !== "&#9762;") {
                matrix[i + m][j + n]++;
              }
            }  
          }
        }
      }
    }
  }
};

//Checks to ensure all mines are flagged properly to display if won or lost
var mineCheck = function() {
  if ($("img", "td:not(:contains('☢'))").length === 0) { 
    $("#minesweeper").addClass("fxl bg-f47503 ff tac fc-FFFFFF b").text("WELL PLAYED MINESWEEPER! YOU WIN!"); 
  }
  else if($("img", "td:contains('☢')").attr("src") === "thumbtack_reverse.svg" && $("img[src='thumbtack_reverse.svg']", "td:not(:contains('☢'))").length === 0){
    $("#minesweeper").addClass("fxl bg-f47503 ff tac fc-FFFFFF b").text("WELL PLAYED MINESWEEPER! YOU WIN!"); 
  }
  else { 
    $("#minesweeper").addClass("fxl bg-000000 ff tac fc-FFFFFF b").text("Sorry, you flagged incorrectly! You'll do better next time!"); 
  }
  $("#game-check").attr("disabled", "disabled");  
  setTimeout(function(){
    location.reload();
  }, 2500);
};

//Cheat to show location of mines.
var showMines = function() {
  var mineImg = $("img", "td:contains('☢')"); 
  var imgSrc = $("img", "td:contains('☢')").attr("src"); 
  $("img", "td:contains('☢')").hide();
  $("td:contains('☢')").removeClass('f0');
  if(imgSrc === "thumbtack_reverse.svg" || "question_mark.svg") {
    $("td:contains('☢')").has("img[src='thumbtack_reverse.svg']").removeClass("bg-f47503");
    $("td:contains('☢')").has("img[src='question_mark.svg']").removeClass("bg-f47503");
    setTimeout(function(){
      $("td:contains('☢')").has("img").addClass("f0");
      $("img", "td:contains('☢')").show();   
      if(imgSrc === "thumbtack_reverse.svg" || "question_mark.svg") {
        $("td:contains('☢')").has("img[src='thumbtack_reverse.svg']").addClass("bg-f47503");
        $("td:contains('☢')").has("img[src='question_mark.svg']").addClass("bg-f47503");
      }
    }, 5000);
  }
}; 

//Loads all functions needed for gameplay after the DOM loads
$(document).ready(function() {
  var matrix = popMatrix(rows, ind, mines);
  mineProximity(rows, ind, matrix); 
  visualMatrixJS(rows, ind, matrix);    
  $('td').prepend('<img class="hin" src="thumbtack.svg" />');
  clickAction(event);
});

