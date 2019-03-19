drop table if exists Bids, Availabilities;
drop table if exists Wallets, Services;
drop table if exists BreedDietRestrictions;
drop table if exists PetBreed;
drop table if exists Breeds;
drop table if exists Species cascade;
drop table if exists CatBreeds;
drop table if exists Cats;
drop table if exists DogBreeds;
drop table if exists Dogs;
drop table if exists Pets cascade;
drop table if exists Caretakers;
drop table if exists PetOwners, OwnsPet cascade;
drop table if exists Users cascade;

CREATE table Users (
	email   varchar(320) PRIMARY KEY,
	name    varchar(255) NOT NULL,
	phone 	int NOT null,
	age		int,
	password varchar not null
);

insert into Users values ('a@hotmail.com', 'a', 12345678, 25, 'password');

create table PetOwners (
	email varchar(320) primary key references Users on delete cascade
);

create table Caretakers (
	email varchar(320) primary key references Users on delete cascade
);

--breed tables format 1
--
--create table Cats (
--	pid int primary key references Pets on delete cascade
--);
--
--create table CatBreeds (
--	pid int primary key references Cats on delete cascade
--);
--
--create table Dogs (
--	pid int primary key references Pets on delete cascade
--);
--
--create table DogBreeds (
--	pid int primary key references Dogs on delete cascade
--);
--
--end of breed tables format 1

--breed tables format 2
create table Species (
	speciesName varchar(255) primary key
);

create table Breeds (
	breedName varchar(255) primary key,
	speciesName varchar(255) references Species 
); 

create table Pets (
	name varchar(255) not null,
	pid int primary key,
	age int,
	speciesName varchar(255) references Species not null
);

create table isOfSpecies (
	pid int references Pets,
	speciesName varchar(255) references Species,
	primary key (pid, speciesName)
);

create table OwnsPet (
	email varchar(255) references PetOwners,
	pid int references Pets,
	primary key (email, pid)
);

create table PetBreed (
	pid int references Pets primary key,
	breedName varchar(255) references Breeds not null
);

create table BreedDietRestrictions (
	breedName varchar(255) references Breeds,
	diet varchar(255) references Diet,
	primary key (breedName, diet)
);

create table Diet (
	diet varchar(255) primary key
);
--end of breed tables format 2

-- Availability of Caretakers
create table Availabilities (
 	aid int primary key,
 	email varchar(255) references Caretakers not null, 
 	startDate date not null,
  	endDate date not null,
  	daysOfWeek int not null  	
);

-- create table hasAvailability (
-- 	aid int references Availabilities primary key,
--  	email varchar(255) references Caretakers not null
-- );

-- Bidding
create table Bids (
	bid int primary key,
	bidderEmail varchar(255) references PetOwners not null,
	caretakerEmail varchar(255) references Caretakers not null,
  	bidTimeStamp timestamp not null,
  	bidAmount int not null
);

-- create table BidsOn (
-- 	bid int references Bids primary key,
-- 	bidderEmail varchar(255) references PetOwners not null,
-- 	caretakerEmail varchar(255) references Caretakers not null,	
-- );

-- Services Caretaker provides
create table Services (
	serviceid varchar(255) primary key
);

create table provideService (
	serviceid varchar(255) references Services,
	email varchar(255) references Caretakers,
  	primary key (serviceid, email)
);

-- Wallets
create table Wallets (
	wid int primary key,
	email varchar(255) references Users primary key,
	walletAmt float8 not null 
);

-- create table hasWallet (
-- 	wid int references Wallets primary key,
-- 	email varchar(255) references Users not null
-- );

create table Transactions (
	tid int primary key,
	transactFrom varchar(255) references Users not null,
	transactTo varchar(255) references Users not null,
	transTimeStamp timestamp not null,
	transAmt float8 not null,
);

-- create table hasTransactions (
-- 	tid int references Transactions,
-- 	email varchar(255) references Users,
-- 	primary key (tid, email)
-- );

-- Badges/ Reviews
create table Reviews (
	rid int primary key,
	review varchar(1024) not null,
	email varchar(255) references Caretakers not null,
	rating int,
	byUser varchar(255) references PetOwners not null
);

-- create table hasReview (
-- 	rid int references Reviews primary key,
-- 	email varchar(255) references Caretakers not null
-- );

-- create table gaveReview (
-- 	rid int references Reviews primary key,
-- 	email varchar(255) references PetOwners not null
-- );

create table Badges (
	badge varchar(255) primary key,
	descript varchar(255)
);

create table hasBadge (
	badge varchar(255),
	email varchar(255) references Users,
	primary key (badge, email)
);