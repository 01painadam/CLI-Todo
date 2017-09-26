#!/usr/bin/env node
console.log("\nExecuting...\n");

/*

ADD -a
DEL -d
RES -r
EDIT -e (not implemented yet!)
LIST -l
HELP

*/

var program = require('commander');
var fs = require('fs');
var TASK_JSON_PATH = "./todo.json";

init();

program
.version('0.0.1')
.command('add <task>')
.description('Add a new task to list') //<REQUIRED INPUT> 
.action(

    task => {
        console.log('User passed task: %s' , task);
        add(task);

}
    
)

program
.version('0.0.1')
.command('del <id>')
.description('Delete task by id') //<REQUIRED INPUT> 
.action(

    id => {
        console.log('Deleting task: %s' , id);
        del(id);
    }
    
)

program
.version('0.0.1')
.command('res <id>')
.description('Resolvee task as "done" by id') //<REQUIRED INPUT> 
.action(

    id => {
        console.log('Resolving task: %s' , id);
        done(id);
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

program.parse(process.argv);

//FUNCTIONS/////////////////////////////////////////////////////////////////////////



function init () {
	//create file if it's not already present.
	if(!fs.existsSync(TASK_JSON_PATH)){
		console.log("Initialising storage.\n Creating `todo.json` file");
		setData([]);	
	}
	
}

function getData () {
	//read file contents
	var contents = fs.readFileSync(TASK_JSON_PATH);

	//parse contents with cheese
    var data = JSON.parse(contents);

	return data;
}


function setData (data) {
	//strigify JSON
	var dataString = JSON.stringify(data);

	//write to  file
	fs.writeFileSync(TASK_JSON_PATH,dataString);
}

function objectify (x, id_count) {
    var obj = {

        id: id_count,
        task: x,
        done: false

    }
    return obj;

}

function menu() {
	console.log('Usage: todo [add|del|res|list|help] <task description|id>');
	console.log('`task description` is a string only when using `add`\n and a number for `id` in all other commands.');
	console.log('Using `todo` without arguments lists all tasks');
}

function renumber (data) {
    
    for (var i in data) {
    
        data[i].id = i;
           
    }

    return data;
        
}

function list () {

    var data = getData();

    if(data.length > 0){

        for (var i in data) console.log(data[i]);

    }
    else{console.log('\nNo tasks in list!\n');}

}

function add (task) {

    var data = getData();
    var id = data.length;

    data.push(objectify(task, id));

    setData(data);

    list();

}

function resolved (id) {

    var data = getData();

    //toggle whether task is resolved
    data[id].done != data[id].done;

    setData(data);

    list();

}

function del (id) {
    
        var data = getData();
    
        data.splice(id, 1);

        data = renumber(data);
    
        setData(data);
    
        list();
    
}
