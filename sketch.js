// Welcome to p5.js Sort Visualiser!

// Main Data Array
let array = [];

// Animation Arrays
let Indexes = []; // Index difference between pastArray and Array
let difference = [];

// Strings + Positions for Menu Buttons
let logSorts = [
  ["Quick", 0, 0],
  ["Merge", 0, 0],
  ["Heap", 0, 0],
];

let quadSorts = [
  ["Bubble", 0, 0],
  ["Selection", 0, 0],
  ["Insertion", 0, 0],
  ["Gnome", 0, 0],
  ["Shaker", 0, 0],
  ["Pancake", 0, 0],
];

let weirdSorts = [
  ["Bitonic", 0, 0],
  ["Radix", 0, 0],
  ["Shell", 0, 0],
  ["Comb", 0, 0],
  ["Bogo", 0, 0],
  ["Stooge", 0, 0],
];

let state = "menu";
let substate = "none";

let time = 100;
let animTime;
let animBool = true;
let ready = false;
let beginTime;

let sortSelected = "none";

// Space used for columns
let spaceX = 850;
let spaceY = 600;

let columnWidth, columnHeight;

let isSorted = false;

let changeName;

let rangeSlider, columnSlider, timeSlider;

let counter = 0;

// Previous slider values for update detection
let preCV, preRV, preTV;

function setup() {
  createCanvas(900, 900);

  generateArray(10, 100);

  rangeSlider = createSlider(0, 1000, 100);
  rangeSlider.position(20, 30);
  columnSlider = createSlider(4, 250, 0);
  columnSlider.position(180, 30);
  timeSlider = createSlider(0, 10000, 100);
  timeSlider.position(340, 30);

  animTime = timeSlider.value();
}

// To minimise the use of fill()
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

  let rV = rangeSlider.value();
  let cV = columnSlider.value();
  let tV = timeSlider.value();

  blackText("Number Range", rangeSlider.x, 28, 15);
  blackText("Columns", columnSlider.x, 28, 15);
  blackText("Time", timeSlider.x, 28, 15);

  if (state == "menu") {
    blackText("Welcome to p5.js Sort Visualiser!", 10, 115, 60);
    blackText("Made with ❤️ by Callum", 338, 850, 20);

    blackText("Logarithmic Sorts", 25, 190, 30);
    for (let i = 0; i < 3; i = i + 1) {
      let xOffset = 25 + 250 * i + 50 * i;
      rect(xOffset, 200, 250, 100);
      logSorts[i][1] = xOffset;
      logSorts[i][2] = 200;
      blackText(logSorts[i][0], logSorts[i][1] + 100, logSorts[i][2] + 60, 30);
    }

    blackText("Quadratic Sorts", 25, 365, 30);
    for (let i = 0; i < 3; i = i + 1) {
      let xOffset = 25 + 250 * i + 50 * i;
      rect(xOffset, 375, 250, 100);
      quadSorts[i][1] = xOffset;
      quadSorts[i][2] = 375;
      blackText(
        quadSorts[i][0],
        quadSorts[i][1] + 100,
        quadSorts[i][2] + 60,
        30
      );
    }

    for (let i = 0; i < 3; i = i + 1) {
      let xOffset = 25 + 250 * i + 50 * i;
      rect(xOffset, 500, 250, 100);
      quadSorts[i + 3][1] = xOffset;
      quadSorts[i + 3][2] = 500;
      blackText(
        quadSorts[i + 3][0],
        quadSorts[i + 3][1] + 100,
        quadSorts[i + 3][2] + 60,
        30
      );
    }

    blackText("Weird Sorts", 25, 665, 30);
    for (let i = 0; i < 3; i = i + 1) {
      let xOffset = 25 + 250 * i + 50 * i;
      rect(xOffset, 675, 250, 100);
      weirdSorts[i][1] = xOffset;
      weirdSorts[i][2] = 675;
      blackText(
        weirdSorts[i][0],
        weirdSorts[i][1] + 100,
        weirdSorts[i][2] + 60,
        30
      );
    }
  }

  // Update the positions of the graph and add the line
  if (state == "update") {
    
    // Exit Button
    fill(255, 0, 0);
    rect(850, 25, 25, 25);
    blackText("X", 855, 46, 22.5);
    fill(255);
    
    // Animation Button
    if (animBool == true) {
      fill(0, 255, 120);

    }
    else {
      fill(255);
    }
    
    // Animate Button
    rect(815, 25, 25, 25);
    blackText("A", 820, 46, 22.5);
    fill(255);

    if (cV != preCV || rV != preRV) {
      clearTimeout(animTimeout);
      generateArray(cV, rV);
      algorithmState();
    }

    if (tV != preTV) {
      clearTimeout(animTimeout);
      algorithmState();
      animTime = timeSlider.value();
    }
    updateGraph();
    line(0, 700, 900, 700);
  }

  preCV = cV;
  preRV = rV;
  preTV = tV;
}

