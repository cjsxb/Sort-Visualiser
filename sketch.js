// Welcome to p5.js Sort Visualiser!

// Main Data Array
let array = [];

// Animation Array
let Indexes = [];

// Strings + Positions for Menu Buttons
let callumSorts = [
  ["Swallow", 0, 0],
  ["Lemon", 0, 0],
  ["Random", 0, 0],
];

let quadSorts = [
  ["Bubble", 0, 0],
  ["Selection", 0, 0],
  ["Insertion", 0, 0],
  ["Gnome", 0, 0],
  ["Shaker", 0, 0],
  ["OddEven", 0, 0],
];

let weirdSorts = [
  ["Bogo", 0, 0],
  ["Bogobogo", 0, 0],
  ["Faith", 0, 0],
];

let state = "menu";
let substate, sortSelected = "none";
let animBool = true;
let once, onceTwo, isSorted, hasSort, helpMenu, isAnim, oddSortedAlready, randomMenu, ready = false;

let spaceX = 850;
let spaceY = 600;
let jesusY = 900;
let counter, infoSlider = 0;

let columnWidth, columnHeight, changeName, beginMS, beginTime;
let preCV, preRV, preTV, preDV, columnSlider, timeSlider, rangeSlider;


function setup() {
  createCanvas(900, 900);

  // createSlider Parameters is (Min, Max, Default, Step (Optional))
  rangeSlider = createSlider(20, 1000, 100);
  rangeSlider.position(20, 30);
  columnSlider = createSlider(4, 250, 5);
  columnSlider.position(180, 30);
  timeSlider = createSlider(0, 3000, 10000);
  timeSlider.position(340, 30);
  
  img = loadImage('jesus.png');

  generateArray(columnSlider.value(), rangeSlider.value());
}

// To minimise the use of fill(), call blackText()
function blackText(string, x, y, size) {
  textSize(size);
  fill(0);
  text(string, x, y);
  fill(255);
}

