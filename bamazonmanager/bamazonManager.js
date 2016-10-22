var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "Bamazon"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected as ID: " + connection.threadId);
    start();
});

var start = function() {
    inquirer.prompt({
        name: "options",
        type: "rawlist",
        message: "Would you like to [View Inventory], [View Low Inventory], [Add Inventory] or [Add New Product]?",
        choices: ["View Inventory", "View Low Inventory", "Add Inventory", "Add New Product"]
    }).then(function(answer) {
        if (answer.options.toUpperCase() == "VIEW INVENTORY") {
            viewInventory();
        } else if (answer.options.toUpperCase() == "VIEW LOW INVENTORY") {
            lowInventory();
        } else if (answer.options.toUpperCase() == "ADD INVENTORY") {
            addInventory();
        } else if (answer.options.toUpperCase() == "ADD NEW PRODUCT") {
            addProduct();
        }
    })
};

var viewInventory = function() {
    connection.query('SELECT * FROM products', function(err, res) {
        if (err) {
            throw err;
        } else {
            console.log("------ Bamazon Products for Sale ------\n")
            for (var i = 0; i < res.length; i++) {
                console.log(res[i].ItemID + ") " + res[i].ProductName);
                console.log("Price: " + "$" + res[i].Price + " USD");
                console.log("Stock Quantity: " + res[i].StockQuantity + "\n");
            }
            start();
        }
    })
};

var lowInventory = function() {
    connection.query("SELECT * FROM products WHERE (StockQuantity)<5", function(err, res) {
        if (err) {
            console.log(err);
        } else {
            console.log('\x1b[31m', "\nThe following products are low on inventory (less than 5 available): \n", '\x1b[0m');
            for (var i = 0; i < res.length; i++) {
                console.log(res[i].ItemID + ") " + res[i].ProductName);
                console.log("Price: " + "$" + res[i].Price + " USD");
                console.log("Stock Quantity: " + res[i].StockQuantity + "\n");
            }
            start();
        }
    });

}
