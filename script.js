const message = document.getElementById("message");
const goalTempInput = document.getElementById("goalTempInput");
const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");

const coldPipelineTDiv = document.getElementById("coldPipelineT");
const hotPipelineTDiv = document.getElementById("hotPipelineT");
const coldMixerTDiv = document.getElementById("coldMixerT");
const hotMixerTDiv = document.getElementById("hotMixerT");
const mixerTDiv = document.getElementById("mixerT");
const pipeCold = document.getElementById("pipeCold");
const pipeHot = document.getElementById("pipeHot");

const coldDiv = document.getElementById("cold");
const hotDiv = document.getElementById("hot");
const coldWidth = Math.floor(coldDiv.getBoundingClientRect().width) * 2.4;
const hotWidth = Math.floor(hotDiv.getBoundingClientRect().width) * 2.4;

const coldNumberDiv = document.getElementById("coldNumber");
const hotNumberDiv = document.getElementById("hotNumber");
const totalNumberDiv = document.getElementById("totalNumber");

const coldAmountDiv = document.getElementById("coldAmount");
const hotAmountDiv = document.getElementById("hotAmount");
const totalAmountDiv = document.getElementById("totalAmount");
const ratioCold = document.getElementById("ratioCold");
const ratioHot = document.getElementById("ratioHot");

const roomTemp = 21;
const coldTemp = 6;
const hotTemp = 60;
const tempSpeed = 0.03;
const amountSpeed = tempSpeed * 300;
const K = 273.15;
let relTemp;
const relHot = hotTemp - coldTemp;
const rgbCoef = 255 / relHot;
const coldClr = getRgb(coldTemp);
const hotClr = getRgb(hotTemp);
let coldMixerTemp;
let hotMixerTemp;
let mixerTemp;
let goalTemp;
let coldAmount;
let hotAmount;
let totalAmount;
let goalTempReached;
let coldGoalFactor;
let hotGoalFactor;
let interval;
let coldPercent;
let divHeight;
let coldPos;
let hotPos;

initBtns();
resetValues();

function removeInterval() {
  if (interval) {
    clearInterval(interval);
    interval = null;
    initBtns();
  }
}

function initBtns() {
  stopButton.style = "display: none;";
  startButton.addEventListener("click", pourWaterHandler);
  stopButton.addEventListener("click", closeTap);
}

function resetValues() {
  message.innerHTML = "Type in temperature";
  coldPipelineTDiv.innerHTML = coldTemp;
  hotPipelineTDiv.innerHTML = hotTemp;
  coldMixerTDiv.innerHTML = roomTemp;
  hotMixerTDiv.innerHTML = roomTemp;
  mixerTDiv.innerHTML = roomTemp;
  goalTempInput.value = "";

  coldPipelineTDiv.setAttribute(
    "style",
    "background-color: " + getRgb(coldTemp) + "; "
  );
  hotPipelineTDiv.setAttribute(
    "style",
    "background-color: " + getRgb(hotTemp) + "; "
  );
  coldMixerTDiv.setAttribute(
    "style",
    "background-color: " + getRgb(roomTemp) + "; "
  );
  hotMixerTDiv.setAttribute(
    "style",
    "background-color: " + getRgb(roomTemp) + "; "
  );
  mixerTDiv.setAttribute(
    "style",
    "background-color: " + getRgb(roomTemp) + "; "
  );
  goalTempInput.setAttribute("style", "background-color: transparent; ");
  pipeCold.setAttribute(
    "style",
    "background-image: linear-gradient(to bottom, " +
      coldClr +
      ", " +
      getRgb(roomTemp) +
      ");"
  );
  pipeHot.setAttribute(
    "style",
    "background-image: linear-gradient(to bottom, " +
      hotClr +
      ", " +
      getRgb(roomTemp) +
      ");"
  );

  coldNumberDiv.innerHTML = 0;
  hotNumberDiv.innerHTML = 0;
  totalNumberDiv.innerHTML = 0;

  coldAmountDiv.setAttribute("style", "width: 0px; ");
  hotAmountDiv.setAttribute("style", "width: 0px; ");
  totalAmountDiv.setAttribute("style", "width: 0px; ");
}

function pourWaterHandler() {
  goalTemp = parseInt(goalTempInput.value, 10);
  goalTempReached = false;
  coldMixerTemp = roomTemp;
  hotMixerTemp = roomTemp;
  mixerTemp = roomTemp;
  coldAmount = 0;
  hotAmount = 0;
  totalAmount = 0;
  coldGoalFactor = 0;
  hotGoalFactor = 0;

  message.innerHTML = "";

  if (!goalTemp) {
    message.innerHTML = "Please check your input";
    return;
  }
  if (goalTemp <= coldTemp) {
    goalTemp = coldTemp;
    goalTempInput.value = coldTemp;
  } else if (goalTemp >= hotTemp) {
    goalTemp = hotTemp;
    goalTempInput.value = hotTemp;
  }
  interval = setInterval(() => {
    pourWater();
  });

  startButton.style = "display: none;";
  stopButton.style = "display: inline;";

  message.innerHTML += "Pouring water...";
  goalTempInput.setAttribute(
    "style",
    "background-color: " + getRgb(goalTemp) + "; "
  );
}

