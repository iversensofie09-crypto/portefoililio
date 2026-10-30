// Beskyttelse mot web-skraping inspirert av Odin James.
// E-post og tlf ligger ikke som ren tekst i HTML, så roboter/spambots ikke kan skrape dem.
// De dekodes først i minnet når en bruker trykker på knappen!

const contactBtn = document.getElementById("contact-btn");
const contactDetails = document.getElementById("contact-details");

// Kryptert data (XOR med nøkkel 73) for:
// [["Email","mailto:sofie.iversen@gmail.com","sofie.iversen@gmail.com"],["Phone","tel:","+47 123 45 678"],["Instagram","https://instagram.com/sofieiversen","@sofieiversen"]]
const encodedContacts = [
  18, 18, 107, 12, 36, 40, 32, 37, 107, 101, 107, 36, 40, 32, 37, 61, 38, 115,
  58, 38, 47, 32, 44, 103, 32, 63, 44, 59, 58, 44, 39, 9, 46, 36, 40, 32, 37,
  103, 42, 38, 36, 107, 101, 107, 58, 38, 47, 32, 44, 103, 32, 63, 44, 59, 58,
  44, 39, 9, 46, 36, 40, 32, 37, 103, 42, 38, 36, 107, 20, 101, 18, 107, 25, 33,
  38, 39, 44, 107, 101, 107, 61, 44, 37, 115, 98, 125, 126, 120, 123, 122, 125,
  124, 127, 126, 113, 107, 101, 107, 98, 125, 126, 105, 120, 123, 122, 105, 125,
  124, 105, 127, 126, 113, 107, 20, 101, 18, 107, 0, 39, 58, 61, 40, 46, 59, 40,
  36, 107, 101, 107, 33, 61, 61, 57, 58, 115, 102, 102, 32, 39, 58, 61, 40, 46,
  59, 40, 36, 103, 42, 38, 36, 102, 58, 38, 47, 32, 44, 32, 63, 44, 59, 58, 44,
  39, 107, 101, 107, 9, 58, 38, 47, 32, 44, 32, 63, 44, 59, 58, 44, 39, 107, 20,
  20,
];

function toggleContact() {
  const isExpanded = contactBtn.getAttribute("aria-expanded") === "true";

  if (isExpanded) {
    contactDetails.replaceChildren();
    contactDetails.hidden = true;
    contactBtn.setAttribute("aria-expanded", "false");
    contactBtn.textContent = "Reveal contact details ↗";
    return;
  }

  // Dekoder kontaktene
  const contacts = JSON.parse(
    String.fromCharCode(...encodedContacts.map((n) => n ^ 73)),
  );

  contactDetails.replaceChildren();

  for (const [label, href, text] of contacts) {
    const link = document.createElement("a");
    link.href = href;
    link.textContent = `${text} ↗`;
    link.setAttribute("aria-label", `${label}: ${text}`);

    if (href.startsWith("https:")) {
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    }

    contactDetails.appendChild(link);
  }

  contactDetails.hidden = false;
  contactBtn.setAttribute("aria-expanded", "true");
  contactBtn.textContent = "Hide contact details";
}

if (contactBtn) {
  contactBtn.addEventListener("click", toggleContact);
}

// Hjelpefunksjon: Hvis du vil endre kontaktinfoen din til dine ekte opplysninger senere,
// kan du åpne nettsiden i nettleseren, trykke F12 (Console), og kjøre f.eks.:
// generateContactData("sofie@dittdomene.no", "+47 98 76 54 32", "@sofie_foto")
// Da får du en ny kryptert liste du bare limer inn i encodedContacts over!
window.generateContactData = function (email, phone, instagram) {
  const data = [
    ["Email", `mailto:${email}`, email],
    ["Phone", `tel:${phone.replace(/\s+/g, "")}`, phone],
    [
      "Instagram",
      `https://instagram.com/${instagram.replace(/^@/, "")}`,
      instagram,
    ],
  ];
  const json = JSON.stringify(data);
  const encoded = Array.from(json).map((c) => c.charCodeAt(0) ^ 73);
  console.log("Kopier denne arrayen inn i encodedContacts i script.js:");
  console.log(JSON.stringify(encoded));
};
