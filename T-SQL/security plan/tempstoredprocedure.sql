CREATE PROCEDURE Application.AccountLogin
    @Email VARCHAR(100),
	@Password VARCHAR(100)
AS
BEGIN
	SELECT * from Banking.Account 
	WHERE Email = @Email AND 
	Password = HASHBYTES('SHA2_256',
		CONVERT(VARCHAR(32), @Password)
	);
END;

GRANT EXECUTE ON Application.AccountLogin TO WebsiteUserRole;

EXECUTE AS USER = 'WebsiteBackendUser'
EXEC Application.AccountLogin @Email = 'john.doe@example.com', @Password = 'john.doe'
REVERT