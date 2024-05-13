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

let booleans = ["is", "has", "can", "deleted", "blocked", "updated", "created"];
let words = ["apple", "banana", "carrot", "dog", "elephant", "fish", "grape", "hat", "jacket", "kiwi", "lemon", "mango", "orange", "pear", "quilt", "rabbit", "turtle", "umbrella", "vase", "xylophone", "yogurt", "zebra", "ant", "ball", "cat", "dolphin", "egg", "fox", "guitar", "hamster", "ink", "koala", "lion", "monkey", "noodle", "owl", "penguin", "rhino", "snail", "tiger", "unicorn", "violin", "walrus"];
let types = ["String", "int", "boolean", "double", "char", "float", "long", "short", "byte", "List<String>", "List<int>", "List<boolean>", "List<double>", "List<char>", "List<float>", "List<long>", "List<short>", "List<byte>"];
let modifiers = ["public", "private", "protected"];

function getRandomModifier() {
    return modifiers[document.new_random_integer(modifiers.length)];
}

function getRandomWords() {
    let boolean = booleans[document.new_random_integer(booleans.length)];
    let word = words[document.new_random_integer(words.length)];
    return [boolean, word];
}

function renderSnakeCase(wordList) {
    return wordList.join("_").toLowerCase();
}

function renderCamelCase(wordList) {
    const x = wordList.map(x => x.charAt(0).toUpperCase() + x.slice(1).toLowerCase()).join("");
    return x.charAt(0).toLowerCase() + x.slice(1);
}


function random_int(border) {
    return document.new_random_integer(border);
}

function random_int_in_range(from, to) {
    return document.new_random_integer(to - from) + from;
}

function random_bool() {
    return document.new_random_integer(2) > 0;
}

function getRandomType() {
    return types[random_int(types.length)];
}

function getRandomSnakeCase() {
    return renderSnakeCase(getRandomWords());
}

function getRandomCamelCase() {
    return renderCamelCase(getRandomWords());
}

function getCodeWithRowNumbers(code) {
    const lines = code.split("\n");
    let codeWithRowNumbers = '';
    for (let i = 0; i < lines.length; i++) {
        codeWithRowNumbers += `${i + 1}:  ${lines[i]}\n`;
    }
    return codeWithRowNumbers;
}

function getSetterVarName(isCamelCase, word) {
    if (isCamelCase) {
        return word.charAt(0).toUpperCase() + word.slice(1);
    } else {
        return "_" + word;
    }
}

