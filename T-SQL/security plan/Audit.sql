-- Create the server audit
USE master;
GO
CREATE SERVER AUDIT UserActivityAudit
TO FILE (
    FILEPATH = 'C:\SQLAudit\',  
    MAXSIZE = 256 MB, 
    MAX_ROLLOVER_FILES = 2147483647, 
    RESERVE_DISK_SPACE = OFF
)
WITH (
    QUEUE_DELAY = 1000,
    ON_FAILURE = CONTINUE
);
GO

-- Enable the server audit
ALTER SERVER AUDIT UserActivityAudit
WITH (STATE = ON);
GO

-- Create the server audit specification to log login-related events
CREATE SERVER AUDIT SPECIFICATION UserLoginAuditSpec
FOR SERVER AUDIT UserActivityAudit
ADD (SUCCESSFUL_LOGIN_GROUP),
ADD (FAILED_LOGIN_GROUP);
GO

-- Enable the server audit specification
ALTER SERVER AUDIT SPECIFICATION UserLoginAuditSpec
WITH (STATE = ON);
GO

-- Move to the target database (BankDB)
USE BankDB;
GO

-- Create the database audit specification
CREATE DATABASE AUDIT SPECIFICATION UserActivityAuditSpec
FOR SERVER AUDIT UserActivityAudit
-- Track SELECT, INSERT, UPDATE, DELETE on all tables and views in the specified schemas
ADD (SELECT, INSERT, UPDATE, DELETE ON SCHEMA::Application BY PUBLIC),
ADD (SELECT, INSERT, UPDATE, DELETE ON SCHEMA::Banking BY PUBLIC),
ADD (SELECT, INSERT, UPDATE, DELETE ON SCHEMA::Loans BY PUBLIC),
ADD (SELECT, INSERT, UPDATE, DELETE ON SCHEMA::Transactions BY PUBLIC),
-- Track EXECUTE on specific stored procedures
ADD (EXECUTE ON OBJECT::usp_GetCustomerInfoById BY PUBLIC),
ADD (EXECUTE ON OBJECT::Application.AccountLogin BY PUBLIC),
-- Track other database-level changes
ADD (DATABASE_ROLE_MEMBER_CHANGE_GROUP),
ADD (SCHEMA_OBJECT_CHANGE_GROUP),
ADD (DATABASE_OBJECT_ACCESS_GROUP),
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