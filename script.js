document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();

    const target = document.querySelector(this.getAttribute('href'));
    target.scrollIntoView({
      behavior: 'smooth'
    });
  });
});

const doseConversionRatios = {
  opioids: {
    "morphine (PO)": 30,
    "morphine (IV)": 10,
    oxycodone: 20,
    hydrocodone: 30,
    "hydromorphone (PO)": 7.5,
    "hydromorphone (IV)": 1.5,
    "codeine (PO)": 200,
  },
  steroids: {
    hydrocortisone: 1,
    cortisone: 0.8,
    prednisone: 4,
    prednisolone: 4,
    methylprednisolone: 5,
    dexamethasone: 25,
    betamethasone: 25,
    triamcinolone: 5,
  },
  betaBlockers: {
    propranolol: 1,
    atenolol: 0.5,
    metoprolol: 1,
    bisoprolol: 10,
    carvedilol: 10,
    nebivolol: 20,
    labetalol: 0.2,
  },
};


function populateDrugSelections() {
  const drugClassSelect = document.getElementById("drug-class");
  const fromDrugSelect = document.getElementById("from-drug");
  const toDrugSelect = document.getElementById("to-drug");

  drugClassSelect.addEventListener("change", function () {
    const drugClass = this.value;
    const drugs = doseConversionRatios[drugClass];

    fromDrugSelect.innerHTML = "";
    toDrugSelect.innerHTML = "";

    for (const drug in drugs) {
      const option = document.createElement("option");
      option.value = drug;
      option.text = drug;

      fromDrugSelect.add(option);
      toDrugSelect.add(option.cloneNode(true));
    }
  });

  drugClassSelect.dispatchEvent(new Event("change"));
}

const modalityConversionFactors = {
  opioids: {
    "PO-IV": {
      morphine: 0.33,
      hydromorphone: 0.2,
    },
    "IV-PO": {
      morphine: 3,
      hydromorphone: 5,
    },
  },
};

function calculateDoseConversion() {
  const fromDrug = document.getElementById("from-drug").value;
  const toDrug = document.getElementById("to-drug").value;
  const fromDose = parseFloat(document.getElementById("from-dose").value);
  const fromDelivery = document.getElementById("from-delivery").value;
  const toDelivery = document.getElementById("to-delivery").value;

  const drugClass = document.getElementById("drug-class").value;
  const conversionRatioFrom = doseConversionRatios[drugClass][fromDrug];
  const conversionRatioTo = doseConversionRatios[drugClass][toDrug];

  let convertedDose = (fromDose * conversionRatioFrom) / conversionRatioTo;

if (
    (drugClass === "opioids" && toDelivery === "IV" &&
      (toDrug === "oxycodone" || toDrug === "codeine (PO)" || toDrug === "hydrocodone"))
  ) {
    const resultElement = document.getElementById("conversion-result");
    resultElement.textContent = "Error: Invalid conversion. No IV option available for the selected drug.";
    return;
  }
  
  // Use the verified delivery modality conversion factors specific to opioids
  if (drugClass === "opioids") {
    const modalityFactorKey = `${fromDelivery}-${toDelivery}`;
    const modalityFactor = modalityConversionFactors[drugClass][modalityFactorKey][fromDrug];
    if (modalityFactor) {
      convertedDose *= modalityFactor;
    }
  }

  const resultElement = document.getElementById("conversion-result");
  resultElement.textContent = `Converted dose: ${convertedDose.toFixed(2)} units`;
}


function setupDoseConversionApp() {
  populateDrugSelections();
  const conversionButton = document.getElementById("convert-dose");
  conversionButton.addEventListener("click", calculateDoseConversion);
}

document.addEventListener("DOMContentLoaded", setupDoseConversionApp);
