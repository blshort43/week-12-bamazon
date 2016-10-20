USE Bamazon;

CREATE TABLE Products(
ItemID INTEGER(11) AUTO_INCREMENT NOT NULL,
PRIMARY KEY (ItemID),
ProductName VARCHAR(50) NOT NULL,
Price INTEGER(11) NOT NULL,
StockQuantity INTEGER(11)
);

INSERT INTO Bamazon.Products(ProductName, Price, StockQuantity)
Values
("Inflatable Toast", "50.00", "100"),
("Unicorn Meat", "1000.00", "3"),
("Canned Air", "0.99", "1000"),
("Yodeling Pickle", "35.00", "10"),
("Bacon", "5.00", "25"),
("Throwing Stars", "75.00", "150"),
("Final Fantasy 1", "500.00", "35"),
("Pet Tiger", "45.00", "6"),
("A Job", "4000.00", "30"),
("Grass Clippings", "1.00", "1000");

SELECT * FROM Bamazon.Products;