function mousePressed() {
  if (state == "menu") {
    findButton(logSorts, 0);
    findButton(quadSorts, 0);
    findButton(quadSorts, 3);
    findButton(weirdSorts, 0);
  }
  if (state == "update") {
    if (mouseX > 850 && mouseX < 875 && mouseY > 25 && mouseY < 50) {
      state = "menu";
      clearTimeout(animTimeout)
    }
    if (mouseX > 815 && mouseX < 840 && mouseY > 25 && mouseY < 50) {
      if (animBool == true) {
        animBool = false;
      } else {
        animBool = true;
      }
    }
   }
}

function algorithmState() {
  print("Algorithm State called")
  switch (substate) {
    case "Quick":
      print("Quick");
      break;

    case "Merge":
      print("Merge");
      break;

    case "Heap":
      print("2");
      break;

    case "Bubble":
      animateArrays();
      print("Bubble");
      break;

    case "Selection":
      animateArrays();
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

    case "Pancake":
      print("Pancake");
      break;

    case "Bitonic":
      print("Bitonic");
      break;

    case "Radix":
      print("Radix");
      break;

    case "Shell":
      print("Shell");
      break;
  }
}

// Find which sort button type was pressed in the menu
function findButton(sortType, ex) {
  for (let i = 0; i < 3; i++) {
    if (mouseX > sortType[i + ex][1] && mouseX < sortType[i + ex][1] + 250) {
      if (mouseY > sortType[i + ex][2] && mouseY < sortType[i + ex][2] + 100) {
        sortSelected = sortType[i + ex];
        substate = sortType[i + ex][0];
        algorithmState();
        state = "update";
      }
    }
  }
}

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

function generateArray(length, range) {
  print("Generated new array!");
  
  isSorted = false;
  counter = 0;

  // Create randomly generated data-array
  for (let i = 0; i < length; i++) {
    array[i] = int(random(range));
  }

  array.splice(length, preRV);
  columnWidth = spaceX / array.length;

  // Create 2D Indexes array (for animation)
  for (let i = 0; i < array.length; i++) {
    Indexes[i] = [];
    Indexes[i][0] = i;
    Indexes[i][1] = i;
  }

  // Shorten the 2D array to new length
  Indexes.splice(array.length, Indexes.length);
}

// Sort numbers then update current index
function bubbleSort() {
  for (let i = 0; i < array.length; i++) {
    if (array[i] > array[i + 1]) {
      [array[i], array[i + 1]] = [array[i + 1], array[i]];

      // Swap identifiers & Update animation array
      if (animBool == true) {
        [Indexes[i][1], Indexes[i + 1][1]] = [Indexes[i + 1][1], Indexes[i][1]];
      }
    }
  }
  checkEnd();
}

function selectionSort() {
  print("Selection sort " + counter)
  i = counter;
  for (let j = i + 1; j < array.length; j++) {
    if (array[counter] > array[j]) {
      counter = j;
    }
  }
  if (i != counter) {
    
    [array[i], array[counter]] = [array[counter], array[i]];
    
    if (animBool == true) {
      [Indexes[i][1], Indexes[counter][1]] = [Indexes[counter][1], Indexes[i][1]];
    }
    
  }
  checkEnd();
  counter=counter+1;
}

