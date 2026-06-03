import React, { useState, useEffect } from 'react';
import api from '../services/api';
import axios from 'axios';
import './styles/CRUD.css';
import './styles/Paises.css';

interface Continente {
  id: string;
  nome: string;
}

interface Pais {
  id: string;
  nome: string;
  populacao: number;
  idiomaOficial: string;
  moeda: string;
  continenteId: string;
}

interface PaisCardProps {
  pais: Pais;
  onEdit: (pais: Pais) => void;
  onDelete: (id: string) => void;
}

const PaisCard: React.FC<PaisCardProps> = ({
  pais,
  onEdit,
  onDelete
}) => {
  const [bandeira, setBandeira] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get(`https://restcountries.com/v3.1/translation/${pais.nome}`)
      .then((response) => {
        setBandeira(response.data[0]?.flags?.svg);
      })
      .catch(() => {
        axios
          .get(`https://restcountries.com/v3.1/name/${pais.nome}`)
          .then((res) => {
            setBandeira(res.data[0]?.flags?.svg);
          })
          .catch(() => {
            setBandeira(null);
          });
      });
  }, [pais.nome]);

  return (
    <div className="crud-card">
      <div className="pais-card-header">
        {bandeira ? (
          <img
            src={bandeira}
            alt={pais.nome}
            className="bandeira-img"
          />
        ) : (
          <div className="bandeira-placeholder"></div>
        )}

        <h3>{pais.nome}</h3>
      </div>

      <p>
        <strong>População:</strong> {pais.populacao}
      </p>

      <p>
        <strong>Idioma:</strong> {pais.idiomaOficial}
      </p>

      <p>
        <strong>Moeda:</strong> {pais.moeda}
      </p>

      <div className="crud-card-actions">
        <button
          onClick={() => onEdit(pais)}
          className="btn-editar"
        >
          Editar
        </button>

        <button
          onClick={() => onDelete(pais.id)}
          className="btn-deletar"
        >
          Deletar
        </button>
      </div>
    </div>
  );
};

const Paises: React.FC = () => {
  const [paises, setPaises] = useState<Pais[]>([]);
  const [continentes, setContinentes] = useState<Continente[]>([]);

  const [nome, setNome] = useState('');
  const [populacao, setPopulacao] = useState('');
  const [idiomaOficial, setIdiomaOficial] = useState('');
  const [moeda, setMoeda] = useState('');
  const [continenteId, setContinenteId] = useState('');

  const [editId, setEditId] = useState<string | null>(null);

  const [filtroContinente, setFiltroContinente] = useState('');

  const [paginaAtual, setPaginaAtual] = useState(1);

  const itensPorPagina = 6;

  useEffect(() => {
    carregarDados();
  }, []);

  useEffect(() => {
    setPaginaAtual(1);
  }, [filtroContinente]);

  const carregarDados = async () => {
    try {
      const resPaises = await api.get('/paises');
      const resContinentes = await api.get('/continentes');

      setPaises(resPaises.data);
      setContinentes(resContinentes.data);
    } catch {
      alert('Erro ao carregar os dados');
    }
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      const payload = {
        nome,
        populacao: Number(populacao),
        idiomaOficial,
        moeda,
        continenteId
      };

      if (editId) {
        await api.put(`/paises/${editId}`, payload);
      } else {
        await api.post('/paises', payload);
      }

      limparFormulario();
      carregarDados();
    } catch {
      alert('Erro ao salvar país');
    }
  };

  const limparFormulario = () => {
    setNome('');
    setPopulacao('');
    setIdiomaOficial('');
    setMoeda('');
    setContinenteId('');
    setEditId(null);
  };

  const handleEdit = (pais: Pais) => {
    setNome(pais.nome);
    setPopulacao(pais.populacao.toString());
    setIdiomaOficial(pais.idiomaOficial);
    setMoeda(pais.moeda);
    setContinenteId(pais.continenteId);
    setEditId(pais.id);
  };

  const handleDelete = async (id: string) => {
    if (
      !window.confirm(
        'Tem certeza? Todas as cidades vinculadas serão deletadas.'
      )
    ) {
      return;
    }

    try {
      await api.delete(`/paises/${id}`);
      carregarDados();
    } catch {
      alert('Erro ao deletar país');
    }
  };

  const paisesFiltrados = filtroContinente
    ? paises.filter(
        (pais) => pais.continenteId === filtroContinente
      )
    : paises;

  const indexUltimoItem =
    paginaAtual * itensPorPagina;

  const indexPrimeiroItem =
    indexUltimoItem - itensPorPagina;

  const paisesPaginados =
    paisesFiltrados.slice(
      indexPrimeiroItem,
      indexUltimoItem
    );

  const totalPaginas = Math.ceil(
    paisesFiltrados.length / itensPorPagina
  );

  const irParaPaginaAnterior = () =>
    setPaginaAtual((prev) =>
      Math.max(prev - 1, 1)
    );

  const irParaProximaPagina = () =>
    setPaginaAtual((prev) =>
      Math.min(prev + 1, totalPaginas)
    );

  return (
    <div className="crud-container">
      <div className="crud-header">
        <h1>Países</h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="crud-form"
      >
        <div className="input-group">
          <label>Nome</label>

          <input
            type="text"
            value={nome}
            onChange={(e) =>
              setNome(e.target.value)
            }
            required
          />
        </div>

        <div className="input-group">
          <label>População</label>

          <input
            type="number"
            value={populacao}
            onChange={(e) =>
              setPopulacao(e.target.value)
            }
            required
          />
        </div>

        <div className="input-group">
          <label>Idioma Oficial</label>

          <input
            type="text"
            value={idiomaOficial}
            onChange={(e) =>
              setIdiomaOficial(e.target.value)
            }
            required
          />
        </div>

        <div className="input-group">
          <label>Moeda</label>

          <input
            type="text"
            value={moeda}
            onChange={(e) =>
              setMoeda(e.target.value)
            }
            required
          />
        </div>

        <div className="input-group">
          <label>Continente</label>

          <select
            value={continenteId}
            onChange={(e) =>
              setContinenteId(e.target.value)
            }
            required
          >
            <option value="" disabled>
              Selecione...
            </option>

            {continentes.map((c) => (
              <option
                key={c.id}
                value={c.id}
              >
                {c.nome}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="btn-salvar"
        >
          {editId
            ? 'Atualizar'
            : 'Cadastrar'}
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

      <div className="filtro-paises">
        <strong>Filtros:</strong>

        <select
          value={filtroContinente}
          onChange={(e) =>
            setFiltroContinente(
              e.target.value
            )
          }
        >
          <option value="">
            Todos os Continentes
          </option>

          {continentes.map((c) => (
            <option
              key={c.id}
              value={c.id}
            >
              {c.nome}
            </option>
          ))}
        </select>
      </div>

      <div className="crud-list">
        {paisesPaginados.map((pais) => (
          <PaisCard
            key={pais.id}
            pais={pais}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}

        {paisesFiltrados.length === 0 && (
          <p>
            Nenhum país encontrado com estes
            filtros.
          </p>
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
            Página {paginaAtual} de{' '}
            {totalPaginas}
          </span>

          <button
            onClick={irParaProximaPagina}
            disabled={
              paginaAtual === totalPaginas
            }
            className="btn-pagina"
          >
            Próxima →
          </button>
        </div>
      )}
    </div>
  );
};

export default Paises;
