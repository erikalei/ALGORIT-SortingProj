const container1 = document.getElementById("arrayContainer1");
const container2 = document.getElementById("arrayContainer2");
let array1 = [];
let array2 = [];
let selectedBars1 = [];
const arraySize = 10;
let currentPlayer = 1; // 1 = Player 1, 2 = Bot

// Define the color palette
const colorPalette = [
    "#001F26", "#005F6B", "#008D8A", "#C9DBB2", "#F4C95D",
    "#F49D26", "#D95B13", "#B9351F", "#A31E1E"
];

// Generate a random array for both players
function generateArray() {
    array1 = [];
    array2 = [];
    for (let i = 1; i <= arraySize; i++) {
        array1.push(Math.floor(Math.random() * 100) + 10);
        array2.push(Math.floor(Math.random() * 100) + 10);
    }
    renderArray(container1, array1, 1);
    renderArray(container2, array2, 2);
    currentPlayer = 1;
}

// Render array as bars with colors from the palette
function renderArray(container, array, player) {
    container.innerHTML = "";
    const maxBarHeight = 280;
    const maxValue = Math.max(...array);
    const scaleFactor = maxBarHeight / maxValue;

    array.forEach((value, index) => {
        const bar = document.createElement("div");
        bar.classList.add("bar");
        bar.style.height = `${value * scaleFactor}px`;
        bar.dataset.index = index;

        // Assign a color from the palette
        const colorIndex = Math.floor(index / arraySize * colorPalette.length);
        bar.style.backgroundColor = colorPalette[colorIndex];

        // Add drag and drop functionality for Player 1
        if (player === 1) {
            bar.draggable = true;
            bar.addEventListener("dragstart", (e) => dragStart(e, index));
            bar.addEventListener("dragover", (e) => dragOver(e));
            bar.addEventListener("drop", (e) => drop(e, index));
        }

        container.appendChild(bar);
    });
}

// Drag Start (Player 1)
function dragStart(e, index) {
    e.dataTransfer.setData("index", index);
}

// Drag Over (Player 1)
function dragOver(e) {
    e.preventDefault();
}

// Drop (Player 1)
function drop(e, index) {
    e.preventDefault();
    const fromIndex = e.dataTransfer.getData("index");
    if (fromIndex !== index) {
        // Swap bars
        [array1[fromIndex], array1[index]] = [array1[index], array1[fromIndex]];
        renderArray(container1, array1, 1);
        if (checkIfSorted(array1)) {
            alert("🎉 Player 1 wins!");
        }
    }
}

// Swap bars in Player 1's array
function swapBars() {
    const [index1, index2] = selectedBars1;
    if (array1[index1] !== array1[index2]) {
        let temp = array1[index1];
        array1[index1] = array1[index2];
        array1[index2] = temp;
    }

    selectedBars1.forEach(index => {
        container1.children[index].style.border = "none";
    });

    selectedBars1.length = 0;
    renderArray(container1, array1, 1);

    if (checkIfSorted(array1)) {
        alert("🎉 Player 1 wins!");
        return;
    }

    currentPlayer = 2;
    setTimeout(botMove, 1000); // Bot's turn after 1 second
}

// **Bot Logic (Player 2)**
function botMove() {
    let swapsMade = false;

    for (let i = 0; i < array2.length - 1; i++) {
        if (array2[i] > array2[i + 1]) {
            let temp = array2[i];
            array2[i] = array2[i + 1];
            array2[i + 1] = temp;
            swapsMade = true;
            break; // Swap only one misplaced bar per turn
        }
    }

    renderArray(container2, array2, 2);

    if (checkIfSorted(array2)) {
        alert("🤖 The bot wins!");
        return;
    }

    currentPlayer = 1; // Player 1's turn again
}

// Check if an array is sorted
function checkIfSorted(array) {
    return array.every((value, index) => index === 0 || array[index - 1] <= value);
}

// Shuffle arrays
function shuffleArray() {
    array1.sort(() => Math.random() - 0.5);
    array2.sort(() => Math.random() - 0.5);
    renderArray(container1, array1, 1);
    renderArray(container2, array2, 2);
}

// Initialize game
generateArray();
