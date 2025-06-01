-- Create tables

DROP TABLE IF EXISTS Authors;

CREATE Table Authors
(
    Id INT NOT NULL AUTO_INCREMENT,
    Name nvarchar(50),
    Country nvarchar(50),
    PRIMARY KEY (Id)
);

DROP TABLE IF EXISTS Books;

CREATE Table Books
(
    Id INT NOT NULL AUTO_INCREMENT,
    Author_Id int,
    Name nvarchar(50),
    Price int,
    PRIMARY KEY (Id),
    INDEX auth_ind (Author_id),
    FOREIGN KEY (Author_id)
        REFERENCES Authors(id)
);

-- Insert data

DROP PROCEDURE IF EXISTS ctemp;

CREATE PROCEDURE ctemp ()
BEGIN
SET @i = 1;
    while @i <= 200 DO
         insert into Authors(Id,name,Country) values(
           default,
            concat('Author - ',convert(@i, CHAR(10))),
            concat('Country - ',convert(@i, CHAR(10)))
         );
         SET @i = @i+1;
    END WHILE;
END;

call ctemp;

DROP PROCEDURE IF EXISTS ctemp;

CREATE PROCEDURE ctemp ()
BEGIN
SET @i = 1;
    while @i <= 200 DO
         insert into Books(Id,Author_Id, Name, Price) values(
            default,
            @i,

            'Book - 1',
            10
         );
         insert into Books(Id,Author_Id, Name, Price) values(
            default,
            @i,

            'Book - 2',
            20
         );
         SET @i = @i+1;
    END WHILE;
END;

call ctemp;

-- Geometry
DROP TABLE IF EXISTS SpatialTable;

CREATE TABLE SpatialTable (
    Id INT  NOT NULL AUTO_INCREMENT,
    GeomCol GEOMETRY,
    GeomColSTA text as (ST_AsText(GeomCol)),
    PRIMARY KEY (Id)
);

INSERT INTO SpatialTable VALUES (default,ST_GeomFromText('LINESTRING (100 100, 20 180, 180 180)',0), default);
INSERT INTO SpatialTable VALUES (default,ST_GeomFromText('POLYGON ((0 0, 150 0, 150 150, 0 150, 0 0))',0), default);
INSERT INTO SpatialTable VALUES (default,ST_GeomFromText('POLYGON((-122.358 47.653 , -122.348 47.649, -122.348 47.658, -122.358 47.658, -122.358 47.653))', 0), default);
INSERT INTO SpatialTable VALUES (default,ST_GeomFromText('LINESTRING (100 100, 20 180, 180 180)',0), default);

-- Stored procedures

DROP PROCEDURE IF EXISTS GetBooksByAuthor;

CREATE PROCEDURE GetBooksByAuthor
(
    AuthorId int
)
BEGIN
    SELECT * FROM Books WHERE Author_id = AuthorID;
END;

DROP PROCEDURE IF EXISTS GetAuthorDetails;

CREATE PROCEDURE GetAuthorDetails
(
    IN AuthorId int,
    OUT AuthorName nvarchar(50),
    OUT AuthorCountry nvarchar(50)
)
BEGIN
    SELECT Name, Country into AuthorName, AuthorCountry FROM Authors WHERE Id = AuthorId;
END;