function draw() {
  clear();
  background(241, 241, 241);
  fill(255);
  
  blackText("Number Range " + str(rangeSlider.value()), rangeSlider.x, 28, 15);
  blackText("Columns " + str(columnSlider.value()), columnSlider.x, 28, 15);
  blackText("Time " + str(timeSlider.value()), timeSlider.x, 28, 15);

  if (state == "menu") {
    
    // Draw menu - boxes and text
    blackText("Welcome to p5.js Sort Visualiser!", 10, 115, 55);
    blackText("Made with ❤️ by Callum", 338, 850, 20);

    blackText("Callum's Sorts 🍋 ", 25, 190, 30);
    for (let i = 0; i < 3; i = i + 1) {
      let xOffset = 25 + 250 * i + 50 * i;
      rect(xOffset, 200, 250, 100);
      callumSorts[i][1] = xOffset;
      callumSorts[i][2] = 200;
      blackText(callumSorts[i][0], callumSorts[i][1] + 66, callumSorts[i][2] + 60, 30);
    }

    blackText("Quadratic Sorts 🧮", 25, 365, 30);
    for (let i = 0; i < 3; i = i + 1) {
      let xOffset = 25 + 250 * i + 50 * i;
      rect(xOffset, 375, 250, 100);
      quadSorts[i][1] = xOffset;
      quadSorts[i][2] = 375;
      blackText(quadSorts[i][0], quadSorts[i][1] + 66, quadSorts[i][2] + 60, 30);
    }

    for (let i = 0; i < 3; i = i + 1) {
      let xOffset = 25 + 250 * i + 50 * i;
      rect(xOffset, 500, 250, 100);
      quadSorts[i + 3][1] = xOffset;
      quadSorts[i + 3][2] = 500;
      blackText(quadSorts[i + 3][0], quadSorts[i + 3][1] + 66, quadSorts[i + 3][2] + 60, 30);
    }

    blackText("Pathetic Sorts 😞", 25, 665, 30);
    for (let i = 0; i < 3; i = i + 1) {
      let xOffset = 25 + 250 * i + 50 * i;
      rect(xOffset, 675, 250, 100);
      weirdSorts[i][1] = xOffset;
      weirdSorts[i][2] = 675;
      blackText(weirdSorts[i][0], weirdSorts[i][1] + 66, weirdSorts[i][2] + 60, 30);
    }
  }

  if (state == "update") {
    
    if (substate == 'Faith') {
        if (jesusY > -1400) {
          faithSort();
          return;
        } else {
          jesusY = 900;
          array.sort(function(a, b){return a - b});

          substate='FaithEnd'
        }
    }
    
    // Draw specific randomising menu
    if (randomMenu == true) {
      // Not Sorted
      fill(255, 0, 0, 255);
      rect(815, 95, 25, 25);
      blackText("N", 819, 116, 22.5);

      // A Little Sorted
      fill(255, 128, 0, 255);
      rect(815, 130, 25, 25);
      blackText("L", 821, 151, 22.5);
      
      // Half-Sorted
      fill(255, 255, 0, 255);
      rect(815, 165, 25, 25);
      blackText("H", 819, 186, 22.5);

      // Almost Sorted
      fill(128, 255, 0, 255);
      rect(815, 200, 25, 25);
      blackText("A", 820, 221, 22.5);
      
      // Reverse Sorted
      fill(0, 255, 0, 255);
      rect(815, 235, 25, 25);
      blackText("R", 819, 256, 22.5);
    }
    
    // Draw help menu
    if (helpMenu == true) {
      rect(10, 710, 880, 180);
      blackText("p5.js Sort Visualiser Help Menu", 275, 735, 25);
      fill(255, 0, 0);
      rect(25, 850, 25, 25);
      blackText("X  - Exit To Menu", 30, 871, 22.5);

      // Animation Button
      fill(0, 200, 255);
      rect(25, 800, 25, 25);
      blackText("A  - Toggle Animation", 30, 821, 22.5);

      // Start Button
      fill(0, 255, 120);
      rect(25, 750, 25, 25);
      blackText("S  - Start/Stop Sorting", 30, 771, 22.5);

      // 1-Iteration Button
      fill(255, 255, 0);
      rect(300, 750, 25, 25);
      blackText("1  - 1 Sort Iteration", 306, 771, 22.5);

      // Randomise Button
      fill(255, 165, 0);
      rect(300, 800, 25, 25);
      blackText("R  - Randomise Array Order", 304, 821, 22.5);

      // Help Button
      fill(255);
      rect(300, 850, 25, 25);
      blackText("?  - Help Menu", 306, 871, 22.5);
      
      // General Tips
      blackText("Tips!", 725, 735, 22.5)
      blackText("Try Setting the Number Range to\nsomething very low - You might see\nsomething interesting happen!", 635, 760, 15);
      blackText("Don't forget to check out the\nBogobogo and Faith sort!", 635, 825, 15);
      blackText("Have fun sorting!", 635, 870, 15);
    }
    
    // Upon detecting update, change accordingly
    if (columnSlider.value() != preCV || rangeSlider.value() != preRV) {
      if (hasSort == true) {clearTimeout(animTimeout);}
      generateArray(columnSlider.value(), rangeSlider.value());
      once = false;
      onceTwo = false;
    }
    if (timeSlider.value() != preTV) {
      once = false;
      onceTwo = false;
    }

    updateGraph();

    // Exit Button
    fill(255, 0, 0);
    rect(850, 25, 25, 25);
    blackText("X", 855, 46, 22.5);

    // Animation Button
    if (animBool == true) {
      fill(0, 200, 255);
    } else {
      fill(255);
    }
    rect(815, 25, 25, 25);
    blackText("A", 820, 46, 22.5);

    // Start Button
    if (isAnim == true) {
      fill(0, 255, 120);
    } else {
      fill(255, 0, 0);
    }
    rect(780, 25, 25, 25);
    blackText("S", 785, 46, 22.5);

    // 1-Iteration Button
    fill(255, 255, 0);
    rect(780, 60, 25, 25);
    blackText("1", 786, 81, 22.5);
    
    // Randomise Button
    fill(255, 165, 0);
    rect(815, 60, 25, 25);
    blackText("R", 819, 81, 22.5);
    
    // Help Button
    fill(255);
    rect(850, 60, 25, 25);
    blackText("?", 856, 81, 22.5);

    line(0, 700, 900, 700);
    
  }
  preCV = columnSlider.value();
  preRV = rangeSlider.value();
  preTV = timeSlider.value();
}

