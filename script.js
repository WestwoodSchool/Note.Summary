function summarizeNotes() {
    let notes = document.getElementById("notesInput").value.trim();
    let mode = document.getElementById("summaryMode").value;
    let output = document.getElementById("summaryOutput");

    if (!notes) {
        output.value = "Please paste your notes first!";
        return;
    }

    output.value = "AI is thinking... 🤖";
    output.disabled = true;

    let summary = generateSummary(notes, mode);
    typeText(output, summary, 30);
}

// AI-like summary generation
function generateSummary(notes, mode) {
    let sentences = notes.split('. ');
    let keyPoints = sentences.slice(0, Math.min(sentences.length, 5)); // Grab first 5 key points

    if (mode === "bullet") {
        return keyPoints.map(point => `- ${point}`).join("\n");
    } else {
        return `In simple terms: ${keyPoints.join(". ")}. Hope that helps!`;
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

function copyToClipboard() {
    let output = document.getElementById("summaryOutput");
    output.select();
    document.execCommand("copy");
    alert("Summary copied to clipboard!");
}
