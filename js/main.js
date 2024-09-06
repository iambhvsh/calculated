document.documentElement.setAttribute("mode", "ios");

// Initialize theme on DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  let t = document.getElementById("utterances-container"),
      e = document.getElementById("loading-spinner");
  setTimeout(() => { e.style.display = "none"; t.style.display = "block"; }, 5000);
});

document.addEventListener("DOMContentLoaded", () => {
  let t = document.querySelectorAll(".themeToggle"),
      e = window.matchMedia("(prefers-color-scheme: dark)");

  // Load and apply the theme
  function applyTheme() {
    let savedTheme = localStorage.getItem("theme") || (e.matches ? "dark" : "light");
    document.body.classList.toggle("dark", savedTheme === "dark");
    let ionContents = document.querySelectorAll("ion-content");
    ionContents.forEach(content => content.setAttribute("color", savedTheme === "dark" ? "dark" : "light"));
    t.forEach(button => button.checked = savedTheme === "dark");
  }

  // Function to toggle the theme and handle reload
  function toggleTheme(newTheme) {
    let currentTheme = localStorage.getItem("theme") || (e.matches ? "dark" : "light");
    
    // Update theme only if it changes
    if (newTheme !== currentTheme) {
      document.body.classList.toggle("dark", newTheme === "dark");
      let ionContents = document.querySelectorAll("ion-content");
      ionContents.forEach(content => content.setAttribute("color", newTheme === "dark" ? "dark" : "light"));
      localStorage.setItem("theme", newTheme);
      t.forEach(button => button.checked = newTheme === "dark");

      // Only reload if it hasn't been done for this change
      if (!sessionStorage.getItem("themeChanged")) {
        sessionStorage.setItem("themeChanged", "true");
        location.reload();
      }
    }
  }

  // Reset the themeChanged flag after the reload
  window.addEventListener("load", () => {
    sessionStorage.removeItem("themeChanged");
  });

  // Apply the theme when the page loads
  applyTheme();

  // Listen for theme toggle changes
  t.forEach(button => {
    button.addEventListener("ionChange", event => {
      let newTheme = event.detail.checked ? "dark" : "light";
      toggleTheme(newTheme);
    });
  });

  // Listen for changes in system color scheme preference
  e.addEventListener("change", event => {
    let newTheme = event.matches ? "dark" : "light";
    toggleTheme(newTheme);
  });
});

class BaseCalculator extends HTMLElement {
  constructor() {
    super();
    this.addEventListener("DOMContentLoaded", () => this.init());
  }
  
  init() {
    this.numInputs = Array.from(this.querySelectorAll("ion-input"));
    this.resultList = this.querySelector("#result");
    this.spinnerContainer = this.querySelector("#spinner-container");
    this.calcButton = this.querySelector("#calc-button");
    this.numInputs.forEach(input => {
      input.addEventListener("ionInput", () => this.handleInputChange());
      input.addEventListener("keydown", event => {
        if (event.key === "Enter") this.performCalculation();
      });
    });
    this.calcButton.addEventListener("click", () => this.performCalculation());
  }
  
  handleInputChange() {
    this.numInputs.some(input => input.value === "") && (this.resultList.innerHTML = "");
  }

  showToast(message) {
    let toast = document.createElement("ion-toast");
    toast.message = message;
    toast.duration = 2000;
    toast.position = "top";
    document.body.appendChild(toast);
    toast.present();
  }
}

