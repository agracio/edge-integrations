-- Create tables

DROP TABLE IF EXISTS dbo.Authors

CREATE Table Authors
(
   Id int identity primary key,
   Name nvarchar(50),
   Country nvarchar(50)
)

DROP TABLE IF EXISTS dbo.Books

CREATE Table Books
(
   Id int identity primary key,
   Author_Id int foreign key references Authors(Id),
   Name nvarchar(50),
   Price int
)

-- Insert data
Declare @LowerLimitForAuthorId int
Declare @UpperLimitForAuthorId int

Set @LowerLimitForAuthorId = 1
Set @UpperLimitForAuthorId = 200

Declare @Id int
Set @Id = @LowerLimitForAuthorId

While @Id <= @UpperLimitForAuthorId
Begin
   Insert Into Authors values ('Author - ' + CAST(@Id as nvarchar(10)),
              'Country - ' + CAST(@Id as nvarchar(10)) )
   Print @Id
   Set @Id = @Id + 1
End

Declare @Id int
Set @Id = @LowerLimitForAuthorId

While @Id <= @UpperLimitForAuthorId
Begin
   Insert Into Books values (@Id, 'Book - 1', 10 )
   Insert Into Books values (@Id, 'Book - 2', 20 )
   Print @Id
   Set @Id = @Id + 1
End

-- Geometry
DROP TABLE IF EXISTS dbo.SpatialTable

CREATE TABLE SpatialTable
    (id int IDENTITY (1,1),
    GeomCol geometry,
    GeomColSTA AS GeomCol.STAsText());
GO

INSERT INTO SpatialTable (GeomCol) VALUES (geometry::STGeomFromText('LINESTRING (100 100, 20 180, 180 180)', 0));
INSERT INTO SpatialTable (GeomCol) VALUES (geometry::STGeomFromText('POLYGON ((0 0, 150 0, 150 150, 0 150, 0 0))', 0));
INSERT INTO SpatialTable (GeomCol) VALUES (geometry::STGeomFromText('POLYGON((-122.358 47.653 , -122.348 47.649, -122.348 47.658, -122.358 47.658, -122.358 47.653))', 4326));
INSERT INTO SpatialTable (GeomCol) VALUES (geometry::STGeomFromText('LINESTRING (100 100, 20 180, 180 180)', 0));

-- Stored procedures

DROP PROCEDURE IF EXISTS GetAuthorDetails

CREATE PROCEDURE GetAuthorDetails
(
    @AuthorID INT,
    @AuthorName NVARCHAR(50) OUTPUT,
    @AuthorCountry NVARCHAR(50) OUTPUT
)
AS
BEGIN
    SELECT @AuthorName = Name, @AuthorCountry = Country
    FROM Authors WHERE Id = @AuthorID
END

DROP PROCEDURE IF EXISTS GetBooksByAuthor

CREATE PROCEDURE GetBooksByAuthor
(
    @AuthorID INT
)
AS
BEGIN
    SELECT * FROM Books WHERE Author_id = @AuthorID
END

