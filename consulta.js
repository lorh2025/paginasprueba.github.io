// assets/consulta.js
import { getDb, queryAll, queryOne } from './db.js';

function setError(inputId, msg){
  const el = document.querySelector(`.error[data-for="${inputId}"]`);
  if (el) el.textContent = msg || '';
}

function validar(form){
  let ok = true;
  const dpi = form.dpi.value.trim();
  if (!/^\d{13}$/.test(dpi)) { setError('dpi', 'Debe contener 13 dígitos.'); ok=false; }
  else setError('dpi');

  const casa = Number(form.numeroCasa.value);
  if (!casa || casa < 1) { setError('numeroCasa','Ingrese un número válido.'); ok=false; }
  else setError('numeroCasa');

  if (!form.nombre.value.trim()) { setError('nombre','Requerido.'); ok=false; } else setError('nombre');
  if (!form.apellido.value.trim()) { setError('apellido','Requerido.'); ok=false; } else setError('apellido');
  if (!form.nacimiento.value) { setError('nacimiento','Requerido.'); ok=false; } else setError('nacimiento');

  return ok;
}

async function consultarEstado(e){
  e.preventDefault();
  const form = e.target;
  const out = document.getElementById('resultado');
  out.className = 'result'; out.textContent = '';
  if (!validar(form)) return;

  const { dpi, numeroCasa, nombre, apellido, nacimiento } = form;
  try {
    const db = await getDb();
    // Verifica existencia del inquilino con esos datos
    const inq = queryOne(db, `
      SELECT * FROM Inquilino
      WHERE DPI = ? AND NumeroCasa = ? AND PrimerNombre = ? AND PrimerApellido = ? AND FechaNacimiento = ?
    `, [dpi.value.trim(), Number(numeroCasa.value), nombre.value.trim(), apellido.value.trim(), nacimiento.value]);

    if (!inq) {
      out.classList.add('warn');
      out.textContent = 'Datos no coinciden con registros de inquilinos.';
      return;
    }

    const hoy = new Date();
    const anio = hoy.getFullYear();
    const mes = String(hoy.getMonth()+1).padStart(2,'0');

    const pago = queryOne(db, `
      SELECT * FROM PagoDeCuotas
      WHERE NumeroCasa = ? AND Anio = ? AND Mes = ?
    `, [Number(numeroCasa.value), anio, mes]);

    if (pago) {
      out.classList.add('ok');
      out.textContent = 'Cuota de mantenimiento al día';
    } else {
      out.classList.add('warn');
      out.textContent = 'Cuota de mantenimiento pendiente';
    }
  } catch(err) {
    out.classList.add('warn');
    out.textContent = `Error: ${err.message}`;
  }
}

async function consultarHistorial(e){
  e.preventDefault();
  const desde = document.getElementById('desde').value;
  const hasta = document.getElementById('hasta').value;
  const casa = Number(document.getElementById('numeroCasa').value);
  const tbody = document.querySelector('#tblHistorial tbody');

  if (!desde || !hasta) { return; }
  if (!casa) { alert('Ingresa primero el Número de Casa en el formulario superior.'); return; }

  const db = await getDb();
  const rows = queryAll(db, `
    SELECT NumeroCasa, Anio, Mes, FechaPago
    FROM PagoDeCuotas
    WHERE NumeroCasa = ? AND date(FechaPago) BETWEEN date(?) AND date(?)
    ORDER BY date(FechaPago) DESC;
  `, [casa, desde, hasta]);

  tbody.innerHTML = '';
  for (const r of rows) {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${r.NumeroCasa}</td><td>${r.Anio}</td><td>${r.Mes}</td><td>${new Date(r.FechaPago).toLocaleDateString('es-GT')}</td>`;
    tbody.appendChild(tr);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('frmConsulta').addEventListener('submit', consultarEstado);
  document.getElementById('frmHistorial').addEventListener('submit', consultarHistorial);
});