function generateTask(isErrorCode, isCamelCase, errorLineRange) {
    const split = errorLineRange.split("-");
    const from = parseInt(split[0]) - 1;
    const to = parseInt(split[1]) - 1;
    // Zufällige Variablennamen generieren
    let variable1 = isCamelCase ? getRandomCamelCase() : getRandomSnakeCase();
    let variable2 = isCamelCase ? getRandomCamelCase() : getRandomSnakeCase();
    let type1 = getRandomType();
    let type2 = getRandomType();

    // Klassenname generieren
    let className = isCamelCase ? "TestClass" : "test_class";

    // Variablendeklarationen generieren

    let variableDeclarationCode = `    ${getRandomModifier()} ${type1} ${variable1};\n    private ${type2} ${variable2};\n`;

    // Konstruktor generieren
    let constructorCode = `    ${getRandomModifier()} ${className}(${type1} ${variable1}, ${type2} ${variable2}) {\n        this.${variable1} = ${variable1};\n        this.${variable2} = ${variable2};\n    }\n`;

    // Getter und Setter generieren
    let getterSetterCode = '';
    getterSetterCode += `    ${getRandomModifier()} ${type1} get${getSetterVarName(isCamelCase, variable1)}() {\n        return this.${variable1};\n   }\n`;
    getterSetterCode += `   ${getRandomModifier()} void set${getSetterVarName(isCamelCase, variable1)}(${type1} ${variable1}) {\n       this.${variable1} = ${variable1};\n   }\n`;
    getterSetterCode += `   ${getRandomModifier()} ${type2} get${getSetterVarName(isCamelCase, variable2)}() {\n       return this.${variable2};\n   }\n`;
    getterSetterCode += `   ${getRandomModifier()} void set${getSetterVarName(isCamelCase, variable2)}(${type2} ${variable2}) {\n       this.${variable2} = ${variable2};\n   }\n`;

    let code = ` ${getRandomModifier()} class ${className} {\n${variableDeclarationCode}${constructorCode}${getterSetterCode}}`
    let errorLine = -1;
    //Generate Error at variable name
    if (isErrorCode) {
        const lines = code.split("\n");
        let var1 = null;
        let count = 500;
        while (errorLine < 0 && count > 0) {
            const randomLine = random_int_in_range(from, to);
            if (lines[randomLine].includes(variable1) || lines[randomLine].includes(variable2)) {
                if (lines[randomLine].includes(variable1)) {
                    var1 = true;
                }
                errorLine = randomLine;
            }
            count--;
        }
        if (var1) {
            //Remove random char of variable1
            const randomChar = random_int(variable1.length);
            const startIndexOfVar1 = lines[errorLine].indexOf(variable1);
            lines[errorLine] = lines[errorLine].substring(0, startIndexOfVar1 + randomChar) + lines[errorLine].substring(startIndexOfVar1 + randomChar + 1);
        } else {
            //Remove random char of variable2 in line
            const randomChar = random_int(variable2.length);
            const startIndexOfVar2 = lines[errorLine].indexOf(variable2);
            lines[errorLine] = lines[errorLine].substring(0, startIndexOfVar2 + randomChar) + lines[errorLine].substring(startIndexOfVar2 + randomChar + 1);
        }
        code = lines.join("\n");
    }

    const codeWithRowNumbers = getCodeWithRowNumbers(code);

    // Rückgabe der Java-Klassenstruktur
    const actualErrorLine = errorLine < 0 ? -1 : errorLine + 1;
    return {
        className: className,
        errorLine: actualErrorLine,
        javaCode: codeWithRowNumbers,
    };
}


// Das hier ist die eigentliche Experimentdefinition
document.experiment_definition(
    {
        experiment_name: "Case Code Errors",
        seed: "42",
        introduction_pages: ["In this experiment you will be shown Java code snippets.\nYour task is to determine whether the code is correct or not. \nIf the code is incorrect, you have to press the key '1' for correct code and the '2' for incorrect code."],
        pre_run_instruction: "Now the Experiment will start. \nPress '2' for correct code and '1' for incorrect code.\n\nPress [Enter] to start the experiment.",
        finish_pages: ["Thanks for nothing. When you press [Enter], the experiment's data will be downloaded."],
        layout: [
            {variable: "Case", treatments: ["Camel_Case", "Snake_Case"]},
            {variable: "is_error_code", treatments: ["true", "false"]},
            {variable: "error_line", treatments: ["4-7", "8-13", "14-19"]}
        ],
        repetitions: 5,                    // Anzahl der Wiederholungen pro Treatmentcombination
        accepted_responses: ["1", "2"], // Tasten, die vom Experiment als Eingabe akzeptiert werden
        task_configuration: (t) => {
            const isErrorCode = t.treatment_combination[1].value === "true";
            let task = generateTask(isErrorCode, t.treatment_combination[0].value == "Camel_Case", t.treatment_combination[2].value);
            t.code = task.javaCode;
            t.expected_answer = isErrorCode ? "1" : "2";
            const errorLine = isErrorCode ? "The Code was incorrect at line " + task.errorLine + "." : "The Code was correct.";
            t.after_task_string = () => {
                const correctAnswer = t.given_answer === t.expected_answer ? "CORRECT." : "WRONG. \nThe correct answer is " + t.expected_answer + ".";
                return "Your answer was " + correctAnswer + "\n" + errorLine + "\n\nPress [Enter] to continue.";
            };
        }
    }
);