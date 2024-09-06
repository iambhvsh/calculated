document.documentElement.setAttribute("mode", "ios"), document.addEventListener("DOMContentLoaded", () => {
  let t = document.getElementById("utterances-container"),
    e = document.getElementById("loading-spinner");
  setTimeout(() => { e.style.display = "none", t.style.display = "block" }, 5e3)
}), document.addEventListener("DOMContentLoaded", () => {
  let t = document.querySelectorAll(".themeToggle"),
    e = window.matchMedia("(prefers-color-scheme: dark)");

  function n() {
    let t = localStorage.getItem("theme"),
      n = "dark" === t || !t && e.matches;
    i(n);
    let o = localStorage.getItem("username");
    o || showUsernameAlert()
  }

  function i(e) {
    document.body.classList.toggle("dark", e);
    let n = document.querySelectorAll("ion-content");
    n.forEach(t => { t.setAttribute("color", e ? "dark" : "light") }), localStorage.setItem("theme", e ? "dark" : "light"), t.forEach(t => t.checked = e)
  }
  t.forEach(t => {
    t.addEventListener("ionChange", t => {
      let e = t.detail.checked;
      i(e)
    })
  }), e.addEventListener("change", t => { i(t.matches) }), n()
});
class BaseCalculator extends HTMLElement {
  constructor() { super(), this.addEventListener("DOMContentLoaded", () => this.init()) } init() { this.numInputs = Array.from(this.querySelectorAll("ion-input")), this.resultList = this.querySelector("#result"), this.spinnerContainer = this.querySelector("#spinner-container"), this.calcButton = this.querySelector("#calc-button"), this.numInputs.forEach(t => { t.addEventListener("ionInput", () => this.handleInputChange()), t.addEventListener("keydown", t => { "Enter" === t.key && this.performCalculation() }) }), this.calcButton.addEventListener("click", () => this.performCalculation()) } handleInputChange() { this.numInputs.some(t => "" === t.value) && (this.resultList.innerHTML = "") } showToast(t) {
    let e = document.createElement("ion-toast");
    e.message = t, e.duration = 2e3, e.position = "top", document.body.appendChild(e), e.present()
  }
}
class HomePage extends HTMLElement { connectedCallback() { this.innerHTML = `
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
    ` } } class BinaryToOther extends BaseCalculator {
  connectedCallback() { this.innerHTML = `
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
    `, super.init() } performCalculation() {
    let t = this.querySelector("#number").value,
      e = parseInt(t, 2),
      n = e.toString(16).toUpperCase(),
      i = e.toString(8);
    this.resultList.innerHTML = "", this.spinnerContainer.classList.remove("hidden"), this.calcButton.disabled = !0, setTimeout(() => { this.spinnerContainer.classList.add("hidden"), this.calcButton.disabled = !1, /^[01]+$/.test(t) ? (this.resultList.innerHTML = `
          <ion-item>Binary: ${t}</ion-item>
          <ion-item>Decimal: ${e}</ion-item>
          <ion-item>Hexadecimal: ${n}</ion-item>
          <ion-item>Octal: ${i}</ion-item>
        `, this.showToast("Conversion completed successfully.")) : this.showToast("Invalid binary number. Please enter a valid binary string.") }, 1e3)
  }
}
class ArithmeticConverter extends BaseCalculator {
  connectedCallback() { this.innerHTML = `
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
    `, super.init() } performCalculation() {
    let t = parseFloat(this.querySelector("#num1").value),
      e = parseFloat(this.querySelector("#num2").value);
    this.resultList.innerHTML = "", this.spinnerContainer.classList.remove("hidden"), this.calcButton.disabled = !0, setTimeout(() => { this.spinnerContainer.classList.add("hidden"), this.calcButton.disabled = !1, isNaN(t) || isNaN(e) ? this.showToast("Invalid input. Please enter valid numbers.") : (this.resultList.innerHTML = `
          <ion-item>Addition: ${t} + ${e} = ${t+e}</ion-item>
          <ion-item>Subtraction: ${t} - ${e} = ${t-e}</ion-item>
          <ion-item>Multiplication: ${t} \xd7 ${e} = ${t*e}</ion-item>
          <ion-item>Division: ${t} \xf7 ${e} = ${0!==e?t/e:"Division by zero is undefined"}</ion-item>
        `, this.showToast("Calculation completed successfully.")) }, 1e3)
  }
}
class PowerCalculator extends BaseCalculator {
  connectedCallback() { this.innerHTML = `
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
    `, super.init() } performCalculation() {
    let t = parseFloat(this.querySelector("#number").value),
      e = ["\xb2", "\xb3", "⁴", "⁵", "⁶", "⁷", "⁸", "⁹", "\xb9⁰"];
    this.resultList.innerHTML = "", this.spinnerContainer.classList.remove("hidden"), this.calcButton.disabled = !0, setTimeout(() => {
      if (this.spinnerContainer.classList.add("hidden"), this.calcButton.disabled = !1, isNaN(t)) this.showToast("Invalid input. Please enter a number.");
      else {
        for (let n = 2; n <= 10; n++) {
          let i = Math.pow(t, n),
            o = document.createElement("ion-item");
          o.textContent = `${t}${e[n-2]} = ${i}`, this.resultList.appendChild(o)
        }
        this.showToast("Calculation completed successfully.")
      }
    }, 1e3)
  }
}
customElements.define("home-page", HomePage), customElements.define("binary-to-other", BinaryToOther), customElements.define("arithmetic-converter", ArithmeticConverter), customElements.define("power-calculator", PowerCalculator);