function checkEnd() {
  
  if (animBool == true) {
    updateIndexes(3); 
    
  } else {
    
    checkIfSorted()

    if (isSorted == false) {
      animTimeout = setTimeout(window[changeName], animTime);
      ready = true;
      print('Animation Sequence. Start.');
    } else {
      print('Algorithm Sorted. Stopping.') 
    }    
  }
}

function indexDifference() {
  for (let i = 0; i < array.length; i++) {
    // Difference = current index - previous index
    difference[i] = Indexes[i][3] - Indexes[i][2];
    
    // Now that the prep has finished, we need to set the timer for the animation
    // we're also ready to updateGraph()
    
  }
  
  checkIfSorted()
    
  if (isSorted == false) {
    beginTime = millis();
    animTimeout = setTimeout(animateArrays, animTime);
    ready = true;
    print('Animation Sequence. Start.');
  } else {
    print('Algorithm Sorted. Stopping.') 
  }
}

// Called every second before sort and after each sort.
function updateIndexes(column) {
  // Pre-sort
  if (column == 2) {
    // Update indexes column [index, id, pI, cI]
    for (let i = 0; i < array.length; i++) {
      // Value = array[Indexes[i][1]]
      // PreviousIndex = Value located at identifier position in array
      Indexes[i][2] = Indexes[i][1];
    }
    // Call bubble sort - Mid-sorting
    window[changeName]();
    
    // Post-sort
  } else if (column == 3) {
    // Update identifier with new position (where the value has gone)
    for (let i = 0; i < array.length; i++) {
      Indexes[i][3] = Indexes[i][1];
    }
    indexDifference();
  }
}

// Redefine arrays for animation sequence
function animateArrays() {
  
  print("Animate Arrays!")
  print("Animbool is " + animBool)
  
  changeName = substate;
  changeName = changeName.toLowerCase();
  changeName = changeName + "Sort";

  if (animBool == false) {
    ready=false;
    print("AnimateBool is false")
    window[changeName]();
  } else {
    print("AnimateBool is true")
    // Calculate previous vs current index positions of numbers
    // Update current index positions (before bubble sort)

    // Pre-sorting
    ready=false;
    updateIndexes(2);
  }
  
}

function checkIfSorted() {
  for (let i = 0; i < array.length; i++) {
    if (array[i] > array[i + 1]) {
      isSorted = false;
      return;
    }
  }
  isSorted = true;
}

function updateGraph() {
  
  // Rect Formula: rect(25 + columnWidth * i, 700 - columnHeight, columnWidth, columnHeight);

  fill(255);

  for (let i = 0; i < array.length; i++) {
    
    // Scale Y of columns with max value of array
    columnHeight = array[i] * (spaceY / find("max"));
    
    if (animBool == false || ready == false) {
      rect(25+columnWidth*i, 700 - columnHeight, columnWidth, columnHeight)     
      continue;
    }
 
    if (difference[i] == 0) {
      rect(25 + columnWidth * i, 700 - columnHeight, columnWidth, columnHeight);
    }
    else {

    oldX = 25 + columnWidth * Indexes[i][3];
    newX = 25 + columnWidth * Indexes[i][2];
    distanceToTravel = newX - oldX;

    // formula = oldX + (elapsedTime / speed) * distance

    currentTime = millis();
    elapsed = currentTime - beginTime;
      
    if (newX - oldX > 0) {
      fill(0, 255, 0)
    } else {
      fill(255, 0, 0)
    }
      
    //print("I am " + (oldX + (elapsed / animTime) * distanceToTravel) + " out of " + oldX);

    rect(
      oldX + (elapsed / animTime) * distanceToTravel, 700 - columnHeight, columnWidth, columnHeight);
    }
  }
}