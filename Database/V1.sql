drop database if exists ckkato;
create database ckkato;
use ckkato;


create table User (
   id int auto_increment primary key,
   firstName varchar(30) not null,
   lastName varchar(30) not null,
   email varchar(30) not null,
   phoneNumber varchar(20),
   password varchar(50),
   role int unsigned not null,  # 0 rider, 1 driver, 2 admin
   model varchar(30),
   make varchar(30),
   year varchar(30),
   unique key(email)
);

create table Ride (
   id int auto_increment primary key,
   driverId int,
   startDestination varchar(80) not null,
   endDestination varchar(80) not null,
   departureTime datetime,
   capacity int,
   curRiders int,
   fee int,
   constraint FKUser_driverId foreign key (driverId) references User(id)
    on delete cascade,
   constraint FKRequest_driverId foreign key (driverId) references User(id)
);

create table Request (
   id int auto_increment primary key,
   email varchar(80) not null,
   firstName varchar(80) not null,
   lastName varchar(80) not null,
   accepted int not null,
   sndId int not null,
   rcvId int not null,
   rideId int not null,
   whenMade datetime not null,
   content varchar(5000) not null,
   constraint FKRequest_sndId foreign key (sndId) references User(id)
    on delete cascade,
   constraint FKRequest_rcvId foreign key (rcvId) references User(id)
    on delete cascade,
   constraint FKRequest_rideId foreign key (rideId) references Ride(id)
    on delete cascade
);

insert into User (firstName, lastName, email, password, role)
   VALUES ("Clint", "Admin", "senpaiClint@437.com", "password", 2);
