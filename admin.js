const API_URL = "https://giftmebackend.onrender.com/gift/creategift";

const form = document.getElementById("giftForm");
const preview = document.getElementById("preview");
const imageInput = document.getElementById("image");

imageInput.addEventListener("input", () => {
  const url = imageInput.value.trim();

  if (!url) {
    preview.innerHTML = "Image Preview";

    return;
  }

  preview.innerHTML = `
        <img src="${url}" alt="Preview">
    `;
});

function getChecked(name) {
  return [...document.querySelectorAll(`input[name="${name}"]:checked`)].map(
    (item) => item.value,
  );
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const relationships = getChecked("relationship");
  const occasions = getChecked("occasion");
  const hobbies = getChecked("hobby");

  if (!relationships.length) {
    return alert("Select at least one relationship.");
  }

  if (!occasions.length) {
    return alert("Select at least one occasion.");
  }

  if (!hobbies.length) {
    return alert("Select at least one hobby.");
  }

  const body = {
    name: document.getElementById("name").value.trim(),

    description: document.getElementById("description").value.trim(),

    price: Number(document.getElementById("price").value),

    relationships,

    occasions,

    ageGroup: {
      min: Number(document.getElementById("minAge").value),

      max: Number(document.getElementById("maxAge").value),
    },

    hobbies,

    image: document.getElementById("image").value.trim(),

    inStock: document.getElementById("inStock").value === "true",

    buyLink: document.getElementById("buyLink").value.trim(),
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to add gift");
    }

    showMessage("Gift added successfully!", true);

    form.reset();

    preview.innerHTML = "Image Preview";
  } catch (err) {
    showMessage(err.message, false);

    console.error(err);
  }
});

function showMessage(message, success) {
  const old = document.querySelector(".successBox, .errorBox");

  if (old) {
    old.remove();
  }

  const div = document.createElement("div");

  div.className = success ? "successBox" : "errorBox";

  div.innerText = message;

  form.after(div);

  setTimeout(() => {
    div.remove();
  }, 3000);
}
