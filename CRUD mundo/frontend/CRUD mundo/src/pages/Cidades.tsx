import React, { useState, useEffect } from 'react';
import api from '../services/api';
import axios from 'axios';
import './styles/Cidades.css';
import './styles/CRUD.css'

interface Continente {
  id: string;
  nome: string;
}

interface Pais {
  id: string;
  nome: string;
  continenteId: string;
}

interface Cidade {
  id: string;
  nome: string;
  populacao: number;
  latitude: number;
  longitude: number;
  paisId: string;
}

interface CidadeCardProps {
  cidade: Cidade;
  onEdit: (cidade: Cidade) => void;
  onDelete: (id: string) => void;
}

const CidadeCard: React.FC<CidadeCardProps> = ({ cidade, onEdit, onDelete }) => {
  const [temperatura, setTemperatura] = useState<number | null>(null);

  useEffect(() => {
    axios
      .get(
        `https://api.open-meteo.com/v1/forecast?latitude=${cidade.latitude}&longitude=${cidade.longitude}&current_weather=true`
      )
      .then((response) => {
        setTemperatura(response.data.current_weather.temperature);
      })
      .catch(() => setTemperatura(null));
  }, [cidade.latitude, cidade.longitude]);

  return (
    <div className="cidade-card">
      <div className="cidade-card-header">
        <h3>{cidade.nome}</h3>

        {temperatura !== null && (
          <span className="temperatura-badge">
            {temperatura}°C
          </span>
        )}
      </div>

      <p>
        <strong>População:</strong> {cidade.populacao}
      </p>

      <p>
        <strong>Lat/Long:</strong> {cidade.latitude.toFixed(2)},{' '}
        {cidade.longitude.toFixed(2)}
      </p>

      <div className="crud-card-actions">
        <button
          onClick={() => onEdit(cidade)}
          className="btn-editar"
        >
          Editar
        </button>

        <button
          onClick={() => onDelete(cidade.id)}
          className="btn-deletar"
        >
          Deletar
        </button>
      </div>
    </div>
  );
};

