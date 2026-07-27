const API_URL = "https://giftmebackend.onrender.com/gift/suggest";

const content = document.getElementById("content");
const progressBar = document.getElementById("progressBar");

const steps = [
  {
    key: "relationship",
    question: "Who are you buying for?",
    options: ["Partner", "Friend", "Brother", "Sister", "Mother", "Father"],
  },
  {
    key: "occasion",
    question: "What's the occasion?",
    options: [
      "Birthday",
      "Christmas",
      "Anniversary",
      "Raksha Bandhan",
      "Karwa Chauth",
      "Durga Puja",
    ],
  },
  {
    key: "age",
    question: "How old are they?",
    input: "number",
  },
  {
    key: "hobby",
    question: "What do they enjoy?",
    options: [
      "Creative",
      "Gaming",
      "Music",
      "Fashion",
      "Art & Décor",
      "Devotional",
      "Spiritual",
    ],
  },
  {
    key: "budget",
    question: "What's your budget?",
    input: "budget",
  },
];

let currentStep = -1;

const answers = {
  relationship: "",
  occasion: "",
  age: "",
  hobby: "",
  minBudget: "",
  maxBudget: "",
};

showWelcome();

function showWelcome() {
  progressBar.style.width = "0%";

  const template = document.getElementById("welcome");

  content.innerHTML = "";

  content.appendChild(template.content.cloneNode(true));

  document.getElementById("startBtn").addEventListener("click", () => {
    currentStep = 0;

    renderStep();
  });
}

function renderStep() {
  progressBar.style.width = `${(currentStep / steps.length) * 100}%`;

  const step = steps[currentStep];

  const template = document.getElementById("question");

  content.innerHTML = "";

  content.appendChild(template.content.cloneNode(true));

  document.getElementById("questionTitle").innerText = step.question;

  const options = document.getElementById("options");
  const inputContainer = document.getElementById("inputContainer");

  let selected = "";

  if (step.options) {
    options.innerHTML = "";

    step.options.forEach((option) => {
      const div = document.createElement("div");

      div.className = "option";

      div.innerText = option;

      div.onclick = () => {
        document
          .querySelectorAll(".option")
          .forEach((el) => el.classList.remove("active"));

        div.classList.add("active");

        selected = option;
      };

      options.appendChild(div);
    });
  }

  if (step.input === "number") {
    inputContainer.innerHTML = `
            <input
                type="number"
                id="ageInput"
                placeholder="Enter Age"
            >
        `;
  }

  if (step.input === "budget") {
    inputContainer.innerHTML = `
            <div class="budget">

                <input
                    id="minBudget"
                    type="number"
                    placeholder="Minimum Budget"
                >

                <input
                    id="maxBudget"
                    type="number"
                    placeholder="Maximum Budget"
                >

            </div>
        `;
  }

  document.getElementById("nextBtn").onclick = async () => {
    if (step.options) {
      if (!selected) {
        alert("Please select an option.");

        return;
      }

      answers[step.key] = selected;
    }

    if (step.input === "number") {
      const age = document.getElementById("ageInput").value;

      if (!age) {
        alert("Enter age.");

        return;
      }

      answers.age = age;
    }

    if (step.input === "budget") {
      const min = document.getElementById("minBudget").value;

      const max = document.getElementById("maxBudget").value;

      if (!min || !max) {
        alert("Enter budget.");

        return;
      }

      answers.minBudget = min;

      answers.maxBudget = max;
    }

    currentStep++;

    if (currentStep >= steps.length) {
      await searchGifts();

      return;
    }

    renderStep();
  };
}

async function searchGifts() {
  progressBar.style.width = "100%";

  const loading = document.getElementById("loading");

  content.innerHTML = "";

  content.appendChild(loading.content.cloneNode(true));

  try {
    const response = await fetch(API_URL, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        relationship: answers.relationship,

        occasion: answers.occasion,

        age: Number(answers.age),

        hobby: answers.hobby,

        minBudget: Number(answers.minBudget),

        maxBudget: Number(answers.maxBudget),
      }),
    });

    const data = await response.json();

    showResults(data.gifts || []);
  } catch (err) {
    console.error(err);

    alert("Could not connect to backend.");
  }
}

function showResults(gifts) {
  const template = document.getElementById("results");

  content.innerHTML = "";

  content.appendChild(template.content.cloneNode(true));

  document.getElementById("restartBtn").onclick = restart;

  const grid = document.getElementById("giftGrid");

  if (gifts.length === 0) {
    grid.innerHTML = `
            <div class="empty">

                <h2>No Gifts Found</h2>

                <p>
                    Try another hobby or budget.
                </p>

            </div>
        `;

    return;
  }

  gifts.forEach((gift) => {
    grid.innerHTML += `

        <div class="giftCard">

            <img
                src="${gift.image}"
                alt="${gift.name}"
            >

            <div class="giftInfo">

                <h3>${gift.name}</h3>

                <p>${gift.description}</p>

                <div class="price">
                    ₹${gift.price}
                </div>

                <button
                    class="viewBtn"
                    onclick="window.open('${gift.image}','_blank')"
                >
                    View Gift
                </button>

            </div>

        </div>

        `;
  });
}

function restart() {
  currentStep = -1;

  Object.keys(answers).forEach((key) => {
    answers[key] = "";
  });

  showWelcome();
}
