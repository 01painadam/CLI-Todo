#!/usr/bin/env node
'use strict';

let program = require('commander');
let fs = require('fs');

const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;

const TASK_JSON_PATH = "./todo.json";

//FUNCTIONS/////////////////////////////////////////////////////////////////////////

let init = () => {
    //create file if it's not already present.
    if (!fs.existsSync(TASK_JSON_PATH)) {
        console.log("Initialising storage.\n Creating `todo.json` file");
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


let setData = data => {
    //strigify JSON
    let dataString = JSON.stringify(data);

    //write to  file
    fs.writeFileSync(TASK_JSON_PATH, dataString);
}

let objectify = (x, id_count) => {
    let obj = {

        id: id_count,
        task: x,
        done: false

    }
    return obj;

}

let menu = () => {
    console.log('ADD: todo add <task description>');
    console.log('EDIT: todo edit <id> <new task description> ');
    console.log('DEL & RES: todo [del|res] <id>');
    console.log('List all: todo list');
    console.log('Help: todo help');
}

let renumber = data => {

    for (let i in data) {

        data[i].id = i;

    }

    return data;

}

let list = () => {

    let data = getData();

    if (data.length > 0) {

        for (let i in data) console.log(data[i]);

    }
    else { console.log('\nNo tasks in list!\n'); }

}

let add = task => {

    let data = getData();
    let id = data.length;

    data.push(objectify(task, id));

    setData(data);

    list();

}

let res = id => {

    let data = getData();

    //toggle whether task is resolved
    data[id].done != data[id].done;

    setData(data);

    list();

}

let del = id => {

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

//MONGO///////////////////////////////////////////

let save = () => {

    MongoClient.connect('mongodb://01painadam:Aj6owp!1@ds143744.mlab.com:43744/test_cli_db', (err, db) => {
        if (err) return console.log(err);

        let data = getData();

        for (let i in data) {
            db.collection('notes').insertOne(data[i], (err, result) => {
                if (err) return console.log(err);
                console.log(`Saved ${data[i]} to Database.\n`);
            })
        }
        db.close();

    })

}



//CODE////////////////////////////////////////////


init();

program
    .version('0.0.1')
    .command('add <task>')
    .description('Add a new task to list') 
    .action(

    task => {
        console.log('User passed task: %s', task);
        add(task);

    }

    )

program
    .version('0.0.1')
    .command('edit <id> <new_task>')
    .description('Edit a task by id') 
    .action(

    (id, new_task) => {
        console.log('Edited task: %s', id);
        edit(id, new_task);

    }

    )

program
    .version('0.0.1')
    .command('del <id>')
    .description('Delete task by id')  
    .action(

    id => {
        console.log('Deleting task: %s', id);
        del(id);
    }

    )

program
    .version('0.0.1')
    .command('res <id>')
    .description('Resolvee task as "done" by id')
    .action(

    id => {
        console.log('Resolving task: %s', id);
        res(id);
    }

    )

program
    .version('0.0.1')
    .command('list')
    .description('List all tasks') //<REQUIRED INPUT> 
    .action(

    () => {
        console.log('Tasks: ');
        list();
    }

    )

program
    .version('0.0.1')
    .command('help')
    .description('Show help menu') //<REQUIRED INPUT> 
    .action(

    () => {
        menu();
    }

    )

program
    .version('0.0.1')
    .command('save')
    .description('Save database to remote Mongo') //<REQUIRED INPUT> 
    .action(

    () => {
        save();
    }

    )

program.parse(process.argv);


