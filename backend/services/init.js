// this is for quickly setting up the database since AWS sandbox resets it each time
const { ApiError } = require("../utils/ApiError")
const { StatusCodes } = require("http-status-codes")
const pool = require("../db")
const asyncHandler = require("express-async-handler")

const createTables = [
    asyncHandler(async(req, res) => {
        await pool.execute(`
            CREATE TABLE Account (
                AccountID INT AUTO_INCREMENT PRIMARY KEY,
                Balance DECIMAL(7, 2) NOT NULL DEFAULT 0,
                Email VARCHAR(100) NOT NULL UNIQUE,
                Password BLOB NOT NULL,
                AccountType VARCHAR(10) NOT NULL,
                CONSTRAINT CK_NonNegative_Balance CHECK (Balance >= 0),
                CONSTRAINT CK_Valid_Account_Types CHECK (AccountType IN ('Savings', 'Checking'))
            );
        `);
        
        await pool.execute(`
            CREATE TABLE Cards (
                CardID INT AUTO_INCREMENT PRIMARY KEY,
                CardNumber VARCHAR(16) NOT NULL UNIQUE,
                CardType VARCHAR(10) NOT NULL,
                ExpirationDate DATETIME NOT NULL,
                AccountID INT NOT NULL,
                CONSTRAINT FK_Cards_Account FOREIGN KEY (AccountID) REFERENCES Account(AccountID),
                CONSTRAINT CK_Valid_Card_Types CHECK (CardType IN ('Debit', 'Credit', 'Prepaid'))
            );
        `);
        
        await pool.execute(`
            CREATE TABLE Person (
                CustomerID INT AUTO_INCREMENT PRIMARY KEY,
                Name VARCHAR(255) NOT NULL,
                Address VARCHAR(255) NOT NULL,
                AccountID INT NOT NULL,
                Contact VARCHAR(15) NOT NULL,
                Age INT NOT NULL,
                CONSTRAINT CK_Age_Above_18 CHECK (Age >= 18),
                CONSTRAINT FK_Person_Account FOREIGN KEY (AccountID) REFERENCES Account(AccountID)
            );
        `);
        
        await pool.execute(`
            CREATE TABLE LoanDetails (
                LoanID INT AUTO_INCREMENT PRIMARY KEY,
                AccountID INT NOT NULL,
                LoanAmount DECIMAL(10, 2) NOT NULL,
                InterestRate DECIMAL(5, 2) NOT NULL DEFAULT 0.00,
                LoanTerm INT NOT NULL,
                StartDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT CK_Minimum_Loan_Amount CHECK (LoanAmount >= 1000.00),
                CONSTRAINT CK_NonNegative_Interest_Rate CHECK (InterestRate >= 0.00),
                CONSTRAINT FK_LoanDetails_Account FOREIGN KEY (AccountID) REFERENCES Account(AccountID)
            );
        `);
        
        await pool.execute(`
            CREATE TABLE LoanPayments (
                PaymentID INT AUTO_INCREMENT PRIMARY KEY,
                LoanID INT NOT NULL,
                PaymentDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                PaymentAmount DECIMAL(10, 2) NOT NULL,
                CONSTRAINT CK_Minimum_Payment_Amount CHECK (PaymentAmount > 0.00),
                CONSTRAINT FK_LoanPayments_Loan FOREIGN KEY (LoanID) REFERENCES LoanDetails(LoanID)
            );
        `);
        
        await pool.execute(`
            CREATE TABLE Transfers (
                TransferID INT AUTO_INCREMENT PRIMARY KEY,
                SenderAccountID INT NOT NULL,
                ReceiverAccountID INT NOT NULL,
                TransactionAmount DECIMAL(10, 2) NOT NULL,
                CONSTRAINT CK_NonNegative_Transaction CHECK (TransactionAmount >= 0.00),
                CONSTRAINT CK_Different_Accounts CHECK (SenderAccountID != ReceiverAccountID)
            );
        `);
        
        await pool.execute(`
            CREATE TABLE TransactionHistory (
                TransactionID INT AUTO_INCREMENT PRIMARY KEY,
                TransferID INT NOT NULL,
                TransactionDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT FK_TransactionHistory_Transfer FOREIGN KEY (TransferID) REFERENCES Transfers(TransferID)
            );
        `);
        
        await pool.execute(`
            CREATE TABLE Branch (
                BranchID INT AUTO_INCREMENT PRIMARY KEY,
                Address VARCHAR(255) NOT NULL,
                State VARCHAR(50) NOT NULL,
                Postcode VARCHAR(5) NOT NULL DEFAULT '00000',
                CONSTRAINT CK_Valid_State CHECK (State IN
                ('Johor', 'Kedah', 'Kelantan', 'Melaka', 'Negeri Sembilan', 
                'Pahang', 'Penang', 'Perak', 'Perlis', 'Sabah', 'Sarawak', 
                'Selangor', 'Terengganu', 'Kuala Lumpur', 'Labuan', 'Putrajaya')),
                CONSTRAINT CK_Valid_Postcode CHECK (LENGTH(Postcode) = 5)
            );
        `);
        
        await pool.execute(`
            CREATE TABLE Employee (
                EmployeeID INT AUTO_INCREMENT PRIMARY KEY,
                Name VARCHAR(255) NOT NULL,
                Contact VARCHAR(15) NOT NULL,
                Salary DECIMAL(7, 2) NOT NULL,
                BranchID INT NOT NULL,
                Position VARCHAR(100) NOT NULL,
                CONSTRAINT FK_Employee_Branch FOREIGN KEY (BranchID) REFERENCES Branch(BranchID)
            );
        `);
        
        await pool.execute(`
            CREATE TABLE EmployeeAccount (
                EmployeeAccountID INT AUTO_INCREMENT PRIMARY KEY,
                Role VARCHAR(100) NOT NULL,
                Email VARCHAR(100) NOT NULL UNIQUE,
                Password BLOB NOT NULL
            );
        `);
        
        await pool.execute(`
            CREATE TABLE TransactionApprovals (
                EmployeeAccountID INT NOT NULL,
                TransactionID INT NOT NULL,
                ApprovalDate DATETIME NOT NULL,
                ApprovedBy INT NOT NULL,
                PRIMARY KEY (EmployeeAccountID, TransactionID),
                CONSTRAINT FK_TransactionApprovals_Transaction FOREIGN KEY (TransactionID) REFERENCES TransactionHistory(TransactionID),
                CONSTRAINT FK_TransactionApprovals_Employee FOREIGN KEY (EmployeeAccountID) REFERENCES EmployeeAccount(EmployeeAccountID)
            );
        `);        

        res.status(StatusCodes.OK).json({msg: "Success table creation"});
    })
]

