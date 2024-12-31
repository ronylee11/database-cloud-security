USE Master;
GO

/* Backup and Drop ur Master Key if you have one
BACKUP MASTER KEY 
TO FILE = 'C:\keys\master_key' 
ENCRYPTION BY PASSWORD = 'Pa$$w0rd' ;
GO
DROP MASTER KEY;
GO
*/

--create certificate
CREATE CERTIFICATE BankTDECert WITH SUBJECT = 'Certificate for BankDB';
GO

--backup certificate
BACKUP CERTIFICATE BankTDECert
TO FILE = 'C:\certificates\BankTDECert';

USE BankDB;
GO

--create database encryption key
CREATE DATABASE ENCRYPTION KEY
WITH ALGORITHM = AES_192
ENCRYPTION BY SERVER CERTIFICATE
BankTDECert;
GO

--enable TDE
ALTER DATABASE BankDB
SET ENCRYPTION ON;
GO
