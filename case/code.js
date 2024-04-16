// Das Beispielexperiment erzeugt als Fragen nur die Zahlen 0-9.
// Ein Experimentteilnehmer kann die Zahlen 1-3 drücken
//
// Die Experimentdefinition erfolgt über Aufruf der Funktion
//  - document.experiment_definition(...)
// Falls eine Zufallszahl benötigt wird, erhält man sie durch den Methodenaufruf
//  - document.new_random_integer(...Obergrenze...);
//
// WICHTIG: Man sollte new_random_integer nur innerhalb  der Lambda-Funktion ausführen, also NICHT
// an einer anderen Stelle, damit man ein reproduzierbares Experiment erhält!

function random_int(max) {
    return document.new_random_integer(max);
}

function random_bool() {
    return document.new_random_integer(2) > 0;
}

const words = [
    "apple",
    "banana",
    "carrot",
    "dog",
    "elephant",
    "fish",
    "grape",
    "hat",
    "icecream",
    "jacket",
    "kiwi",
    "lemon",
    "mango",
    "notebook",
    "orange",
    "pear",
    "quilt",
    "rabbit",
    "strawberry",
    "turtle",
    "umbrella",
    "vase",
    "watermelon",
    "xylophone",
    "yogurt",
    "zebra",
    "ant",
    "ball",
    "cat",
    "dolphin",
    "egg",
    "fox",
    "guitar",
    "hamster",
    "ink",
    "jellyfish",
    "koala",
    "lion",
    "monkey",
    "noodle",
    "owl",
    "penguin",
    "quokka",
    "rhino",
    "snail",
    "tiger",
    "unicorn",
    "violin",
    "walrus",
    "xylophone",
    "yak",
    "zeppelin",
    "anchor",
    "bag",
    "candy",
    "donut",
    "ear",
    "feather",
    "globe",
    "hat",
    "igloo",
    "jam",
    "kangaroo",
    "lamp",
    "muffin",
    "nail",
    "octopus",
    "pencil",
    "quilt",
    "robot",
    "sock",
    "towel",
    "umbrella",
    "violin",
    "waffle",
    "xylophone",
    "yacht",
    "zebra",
    "apple",
    "banana",
    "carrot",
    "dog",
    "elephant",
    "fish",
    "grape",
    "hat",
    "icecream",
    "jacket",
    "kiwi",
    "lemon",
    "mango",
    "notebook",
    "orange",
    "pear",
    "quilt",
    "rabbit",
    "strawberry",
    "turtle",
    "umbrella",
    "vase",
    "watermelon",
    "xylophone",
    "yogurt",
    "zebra",
    "ant",
    "ball",
    "cat",
    "dolphin",
    "egg",
    "fox",
    "guitar",
    "hamster",
    "ink",
    "jellyfish",
    "koala",
    "lion",
    "monkey",
    "noodle",
    "owl",
    "penguin",
    "quokka",
    "rhino",
    "snail",
    "tiger",
    "unicorn",
    "violin",
    "walrus",
    "xylophone",
    "yak",
    "zeppelin",
    "anchor",
    "bag",
    "candy",
    "donut",
    "ear",
    "feather",
    "globe",
    "hat",
    "igloo",
    "jam",
    "kangaroo",
    "lamp",
    "muffin",
    "nail",
    "octopus",
    "pencil",
    "quilt",
    "robot",
    "sock",
    "towel",
    "umbrella",
    "violin",
    "waffle",
    "xylophone",
    "yacht",
    "zebra"
];

const getRandomWord = () => {
    const randomIndex = Math.floor(Math.random() * words.length);
    return words[randomIndex];
}

const getWordList = (length, duplicateGoal) => {
    const selectedWords = [];
    const duplicateWord = getRandomWord();
    while (selectedWords.length < length) {
        selectedWords.push(getRandomWord());
    }
    for (let i = 0; i < duplicateGoal; i++) {
        const index = random_int(selectedWords.length - 1);
        selectedWords[index] = duplicateWord;
    }
    const duplicateCount = selectedWords.filter((word) => word === duplicateWord).length;
    return {
        list: selectedWords,
        duplicateWord: duplicateWord,
        duplicateCount: duplicateCount
    };
}

function renderSnakeCase(wordList) {
    return wordList.join("_").toLowerCase();
}

function renderNoCase(wordList) {
    return wordList.join("").toLowerCase();
}

function renderCamelCase(wordList) {
    const x = wordList.map(x => x.charAt(0).toUpperCase() + x.slice(1).toLowerCase()).join("");
    return x.charAt(0).toLowerCase() + x.slice(1);
}

// Das hier ist die eigentliche Experimentdefinition
document.experiment_definition(
    {
        experiment_name: "CamelCase vs. Snake_Case Experiment",
        seed: "42",
        introduction_pages: ["Zähle in folgenden Strings die Häufigkeit eines bestimmten Wortes. Anworte mit dem Numpad. Du kannst nach jeder Antwort eine Pause machen. \n\nPress [Enter] to continue."],
        pre_run_instruction: "Gleich gehts los.\n\nWhen you press [Enter] the tasks directly start.",
        finish_pages: ["Thanks for nothing. When you press [Enter], the experiment's data will be downloaded."],
        layout: [
            {variable: "Case", treatments: ["Camel_Case", "Snake_Case", "No_Case"]}
        ],
        repetitions: 20,                    // Anzahl der Wiederholungen pro Treatmentcombination
        accepted_responses: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"], // Tasten, die vom Experiment als Eingabe akzeptiert werden
        task_configuration: (t) => {
            const length = random_int(12) + 5;
            const duplicateGoal = random_int(length - 3) + 1;
            const task = getWordList(length, duplicateGoal);
            const wordList = task.list;
            const duplicateCount = task.duplicateCount;
            const duplicateWord = task.duplicateWord;
            if (t.treatment_combination[0].value === "Camel_Case")
                t.code = "Count the word " + duplicateWord + "\n\n" + renderCamelCase(wordList)
            else if (t.treatment_combination[0].value === "Snake_Case")
                t.code = "Count the word " + duplicateWord + "\n\n" + renderSnakeCase(wordList)
            else
                t.code = "Count the word " + duplicateWord + "\n\n" + renderNoCase(wordList);

            t.expected_answer = "" + duplicateCount;

            // im Feld after_task_string steht eine Lambda-Funktion, die ausgeführt wird
            // wenn eine Task beantwortet wurde. Das Ergebnis der Funktion muss ein String
            // sein.
            t.after_task_string = () => "Correct Answer is " + duplicateCount + "\n\nSome nice text between the tasks";
        }
    }
);