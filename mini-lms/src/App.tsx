import { useState, useEffect } from 'react';

interface Universidad {
  name: string;
  domains: string[];
  web_pages: string[];
}

function App() {
  const [universidades, setUniversidades] = useState<Universidad[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // Hacemos la petición a la ruta del proxy que configuramos
    fetch('/api-uni/search?country=peru')
      .then((res) => {
        if (!res.ok) throw new Error("Error en la petición");
        return res.json();
      })
      .then((data) => {
        setUniversidades(data);
        setCargando(false);
      })
      .catch((error) => {
        console.error("Error al cargar los datos:", error);
        setCargando(false);
      });
  }, []);

  // Lógica para la búsqueda en tiempo real
  const filtradas = universidades.filter((u) =>
    u.name.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Buscador de Universidades 🇵🇪</h1>
      
      <input
        type="text"
        placeholder="Escribe para buscar (ej. San Marcos)..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        style={{ width: '100%', padding: '12px', fontSize: '18px', marginBottom: '20px', borderRadius: '8px', border: '1px solid #ccc' }}
      />

      {cargando ? (
        <p>Cargando universidades desde la API...</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {filtradas.map((u, index) => (
            <li key={index} style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '15px', borderRadius: '8px', backgroundColor: '#fafafa' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#007bff' }}>{u.name}</h3>
              <p style={{ margin: '0 0 10px 0', color: '#555' }}><strong>Dominio:</strong> {u.domains[0]}</p>
              <a 
                href={u.web_pages[0]} 
                target="_blank" 
                rel="noreferrer"
                style={{ display: 'inline-block', padding: '8px 12px', backgroundColor: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '5px' }}
              >
                Visitar sitio web
              </a>
            </li>
          ))}
          {filtradas.length === 0 && <p>No se encontraron universidades con ese nombre.</p>}
        </ul>
      )}
    </div>
  );
}

export default App;