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

var itemArray = [];

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId)
    display();
    start();
});

var display = function(){
connection.query('SELECT * FROM products', function(err, res) {
    if (err) {
        throw err;
    } else {
        console.log("------ Bamazon Products for Sale ------\n")
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].ItemID + ") " + res[i].ProductName);
            console.log("Price: " + "$" + res[i].Price + " USD");
            console.log("Stock Quantity: " + res[i].StockQuantity + "\n");
            itemArray.push((res[i].ItemID).toString());
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
                        message: "How much would you like to buy?"
                    }).then(function(answer) {
                        if (chosenItem.StockQuantity > parseInt(answer.amount)) {
                        	var newAmount = (chosenItem.StockQuantity - parseInt(answer.amount));
                            connection.query("UPDATE products SET ? WHERE ?", [{
                                StockQuantity: newAmount
                            }, {
                                ItemID: chosenItem.ItemID
                            }], function(err, res) {
                            	console.log("You bought " + chosenItem.ProductName + " x " + answer.amount);
                            	console.log("You spent " + (chosenItem.Price * answer.amount) + " dollars");
                            	
                                start();

                            });
                        } else {
                            console.log("We don't have enough! Choose a different product or amount.");
                            start();
                        }
                    })
                }
            }
        })
    })
}
