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
    console.log("Welcome, you have connected to the Bamazon inventory management system.");
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
    		console.log("wat")
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

var addInventory = function() {
    connection.query('SELECT * FROM products', function(err, res) {
        inquirer.prompt({
            name: "choice",
            type: "list",
            choices: function(value) {
                var itemArray = [];
                for (var i = 0; i < res.length; i++) {
                    itemArray.push((res[i].ItemID).toString());
                }
                return itemArray;
            },
            message: "What item do you want to add inventory to?"
        }).then(function(answer) {
            for (var i = 0; i < res.length; i++) {
                if (res[i].ItemID == answer.choice) {
                    var chosenItem = res[i];
                    console.log("You chose: " + res[i].ProductName);
                    inquirer.prompt({
                        name: "amount",
                        type: "input",
                        message: "How much would you like to add?",
                        validate: function(managerInput) {
                            if ((managerInput.search(/^[\d]+$/)) === -1) {
                                console.log('\x1b[31m', "\nPlease enter a valid whole number input.", '\x1b[0m');
                            } else {
                                return (managerInput.search(/^[\d]+$/) !== -1);
                            }
                        },
                    }).then(function(answer) {
                        var newAmount = (parseInt(chosenItem.StockQuantity) + parseInt(answer.amount));
                        console.log(newAmount);
                        connection.query("UPDATE products SET ? WHERE ?", [{
                            StockQuantity: newAmount
                        }, {
                            ItemID: chosenItem.ItemID
                        }], function(err, res) {
                            console.log(" There are now " + newAmount + " " + chosenItem.ProductName + " remaining.");
                            anotherItem();
                        });
                    });
                };
            };
        });
    });
};

var addProduct = function() {
    inquirer.prompt([{
        name: "name",
        type: "input",
        message: "Please enter a product name",
    }, {
        name: "price",
        type: "input",
        message: "Please enter a price for the product",
        validate: function(managerInput) {
            if ((managerInput.search(/^[\d]+$/)) === -1) {
                console.log('\x1b[31m', "\nPlease enter a valid whole number input.", '\x1b[0m');
            } else {
                return (managerInput.search(/^[\d]+$/) !== -1);
            }
        }
    }, {
        name: "amount",
        type: "input",
        message: "Please enter a product amount",
        validate: function(managerInput) {
            if ((managerInput.search(/^[\d]+$/)) === -1) {
                console.log('\x1b[31m', "\nPlease enter a valid whole number input.", '\x1b[0m');
            } else {
                return (managerInput.search(/^[\d]+$/) !== -1);
            }
        }
    }]).then(function(answer) {
        connection.query("INSERT INTO products SET ?", {
                ProductName: answer.name,
                Price: answer.price,
                StockQuantity: answer.amount
            },
            function(err, res) {
                if (err) throw err;
                anotherItem();
            });
    });
};

var anotherItem = function() {
    inquirer.prompt({
        name: "yesorno",
        type: "confirm",
        message: "Would you like to perform another action?"
    }).then(function(answer) {
        if (answer.yesorno) {
            start();
        } else {
            console.log("-------------------------------")
            console.log("          Goodbye!")
            console.log("-------------------------------")
            process.exit()
        };
    });
};
