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
    morphine: 1,
    oxycodone: 1.5,
    hydrocodone: 0.9,
    hydromorphone: 5,
    fentanyl: 100,
    methadone: 3,
    codeine: 0.15,
    tramadol: 0.1,
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

  function updateDrugOptions() {
    const drugClass = drugClassSelect.value;

    fromDrugSelect.innerHTML = "";
    toDrugSelect.innerHTML = "";

    for (const drug in doseConversionRatios[drugClass]) {
      const option = document.createElement("option");
      option.value = drug;
      option.textContent = drug;

      fromDrugSelect.appendChild(option.cloneNode(true));
      toDrugSelect.appendChild(option);
    }
  }

  drugClassSelect.addEventListener("change", updateDrugOptions);
  updateDrugOptions();
}

function handleDoseConversionForm() {
  const form = document.getElementById("dose-conversion-form");
  const result = document.getElementById("conversion-result");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const drugClass = document.getElementById("drug-class").value;
    const fromDrug = document.getElementById("from-drug").value;
    const fromDose = parseFloat(document.getElementById("from-dose").value);
    const toDrug = document.getElementById("to-drug").value;

    const conversionRatioFrom = doseConversionRatios[drugClass][fromDrug];
    const conversionRatioTo = doseConversionRatios[drugClass][toDrug];

    const convertedDose = (fromDose * conversionRatioFrom) / conversionRatioTo;

    result.textContent = `Converted dose: ${convertedDose.toFixed(2)} mg`;
  });
}

populateDrugSelections();
handleDoseConversionForm();