function generateArray(length, range) {
  print("Generated new array!");
  if (hasSort == true) {clearTimeout(animTimeout);}

  isAnim = false;
  ready = false;
  isSorted = false;
  counter = 0;

  // Shorten array to new length
  array.splice(length, preRV);

  // Create randomly generated data-array
  for (let i = 0; i < length; i++) {
    array[i] = int(random(range));
  }

  columnWidth = spaceX / array.length;

  // Shorten the 2D array to new length
  Indexes.splice(array.length, Indexes.length);

  // Create 2D Indexes array (for animation)
  for (let i = 0; i < array.length; i++) {
    Indexes[i] = [];
    Indexes[i][0] = i;
    Indexes[i][1] = i;
  }
}

function mousePressed() {
  
  // Detect which button was pressed then update substate
  if (state == "menu") {
    findButton(callumSorts, 0);
    findButton(quadSorts, 0);
    findButton(quadSorts, 3);
    findButton(weirdSorts, 0);
  }
  
  if (state == "update") {
    if (substate=='FaithEnd') {
      // Jesus Exit
      if (mouseX > 850 && mouseX < 875 && mouseY > 25 && mouseY < 50) {
        // pass
      } else {
        return;
      } 
    }
    // Exit Button Check
    if (mouseX > 850 && mouseX < 875 && mouseY > 25 && mouseY < 50) {
      state = "menu";
      if (hasSort == true) {clearTimeout(animTimeout);}
      isAnim = false;
    }
    // Animation Button Check
    if (mouseX > 815 && mouseX < 840 && mouseY > 25 && mouseY < 50) {
      if (animBool == true) {
        animBool = false;
      } else {
        animBool = true;
      }
    }
    // Start Button Check
    if (mouseX > 780 && mouseX < 805 && mouseY > 25 && mouseY < 50) {
      if (isAnim == true) {
        clearTimeout(animTimeout);
        isAnim = false;
      } else {
        animateArrays();
        isAnim = true;
      }
    }
    // 1-Iteration Sort Button Check
    if (mouseX > 780 && mouseX < 805 && mouseY > 60 && mouseY < 85) {
      once = true;
      animateArrays();
    }

    // Randomise / Shuffle Array
    if (mouseX > 815 && mouseX < 840 && mouseY > 60 && mouseY < 85) {
      if (randomMenu == true) {randomMenu = false;} else {randomMenu = true;}
    }
    // Help Menu
    if (mouseX > 850 && mouseX < 875 && mouseY > 60 && mouseY < 85) {
      if (helpMenu == true) {helpMenu = false;} else {helpMenu = true;}
    }
    
    // Detect button presses in the randomise array positons feature using mixArray()
    if (randomMenu == true) {
      if (mouseX > 815 && mouseX < 840) {
        if (mouseY > 95 && mouseY < 120) {
          mixArray('Not')
        }
        if (mouseY > 130 && mouseY < 155) {
          mixArray('Little')
        }
        if (mouseY > 165 && mouseY < 190) {
          mixArray('Half')
        }
        if (mouseY > 200 && mouseY < 225) {
          mixArray('Almost')
        }
        if (mouseY > 235 && mouseY < 260) {
          mixArray('Reverse')
        }      
      }
    }
  }
} 

