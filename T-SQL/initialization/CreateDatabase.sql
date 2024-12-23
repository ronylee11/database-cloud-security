USE master;
GO

/* change MSSQLSERVER01 with your own folder*/
CREATE DATABASE BankDB ON
(NAME = BankDB_dat,
    FILENAME = 'C:\Program Files\Microsoft SQL Server\MSSQL16.MSSQLSERVER01\MSSQL\DATA\bankdb.mdf',
    SIZE = 100 MB,
    MAXSIZE = 500 MB,
    FILEGROWTH = 10 MB)
LOG ON
(NAME = BankDB_log,
    FILENAME = 'C:\Program Files\Microsoft SQL Server\MSSQL16.MSSQLSERVER01\MSSQL\DATA\bankdb.ldf',
    SIZE = 50 MB,
    MAXSIZE = 200 MB,
    FILEGROWTH = 10 MB);
GO

USE BankDB
GO

/* SELECT * FROM sys.schemas; */

/* !!! FOR TESTING ONLY !!! Run multiple times to clear all FK relations and tables
EXEC sp_msforeachtable "ALTER TABLE ? NOCHECK CONSTRAINT all"
EXEC sp_MSforeachtable @command1 = "DROP TABLE ?"
DROP SCHEMA IF EXISTS Application'
DROP SCHEMA IF EXISTS Banking
DROP SCHEMA IF EXISTS Loans
DROP SCHEMA IF EXISTS Transactions
*/

CREATE SCHEMA Application;
GO
CREATE SCHEMA Banking;
GO
CREATE SCHEMA Loans;
GO
CREATE SCHEMA Transactions;
GO


CREATE TABLE Banking.Account
(
	AccountID INT PRIMARY KEY NOT NULL IDENTITY,
	Balance DECIMAL(7, 2) NOT NULL DEFAULT 0,
	Email VARCHAR(100) NOT NULL UNIQUE,
	Password BINARY(100) NOT NULL,
	AccountType VARCHAR(10) NOT NULL,
	CONSTRAINT CK_NonNegative_Balance CHECK (Balance >= 0),
	CONSTRAINT CK_Valid_Account_Types CHECK (AccountType IN ('Savings', 'Checking'))
)

CREATE TABLE Banking.Cards
(
	CardID INT PRIMARY KEY NOT NULL IDENTITY,
	CardNumber VARCHAR(16) NOT NULL UNIQUE,
	CardType VARCHAR(10) NOT NULL,
	ExpirationDate DATETIME NOT NULL,
	AccountID INT NOT NULL FOREIGN KEY REFERENCES Banking.Account(AccountID),
	CONSTRAINT CK_Valid_Card_Types CHECK (CardType IN ('Debit', 'Credit', 'Prepaid'))
)

CREATE TABLE Application.Person 
(
	CustomerID INT PRIMARY KEY NOT NULL IDENTITY,
	Name VARCHAR(255) NOT NULL,
	Address VARCHAR(255) NOT NULL,
	AccountID INT NOT NULL FOREIGN KEY REFERENCES Banking.Account(AccountID),
	Contact VARCHAR(15) NOT NULL,
	Age INT NOT NULL,
	CONSTRAINT CK_Age_Above_18 CHECK (Age >= 18)
)

CREATE TABLE Loans.Details
(
	LoanID INT PRIMARY KEY NOT NULL IDENTITY,
	AccountID INT NOT NULL FOREIGN KEY REFERENCES Banking.Account(AccountID),
	LoanAmount DECIMAL(10, 2) NOT NULL,
	InterestRate DECIMAL(5, 2) NOT NULL DEFAULT 0.00,
	LoanTerm INT NOT NULL,
	StartDate DATETIME NOT NULL DEFAULT GETDATE(),
	CONSTRAINT CK_Minimum_Loan_Amount CHECK (LoanAmount >= 1000.00),
	CONSTRAINT CK_NonNegative_Interest_Rate CHECK (InterestRate >= 0.00)
)

CREATE TABLE Loans.PaymentHistory
(
	PaymentID INT PRIMARY KEY NOT NULL IDENTITY,
	LoanID INT NOT NULL FOREIGN KEY REFERENCES Loans.Details(LoanID),
	PaymentDate DATETIME NOT NULL DEFAULT GETDATE(),
	PaymentAmount DECIMAL(10, 2) NOT NULL,
	CONSTRAINT CK_Minimum_Payment_Amount CHECK (PaymentAmount > 0.00)
);

CREATE TABLE Transactions.TransferDetails
(
	TransferID INT PRIMARY KEY NOT NULL IDENTITY,
	SenderAccountID INT NOT NULL,
	ReceiverAccountID INT NOT NULL,
	TransactionAmount DECIMAL(10, 2) NOT NULL,
	CONSTRAINT CK_NonNegative_Transaction CHECK (TransactionAmount >= 0.00),
	CONSTRAINT CK_Different_Accounts CHECK (SenderAccountID != ReceiverAccountID)
)

CREATE TABLE Transactions.History
(
	TransactionID INT PRIMARY KEY NOT NULL IDENTITY,
	TransferID INT NOT NULL FOREIGN KEY REFERENCES Transactions.TransferDetails(TransferID),
	TransactionDate DATETIME NOT NULL DEFAULT GETDATE(),
)

CREATE TABLE Application.Branch
(
	BranchID INT PRIMARY KEY NOT NULL IDENTITY,
	Address VARCHAR(255) NOT NULL,
	State VARCHAR(50) NOT NULL,
	Postcode VARCHAR(5) NOT NULL DEFAULT '00000',
	CONSTRAINT CK_Valid_State CHECK (State IN
	('Johor', 'Kedah', 'Kelantan', 'Melaka', 'Negeri Sembilan', 
	'Pahang', 'Penang', 'Perak', 'Perlis', 'Sabah', 'Sarawak', 
	'Selangor', 'Terengganu', 'Kuala Lumpur', 'Labuan', 'Putrajaya')),
	CONSTRAINT CK_Valid_Postcode CHECK (LEN(Postcode) = 5)
)

CREATE TABLE Application.Employee
(
	EmployeeID INT PRIMARY KEY NOT NULL IDENTITY,
	Name VARCHAR(255) NOT NULL,
	Contact VARCHAR(15) NOT NULL,
	Salary DECIMAL(7, 2) NOT NULL,
	BranchID INT NOT NULL FOREIGN KEY REFERENCES Application.Branch(BranchID),
	Position VARCHAR(100) NOT NULL,
)

CREATE TABLE Banking.EmployeeAccount
(
	EmployeeAccountID INT PRIMARY KEY NOT NULL IDENTITY,
	Role VARCHAR(100) NOT NULL,
	Email VARCHAR(100) NOT NULL UNIQUE,
	Password BINARY(100) NOT NULL,
)

CREATE TABLE Transactions.ApprovalHistory
(
	EmployeeAccountID INT PRIMARY KEY NOT NULL IDENTITY,
	TransactionID INT NOT NULL FOREIGN KEY REFERENCES Transactions.History(TransactionID),
	ApprovalDate DATETIME NOT NULL,
	ApprovedBy INT NOT NULL FOREIGN KEY REFERENCES Banking.EmployeeAccount(EmployeeAccountID)
)