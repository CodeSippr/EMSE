function random_int(max) {
    return document.new_random_integer(max);
}

function random_bool() {
    return document.new_random_integer(2) > 0;
}

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
    const rows = code.split("\n");
    let indent = 0;
    for (let i = 0; i < rows.length; i++) {
        if (rows[i].includes("}")) {
            indent--;
        }
        rows[i] = " ".repeat(indent * 4) + rows[i];
        if (rows[i].includes("{")) {
            indent++;
        }
    }
    code = rows.join("\n");
    return code;
}
const generateTask = () => {
    const statement = generateStatement(8);
    const solution = getSolution(statement);
    const indentedStatement = indentCode(statement);
    return {
        statement: statement,
        indentedStatement: indentedStatement,
        solution: solution
    }
}

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
        repetitions: 10,
        accepted_responses: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
        task_configuration: (t) => {
            const task = generateTask();
            if (t.treatment_combination[0].value === "Indented")
                t.code = task.indentedStatement;
            else
                t.code = task.statement;

            t.expected_answer = "" + task.solution;
            t.after_task_string = () => "You answered the task. The correct answer is " + t.expected_answer + ".\n\nPress [Enter] to continue.";
        }
    }
);