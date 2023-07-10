const days = document.querySelector("#days");
const hours = document.querySelector("#hours");
const minutes = document.querySelector("#minutes");
const seconds = document.querySelector("#seconds");
const name = document.querySelector("#name");
const submit = document.querySelector("#submit");
const customSelect = document.querySelector(".select-wrapper");
const selectedValue = customSelect.querySelector(".selected-value");
const selectOptions = customSelect.querySelector(".select-options");
const optionsList = selectOptions.querySelectorAll("li");
const spotStatus = document.querySelectorAll(".checkBoxSpot");
const callout = document.getElementById("callout");
const arrowIcon = customSelect.querySelector(".arrow-icon");
const statusCheckBox = document.querySelectorAll('.countCheckBox');

let drinks = [];
let selectedCheckbox = null;
let statusSelectedCheckbox = null;

const checkFormValidity = () => {
  const isTextInputValid = name.value.trim() !== "";
  const isCheckboxSelected = Array.from(spotStatus).some(
    (checkbox) => checkbox.checked,
  );
  const isSelectInputValid = drinks.length !== 0;

  return isTextInputValid && isCheckboxSelected && isSelectInputValid;
};
const updateSelectedValue = () => {
  const selectedOptions = Array.from(
    selectOptions.querySelectorAll(".selected"),
    (option) => option.textContent,
  );
  selectedValue.textContent = selectedOptions.join(", ");
};

// Toggle the display of the options list
selectedValue.addEventListener("click", () => {
  selectOptions.style.display =
    selectOptions.style.display === "none" ? "block" : "none";
  arrowIcon.classList.toggle("opened");
});

// Handle selection of options
optionsList.forEach((option) => {
  option.addEventListener("click", () => {
    option.classList.toggle("selected");
    drinks = Array.from(
      selectOptions.querySelectorAll(".selected"),
      (option) => option.textContent,
    );
    updateSelectedValue();
    submit.disabled = !checkFormValidity();
  });
});

const deadline = new Date(`2023-08-18`);

function updateCounter() {
  const currentasdupog = new Date();
  const dist = deadline - currentasdupog;

  const toDays = Math.floor(dist / 1000 / 60 / 60 / 24);
  const toHours = Math.floor(dist / 1000 / 60 / 60) % 24;
  const toMinutes = Math.floor(dist / 1000 / 60) % 60;
  const toSeconds = Math.floor(dist / 1000) % 60;

  days.innerText = toDays;
  hours.innerText = toHours < 10 ? "0" + toHours : toHours;
  minutes.innerText = toMinutes < 10 ? "0" + toMinutes : toMinutes;
  seconds.innerText = toSeconds < 10 ? "0" + toSeconds : toSeconds;
}

updateCounter();

let templateParams = {};

spotStatus.forEach((el) => {
  el.addEventListener("click", (e) => {
    templateParams = {
      ...templateParams,
      spots: e.target.value,
    };
    submit.disabled = !checkFormValidity();
  });
});

statusCheckBox.forEach((el) => {
  el.addEventListener("click", (e) => {
    templateParams = {
      ...templateParams,
      count: e.target.value,
    };
    submit.disabled = !checkFormValidity();
  });
});

spotStatus.forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
    if (selectedCheckbox) {
      selectedCheckbox.checked = false;
      selectedCheckbox.disabled = false;
    }

    if (checkbox.checked) {
      checkbox.disabled = true;
      selectedCheckbox = checkbox;
    } else {
      selectedCheckbox = null;
    }
  });
});

statusCheckBox.forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
    if (statusSelectedCheckbox) {
      statusSelectedCheckbox.checked = false;
      statusSelectedCheckbox.disabled = false;
    }

    if (checkbox.checked) {
      checkbox.disabled = true;
      statusSelectedCheckbox = checkbox;
    } else {
      statusSelectedCheckbox = null;
    }
  });
});

name.addEventListener("input", (e) => {
  name.value = e.target.value;
  templateParams = {
    ...templateParams,
    name: name.value,
  };
  submit.disabled = !checkFormValidity();
});

document.addEventListener("click", (event) => {
  const targetElement = event.target;
  if (!customSelect.contains(targetElement)) {
    selectOptions.style.display = "none";
  }
});

submit.addEventListener("click", () => {
  templateParams = {
    ...templateParams,
    alcohol: drinks.join(","),
  };
  emailjs.send("service_r6um5w8", "template_xq2l00h", templateParams).then(
    function (response) {
      console.log("SUCCESS!", response.status, response.text);
    },
    function (error) {
      console.log("FAILED...", error);
    },
  );

  callout.style.display = "block";

  // Hide the callout after 2 seconds
  setTimeout(() => {
    callout.style.display = "none";
  }, 2000);
});

setInterval(updateCounter, 1000);
