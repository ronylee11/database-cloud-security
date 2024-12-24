USE BankDB
GO
/* for testing hash comparison 
SELECT * FROM Banking.Account WHERE Email='john.doe@example.com' AND Password=HASHBYTES('SHA2_256', CONVERT(VARCHAR(32), 'john.doe'));
*/
INSERT INTO Banking.Account (Balance, Email, Password, AccountType) VALUES
(1000.00, 'john.doe@example.com', HASHBYTES('SHA2_256', CONVERT(VARCHAR(32), 'john.doe')), 'Checking'),
(2500.50, 'jane.smith@example.com', HASHBYTES('SHA2_256', CONVERT(VARCHAR(32), 'jane.smith')), 'Savings'),
(5000.00, 'michael.jones@example.com', HASHBYTES('SHA2_256', CONVERT(VARCHAR(32), 'michael.jones')), 'Checking'),
(150.75, 'emily.davis@example.com', HASHBYTES('SHA2_256', CONVERT(VARCHAR(32), 'emily.davis')), 'Checking'),
(3200.00, 'alex.miller@example.com', HASHBYTES('SHA2_256', CONVERT(VARCHAR(32), 'alex.miller')), 'Savings'),
(0.00, 'olivia.brown@example.com', HASHBYTES('SHA2_256', CONVERT(VARCHAR(32), 'olivia.brown')), 'Checking'),
(450.00, 'david.wilson@example.com', HASHBYTES('SHA2_256', CONVERT(VARCHAR(32), 'david.wilson')), 'Checking'),
(10000.00, 'sarah.moore@example.com', HASHBYTES('SHA2_256', CONVERT(VARCHAR(32), 'sarah.moore')), 'Savings'),
(675.20, 'daniel.johnson@example.com', HASHBYTES('SHA2_256', CONVERT(VARCHAR(32), 'daniel.johnson')), 'Checking'),
(320.00, 'lucy.williams@example.com', HASHBYTES('SHA2_256', CONVERT(VARCHAR(32), 'lucy.williams')), 'Savings');

INSERT INTO Banking.Cards (CardNumber, CardType, ExpirationDate, AccountID) VALUES
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

INSERT INTO Application.Person (Name, Address, AccountID, Contact, Age) VALUES
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

INSERT INTO Loans.Details (AccountID, LoanAmount, InterestRate, LoanTerm, StartDate) VALUES
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

INSERT INTO Loans.PaymentHistory (LoanID, PaymentAmount, PaymentDate) VALUES
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

INSERT INTO Transactions.TransferDetails (SenderAccountID, ReceiverAccountID, TransactionAmount) VALUES
(1, 2, 100.00),
(2, 3, 200.00),
(3, 4, 50.00),
(4, 5, 150.00),
(5, 6, 300.00),
(6, 7, 75.00),
(7, 8, 220.00),
(8, 9, 50.00),
(9, 10, 400.00),
(10, 1, 80.00);

INSERT INTO Transactions.History (TransferID, TransactionDate) VALUES
(1, '2024-12-01'),
(2, '2024-12-02'),
(3, '2024-12-03'),
(4, '2024-12-04'),
(5, '2024-12-05'),
(6, '2024-12-06'),
(7, '2024-12-07'),
(8, '2024-12-08'),
(9, '2024-12-09'),
(10, '2024-12-10');

INSERT INTO Application.Branch (Address, State, Postcode) VALUES
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

INSERT INTO Application.Employee (Name, Contact, Salary, BranchID, Position) VALUES
('Samuel Thompson', '123-456-7890', 5000.00, 1, 'Manager'),
('Rebecca Williams', '234-567-8901', 4000.00, 2, 'Assistant Manager'),
('Brian Roberts', '345-678-9012', 4500.00, 3, 'Clerk'),
('Grace Anderson', '456-789-0123', 3800.00, 4, 'Accountant'),
('Lucas White', '567-890-1234', 3500.00, 5, 'Teller'),
('Nina Harris', '678-901-2345', 4100.00, 6, 'Clerk'),
('Ethan Clark', '789-012-3456', 4800.00, 7, 'Manager'),
('Sophia King', '890-123-4567', 4200.00, 8, 'Teller'),
('Oliver Scott', '901-234-5678', 4600.00, 9, 'Assistant Manager'),
('Amelia Adams', '012-345-6789', 3700.00, 10, 'Accountant');

INSERT INTO Banking.EmployeeAccount (Role, Email, Password) VALUES
('Admin', 'samuel.thompson@bank.com', HASHBYTES('SHA2_256', CONVERT(VARCHAR(32), 'samuel.thompson'))),
('Supervisor', 'rebecca.williams@bank.com', HASHBYTES('SHA2_256', CONVERT(VARCHAR(32), 'rebecca.williams'))),
('Manager', 'brian.roberts@bank.com', HASHBYTES('SHA2_256', CONVERT(VARCHAR(32), 'brian.roberts'))),
('Teller', 'grace.anderson@bank.com', HASHBYTES('SHA2_256', CONVERT(VARCHAR(32), 'grace.anderson'))),
('Assistant Manager', 'lucas.white@bank.com', HASHBYTES('SHA2_256', CONVERT(VARCHAR(32), 'lucas.white'))),
('Clerk', 'nina.harris@bank.com', HASHBYTES('SHA2_256', CONVERT(VARCHAR(32), 'nina.harris'))),
('Supervisor', 'ethan.clark@bank.com', HASHBYTES('SHA2_256', CONVERT(VARCHAR(32), 'ethan.clark'))),
('Admin', 'sophia.king@bank.com', HASHBYTES('SHA2_256', CONVERT(VARCHAR(32), 'sophia.king'))),
('Manager', 'oliver.scott@bank.com', HASHBYTES('SHA2_256', CONVERT(VARCHAR(32), 'oliver.scott'))),
('Teller', 'amelia.adams@bank.com', HASHBYTES('SHA2_256', CONVERT(VARCHAR(32), 'amelia.adams')));

INSERT INTO Transactions.ApprovalHistory (TransactionID, ApprovalDate, ApprovedBy) VALUES
(1, '2024-12-10', 1),
(2, '2024-12-11', 2),
(3, '2024-12-12', 3),
(4, '2024-12-13', 4),
(5, '2024-12-14', 5),
(6, '2024-12-15', 6),
(7, '2024-12-16', 7),
(8, '2024-12-17', 8),
(9, '2024-12-18', 9),
(10, '2024-12-19', 10);