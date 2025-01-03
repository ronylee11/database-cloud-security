USE BankDB
GO
CREATE PROCEDURE Transactions.GetHistoryByID
    @CustomerID INT
AS
BEGIN
    SET NOCOUNT ON;
    -- the horrors
    SELECT 
        pSender.Name AS SenderName,
        pReceiver.Name AS ReceiverName,
        t.TransactionAmount,
        th.TransactionDate
    FROM 
        Transactions.TransferDetails t
    JOIN 
        Transactions.History th ON t.TransferID = th.TransferID
    JOIN 
        Banking.Account senderAccount ON t.SenderAccountID = senderAccount.AccountID
    JOIN 
        Application.Person pSender ON senderAccount.AccountID = pSender.AccountID
    JOIN 
        Banking.Account receiverAccount ON t.ReceiverAccountID = receiverAccount.AccountID
    JOIN 
        Application.Person pReceiver ON receiverAccount.AccountID = pReceiver.AccountID
    WHERE 
        t.SenderAccountID = @CustomerID OR t.ReceiverAccountID = @CustomerID
END
GO

GRANT EXECUTE ON Transactions.GetHistoryByID TO WebsiteUserRole
GO

-- testing
EXECUTE AS USER = 'WebsiteBackendUser'
EXEC Transactions.GetHistoryByID @CustomerID = 1
REVERT