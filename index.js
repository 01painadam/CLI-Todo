#!/usr/bin/env node
var program = require('commander');
var fs = require('fs');
var TASK_JSON_PATH = "./todo.json";

init();

program
    .version('0.0.1')
    .command('run <arg1> [arg2] [arg3]')
    .description('Run todo list')
    //.option('-a, --all','Select all (for del or res only')
    .action(

        (arg1,arg2,arg3) => {
            
            switch(arg1){
                case "add":
                    add(arg2);
                    break;
                case "res":
                    done(arg2);
                    break;
                case "del":
                    del(arg2);
                    break;
                case "edit":
                    edit(arg2, arg3);
                    break;
                case "help":
                    menu();
                    break;
                case 'list':
                    list();
                    break;
                default:
                    console.log("Command not found!!\n");
                    break;
            }
        }

    )

program.parse(process.argv);

//FUNCTIONS/////////////////////////////////////////////////////////////////////////

function init() {
    //create file if it's not already present.
    if (!fs.existsSync(TASK_JSON_PATH)) {
        console.log("Initialising storage.\nCreating `todo.json` file...\n\n");
        setData([]);
    }

}

function getData() {
    //read file contents
    var contents = fs.readFileSync(TASK_JSON_PATH);

    //parse contents
    var data = JSON.parse(contents);

    return data;
}


function setData(data) {
    //strigify JSON
    var dataString = JSON.stringify(data);

    //write to  file
    fs.writeFileSync(TASK_JSON_PATH, dataString);
}

function objectify(x, id_count) {
    var obj = {

        id: id_count,
        task: x,
        done: false

    }
    return obj;

}

function menu() {
    console.log('ADD: todo run add <task description>');
    console.log('EDIT: todo run edit <id> <new task description> ');
    console.log('DEL & RES: todo run [del|res] <id>');
    console.log('List all: todo run list');
    console.log('Help: todo run help');
}

function renumber(data) {

    for (var i in data) {

        data[i].id = i;

    }

    return data;

}

function list() {

    var data = getData();

    if (data.length > 0) {

        for (var i in data) console.log(data[i]);

    }
    else { console.log('\nNo tasks in list!\n'); }

}

function add(task) {

    var data = getData();
    var id = data.length;

    data.push(objectify(task, id));

    setData(data);

    list();

}

function resolved(id) {

    var data = getData();

    //toggle whether task is resolved
    data[id].done != data[id].done;

    setData(data);

    list();

}

function del(id) {

    var data = getData();

    data.splice(id, 1);

    data = renumber(data);

    setData(data);

    list();

}

function edit(id, edit) {

    var data = getData();

    data[id].task = edit;

    setData(data);

    list();

}
