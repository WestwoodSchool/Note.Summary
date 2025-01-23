function summarizeNotes() {
    let notes = document.getElementById("notesInput").value.trim();
    let mode = document.getElementById("summaryMode").value;
    let output = document.getElementById("summaryOutput");

    if (!notes) {
        output.value = "Please paste your notes or upload a file!";
        return;
    }

    output.value = "AI is processing your notes... 🤖";
    output.disabled = true;

    let summary = generateSummary(notes, mode);
    typeText(output, summary, 15); // Typing speed: Lower = Faster
}

// AI-generated summary logic
function generateSummary(notes, mode) {
    let sentences = notes.split('. ');
    let keyPoints = sentences.slice(0, Math.min(sentences.length, 5)); // Extract key sentences

    if (mode === "concise") {
        return `📌 Quick Summary:\n\n${keyPoints.join(". ")}.`;
    } else if (mode === "detailed") {
        return `📖 Detailed Breakdown:\n\n${keyPoints.join(".\n\n")}.`;
    } else {
        return generateHyperBrainrot(keyPoints); // Gen Alpha Chaos Mode
    }
}

// **BRAINROT MODE (GEN ALPHA EDITION)**
function generateHyperBrainrot(keyPoints) {
    let chaoticOpeners = [
        "YO THIS INFO GOT ME HITTING THE GRIDDY LIKE BABY GRONK 🕺🔥",
        "BRO REALLY THINKS HE'S CARTI AFTER READING THIS 💀💀",
        "SKIBIDI RIZZ GYATT IN REAL LIFE?? DAWG SHMLAWG 📢📢",
        "JOHN PORK CALLED, HE SAID THIS INFO IS LITERALLY GOATED 🐖💯",
        "DUKE DENNIS DID YOU PRAY TODAY? BECAUSE THIS SUMMARY ABOUT TO GO CRAZY 🙏🔥"
    ];

    let chaoticClosers = [
        "ANYWAY THAT’S THE SUMMARY, NOW GO MEWING AND LOOKSMAXXING 😈",
        "GGS, NOW GO POST THIS ON WHOLESOME REDDIT WITH SUBWAY SURFERS GAMEPLAY 🎮💀",
        "EZ CLAPS, TIME TO WATCH A FAMILY GUY FUNNY MOMENTS COMPILATION 🔥",
        "BRB, GOING BACK TO THE GOON CAVE WITH MRBEAST 💀",
        "QUANDALE DINGLE JUST DM’D ME SAYING THIS INFO IS LITERALLY GRIMACE SHAKE WORTHY 💜🤮"
    ];

    let brainrotBody = keyPoints.map(point => {
        let phrases = [
            `LITERALLY MORE IMPACTFUL THAN OCEANGATE 🚢💀`,
            `BRO THIS INFO IS BUILT DIFFERENT LIKE SMURF CAT VS STRAWBERRY ELEPHANT 🐘🌀`,
            `RIZZED UP LIKE KEVIN JAMES TRYING TO IMPRESS LIVVY DUNNE 💅💯`,
            `ABSOLUTE NPC DIALOGUE, BUT I RESPECT IT 🔥🔥`,
            `BRO THIS FEELS LIKE KAI CENAT PAYING HIS FANUM TAX 💰💀`,
            `I CAN HEAR ANDREW TATE PREACHING ABOUT THIS FROM HIS BUGATTI 🚗💨`,
            `I SHOWSPEED SCREAMING "AMOGUS" WOULD SUMMARIZE THIS BETTER 🔴🔵`,
            `BRO THIS GOT ME THINKING ABOUT FREDDY FAZBEAR’S PIZZA TOWER 🍕🐻`,
            `THIS INFO IS SO UNHINGED IT FEELS LIKE COLLEEN BALLINGER’S UKULELE APOLOGY 💀🎶`,
            `IMAGINE NOT KNOWING THIS WHILE HITTING "1 2 BUCKLE MY SHOE" 🔥`,
            `AMBATUKAM, THIS INFO IS SHAKING MY WHOLE EXISTENCE 🌍💀`,
            `HUGGY WUGGY WOULDN’T EVEN BE ABLE TO HANDLE THIS KNOWLEDGE 🧠💀`,
            `LOOKS LIKE A QUANTUM RIZZ PHENOMENON BUT IT’S JUST MATH 📈📚`
        ];
        return `- ${point.toUpperCase()} ${getRandomElement(phrases)}`;
    }).join("\n");

    return `${getRandomElement(chaoticOpeners)}\n\n${brainrotBody}\n\n${getRandomElement(chaoticClosers)}`;
}

// AI Typing Effect (Real-Time Simulation)
function typeText(element, text, speed) {
    element.value = "";
    let index = 0;

    function type() {
        if (index < text.length) {
            element.value += text.charAt(index);
            index++;
            setTimeout(type, speed);
        } else {
            element.disabled = false;
        }
    }

    type();
}

// **FILE UPLOAD HANDLING (IMAGE & PDF TEXT EXTRACTION)**
document.getElementById("uploadFile").addEventListener("change", function () {
    let file = this.files[0];

    if (!file) return;

    let output = document.getElementById("notesInput");
    output.value = "Extracting text from file... 📖";

    let reader = new FileReader();

    if (file.type.includes("image")) {
        // Use OCR (Tesseract.js) for image text extraction
        reader.onload = function (event) {
            Tesseract.recognize(event.target.result, "eng")
                .then(({ data: { text } }) => {
                    output.value = text.trim() || "No readable text found!";
                })
                .catch(() => output.value = "Error extracting text from image.");
        };
        reader.readAsDataURL(file);
    } else if (file.type === "application/pdf") {
        // Extract text from PDF using PDF.js
        reader.onload = function (event) {
            let typedArray = new Uint8Array(event.target.result);
            pdfjsLib.getDocument(typedArray).promise.then(pdf => {
                let text = "";
                let promises = [];

                for (let i = 1; i <= pdf.numPages; i++) {
                    promises.push(pdf.getPage(i).then(page => page.getTextContent().then(content => {
                        text += content.items.map(item => item.str).join(" ") + "\n";
                    })));
                }

                Promise.all(promises).then(() => {
                    output.value = text.trim() || "No readable text found!";
                });
            });
        };
        reader.readAsArrayBuffer(file);
    } else {
        output.value = "Unsupported file type. Please upload an image or PDF.";
    }
});

// Copy Summary to Clipboard
function copyToClipboard() {
    let output = document.getElementById("summaryOutput");
    output.select();
    document.execCommand("copy");
    alert("Summary copied to clipboard!");
}

// Helper function to get a random element from an array
function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}
