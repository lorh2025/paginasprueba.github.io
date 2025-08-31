-- data/schema.sql
PRAGMA foreign_keys = ON;

-- Fechas en formato ISO (YYYY-MM-DD) para facilitar ORDER BY y filtros

DROP TABLE IF EXISTS Noticias;
CREATE TABLE Noticias (
  Fecha TEXT NOT NULL,          -- YYYY-MM-DD
  Noticia TEXT NOT NULL
);

DROP TABLE IF EXISTS Calendario;
CREATE TABLE Calendario (
  Fecha TEXT NOT NULL,          -- YYYY-MM-DD
  Titulo TEXT NOT NULL,
  Descripcion TEXT NOT NULL
);

DROP TABLE IF EXISTS Inquilino;
CREATE TABLE Inquilino (
  DPI TEXT PRIMARY KEY,         -- 13 dígitos
  PrimerNombre TEXT NOT NULL,
  PrimerApellido TEXT NOT NULL,
  FechaNacimiento TEXT NOT NULL, -- YYYY-MM-DD
  NumeroCasa INTEGER NOT NULL
);

DROP TABLE IF EXISTS PagoDeCuotas;
CREATE TABLE PagoDeCuotas (
  NumeroCasa INTEGER NOT NULL,
  Anio INTEGER NOT NULL,        -- 4 dígitos (ej: 2025)
  Mes TEXT NOT NULL,            -- "01".."12"
  FechaPago TEXT NOT NULL,      -- YYYY-MM-DD
  PRIMARY KEY (NumeroCasa, Anio, Mes)
);

-- Datos de ejemplo
INSERT INTO Noticias (Fecha, Noticia) VALUES
  ('2025-08-01', 'Instalación de luminarias nuevas en el sendero central.'),
  ('2025-08-15', 'Jornada de reforestación este fin de semana.'),
  ('2025-08-20', 'Mantenimiento de piscina programado para el 28 de agosto.'),
  ('2025-07-20', 'Clausura de curso vacacional infantil.');

INSERT INTO Calendario (Fecha, Titulo, Descripcion) VALUES
  ('2025-08-05', 'Clases de yoga', 'Sesión abierta en el salón social, 7:00 AM.'),
  ('2025-08-15', 'Reforestación', 'Punto de reunión: parque central, 8:00 AM.'),
  ('2025-08-28', 'Mantenimiento de piscina', 'Cerrada por trabajos de 8:00 a 14:00.'),
  ('2025-09-10', 'Asamblea General', 'Salón social, 19:00.');

INSERT INTO Inquilino (DPI, PrimerNombre, PrimerApellido, FechaNacimiento, NumeroCasa) VALUES
  ('1234567890123','Ana','García','1990-05-12',101),
  ('9876543210987','Luis','Reyes','1985-02-20',102);

INSERT INTO PagoDeCuotas (NumeroCasa, Anio, Mes, FechaPago) VALUES
  (101, 2025, '08', '2025-08-03'),
  (102, 2025, '07', '2025-07-05');