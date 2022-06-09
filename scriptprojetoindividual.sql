create database GenesisCore;
use GenesisCore;

create table Usuario (
idUsuario int primary key auto_increment,
Nickname varchar(30));

create table Pontuação (
idPontuação int auto_increment,
Pontos double,
fkUsuario int,
foreign key (fkUsuario) references Usuario (idUsuario),
primary key (idPontuação, fkUsuario));

