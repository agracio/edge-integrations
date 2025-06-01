-- Create tables

DROP TABLE IF EXISTS Authors;

CREATE Table Authors
(
    Id int generated always as identity primary key,
    Name varchar(50),
    Country varchar(50)
);

DROP TABLE IF EXISTS Books CASCADE;

CREATE Table Books
(
    Id int generated always as identity primary key,
    Author_Id int,
    Name varchar(50),
    Price int,
    FOREIGN KEY (Author_id)
        REFERENCES Authors(id)
);

-- Insert data

INSERT INTO Authors(Name, Country)
SELECT 'Author - ' || a.n, 'Country - ' || a.n
FROM generate_series(1, 200) as a(n);

DO $FN$
BEGIN
  FOR counter IN 1..200 LOOP
    RAISE NOTICE 'Counter: %', counter;

    EXECUTE $$ INSERT INTO Books(Id, Author_Id, Name, Price) VALUES (default, $1, 'Book - 1', 10) RETURNING id $$
      USING counter;
    EXECUTE $$ INSERT INTO Books(Id, Author_Id, Name, Price) VALUES (default, $1, 'Book - 2', 20) RETURNING id $$
      USING counter;
  END LOOP;
END;
$FN$;

-- Geometry

DROP TABLE IF EXISTS SpatialTable;

CREATE TABLE SpatialTable
(
    Id int generated always as identity primary key,
    GeomCol GEOMETRY,
    GeomColSTA text GENERATED ALWAYS AS (ST_AsText(GeomCol)) STORED
);

INSERT INTO SpatialTable VALUES (default,ST_GeomFromText('LINESTRING (100 100, 20 180, 180 180)',0), default);
INSERT INTO SpatialTable VALUES (default,ST_GeomFromText('POLYGON ((0 0, 150 0, 150 150, 0 150, 0 0))',0), default);
INSERT INTO SpatialTable VALUES (default,ST_GeomFromText('POLYGON((-122.358 47.653 , -122.348 47.649, -122.348 47.658, -122.358 47.658, -122.358 47.653))', 0), default);
INSERT INTO SpatialTable VALUES (default,ST_GeomFromText('LINESTRING (100 100, 20 180, 180 180)',0), default);

-- Functions

DROP FUNCTION IF EXISTS GetBooksByAuthor;

CREATE FUNCTION GetBooksByAuthor(AuthorId integer)
RETURNS table(Id int, Author_Id int, Name varchar(50), Price int)
AS $$

BEGIN
    return query SELECT * FROM Books WHERE Books.Author_id = AuthorId;
END;
$$ LANGUAGE plpgsql;

-- Stored procedures

DROP PROCEDURE IF EXISTS GetAuthorDetails

CREATE PROCEDURE GetAuthorDetails
(
    IN AuthorId int,
    OUT AuthorName varchar(50),
    OUT AuthorCountry varchar(50)
)
AS $$
BEGIN
    SELECT Name, Country into AuthorName, AuthorCountry FROM Authors WHERE Id = AuthorId;
END;
$$ LANGUAGE plpgsql;

