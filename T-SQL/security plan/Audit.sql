USE master;
GO

-- Create the server audit to store logs in a specified directory.
CREATE SERVER AUDIT UserActivityAudit
TO FILE (
    FILEPATH = 'C:\SQLAudit\',  -- Make sure this path exists and has proper write permissions
    MAXSIZE = 256 MB, 
    MAX_ROLLOVER_FILES = 2147483647, 
    RESERVE_DISK_SPACE = OFF
)
WITH (
    QUEUE_DELAY = 1000,
    ON_FAILURE = CONTINUE
);
GO

-- Enable the server audit.
ALTER SERVER AUDIT UserActivityAudit
WITH (STATE = ON);
GO

-- Move to the target database (BankDB).
USE BankDB;
GO

-- Create the database audit specification to track actions on all tables, views, and the specific stored procedure.
CREATE DATABASE AUDIT SPECIFICATION UserActivityAuditSpec
FOR SERVER AUDIT UserActivityAudit
-- Track SELECT, INSERT, UPDATE, DELETE on all tables and views in the schema
ADD (SELECT, INSERT, UPDATE, DELETE ON SCHEMA::Application BY PUBLIC),
ADD (SELECT, INSERT, UPDATE, DELETE ON SCHEMA::Banking BY PUBLIC),
ADD (SELECT, INSERT, UPDATE, DELETE ON SCHEMA::Loans BY PUBLIC),
ADD (SELECT, INSERT, UPDATE, DELETE ON SCHEMA::Transactions BY PUBLIC),
-- Track EXECUTE on the specific stored procedure
ADD (EXECUTE ON OBJECT::usp_GetCustomerInfoById BY PUBLIC),
ADD (EXECUTE ON OBJECT::Application.AccountLogin BY PUBLIC),
ADD (DATABASE_ROLE_MEMBER_CHANGE_GROUP),
ADD (SCHEMA_OBJECT_CHANGE_GROUP),
ADD (DATABASE_OBJECT_ACCESS_GROUP),
ADD (DATABASE_ROLE_MEMBER_CHANGE_GROUP),
ADD (USER_CHANGE_PASSWORD_GROUP)
WITH (STATE = ON);
GO


--USE BankDB;
--GO
--IF EXISTS (SELECT * FROM sys.database_audit_specifications WHERE name = 'UserActivityAuditSpec')
--BEGIN
--   ALTER DATABASE AUDIT SPECIFICATION UserActivityAuditSpec WITH (STATE = OFF); -- Corrected here
--    DROP DATABASE AUDIT SPECIFICATION UserActivityAuditSpec;
--END;
--GO
--
--USE master;
--GO
--IF EXISTS (SELECT * FROM sys.server_audits WHERE name = 'UserActivityAudit')
--BEGIN
--    ALTER SERVER AUDIT UserActivityAudit WITH (STATE = OFF); -- Disable the audit before dropping it
--   DROP SERVER AUDIT UserActivityAudit;
--END;
--GO