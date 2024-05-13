let booleans = ["is", "has", "can", "deleted", "blocked", "updated", "created"];
let words = ["apple", "banana", "carrot", "dog", "elephant", "fish", "grape", "hat", "jacket", "kiwi", "lemon", "mango", "notebook", "orange", "pear", "quilt", "rabbit", "strawberry", "turtle", "umbrella", "vase", "watermelon", "xylophone", "yogurt", "zebra", "ant", "ball", "cat", "dolphin", "egg", "fox", "guitar", "hamster", "ink", "jellyfish", "koala", "lion", "monkey", "noodle", "owl", "penguin", "quokka", "rhino", "snail", "tiger", "unicorn", "violin", "walrus", "xylophone"];

function getRandomWords() {
    let boolean = booleans[document.new_random_integer(booleans.length - 1)];
    let word = words[document.new_random_integer(words.length - 1)];
    return [boolean, word];
}

function renderSnakeCase(wordList) {
    return wordList.join("_").toLowerCase();
}

function renderCamelCase(wordList) {
    const x = wordList.map(x => x.charAt(0).toUpperCase() + x.slice(1).toLowerCase()).join("");
    return x.charAt(0).toLowerCase() + x.slice(1);
}

function getFunctionCall(count) {
    let snakeCaseWords = {
        snakeCase: [],
        camelCase: [],
    };
    for (let i = 0; i < count; i++) {
        let words = getRandomWords();
        snakeCaseWords.snakeCase.push(renderSnakeCase(words));
        snakeCaseWords.camelCase.push(renderCamelCase(words));
    }
    const snakeCaseString = snakeCaseWords.snakeCase.join(", ");
    const camelCaseString = snakeCaseWords.camelCase.join(", ");
    return {
        snakeCase: "myFunction(" + snakeCaseString + ");",
        camelCase: "myFunction(" + camelCaseString + ");",
    }
}

// Das hier ist die eigentliche Experimentdefinition
document.experiment_definition(
    {
        experiment_name: "Stefan First Trial",
        seed: "42",
        introduction_pages: ["Interessiert mich nicht.\n\nPress [Enter] to continue."],
        pre_run_instruction: "Gleich gehts los.\n\nWhen you press [Enter] the tasks directly start.",
        finish_pages: ["Thanks for nothing. When you press [Enter], the experiment's data will be downloaded."],
        layout: [
            {variable: "case", treatments: ["camel", "snake"]}, {
                variable: "word count",
                treatments: ["4", "5", "6", "7", "8", "9"]
            }
        ],
        repetitions: 7,                    // Anzahl der Wiederholungen pro Treatmentcombination
        accepted_responses: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"], // Tasten, die vom Experiment als Eingabe akzeptiert werden
        task_configuration: (t) => {
            // Das hier ist der Code, der jeder Task im Experiment den Code zuweist.
            // Im Feld code steht der Quellcode, der angezeigt wird,
            // in "expected_answer" das, was die Aufgabe als Lösung erachtet
            // In das Feld "given_answer" trägt das Experiment ein, welche Taste gedrückt wurde
            //
            // Ein Task-Objekt hat ein Feld treatment_combination, welches ein Array von Treatment-Objekten ist.
            // Ein Treatment-Objekt hat zwei Felder:
            //     variable - Ein Variable-Objekt, welches das Feld name hat (der Name der Variablen);
            //     value - Ein String, in dem der Wert des Treatments steht.
            const functionCalls = getFunctionCall(parseInt(t.treatment_combination[1].value));
            t.expected_answer = t.treatment_combination[1].value;
            if (t.treatment_combination[0].value === "camel")
                t.code = functionCalls.camelCase;
            else
                t.code = functionCalls.snakeCase;


            // im Feld after_task_string steht eine Lambda-Funktion, die ausgeführt wird
            // wenn eine Task beantwortet wurde. Das Ergebnis der Funktion muss ein String
            // sein.
            t.after_task_string = () => "You answered the task. The correct answer is " + t.expected_answer + ".\n\nPress [Enter] to continue.";
        }
    }
);