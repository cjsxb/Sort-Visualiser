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

let beginMS;

let dif;

let once = false;

// Previous slider values for update detection
let preCV, preRV, preTV, preDV;

function setup() {
  createCanvas(900, 900);

  // Min, Max, Default, Step (Optional)
  rangeSlider = createSlider(20, 1000, 100);
  rangeSlider.position(20, 30);
  columnSlider = createSlider(4, 250, 5);
  columnSlider.position(180, 30);
  timeSlider = createSlider(0, 3000, 10000);
  timeSlider.position(340, 30);

  generateArray(columnSlider.value(), rangeSlider.value());
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
    if (columnSlider.value() != preCV || rangeSlider.value() != preRV) {
      clearTimeout(animTimeout);
      generateArray(columnSlider.value(), rangeSlider.value());
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
    fill(0, 255, 120);
    rect(780, 25, 25, 25);
    blackText("S", 785, 46, 22.5);

    // Generate Button
    fill(255, 165, 0);
    rect(745, 25, 25, 25);
    blackText("1", 750, 46, 22.5);

    line(0, 700, 900, 700);
  }
  preCV = columnSlider.value();
  preRV = rangeSlider.value();
  preTV = timeSlider.value();
}

function generateArray(length, range) {
  print("Generated new array!");

  isSorted = false;
  counter = 0;

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
    Indexes[i][2] = 0;
  }

  print("GEN ARRAY: " + array);
  print("GEN INDEXES " + Indexes);

  // Shorten the 2D array to new length
  Indexes.splice(array.length, Indexes.length);
}

function mousePressed() {
  if (state == "menu") {
    findButton(logSorts, 0);
    findButton(quadSorts, 0);
    findButton(quadSorts, 3);
    findButton(weirdSorts, 0);
  }
  if (state == "update") {
    // Exit Button Check
    if (mouseX > 850 && mouseX < 875 && mouseY > 25 && mouseY < 50) {
      state = "menu";
      clearTimeout(animTimeout);
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
      animateArrays();
    }
    // Randomise Button Check
    if (mouseX > 745 && mouseX < 770 && mouseY > 25 && mouseY < 50) {
      once = true;
      animateArrays();
    }
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
        algorithmState();
        state = "update";
      }
    }
  }
}

function algorithmState() {
  print("Algorithm State called");
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
      animateArrays();
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

// Calculate Pre-Sort Variables and check where to go next
function animateArrays() {
  
  ready = false;

  // Stop recursion if array is sorted
  if (checkIfSorted() == true) {
    print("Sorted");
    isSorted = true;
    return;
  }

  for (let i = 0; i < array.length; i++) {
    Indexes[i][2] = 0;
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

function checkEnd() {
  // If animation is toggled on, it will calculate difference[i] and timeout.
  // If otherwise, just call now as we are ready.
  if (animBool == true) {
    indexDifference();
  } else {
    animTimeout = setTimeout(animateArrays, timeSlider.value());
    print("Sorting Display Sequence. Start.");
  }
}

function indexDifference() {
  // We're ready.
  animTimeout = setTimeout(animateArrays, timeSlider.value());
  beginTime = millis();
  ready = true;
  print("Animation Sequence. Start.");
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

function updateGraph() {
  // Rect Formula: rect(25 + columnWidth * i, 700 - columnHeight, columnWidth, columnHeight);

  for (let i = 0; i < array.length; i++) {
    // Scale Y of columns with max value of array
    columnHeight = array[i] * (spaceY / find("max"));
    
    blackText(str(array[i]), (25 + columnWidth * i) + columnWidth / 3, 700 + columnWidth / 3, columnWidth / 3);
    blackText((Indexes[i][1]), (25 + columnWidth * i) + columnWidth / 3, (700 + (columnWidth / 3)*2), columnWidth / 3);
    blackText((Indexes[i][2]), (25 + columnWidth * i) + columnWidth / 3, (700 + (columnWidth / 3)*3), columnWidth / 3);

    if (animBool == false || ready == false || isSorted == true) {
      fill(255, 255, 255, 100);
      rect(25 + columnWidth * i, 700 - columnHeight, columnWidth, columnHeight);
      continue;
    }

    if (Indexes[i][2] == 0) {
      fill(255, 255, 255, 100);
      rect(25 + columnWidth * i, 700 - columnHeight, columnWidth, columnHeight);
    } else {
      
      // oldX = Array position (i) - change of index ([i][2])
      oldX = 25 + (columnWidth * (i - Indexes[i][2]));
      // newX = Array position(i)
      newX = 25 + (columnWidth * i);
      distanceToTravel = newX - oldX;

      if (distanceToTravel > 0) {
        fill(0, 255, 0);
      } else {
        fill(255, 0, 0);
      }    

      currentTime = millis();
      elapsed = currentTime - beginTime;

      rect(oldX + (elapsed / timeSlider.value()) * distanceToTravel, 700 - columnHeight, columnWidth, columnHeight);
    }
  }
}

// Sort numbers then update current index
function bubbleSort() {
  for (let i = 0; i < array.length; i++) {
    if (array[i] > array[i + 1]) {
      [array[i], array[i + 1]] = [array[i + 1], array[i]];
      
      Indexes[i][2] = Indexes[i+1][1] - Indexes[i][1];
      Indexes[i+1][2] = Indexes[i][1] - Indexes[i+1][1];

      // Swap indexes
      [Indexes[i][1], Indexes[i+1][1]] = [Indexes[i+1][1], Indexes[i][1]];
    
    }
  }
  checkEnd();
}

function selectionSort() {
  let min = counter;
  for (let j = counter + 1; j < array.length; j++) {
    if (array[min] > array[j]) {
      min = j;
    }
  }
  if (min != counter) {
    [array[counter], array[min]] = [array[min], array[counter]];

    // OMFG
    Indexes[counter][2] = counter - min;
    Indexes[min][2] = min - counter;

    // Swap Indexes
    //[Indexes[counter][1], Indexes[min][1]] = [Indexes[min][1], Indexes[counter][1]];
  }
  checkEnd();
  counter = counter + 1;
}

function insertionSort() {
  counter = counter + 1;
  let key = array[counter];
  let j = counter - 1;
  while (j >= 0 && array[j] > key) {
    array[j + 1] = array[j];
    Indexes[j + 1][3] = Indexes[j][3];
    j = j - 1;
  }
  array[j + 1] = key;
  Indexes[j + 1][3] = key;
  checkEnd();
}
