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
        await pool.execute(`
            INSERT INTO Account (Balance, Email, Password, AccountType) VALUES
            (1000.00, 'john.doe@example.com', SHA2('john.doe', 256), 'Checking'),
            (2500.50, 'jane.smith@example.com', SHA2('jane.smith', 256), 'Savings'),
            (5000.00, 'michael.jones@example.com', SHA2('michael.jones', 256), 'Checking'),
            (150.75, 'emily.davis@example.com', SHA2('emily.davis', 256), 'Checking'),
            (3200.00, 'alex.miller@example.com', SHA2('alex.miller', 256), 'Savings'),
            (0.00, 'olivia.brown@example.com', SHA2('olivia.brown', 256), 'Checking'),
            (450.00, 'david.wilson@example.com', SHA2('david.wilson', 256), 'Checking'),
            (10000.00, 'sarah.moore@example.com', SHA2('sarah.moore', 256), 'Savings'),
            (675.20, 'daniel.johnson@example.com', SHA2('daniel.johnson', 256), 'Checking'),
            (320.00, 'lucy.williams@example.com', SHA2('lucy.williams', 256), 'Savings');
        `)

        // Insert into Cards table
        await pool.execute(`
            INSERT INTO Cards (CardNumber, CardType, ExpirationDate, AccountID) VALUES
            ('1234567890123456', 'Debit', '2025-12-01', 1),
            ('2345678901234567', 'Credit', '2024-07-15', 2),
            ('3456789012345678', 'Debit', '2026-01-20', 3),
            ('4567890123456789', 'Prepaid', '2023-11-30', 4),
            ('5678901234567890', 'Credit', '2027-02-10', 5),
            ('6789012345678901', 'Debit', '2025-05-25', 6),
            ('7890123456789012', 'Debit', '2026-08-18', 7),
            ('8901234567890123', 'Prepaid', '2023-09-15', 8),
            ('9012345678901234', 'Credit', '2024-12-01', 9),
            ('0123456789012345', 'Debit', '2025-06-30', 10);
        `)

        // Insert into Person table
        await pool.execute(`
            INSERT INTO Person (Name, Address, AccountID, Contact, Age) VALUES
            ('John Doe', '123 Elm St, City A', 1, '123-456-7890', 28),
            ('Jane Smith', '456 Oak Rd, City B', 2, '234-567-8901', 34),
            ('Michael Jones', '789 Pine Ave, City C', 3, '345-678-9012', 45),
            ('Emily Davis', '101 Maple Blvd, City D', 4, '456-789-0123', 32),
            ('Alex Miller', '202 Birch Dr, City E', 5, '567-890-1234', 27),
            ('Olivia Brown', '303 Cedar Ln, City F', 6, '678-901-2345', 24),
            ('David Wilson', '404 Fir St, City G', 7, '789-012-3456', 39),
            ('Sarah Moore', '505 Redwood Way, City H', 8, '890-123-4567', 41),
            ('Daniel Johnson', '606 Willow Pkwy, City I', 9, '901-234-5678', 29),
            ('Lucy Williams', '707 Chestnut Blvd, City J', 10, '012-345-6789', 36);
        `)

        await pool.execute(`
            INSERT INTO LoanDetails (AccountID, LoanAmount, InterestRate, LoanTerm, StartDate) VALUES
            (1, 5000.00, 5.00, 24, '2024-01-15'),
            (2, 10000.00, 4.50, 36, '2023-11-20'),
            (3, 2000.00, 3.00, 12, '2024-06-01'),
            (4, 1500.00, 6.00, 18, '2024-03-10'),
            (5, 8000.00, 3.50, 30, '2023-09-10'),
            (6, 1200.00, 5.50, 24, '2024-02-25'),
            (7, 4500.00, 4.00, 36, '2024-07-15'),
            (8, 2500.00, 3.75, 12, '2024-05-01'),
            (9, 10000.00, 4.25, 48, '2023-12-20'),
            (10, 3000.00, 5.00, 24, '2024-04-10');
        `)

        await pool.execute(`
            INSERT INTO LoanPayments (LoanID, PaymentAmount, PaymentDate) VALUES
            (1, 200.00, '2024-01-20'),
            (2, 300.00, '2024-02-10'),
            (3, 150.00, '2024-03-05'),
            (4, 100.00, '2024-04-10'),
            (5, 250.00, '2024-05-15'),
            (6, 100.00, '2024-06-20'),
            (7, 200.00, '2024-07-25'),
            (8, 150.00, '2024-08-30'),
            (9, 350.00, '2024-09-05'),
            (10, 200.00, '2024-10-01');
        `)

        await pool.execute(`
            INSERT INTO Transfers (SenderAccountID, ReceiverAccountID, TransactionAmount) VALUES
            (1, 2, 100.00),
            (2, 3, 200.00),
            (3, 4, 50.00),
            (4, 5, 150.00),
            (5, 6, 300.00);
        `)

        await pool.execute(`
            INSERT INTO TransactionHistory (TransferID, TransactionDate) VALUES
            (1, '2024-12-01'),
            (2, '2024-12-02'),
            (3, '2024-12-03'),
            (4, '2024-12-04'),
            (5, '2024-12-05');
        `)

        await pool.execute(`
            INSERT INTO Branch (Address, State, Postcode) VALUES
            ('123 Main St, City A', 'Selangor', '40000'),
            ('456 High St, City B', 'Penang', '10000'),
            ('789 Park Rd, City C', 'Kuala Lumpur', '50000'),
            ('101 Oak Blvd, City D', 'Pahang', '25000'),
            ('202 Pine Dr, City E', 'Sabah', '88000'),
            ('303 Maple Way, City F', 'Melaka', '75000'),
            ('404 Birch Rd, City G', 'Terengganu', '21000'),
            ('505 Elm Pkwy, City H', 'Sarawak', '93000'),
            ('606 Cedar Ave, City I', 'Perak', '32000'),
            ('707 Fir Ln, City J', 'Kedah', '06000');
        `)

        await pool.execute(`
            INSERT INTO Employee (Name, Contact, Salary, BranchID, Position) VALUES
            ('Samuel Thompson', '123-456-7890', 5000.00, 1, 'Manager'),
            ('Rebecca Williams', '234-567-8901', 4000.00, 2, 'Assistant Manager'),
            ('Brian Roberts', '345-678-9012', 4500.00, 3, 'Clerk'),
            ('Grace Anderson', '456-789-0123', 3800.00, 4, 'Accountant');
        `)

        await pool.execute(`
            INSERT INTO EmployeeAccount (Role, Email, Password) VALUES
            ('Admin', 'samuel.thompson@bank.com', SHA2('samuel.thompson', 256)),
            ('Supervisor', 'rebecca.williams@bank.com', SHA2('rebecca.williams', 256));
        `)
    
        res.status(StatusCodes.OK).json({msg: "Success data insertion"});
    })
]

module.exports = {
    createTables,
    seedDatabase
}