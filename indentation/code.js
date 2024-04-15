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

const random_bool = () => Math.random() < 0.5;

const random_int = (max) => Math.floor(Math.random() * max);

// Funktion zum Generieren eines zufälligen if-else-Statements
const generateStatement = (statements) => {
    const bool = random_bool();
    const trueNumber = random_int(statements - 1);
    const falseNumber = statements - trueNumber - 1;
    return `if(${bool}){\n${trueNumber > 0 ? generateStatement(trueNumber) : `return ${random_int(9)};`}\n}else{\n${falseNumber > 0 ? generateStatement(falseNumber) : `return ${random_int(9)};`}\n}`;
};
const getSolution = (statement) => {
    const evaluateFunction = new Function(statement);
    return evaluateFunction();
};

const indentCode = (code) => {
//todo: implement
    return code;
}
const generateTask = () => {
    const statement = generateStatement(6);
    const solution = getSolution(statement);
    const indentedStatement = indentCode(statement);
    return {
        statement: statement,
        indentedStatement: indentedStatement,
        solution: solution
    }
}
// Das hier ist die eigentliche Experimentdefinition
document.experiment_definition(
    {
        experiment_name: "Indentation Experiment in if-else-Statements",
        seed: "42",
        introduction_pages: ["Interessiert mich nicht.\n\nPress [Enter] to continue."],
        pre_run_instruction: "Gleich gehts los.\n\nWhen you press [Enter] the tasks directly start.",
        finish_pages: ["Thanks for nothing. When you press [Enter], the experiment's data will be downloaded."],
        layout: [
            {variable: "Indentation", treatments: ["Indented", "Not Indented"]}
        ],
        repetitions: 2,                    // Anzahl der Wiederholungen pro Treatmentcombination
        accepted_responses: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"], // Tasten, die vom Experiment als Eingabe akzeptiert werden
        task_configuration: (t) => {
            const task = generateTask();
            console.log(task)
            if (t.treatment_combination[0].value === "Indented")
                t.code = task.indentedStatement;
            else
                t.code = task.statement;

            t.expected_answer = "" + task.solution;


            // im Feld after_task_string steht eine Lambda-Funktion, die ausgeführt wird
            // wenn eine Task beantwortet wurde. Das Ergebnis der Funktion muss ein String
            // sein.
            t.after_task_string = () => "Some nice text between the tasks";
        }
    }
);