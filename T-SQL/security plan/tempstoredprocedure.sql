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