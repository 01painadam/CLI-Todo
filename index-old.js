#!/usr/bin/env node
'use strict';

let program = require('commander');
let fs = require('fs');

const TASK_JSON_PATH = "./todo.json";

//FUNCTIONS/////////////////////////////////////////////////////////////////////////

let init = () => {
    //create file if it's not already present.
    if (!fs.existsSync(TASK_JSON_PATH)) {
        console.log("Initialising storage.\nCreating `todo.json` file...\n\n");
        setData([]);
    }

}

let getData = () => {
    //read file contents
    let contents = fs.readFileSync(TASK_JSON_PATH);

    //parse contents
    let data = JSON.parse(contents);

    return data;
}


let setData = (data) =>  {
    //strigify JSON
    let dataString = JSON.stringify(data);

    //write to  file
    fs.writeFileSync(TASK_JSON_PATH, dataString);
}

let objectify = (x, id_count) =>  {
    let obj = {

        id: id_count,
        task: x,
        done: false

    }
    return obj;

}

let menu = () =>  {
    console.log('ADD: todo run add <task description>');
    console.log('EDIT: todo run edit <id> <new task description> ');
    console.log('DEL & RES: todo run [del|res] <id>');
    console.log('List all: todo run list');
    console.log('Help: todo run help');
}

let renumber = (data) =>  {

    for (let i in data) {

        data[i].id = i;

    }

    return data;

}

let list = () =>  {

    let data = getData();

    if (data.length > 0) {

        for (let i in data) console.log(data[i]);

    }
    else { console.log('\nNo tasks in list!\n'); }

}

let add = (task) => {

    let data = getData();
    let id = data.length;

    data.push(objectify(task, id));

    setData(data);

    list();

}

let resolved = (id) => {

    let data = getData();

    //toggle whether task is resolved
    data[id].done != data[id].done;

    setData(data);

    list();

}

let del = (id) => {

    let data = getData();

    data.splice(id, 1);

    data = renumber(data);

    setData(data);

    list();

}

let edit = (id, edit) => {

    let data = getData();

    data[id].task = edit;

    setData(data);

    list();

}

//CODE//////////////////////////////////

init();

program
    .version('0.0.1')
    .command('run <arg1> [arg2] [arg3]')
    .description('Run todo list')
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

