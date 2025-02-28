const container1 = document.getElementById("arrayContainer1");
const container2 = document.getElementById("arrayContainer2");
let array1 = [];
let array2 = [];
let selectedBars1 = [];
let selectedBars2 = [];
const arraySize = 10;
let currentPlayer = 1; // 1 = Player 1, 2 = Player 2

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

// Render array as bars
function renderArray(container, array, player) {
    container.innerHTML = "";
    array.forEach((value, index) => {
        const bar = document.createElement("div");
        bar.classList.add("bar");
        bar.style.height = `${value * 3}px`;
        bar.dataset.index = index;
        container.appendChild(bar);

        // Add click event for players
        bar.addEventListener("click", () => {
            if (currentPlayer === player) selectBar(index, player);
        });
    });
}

// Select and swap bars
function selectBar(index, player) {
    let selectedBars = player === 1 ? selectedBars1 : selectedBars2;
    let array = player === 1 ? array1 : array2;
    let container = player === 1 ? container1 : container2;

    if (selectedBars.length < 2) {
        selectedBars.push(index);
        const bar = container.children[index];
        bar.style.backgroundColor = "red";
        
        if (selectedBars.length === 2) {
            swapBars(player);
        }
    }
}

// Swap bars in the array
function swapBars(player) {
    let selectedBars = player === 1 ? selectedBars1 : selectedBars2;
    let array = player === 1 ? array1 : array2;
    let container = player === 1 ? container1 : container2;

    const [index1, index2] = selectedBars;
    if (array[index1] !== array[index2]) {
        let temp = array[index1];
        array[index1] = array[index2];
        array[index2] = temp;

        container.children[index1].style.height = `${array[index1] * 3}px`;
        container.children[index2].style.height = `${array[index2] * 3}px`;
    }

    selectedBars.forEach(index => {
        container.children[index].style.backgroundColor = "blue";
    });
    selectedBars.length = 0;

    if (checkIfSorted(array)) {
        alert(`Player ${player} wins!`);
        return;
    }

    currentPlayer = currentPlayer === 1 ? 2 : 1;
}

// Check if sorted
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

// Hint function
function giveHint(player) {
    let array = player === 1 ? array1 : array2;
    let container = player === 1 ? container1 : container2;
    for (let i = 0; i < array.length - 1; i++) {
        if (array[i] > array[i + 1]) {
            container.children[i].style.backgroundColor = "green";
            container.children[i + 1].style.backgroundColor = "green";
            setTimeout(() => {
                container.children[i].style.backgroundColor = "blue";
                container.children[i + 1].style.backgroundColor = "blue";
            }, 1000);
            return;
        }
    }
}

// Initialize
generateArray();

// Add buttons
document.body.insertAdjacentHTML("beforeend", `
    <button onclick="giveHint(1)">Hint Player 1</button>
    <button onclick="giveHint(2)">Hint Player 2</button>
`);
