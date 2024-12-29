USE BankDB
GO

ALTER TABLE Application.Person
ALTER COLUMN Contact
ADD MASKED WITH (FUNCTION = 'partial(0, "***-***-", 4)');

ALTER TABLE Banking.Cards
ALTER COLUMN CardNumber
ADD MASKED WITH (FUNCTION = 'partial(0, "************", 4)');

ALTER TABLE Banking.Account
ALTER COLUMN Email
ADD MASKED WITH (FUNCTION = 'partial(3, "*******************************", 5)')