const Cidades: React.FC = () => {
  const [cidades, setCidades] = useState<Cidade[]>([]);
  const [paises, setPaises] = useState<Pais[]>([]);
  const [continentes, setContinentes] = useState<Continente[]>([]);

  const [nome, setNome] = useState('');
  const [populacao, setPopulacao] = useState('');
  const [paisId, setPaisId] = useState('');

  const [editId, setEditId] = useState<string | null>(null);

  const [filtroPais, setFiltroPais] = useState('');
  const [filtroContinente, setFiltroContinente] = useState('');

  const [paginaAtual, setPaginaAtual] = useState(1);

  const itensPorPagina = 4;

  useEffect(() => {
    carregarDados();
  }, []);

  useEffect(() => {
    setPaginaAtual(1);
  }, [filtroPais, filtroContinente]);

  const carregarDados = async () => {
    try {
      const resCidades = await api.get('/cidades');
      const resPaises = await api.get('/paises');
      const resContinentes = await api.get('/continentes');

      setCidades(resCidades.data);
      setPaises(resPaises.data);
      setContinentes(resContinentes.data);
    } catch {
      alert('Erro ao carregar os dados');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const geoResponse = await axios.get(
        `https://geocoding-api.open-meteo.com/v1/search?name=${nome}&count=1&language=pt&format=json`
      );

      if (
        !geoResponse.data.results ||
        geoResponse.data.results.length === 0
      ) {
        alert(
          'Não foi possível encontrar as coordenadas para esta cidade.'
        );
        return;
      }

      const lat = geoResponse.data.results[0].latitude;
      const lng = geoResponse.data.results[0].longitude;

      const payload = {
        nome,
        populacao: Number(populacao),
        latitude: lat,
        longitude: lng,
        paisId
      };

      if (editId) {
        await api.put(`/cidades/${editId}`, payload);
      } else {
        await api.post('/cidades', payload);
      }

      limparFormulario();
      carregarDados();
    } catch {
      alert('Erro ao salvar cidade');
    }
  };

  const limparFormulario = () => {
    setNome('');
    setPopulacao('');
    setPaisId('');
    setEditId(null);
  };

  const handleEdit = (cidade: Cidade) => {
    setNome(cidade.nome);
    setPopulacao(cidade.populacao.toString());
    setPaisId(cidade.paisId);
    setEditId(cidade.id);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja deletar esta cidade?')) {
      return;
    }

    try {
      await api.delete(`/cidades/${id}`);
      carregarDados();
    } catch {
      alert('Erro ao deletar cidade');
    }
  };

  const cidadesFiltradas = cidades.filter((cidade) => {
    let matchPais = true;
    let matchContinente = true;

    if (filtroPais) {
      matchPais = cidade.paisId === filtroPais;
    }

    if (filtroContinente) {
      const paisDaCidade = paises.find(
        (p) => p.id === cidade.paisId
      );

      matchContinente =
        paisDaCidade?.continenteId === filtroContinente;
    }

    return matchPais && matchContinente;
  });

  const indexUltimoItem = paginaAtual * itensPorPagina;
  const indexPrimeiroItem = indexUltimoItem - itensPorPagina;

  const cidadesPaginadas = cidadesFiltradas.slice(
    indexPrimeiroItem,
    indexUltimoItem
  );

  const totalPaginas = Math.ceil(
    cidadesFiltradas.length / itensPorPagina
  );

  const irParaPaginaAnterior = () =>
    setPaginaAtual((prev) => Math.max(prev - 1, 1));

  const irParaProximaPagina = () =>
    setPaginaAtual((prev) =>
      Math.min(prev + 1, totalPaginas)
    );

  return (
    <div className="crud-container">
      <div className="crud-header">
        <h1>Cidades</h1>
      </div>

      <form onSubmit={handleSubmit} className="crud-form">
        <div className="input-group">
          <label>Nome</label>

          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label>População</label>

          <input
            type="number"
            value={populacao}
            onChange={(e) => setPopulacao(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label>País</label>

          <select
            value={paisId}
            onChange={(e) => setPaisId(e.target.value)}
            required
          >
            <option value="" disabled>
              Selecione...
            </option>

            {paises.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn-salvar">
          {editId ? 'Atualizar' : 'Cadastrar'}
        </button>

        {editId && (
          <button
            type="button"
            onClick={limparFormulario}
            className="btn-deletar"
          >
            Cancelar
          </button>
        )}
      </form>

      <div className="filtros-container">
        <strong>Filtros:</strong>

        <select
          value={filtroContinente}
          onChange={(e) => setFiltroContinente(e.target.value)}
        >
          <option value="">
            Todos os Continentes
          </option>

          {continentes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nome}
            </option>
          ))}
        </select>

        <select
          value={filtroPais}
          onChange={(e) => setFiltroPais(e.target.value)}
        >
          <option value="">Todos os Países</option>

          {paises
            .filter((p) =>
              filtroContinente
                ? p.continenteId === filtroContinente
                : true
            )
            .map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome}
              </option>
            ))}
        </select>
      </div>

      <div className="crud-list">
        {cidadesPaginadas.map((cidade) => (
          <CidadeCard
            key={cidade.id}
            cidade={cidade}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}

        {cidadesFiltradas.length === 0 && (
          <p>Nenhuma cidade encontrada com estes filtros.</p>
        )}
      </div>

      {totalPaginas > 1 && (
        <div className="paginacao">
          <button
            onClick={irParaPaginaAnterior}
            disabled={paginaAtual === 1}
            className="btn-pagina"
          >
            ← Anterior
          </button>

          <span>
            Página {paginaAtual} de {totalPaginas}
          </span>

          <button
            onClick={irParaProximaPagina}
            disabled={paginaAtual === totalPaginas}
            className="btn-pagina"
          >
            Próxima →
          </button>
        </div>
      )}
    </div>
  );
};

export default Cidades;
