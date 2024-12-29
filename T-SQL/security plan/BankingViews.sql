USE BankDB
GO

-- Exclude password from being displayed
CREATE VIEW Banking.AccountSummary AS 
SELECT AccountID, Email, AccountType, Balance
FROM Banking.Account
GO

CREATE VIEW Application.CustomerInfo AS
SELECT
    p.CustomerID,
    p.Name,
    p.Contact,
    a.Email,
    a.AccountType
FROM Application.Person p
JOIN Banking.Account a ON p.AccountID = a.AccountID;
GO

CREATE VIEW Banking.CheckingEmployeeAccountView AS
SELECT AccountID, Email, AccountType
FROM Banking.Account
WHERE AccountType = 'Checking'; 
GO

CREATE VIEW Banking.SavingsEmployeeAccountView AS
SELECT AccountID, Email, AccountType
FROM Banking.Account
WHERE AccountType = 'Savings';
GO