USE BankDB
GO

CREATE PROCEDURE Application.AccountLogin
    @Email VARCHAR(100),
	@Password VARCHAR(100)
AS
BEGIN
  SET NOCOUNT ON;

	SELECT * from Banking.Account 
	WHERE Email = @Email AND 
	Password = HASHBYTES('SHA2_256',
		CONVERT(VARCHAR(32), @Password)
	);
END;
GO

GRANT EXECUTE ON Application.AccountLogin TO WebsiteUserRole;
GO

CREATE PROCEDURE Application.CreateAccounts
    @Email VARCHAR(100),
    @Password VARCHAR(100),
    @Name VARCHAR(255),
    @Contact VARCHAR(15),
    @Age INT,
    @Address VARCHAR(255),
    @AccountType VARCHAR(10)
AS
BEGIN
    INSERT INTO Banking.Account (Balance, Email, Password, AccountType) VALUES 
    (0.00, @Email, HASHBYTES('SHA2_256', CONVERT(VARCHAR(32), @Password)), @AccountType)
    
    DECLARE @AccountID INT
    SET @AccountID = SCOPE_IDENTITY();

    INSERT INTO Application.Person (Name, Address, AccountID, Contact, Age) VALUES 
    (
        @Name,
        @Address,
        @AccountID,
        @Contact,
        @Age
    )
END;

GRANT EXECUTE ON Application.CreateAccounts TO WebsiteUserRole;
GO

EXECUTE AS USER = 'WebsiteBackendUser'
EXEC Application.AccountLogin @Email = 'john.doe@example.com', @Password = 'john.doe'
REVERT

SELECT * FROM Banking.Account 
SELECT * FROM Application.Person