class HomePage extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <ion-header>
        <ion-toolbar>
          <ion-title>Calculators</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <div class="text-center my-8 mx-2">
          <h1 class="text-2xl font-bold mb-4">Select a Calculator</h1>
        </div>
        <ion-nav-link router-direction="forward" component="binary-to-other">
          <ion-button expand="block">B2O - Binary to Other</ion-button>
        </ion-nav-link>
        <ion-nav-link router-direction="forward" component="arithmetic-converter">
          <ion-button expand="block">A2Z - Arithmetic Converter</ion-button>
        </ion-nav-link>
        <ion-nav-link router-direction="forward" component="power-calculator">
          <ion-button expand="block">P2X - Power Calculator</ion-button>
        </ion-nav-link>
      </ion-content>
    `;
  }
}

class BinaryToOther extends BaseCalculator {
  connectedCallback() {
    this.innerHTML = `
      <ion-header>
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-back-button></ion-back-button>
          </ion-buttons>
          <ion-title>B2O</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content>
        <div class="text-center my-8 mx-2">
          <h1 class="text-2xl font-bold mb-4">Binary to Other</h1>
          <p class="text-gray-700 mb-6">Quickly convert binary numbers to decimal, hexadecimal, or octal formats</p>
        </div>
        <ion-list inset="true" lines="full">
          <ion-item>
            <ion-input id="number" type="number" label-placement="floating" label="Enter Binary Number" clear-input="true" style="--placeholder-color: #ddd;"></ion-input>
          </ion-item>
          <ion-button id="calc-button" expand="block" class="my-5 mx-2">Magic 🪄</ion-button>
        </ion-list>
        <div id="spinner-container" class="flex justify-center items-center mb-4 hidden">
          <ion-spinner name="lines"></ion-spinner>
        </div>
        <ion-list id="result" inset="true" lines="full"></ion-list>
      </ion-content>
    `;
    super.init();
  }

  performCalculation() {
    let binaryInput = this.querySelector("#number").value,
        decimalValue = parseInt(binaryInput, 2),
        hexValue = decimalValue.toString(16).toUpperCase(),
        octalValue = decimalValue.toString(8);
    this.resultList.innerHTML = "";
    this.spinnerContainer.classList.remove("hidden");
    this.calcButton.disabled = true;
    setTimeout(() => {
      this.spinnerContainer.classList.add("hidden");
      this.calcButton.disabled = false;
      if (/^[01]+$/.test(binaryInput)) {
        this.resultList.innerHTML = `
          <ion-item>Binary: ${binaryInput}</ion-item>
          <ion-item>Decimal: ${decimalValue}</ion-item>
          <ion-item>Hexadecimal: ${hexValue}</ion-item>
          <ion-item>Octal: ${octalValue}</ion-item>
        `;
        this.showToast("Conversion completed successfully.");
      } else {
        this.showToast("Invalid binary number. Please enter a valid binary string.");
      }
    }, 1000);
  }
}

class ArithmeticConverter extends BaseCalculator {
  connectedCallback() {
    this.innerHTML = `
      <ion-header>
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-back-button></ion-back-button>
          </ion-buttons>
          <ion-title>A2Z</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content>
        <div class="text-center my-8 mx-2">
          <h1 class="text-2xl font-bold mb-4">Arithmetic Calculator</h1>
          <p class="text-gray-700 mb-6">Precise and efficient solutions for all basic arithmetic operations with simplicity and accuracy</p>
        </div>
        <ion-list inset="true" lines="full">
          <ion-item>
            <ion-input id="num1" type="number" label-placement="floating" label="Enter First Number" clear-input="true" style="--placeholder-color: #ddd;"></ion-input>
          </ion-item>
          <ion-item>
            <ion-input id="num2" type="number" label-placement="floating" label="Enter Second Number" clear-input="true" style="--placeholder-color: #ddd;"></ion-input>
          </ion-item>
        </ion-list>
        <ion-button id="calc-button" expand="block" class="ion-padding">Magic 🪄</ion-button>
        <div id="spinner-container" class="flex justify-center items-center mb-4 hidden">
          <ion-spinner name="lines"></ion-spinner>
        </div>
        <ion-list id="result" inset="true" lines="full"></ion-list>
      </ion-content>
    `;
    super.init();
  }

  performCalculation() {
    let num1 = parseFloat(this.querySelector("#num1").value),
        num2 = parseFloat(this.querySelector("#num2").value);
    this.resultList.innerHTML = "";
    this.spinnerContainer.classList.remove("hidden");
    this.calcButton.disabled = true;
    setTimeout(() => {
      this.spinnerContainer.classList.add("hidden");
      this.calcButton.disabled = false;
      if (isNaN(num1) || isNaN(num2)) {
        this.showToast("Invalid input. Please enter valid numbers.");
      } else {
        this.resultList.innerHTML = `
          <ion-item>Addition: ${num1} + ${num2} = ${num1 + num2}</ion-item>
          <ion-item>Subtraction: ${num1} - ${num2} = ${num1 - num2}</ion-item>
          <ion-item>Multiplication: ${num1} × ${num2} = ${num1 * num2}</ion-item>
          <ion-item>Division: ${num1} ÷ ${num2} = ${num2 !== 0 ? num1 / num2 : "Division by zero is undefined"}</ion-item>
        `;
        this.showToast("Calculation completed successfully.");
      }
    }, 1000);
  }
}

class PowerCalculator extends BaseCalculator {
  connectedCallback() {
    this.innerHTML = `
      <ion-header>
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-back-button></ion-back-button>
          </ion-buttons>
          <ion-title>P2X</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content>
        <div class="text-center my-8 mx-2">
          <h1 class="text-2xl font-bold mb-4">Power Calculator</h1>
          <p class="text-gray-700 mb-6">Calculate power with our intuitive tool, providing quick and accurate results in seconds</p>
        </div>
        <ion-list inset="true" lines="full">
          <ion-item>
            <ion-input id="number" type="number" label-placement="floating" label="Enter Number" clear-input="true" style="--placeholder-color: #ddd;"></ion-input>
          </ion-item>
          <ion-button id="calc-button" expand="block" class="my-5 mx-2">Magic 🪄</ion-button>
        </ion-list>
        <div id="spinner-container" class="flex justify-center items-center mb-4 hidden">
          <ion-spinner name="lines"></ion-spinner>
        </div>
        <ion-list id="result" inset="true" lines="full"></ion-list>
      </ion-content>
    `;
    super.init();
  }

  performCalculation() {
    let numberInput = parseFloat(this.querySelector("#number").value),
        exponents = ["²", "³", "⁴", "⁵", "⁶", "⁷", "⁸", "⁹", "⁹⁰"];
    this.resultList.innerHTML = "";
    this.spinnerContainer.classList.remove("hidden");
    this.calcButton.disabled = true;
    setTimeout(() => {
      this.spinnerContainer.classList.add("hidden");
      this.calcButton.disabled = false;
      if (isNaN(numberInput)) {
        this.showToast("Invalid input. Please enter a number.");
      } else {
        for (let exponent = 2; exponent <= 10; exponent++) {
          let result = Math.pow(numberInput, exponent),
              resultItem = document.createElement("ion-item");
          resultItem.textContent = `${numberInput}${exponents[exponent - 2]} = ${result}`;
          this.resultList.appendChild(resultItem);
        }
        this.showToast("Calculation completed successfully.");
      }
    }, 1000);
  }
}

customElements.define("home-page", HomePage);
customElements.define("binary-to-other", BinaryToOther);
customElements.define("arithmetic-converter", ArithmeticConverter);
customElements.define("power-calculator", PowerCalculator);