function mixArray(type) {
  // Swap array positions and randomly choose which columns get swapped or not
  function randSort(chance) {
    array.sort(function(a, b){return a - b});
    for (let i=0; i<array.length; i=i+int(random(1, chance+1))) {
      j = int(random(array.length));
      [array[i], array[j]] = [array[j], array[i]];
    }  
  }
  
  if (isAnim == true) {
    clearTimeout(animTimeout);
    isAnim = false;
  } else {
    animateArrays();
    isAnim = true;
  }
  
  ready = false;
  isSorted = false;
  isAnim = false;
  counter = 0;
  
  for (let i = 0; i < array.length; i++) {
    Indexes[i] = [];
    Indexes[i][0] = i;
    Indexes[i][1] = i;
  }

  // Randomly sort array
  if (type == 'Not') {
    array = array.sort(() => Math.random() - 0.5)
  }
  if (type == 'Little') {
    randSort(1);
  }
  if (type == 'Half') {
    randSort(2);
  }
  if (type == 'Almost') {
    randSort(4);
  }
  if (type == 'Reverse') {
    array.sort(function(a, b){return a - b});
    array.reverse();
  }
}

// Find which sort button type was pressed in the menu
function findButton(sortType, ex) {
  for (let i = 0; i < 3; i++) {
    if (mouseX > sortType[i + ex][1] && mouseX < sortType[i + ex][1] + 250) {
      if (mouseY > sortType[i + ex][2] && mouseY < sortType[i + ex][2] + 100) {
        sortSelected = sortType[i + ex];
        substate = sortType[i + ex][0];
        generateArray(columnSlider.value(), rangeSlider.value());
        //algorithmState(); (currently unused)
        state = "update";
      }
    }
  }
}

/* Currently not used subprogram that is called upon each button press, and prints the selected substate
function algorithmState() {
  switch (substate) {
    case "Swallow":
      print("Swallow");
      break;

    case "Lemon":
      print("Lemon");
      break;

    case "Random":
      print("Random");
      break;

    case "Bubble":
      print("Bubble");
      break;

    case "Selection":
      print("Selection");
      break;

    case "Insertion":
      print("Insertion");
      break;

    case "Gnome":
      print("Gnome");
      break;

    case "Shaker":
      print("Shaker");
      break;

    case "OddEven":
      print("Odd/Even");
      break;

    case "Bogo":
      print("Bogo");
      break;

    case "Bogobogo":
      print("Bogobogo");
      break;

    case "Faith":
      print("Faith");
      break;
  }
}
*/

// Beginning of recursive code that will call the sort selected along with the setup for the program
function animateArrays() {
  
  ready = false;

  // Stop recursion if array is sorted
  if (checkIfSorted() == true && substate != 'Bogobogo') {
    print("Sorted");
    isSorted = true;
    return;
  }

  for (let i = 0; i < array.length; i++) {
    Indexes[i][1] = 0;
  }
  
  if (onceTwo == true) {
    once = false;
    onceTwo = false;
    return;
  }

  beginMS = millis();

  // Calculate which sort function to call by configuring the string
  changeName = substate;
  changeName = changeName.toLowerCase();
  changeName = changeName + "Sort";

  // Call appropriate sort with the string calculated above
  window[changeName]();
}

// Called at the beginning of each loop to check if sorting is still required
function checkIfSorted() {
  for (let i = 0; i < array.length; i++) {
    if (array[i] > array[i + 1]) {
      return false;
    }
  }
  return true;
}

// Call seperate subprogram if animate is on, else just call animateArrays again for non-animated sorting
function checkEnd() {
  if (animBool == true) {
    indexDifference();
  } else {
    hasSort=true
    animTimeout = setTimeout(animateArrays, timeSlider.value());
    // print("Sorting Display Sequence. Start."); // used in debugging, currently unused
  }
}

// Call animate arrays after timer and start measuring time for animation
function indexDifference() {
  // Flag for 1-iteration feature
  if (once == true) {
    onceTwo = true;
  }
  hasSort=true
  animTimeout = setTimeout(animateArrays, timeSlider.value());
  beginTime = millis();
  ready = true;
  // print("Animation Sequence. Start."); // used in debugging, currently unused
}

