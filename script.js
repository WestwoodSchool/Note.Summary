// Function to summarize notes
function summarizeNotes() {
    let notes = document.getElementById("notesInput").value.trim();
    let mode = document.getElementById("summaryMode").value;
    let output = document.getElementById("summaryOutput");

    if (!notes) {
        output.value = "Please paste your notes or upload a file!";
        return;
    }

    output.value = "AI is analyzing your notes... 🤖";
    output.disabled = true;

    let summary = generateSummary(notes, mode);
    typeText(output, summary, 25); // Adjust typing speed (lower = faster)
}

// AI-generated summary logic
function generateSummary(notes, mode) {
    let sentences = notes.split('. '); // Split text into sentences
    let keyPoints = sentences.slice(0, Math.min(sentences.length, 5)); // Get first 5 key points

    if (mode === "concise") {
        return keyPoints.join(". ") + "."; // Short summary
    } else if (mode === "detailed") {
        return `Detailed Breakdown:\n\n` + keyPoints.join(".\n\n") + "."; // Expanded details
    } else {
        // Brainrot Mode (Funny & Chaotic)
        return `🔥 Alright, here’s the deal: ${keyPoints.join("!!! Also, ")}!!! Absolute madness! 🚀😂`;
    }
}

// AI Typing Effect
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

// Function to extract text from uploaded files (Images/PDFs)
document.getElementById("uploadFile").addEventListener("change", function () {
    let file = this.files[0];

    if (!file) return;

    let output = document.getElementById("notesInput");
    output.value = "Extracting text from file... 🧐";

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

// Function to copy summary to clipboard
function copyToClipboard() {
    let output = document.getElementById("summaryOutput");
    output.select();
    document.execCommand("copy");
    alert("Summary copied to clipboard!");
}
