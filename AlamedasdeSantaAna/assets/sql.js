<!DOCTYPE html>
<html>
<head>
    <title>Noticias</title>
    <script src="js/sql.js"></script>
</head>
<body>
    <h1>Noticias</h1>
    <div id="noticias"></div>

    <script>
        // Cargar la base de datos
        fetch('data/residencial.db')
            .then(response => response.arrayBuffer())
            .then(buffer => {
                const SQL = window.initSqlJs(); // Inicializa sql.js
                return SQL.then(SQLLib => {
                    const db = new SQLLib.Database(new Uint8Array(buffer));

                    // Ejecutar consulta
                    const res = db.exec("SELECT Fecha, Noticia FROM Noticias");
                    let html = '';
                    if(res.length > 0) {
                        const values = res[0].values;
                        values.forEach(row => {
                            html += `<p><strong>${row[0]}</strong>: ${row[1]}</p>`;
                        });
                    }
                    document.getElementById('noticias').innerHTML = html;
                });
            });
    </script>
</body>
</html>