const words = [
    "algorithm", "backend", "binary", "bytecode",
    "callback", "closure", "compiler", "constant", "constructor",
    "data", "database", "debug", "dependency", "development",
    "encryption", "expression", "framework", "function",
    "gateway", "hash", "identifier", "index", "inheritance",
    "instance", "interface", "iteration", "library", "loop",
    "machine", "method", "module", "namespace", "object",
    "operator", "optimization", "parameter", "pointer",
    "polymorphism", "protocol", "query", "recursion", "reference",
    "repository", "runtime", "script", "server", "singleton",
    "socket", "source", "stack", "syntax", "testing",
    "thread", "transaction", "variable", "version", "virtual",
    "workflow", "wrapper", "architecture", "bitwise", "byte",
    "cache", "cipher", "client", "cluster", "command",
    "compile", "compute", "configure", "connect", "container",
    "context", "control", "deploy", "deserialize", "disk",
    "dispatch", "distributed", "encode", "engine", "execute",
    "export", "fetch", "flag", "flush", "grid",
    "heap", "hook", "import", "indexer", "initialize",
    "integrate", "interpreter", "iterate", "junction", "keyword"
];

function random_word() {
    return words[random_int(words.length)];
}

function get_random_var_name(case_type) {
    let var_words = [];
    for (let i = 0; i < random_int_in_range(2, 4); i++) {
        var_words.push(random_word());
    }
    if (case_type == "Camel") {
        return render_camel_case(var_words);
    }
    return render_snake_case(var_words);
}

function generateTask(direct_reference, case_type) {
    const indent = ' ';
    let code = '';
    let varNames = [];
    let directValues = [];
    let refValues = [];
    let direct_value_count = 4;
    let ref_value_count = 5;
    let direct_value_ints = x_random_ints_in_range_without_doubles(direct_value_count, 0, 9);
    for (let i = 0; i < direct_value_count; i++) {
        const varName = get_random_var_name(case_type);
        const value = direct_value_ints[i];
        varNames.push(varName);
        directValues.push(value);
        code += `${i + 1}. ${indent}int ${varName} = ${value};\n`;
    }

    for (let i = 0; i < ref_value_count; i++) {
        const varName = get_random_var_name(case_type);
        const refIndex = random_int_in_range(0, directValues.length - 1);
        varNames.push(varName);
        refValues.push(directValues[refIndex]);
        code += `${i + direct_value_count + 1}. ${indent}int ${varName} = ${varNames[refIndex]};\n`;
    }

    let returnValue = 0;
    code += direct_value_count + ref_value_count + 1 + ".\n";
    if (direct_reference) {
        const randomIndex = random_int_in_range(0, directValues.length - 1);
        returnValue = directValues[randomIndex];
        code += `${direct_value_count + ref_value_count + 2}. ${indent}return ${varNames[randomIndex]};\n`;
    } else {
        const randomIndex = random_int_in_range(0, 1);
        returnValue = refValues[randomIndex];
        code += `${direct_value_count + ref_value_count + 2}.${indent}return ${varNames[randomIndex + directValues.length]};\n`;
    }

    return {
        code: code.trim(),
        returnValue: returnValue
    };
}

function render_snake_case(word_list) {
    return word_list.join("_").toLowerCase();
}

function render_camel_case(word_list) {
    const x = word_list.map(x => x.charAt(0).toUpperCase() + x.slice(1).toLowerCase()).join("");
    return x.charAt(0).toLowerCase() + x.slice(1);
}


function random_int(border) {
    return document.new_random_integer(border);
}

function random_int_in_range(from, to) {
    return document.new_random_integer(to - from) + from;
}

function x_random_ints_in_range_without_doubles(x, from, to) {
    let result = [];
    for (let i = 0; i < x; i++) {
        let randomInt = random_int_in_range(from, to);
        while (result.includes(randomInt)) {
            randomInt = random_int_in_range(from, to);
        }
        result.push(randomInt);
    }
    return result;
}

function random_bool() {
    return document.new_random_integer(2) > 0;
}

// Das hier ist die eigentliche Experimentdefinition
document.experiment_definition(
    {
        experiment_name: "CaseReturnValue",
        seed: "42",
        introduction_pages: ["Please, just do this experiment only, when you have enough time, are concentrated enough, and motivated enough.\n\nPlease, open the browser in fullscreen mode (probably by pressing [F11]).",
            "In this experiment, you will be asked to give the return value of a Code snippet.\n\nDon't worry, the snippets are not too complex. \n\nPress [Enter] to continue."],
        pre_run_instruction: "Gleich gehts los.\n\nWhen you press [Enter] the tasks directly start.",
        finish_pages: ["Thanks for nothing. When you press [Enter], the experiment's data will be downloaded."],
        layout: [
            {variable: "Case", treatments: ["Camel", "Snake"]},
            {variable: "DirectReference", treatments: ["true", "false"]}
        ],
        repetitions: 5,                    // Anzahl der Wiederholungen pro Treatmentcombination
        accepted_responses: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"], // Tasten, die vom Experiment als Eingabe akzeptiert werden
        task_configuration: (t) => {
            const task = generateTask(t.treatment_combination[1].value === "true", t.treatment_combination[0].value);
            t.code = task.code;
            t.expected_answer = "" + task.returnValue;
            t.after_task_string = () => {
                const correctAnswer = t.given_answer === t.expected_answer ? "CORRECT." : "WRONG. \nThe correct answer is " + t.expected_answer + ".";
                return "Your answer was " + correctAnswer + "\n\nPress [Enter] to continue.";
            };
        }
    }
);