const seedDatabase = [
    asyncHandler(async(req, res) => {
        await pool.execute("INSERT INTO Account (Balance, Email, Password, AccountType) VALUES (?, ?, SHA2(?, 256), ?)", [1000.00, 'john.doe@example.com', 'john.doe', 'Checking']);
        await pool.execute("INSERT INTO Account (Balance, Email, Password, AccountType) VALUES (?, ?, SHA2(?, 256), ?)", [2500.50, 'jane.smith@example.com', 'jane.smith', 'Savings']);
        await pool.execute("INSERT INTO Account (Balance, Email, Password, AccountType) VALUES (?, ?, SHA2(?, 256), ?)", [5000.00, 'michael.jones@example.com', 'michael.jones', 'Checking']);
        
        // Insert into Cards table
        await pool.execute("INSERT INTO Cards (CardNumber, CardType, ExpirationDate, AccountID) VALUES (?, ?, ?, ?)", ['1234567890123456', 'Debit', '2025-12-01', 1]);
        await pool.execute("INSERT INTO Cards (CardNumber, CardType, ExpirationDate, AccountID) VALUES (?, ?, ?, ?)", ['2345678901234567', 'Credit', '2024-07-15', 2]);

        // Insert into Person table
        await pool.execute("INSERT INTO Person (Name, Address, AccountID, Contact, Age) VALUES (?, ?, ?, ?, ?)", ['John Doe', '123 Elm St, City A', 1, '123-456-7890', 28]);
        await pool.execute("INSERT INTO Person (Name, Address, AccountID, Contact, Age) VALUES (?, ?, ?, ?, ?)", ['Jane Smith', '456 Oak Rd, City B', 2, '234-567-8901', 34]);

        // Insert into LoanDetails table
        await pool.execute("INSERT INTO LoanDetails (AccountID, LoanAmount, InterestRate, LoanTerm, StartDate) VALUES (?, ?, ?, ?, ?)", [1, 5000.00, 5.00, 24, '2024-01-15']);
        await pool.execute("INSERT INTO LoanDetails (AccountID, LoanAmount, InterestRate, LoanTerm, StartDate) VALUES (?, ?, ?, ?, ?)", [2, 10000.00, 4.50, 36, '2023-11-20']);

        // Insert into LoanPayments table
        await pool.execute("INSERT INTO LoanPayments (LoanID, PaymentAmount, PaymentDate) VALUES (?, ?, ?)", [1, 200.00, '2024-01-20']);
        await pool.execute("INSERT INTO LoanPayments (LoanID, PaymentAmount, PaymentDate) VALUES (?, ?, ?)", [2, 300.00, '2024-02-10']);

        // Insert into Transfers table
        await pool.execute("INSERT INTO Transfers (SenderAccountID, ReceiverAccountID, TransactionAmount) VALUES (?, ?, ?)", [1, 2, 100.00]);
        await pool.execute("INSERT INTO Transfers (SenderAccountID, ReceiverAccountID, TransactionAmount) VALUES (?, ?, ?)", [2, 3, 200.00]);

        // Insert into TransactionHistory table
        await pool.execute("INSERT INTO TransactionHistory (TransferID, TransactionDate) VALUES (?, ?)", [1, '2024-12-01']);
        await pool.execute("INSERT INTO TransactionHistory (TransferID, TransactionDate) VALUES (?, ?)", [2, '2024-12-02']);

        // Insert into Branch table
        await pool.execute("INSERT INTO Branch (Address, State, Postcode) VALUES (?, ?, ?)", ['123 Main St, City A', 'Selangor', '40000']);
        await pool.execute("INSERT INTO Branch (Address, State, Postcode) VALUES (?, ?, ?)", ['456 High St, City B', 'Penang', '10000']);

        // Insert into Employee table
        await pool.execute("INSERT INTO Employee (Name, Contact, Salary, BranchID, Position) VALUES (?, ?, ?, ?, ?)", ['Samuel Thompson', '123-456-7890', 5000.00, 1, 'Manager']);
        await pool.execute("INSERT INTO Employee (Name, Contact, Salary, BranchID, Position) VALUES (?, ?, ?, ?, ?)", ['Rebecca Williams', '234-567-8901', 4000.00, 2, 'Assistant Manager']);

        // Insert into EmployeeAccount table
        await pool.execute("INSERT INTO EmployeeAccount (Role, Email, Password) VALUES (?, ?, SHA2(?, 256))", ['Admin', 'samuel.thompson@bank.com', 'samuel.thompson']);
        await pool.execute("INSERT INTO EmployeeAccount (Role, Email, Password) VALUES (?, ?, SHA2(?, 256))", ['Supervisor', 'rebecca.williams@bank.com', 'rebecca.williams']);
    
        res.status(StatusCodes.OK).json({msg: "Success data insertion"});
    })
]

module.exports = {
    createTables,
    seedDatabase
}