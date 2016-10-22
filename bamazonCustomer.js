var mysql = require('mysql');
var prompt = require('prompt');
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
    console.log("connected as id " + connection.threadId)
    display();
    start();
});

var display = function() {
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
        }
    });
}

var start = function() {
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
            message: "What item do you want to buy?"
        }).then(function(answer) {
            for (var i = 0; i < res.length; i++) {
                if (res[i].ItemID == answer.choice) {
                    var chosenItem = res[i];
                    console.log("You chose: " + res[i].ProductName);
                    inquirer.prompt({
                        name: "amount",
                        type: "input",
                        message: "How much would you like to buy?",
                        validate: function(managerInput) {
                            if ((managerInput.search(/^[\d]+$/)) === -1) {
                                console.log('\x1b[31m', "\nPlease enter a valid whole number input.", '\x1b[0m');
                            } else {
                                return (managerInput.search(/^[\d]+$/) !== -1);
                            }
                        },
                    }).then(function(answer) {
                        if (chosenItem.StockQuantity > 0) {
                            var newAmount = (chosenItem.StockQuantity - parseInt(answer.amount));
                            connection.query("UPDATE products SET ? WHERE ?", [{
                                StockQuantity: newAmount
                            }, {
                                ItemID: chosenItem.ItemID
                            }], function(err, res) {
                                console.log(" You bought " + chosenItem.ProductName + " x " + answer.amount);
                                console.log('\x1b[31m', "You spent " + (chosenItem.Price * answer.amount) + " dollars", '\x1b[0m');
                                console.log(" There are " + newAmount + " " + chosenItem.ProductName + " remaining.");
                                anotherItem();
                            });
                        } else {
                            console.log('\x1b[31m', "We don't have enough! Choose a different product or amount.", '\x1b[0m');
                            start();
                        }
                    })
                }
            }
        })
    })
}

var anotherItem = function() {
    inquirer.prompt({
        name: "yesorno",
        type: "confirm",
        message: "Would you like to buy another item?"
    }).then(function(answer) {
        if (answer.yesorno) {
            display();
            start();
        } else if (!answer.yesorno) {
            console.log("-------------------------------")
            console.log("Thank you for shopping Bamazon!")
            console.log("-------------------------------")
            process.exit()
        }
    });
}
