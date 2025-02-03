USE FinanceApp;

-- Create Tables

CREATE TABLE Account
(
    AccountID INT AUTO_INCREMENT PRIMARY KEY,
    Balance DECIMAL(7, 2) NOT NULL DEFAULT 0,
    Email VARCHAR(100) NOT NULL UNIQUE,
    Password BLOB NOT NULL,
    AccountType VARCHAR(10) NOT NULL,
    CONSTRAINT CK_NonNegative_Balance CHECK (Balance >= 0),
    CONSTRAINT CK_Valid_Account_Types CHECK (AccountType IN ('Savings', 'Checking'))
);

CREATE TABLE Cards
(
    CardID INT AUTO_INCREMENT PRIMARY KEY,
    CardNumber VARCHAR(16) NOT NULL UNIQUE,
    CardType VARCHAR(10) NOT NULL,
    ExpirationDate DATETIME NOT NULL,
    AccountID INT NOT NULL,
    CONSTRAINT FK_Cards_Account FOREIGN KEY (AccountID) REFERENCES Account(AccountID),
    CONSTRAINT CK_Valid_Card_Types CHECK (CardType IN ('Debit', 'Credit', 'Prepaid'))
);

CREATE TABLE Person
(
    CustomerID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    Address VARCHAR(255) NOT NULL,
    AccountID INT NOT NULL,
    Contact VARCHAR(15) NOT NULL,
    Age INT NOT NULL,
    CONSTRAINT CK_Age_Above_18 CHECK (Age >= 18),
    CONSTRAINT FK_Person_Account FOREIGN KEY (AccountID) REFERENCES Account(AccountID)
);

CREATE TABLE LoanDetails
(
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

CREATE TABLE LoanPayments
(
    PaymentID INT AUTO_INCREMENT PRIMARY KEY,
    LoanID INT NOT NULL,
    PaymentDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PaymentAmount DECIMAL(10, 2) NOT NULL,
    CONSTRAINT CK_Minimum_Payment_Amount CHECK (PaymentAmount > 0.00),
    CONSTRAINT FK_LoanPayments_Loan FOREIGN KEY (LoanID) REFERENCES LoanDetails(LoanID)
);

CREATE TABLE Transfers
(
    TransferID INT AUTO_INCREMENT PRIMARY KEY,
    SenderAccountID INT NOT NULL,
    ReceiverAccountID INT NOT NULL,
    TransactionAmount DECIMAL(10, 2) NOT NULL,
    CONSTRAINT CK_NonNegative_Transaction CHECK (TransactionAmount >= 0.00),
    CONSTRAINT CK_Different_Accounts CHECK (SenderAccountID != ReceiverAccountID)
);

CREATE TABLE TransactionHistory
(
    TransactionID INT AUTO_INCREMENT PRIMARY KEY,
    TransferID INT NOT NULL,
    TransactionDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT FK_TransactionHistory_Transfer FOREIGN KEY (TransferID) REFERENCES Transfers(TransferID)
);

CREATE TABLE Branch
(
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

CREATE TABLE Employee
(
    EmployeeID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    Contact VARCHAR(15) NOT NULL,
    Salary DECIMAL(7, 2) NOT NULL,
    BranchID INT NOT NULL,
    Position VARCHAR(100) NOT NULL,
    CONSTRAINT FK_Employee_Branch FOREIGN KEY (BranchID) REFERENCES Branch(BranchID)
);

CREATE TABLE EmployeeAccount
(
    EmployeeAccountID INT AUTO_INCREMENT PRIMARY KEY,
    Role VARCHAR(100) NOT NULL,
    Email VARCHAR(100) NOT NULL UNIQUE,
    Password BLOB NOT NULL
);

CREATE TABLE TransactionApprovals
(
    EmployeeAccountID INT NOT NULL,
    TransactionID INT NOT NULL,
    ApprovalDate DATETIME NOT NULL,
    ApprovedBy INT NOT NULL,
    PRIMARY KEY (EmployeeAccountID, TransactionID),
    CONSTRAINT FK_TransactionApprovals_Transaction FOREIGN KEY (TransactionID) REFERENCES TransactionHistory(TransactionID),
    CONSTRAINT FK_TransactionApprovals_Employee FOREIGN KEY (EmployeeAccountID) REFERENCES EmployeeAccount(EmployeeAccountID)
);