// Searching algorithm for finding either minimum or maximum value in array - find('min') currently unused
function find(value) {
  temp = array[0];
  if (value == "min") {
    for (let i = 1; i < array.length; i++) {
      if (array[i] < temp) {
        temp = array[i];
      }
    }
  }
  if (value == "max") {
    for (let i = 1; i < array.length; i++) {
      if (array[i] > temp) {
        temp = array[i];
      }
    }
  }
  return temp;
}

// Draw updated column positions and calculate animation positions of each animated column
function updateGraph() {
  for (let i = 0; i < array.length; i++) {
    // Scale height/y of columns with max value of array
    columnHeight = array[i] * (spaceY / find("max"));
    
    // Draw number values of each array item if help menu is off
    if (helpMenu != true) {
      blackText(str(array[i]), (25 + columnWidth * i) + columnWidth / 3, 700 + (columnWidth / 3), columnWidth / 3);
      blackText(str(Indexes[i][1]), (25 + columnWidth * i) + columnWidth / 3, (700 + (columnWidth / 3)*2), columnWidth / 3);
    }
      
    // Draw static, unchanged columns if change is not detected or animation is turned off
    if (animBool == false || ready == false || isSorted == true || (isAnim == false && onceTwo == false)) {
      fill(255, 255, 255, 100);
      rect(25 + columnWidth * i, 700 - columnHeight, columnWidth, columnHeight);
      continue;
    }

    // If Indexes is empty for the i position of array, draw static columns else calculate positions
    if (Indexes[i][1] == 0) {
      fill(255, 255, 255, 100);
      rect(25 + columnWidth * i, 700 - columnHeight, columnWidth, columnHeight);
    } else {
      oldX = 25 + (columnWidth * (i - Indexes[i][1]));
      newX = 25 + (columnWidth * i);
      distanceToTravel = newX - oldX;

      // Draw red if columns is travelling backwards | draw green if column is travelling forwards
      if (distanceToTravel > 0) {
        fill(0, 255, 0, 200);
      } else {
        fill(255, 0, 0, 200);
      }    

      currentTime = millis();
      elapsed = currentTime - beginTime;

      // Calculate column positions using the elapsed time as a scale for animation
      rect(oldX + (elapsed / timeSlider.value()) * distanceToTravel, 700 - columnHeight, columnWidth, columnHeight);
    }
  }
}

// Reverse bubble sort
function swallowSort() {
  for (let i = array.length-1; i >= 0; i--) {
    if (array[i] < array[i-1]) {   
      [array[i], array[i-1]] = [array[i-1], array[i]];
      // Calculate change in array indexes and update Indexes[][] with these changes
      Indexes[i][1] = 1;
      Indexes[i-1][1] = -1;
      break;
    }
  }
  checkEnd();
}

// Sorting algorithms designed after the shape of a lemon
function lemonSort(){
  mid = int(array.length / 2);
  for (let i=0; i < mid; i++) {
    if (array[i] > array[i+1]) {
      [array[i], array[i+1]] = [array[i+1], array[i]];
      Indexes[i][1] = -1;
      Indexes[i+1][1] = 1;
      break;
    }
  }
  for (let i=array.length-1; i >= mid; i--) {
    if (array[i] < array[i-1]) {   
      [array[i], array[i-1]] = [array[i-1], array[i]];
      Indexes[i][1] = 1;
      Indexes[i-1][1] = -1;
      break;
    }
  }
  checkEnd();
}

// Choose a random sorting algorithm per iteration (that isn't in the pathetic category)
function randomSort() {
  counter=0;
  typeSort = int(random(0, 2));
  let sortChosen;
  if (typeSort == 0) {
    sortChosen = callumSorts[int(random(2))][0];
  } else if (typeSort == 1) {
    sortChosen = quadSorts[int(random(6))][0];
  }
  sortChosen = sortChosen.toLowerCase();
  sortChosen = sortChosen + "Sort";
  window[sortChosen]();
}

