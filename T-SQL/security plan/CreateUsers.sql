-- Create login on server level and database level
USE master
GO
CREATE LOGIN WebsiteBackendUser WITH PASSWORD = 'Sup3rS3cureP4ssw0rd';
CREATE LOGIN SavingsAccountEmployee WITH PASSWORD = 'S@v1ngs#';
CREATE LOGIN CheckingAccountEmployee WITH PASSWORD = 'Ch3ck1ng!';

USE BankDB
GO
CREATE USER WebsiteBackendUser FOR LOGIN WebsiteBackendUser
CREATE USER SavingsAccountEmployee FOR LOGIN SavingsAccountEmployee
CREATE USER CheckingAccountEmployee FOR LOGIN CheckingAccountEmployee


-- Create role to deny access to all tables, stored procedures and functions
-- Then, grant permissions to specific views or functions
CREATE ROLE WebsiteUserRole;
DENY SELECT ON SCHEMA::dbo TO WebsiteUserRole;
DENY SELECT ON SCHEMA::dbo TO WebsiteUserRole;
DENY SELECT ON SCHEMA::dbo TO WebsiteUserRole;
REVOKE EXECUTE ON SCHEMA::dbo TO WebsiteUserRole;
GRANT SELECT ON Banking.AccountSummary TO WebsiteUserRole;
GRANT SELECT ON Application.CustomerInfo TO WebsiteUserRole;

EXEC sp_addrolemember 'WebsiteUserRole', 'WebsiteBackendUser';

CREATE ROLE RegularBankEmployeeRole;
DENY SELECT ON SCHEMA ::dbo TO RegularBankEmployeeRole;
REVOKE EXECUTE ON SCHEMA::dbo TO RegularBankEmployeeRole;
GRANT SELECT ON SCHEMA::Banking TO RegularBankEmployeeRole;

EXEC sp_addrolemember 'RegularBankEmployeeRole', 'SavingsAccountEmployee';
EXEC sp_addrolemember 'RegularBankEmployeeRole', 'CheckingAccountEmployee';


-- Principle of least privilege: Deny SELECT permissions for WebUser as they don't need extra permissions


-- Only grant SELECT for specific views
