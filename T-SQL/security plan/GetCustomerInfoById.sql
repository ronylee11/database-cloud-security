USE BankDB;
GO

-- Create the stored procedure for retrieving customer information by ID
CREATE PROCEDURE usp_GetCustomerInfoById
    @CustomerID INT -- Input parameter for filtering by CustomerID
AS
BEGIN
    SET NOCOUNT ON;

    -- Select customer information from the view based on CustomerID
    SELECT *
    FROM Application.CustomerInfo
    WHERE CustomerID = @CustomerID;
END;
GO

-- Grant EXECUTE permission for the WebsiteUserRole on the stored procedure
GRANT EXECUTE ON usp_GetCustomerInfoById TO WebsiteUserRole;
GO