function bubbleSort() {
  for (let i = 0; i < array.length; i++) {
    if (array[i] > array[i+1]) {
      [array[i], array[i+1]] = [array[i+1], array[i]];
      Indexes[i][1] = -1;
      Indexes[i+1][1] = 1;
      break;
    }
  }
  checkEnd();
}

function selectionSort() {
  let min = counter;
  for (let j = counter+1; j < array.length; j++) {
    if (array[min] > array[j]) {
      min = j;
    }
  }
  if (min != counter) {
    [array[counter], array[min]] = [array[min], array[counter]];
    Indexes[counter][1] = counter - min;
    Indexes[min][1] = min - counter;
  }
  checkEnd();
  counter = counter+1;
}

function insertionSort() {
  counter = counter+1;
  let key = array[counter];
  let j = counter-1;
  while (j >= 0 && array[j] > key) {
    array[j+1] = array[j];
    Indexes[j+1][1] = (j+1)-j
    j=j-1;
  }
  array[j+1] = key;
  Indexes[j+1][1] = (j+1)-counter;
  checkEnd();
}

function gnomeSort() {
  i=0;
  for (let j = 0; j < array.length-1; j++) {
    if (i==0) {
      i+=1;
    }
    if (array[i] >= array[i-1]) {
      i+=1;
    } else {
      [array[i], array[i-1]] = [array[i-1], array[i]];
      Indexes[i][1] = 1;
      Indexes[i-1][1] = -1;
      break;
    }
  }
  checkEnd();
}

function shakerSort() { 
  for (let i = 0; i < array.length-1; i++) {
    if (array[i] > array[i+1]) {
      let temp = array[i];
      array[i] = array[i+1];
      array[i+1] = temp;
      Indexes[i][1] = -1;
      Indexes[i+1][1] = 1;
      break;
    }
  }
  for (let j = array.length-1; j >= 0; j--) {
    if (array[j-1] > array[j]) {
      let temp = array[j];
      array[j] = array[j-1];
      array[j-1] = temp;
      Indexes[j][1] = 1;
      Indexes[j-1][1] = -1;
      break;
    }
  }
  checkEnd();
}

function oddevenSort() {
  oddSortedAlready = false;
  for (let i=1; i < array.length - 1; i+=2) {
    if (array[i] > array[i+1]) {
      [array[i], array[i+1]] = [array[i+1], array[i]];
      Indexes[i][1] = -1;
      Indexes[i+1][1] = 1
      turn = 1;
      oddSortedAlready = true;
      break;
    }
  }

  if (oddSortedAlready == false) {
    for (let i = 0; i < array.length - 1; i+=2) {
      if (array[i] > array[i+1]) {
        [array[i], array[i+1]] = [array[i+1], array[i]];
        Indexes[i][1] = -1;
        Indexes[i+1][1] = 1;
        turn = 0;
        break;
      }
    }
  }
  checkEnd();
}

function bogoSort(){
  let rand1 = int(random(array.length));
  let rand2 = int(random(array.length));
  [array[rand1], array[rand2]] = [array[rand2], array[rand1]];
  Indexes[rand1][1] = rand1 - rand2;
  Indexes[rand2][1] = rand2 - rand1;
  checkEnd();
}

function bogobogoSort() {
  bogoSort();
}

function faithSort() {
  
  image(img, 120, jesusY);
  jesusY-=1;
      
  // Display text incrementely throughout jesus image animation
  if (jesusY < 825) {
     blackText("Dear Lord", 10, 75, 20);
  }  
  if (jesusY < 525) {
      blackText("Thank you for this array that you have given us, blessed be thy name.", 10, 125, 20)
  }
  if (jesusY < 225) {
      blackText("In all your might, sort this array, such that each element is equal or greater than the previous", 10, 175, 20);
      blackText("one so we may continue to compute on this data.", 10, 200, 20);
  }
  if (jesusY < -125) {
      blackText("In your everlasting glory,", 10, 250, 20);
  }
  if (jesusY < -425) {
      blackText("Amen.", 10, 300, 20);
  }
}

// Finished 3/6/2022. 🎉
