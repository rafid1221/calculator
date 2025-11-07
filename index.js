const tempDisplay = document.querySelector("#temp");
const resultDisplay = document.querySelector("#result");
const historyParent = document.querySelector("ul");

const historyList = [];
const operations = ["+", "-", "/", "*"];
let tempInput = "0";

// Safely calculate results
const calcResults = (saveToHistory = false) => {
  const lastChar = tempInput[tempInput.length - 1];

  // Don't evaluate if last char is an operator
  if (operations.includes(lastChar)) {
    resultDisplay.textContent = " ";
    return;
  }

  // Check balanced parentheses
  let balance = 0;
  for (let char of tempInput) {
    if (char === "(") balance++;
    else if (char === ")") balance--;
    if (balance < 0) break;
  }
  if (balance !== 0) {
    resultDisplay.textContent = " ";
    return;
  }

  // Add to history if needed
  if (saveToHistory) {
    historyList.push(tempInput);
    historyParent.innerHTML = "";
    historyList.forEach(item => {
      const li = document.createElement("li");
      li.innerHTML = `<div class="p-5 pb-0 text-white/50 text-right text-3xl">${item}</div>`;
      historyParent.appendChild(li);
    });
  }

  // Replace operators and functions for eval
  const expr = tempInput
    .replace(/x/g, "*")
    .replace(/√/g, "Math.sqrt")
    .replace(/sin/g, "Math.sin");

  try {
    resultDisplay.textContent = eval(expr);
  } catch (e) {
    resultDisplay.textContent = " ";
  }
};

// Rerender temp display
const _reRender = () => {
  tempDisplay.textContent = tempInput;
  calcResults();
};

// Initialize
_reRender();

// Handle button clicks
const handleButtonPress = (value) => {

  // ---- Special Buttons ----
  if (value === "AC") {
    tempInput = "0";
    tempDisplay.textContent = "";
    resultDisplay.textContent = "0";
    return;
  }

  if (value === "DEL" || value === "⌫") {
    if (tempInput.length > 1) {
      tempInput = tempInput.slice(0, -1);
    } else {
      tempInput = "0";
    }
    _reRender();
    return;
  }

  if (value === "SQRT" || value === "√") {
    // Append square root symbol
    if (tempInput === "0") {
        tempInput = "√(";
    } else {
        tempInput += "√(";
    }
    _reRender();
    return;
  }

  if (value === "SIN" || value === "sin") {
    // Append sine function
    if (tempInput === "0") {
        tempInput = "sin(";
    } else {
        tempInput += "sin(";
    }
    _reRender();
    return;
  }

  if (value === "-+") {  // plus-minus toggle
    const parts = tempInput.split(/([\+\-\*\/\(\)])/);
    const lastPart = parts.pop();
    if (!lastPart) return;

    let newPart;
    if (lastPart.startsWith("-")) {
      newPart = lastPart.slice(1); // remove minus
    } else if (lastPart === "0") {
      newPart = "0"; // no change
    } else {
      newPart = "-" + lastPart;
    }

    parts.push(newPart);
    tempInput = parts.join("");
    _reRender();
    return;
  }

  if (value === ".") { // decimal handling
    const lastNumber = tempInput.split(/[\+\-\*\/\(\)]/).pop();
    if (lastNumber.includes(".")) return;
  }

  // ---- Regular Input Handling ----
  const isOperation = operations.includes(value);
  const displayText = tempDisplay.innerText;

  if (displayText === "0" && !isOperation) {
    tempInput = value;
    _reRender();
    return;
  }

  if (isOperation && displayText === resultDisplay.innerText) {
    tempInput = resultDisplay.innerText + value;
    _reRender();
    return;
  }

  tempInput = displayText + value;
  _reRender();
};

// Scroll behavior
const scrollable = document.querySelector("#scrollable");
function scrollToBottom() {
  scrollable.scrollTop = scrollable.scrollHeight;
}
scrollToBottom();
const observer = new MutationObserver(scrollToBottom);
observer.observe(scrollable, { childList: true, subtree: true });