function pourWater() {
  if (!goalTempReached) {
    if (goalTemp <= coldMixerTemp) {
      coldGoalFactor = 1;
      hotGoalFactor = 0;
      pourColdWater(1);
      mixerTemp = coldMixerTemp;
      if (coldMixerTemp <= goalTemp) {
        goalTempReached = true;
      }
    } else if (goalTemp >= hotMixerTemp) {
      coldGoalFactor = 0;
      hotGoalFactor = 1;
      pourHotWater(1);
      mixerTemp = hotMixerTemp;
      if (hotMixerTemp >= goalTemp) {
        goalTempReached = true;
      }
    }
  } else {
    coldGoalFactor = (goalTemp - hotMixerTemp) / (coldMixerTemp - hotMixerTemp);
    hotGoalFactor = 1 - coldGoalFactor;
    if (goalTemp != hotTemp) {
      pourColdWater(coldGoalFactor);
    }
    if (goalTemp != coldTemp) {
      pourHotWater(hotGoalFactor);
    }
    mixerTemp =
      (coldMixerTemp + K) * coldGoalFactor +
      (hotMixerTemp + K) * hotGoalFactor -
      K;
  }
  updateElements();
}

function pourColdWater(goalFactor) {
  coldAmount += amountSpeed * goalFactor;

  if (coldMixerTemp > coldTemp) {
    coldMixerTemp -= tempSpeed * goalFactor;
  }
}

function pourHotWater(goalFactor) {
  hotAmount += amountSpeed * goalFactor;

  if (hotMixerTemp < hotTemp) {
    hotMixerTemp += tempSpeed * goalFactor;
  }
}

function closeTap() {
  stopButton.style = "display: none;";
  removeInterval();
  message.innerHTML = "Pouring stopped";
  startButton.style = "display: inline;";
}

function updateElements() {
  totalAmount = coldAmount + hotAmount;

  coldMixerTDiv.innerHTML = coldMixerTemp.toFixed();
  hotMixerTDiv.innerHTML = hotMixerTemp.toFixed();
  mixerTDiv.innerHTML = mixerTemp.toFixed();
  coldNumberDiv.innerHTML = (coldAmount / 10).toFixed();
  hotNumberDiv.innerHTML = (hotAmount / 10).toFixed();
  totalNumberDiv.innerHTML = (totalAmount / 10).toFixed();

  coldPercent = (coldGoalFactor * 100).toFixed();
  ratioCold.innerHTML = coldPercent + " %";
  ratioHot.innerHTML = 100 - coldPercent + " %";

  coldMixerTDiv.setAttribute(
    "style",
    "background-color: " + getRgb(coldMixerTemp) + "; "
  );
  hotMixerTDiv.setAttribute(
    "style",
    "background-color: " + getRgb(hotMixerTemp) + "; "
  );
  mixerTDiv.setAttribute(
    "style",
    "background-color: " + getRgb(mixerTemp) + "; "
  );

  if (coldAmount < coldWidth) {
    coldAmountDiv.setAttribute("style", "width: " + coldAmount + "px; ");
  } else {
    divHeight = 1 + coldAmount / coldWidth;
    coldAmountDiv.setAttribute(
      "style",
      "height: " + divHeight + "px; width: " + coldWidth + "px; "
    );
  }
  if (hotAmount < hotWidth) {
    hotAmountDiv.setAttribute("style", "width: " + hotAmount + "px; ");
  } else {
    divHeight = 1 + hotAmount / hotWidth;
    hotAmountDiv.setAttribute(
      "style",
      "height: " + divHeight + "px; width: " + hotWidth + "px; "
    );
  }
  coldPos = Math.ceil(
    (1 - (coldMixerTemp - coldTemp) / (roomTemp - coldTemp)) * 100
  );
  if (coldPos <= 100) {
    pipeCold.setAttribute(
      "style",
      "background-image: linear-gradient(to bottom, " +
        coldClr +
        " " +
        coldPos +
        "%, " +
        getRgb(coldMixerTemp) +
        ");"
    );
  }
  hotPos = Math.ceil(
    (1 - (hotTemp - hotMixerTemp) / (hotTemp - roomTemp)) * 100
  );
  if (hotPos <= 100) {
    pipeHot.setAttribute(
      "style",
      "background-image: linear-gradient(to bottom, " +
        hotClr +
        " " +
        hotPos +
        "%, " +
        getRgb(hotMixerTemp) +
        ");"
    );
  }
}

function getRgb(temp) {
  relTemp = temp;
  red = rgbCoef * relTemp;
  green = 127;
  blue = rgbCoef * (relHot - relTemp);
  return "rgb(" + red + ", " + green + ", " + blue + ")";
}
