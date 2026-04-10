-- Initialize Patient Portal Database
-- This script is executed when the SQL Server container starts in production

-- Create database if not exists
IF DB_ID('PatientPortalDb') IS NULL
BEGIN
    CREATE DATABASE [PatientPortalDb];
    PRINT 'Database [PatientPortalDb] created successfully.';
END
ELSE
BEGIN
    PRINT 'Database [PatientPortalDb] already exists.';
END

USE [PatientPortalDb];
GO

-- Set database options
ALTER DATABASE [PatientPortalDb] SET READ_COMMITTED_SNAPSHOT ON;
ALTER DATABASE [PatientPortalDb] SET RECOVERY SIMPLE;
GO

PRINT 'Database initialization completed.';
