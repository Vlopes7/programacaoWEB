import * as readline from 'node:readline';
import { CatalogoFilmes } from "./CatalogoFilmes";
import { Filme } from "./Filme";
import {
  exibirListaFilmes,
  exibirSeparador,
  exibirSucesso,
  exibirErro,
  exibirAviso,
} from "./display";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const catalogo = new CatalogoFilmes();

function perguntar(questao: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(questao, (resposta: string) => resolve(resposta.trim()));
  });
}

function exibirBanner(): void {
  console.clear();
  console.log("");
  console.log("  ╔══════════════════════════════════════════════════════╗");
  console.log("  ║             CATÁLOGO DE FILMES                       ║");
  console.log("  ║                                                      ║");
  console.log("  ╚══════════════════════════════════════════════════════╝");
  console.log(`\n  Filmes cadastrados: ${catalogo.totalFilmes()}\n`);
}

function exibirMenuPrincipal(): void {
  console.log("  ┌─────────────────────────────────────────────────────┐");
  console.log("  │                  MENU PRINCIPAL                     │");
  console.log("  ├─────────────────────────────────────────────────────┤");
  console.log("  │  1 › Adicionar novo filme                           │");
  console.log("  │  2 › Listar todos os filmes                         │");
  console.log("  │  3 › Buscar filme por título                        │");
  console.log("  │  4 › Buscar filmes por gênero                       │");
  console.log("  │  5 › Remover filme pelo título                      │");
  console.log("  │  6 › Ordenar filmes por ano                         │");
  console.log("  │  0 › Sair                                           │");
  console.log("  └─────────────────────────────────────────────────────┘");
  console.log("");
}

async function aguardarEnter(): Promise<void> {
  await perguntar("\n  Pressione Enter para continuar...");
}

async function adicionarFilme(): Promise<void> {
  console.clear();
  console.log("\n  ╔══════════════════════════════════════╗");
  console.log("  ║         ADICIONAR NOVO FILME         ║");
  console.log("  ╚══════════════════════════════════════╝\n");

  const titulo = await perguntar("Título: ");
  if (!titulo) { exibirErro("O título não pode estar vazio."); await aguardarEnter(); return; }

  const anoStr = await perguntar("Ano de lançamento: ");
  const ano = parseInt(anoStr);
  if (isNaN(ano) || ano < 1888 || ano > new Date().getFullYear() + 5) {
    exibirErro("Ano inválido."); await aguardarEnter(); return;
  }

  const genero = await perguntar("Gênero: ");
  if (!genero) { exibirErro("O gênero não pode estar vazio."); await aguardarEnter(); return; }

  const duracaoStr = await perguntar("Duração (minutos): ");
  const duracao = parseInt(duracaoStr);
  if (isNaN(duracao) || duracao <= 0) {
    exibirErro("Duração inválida."); await aguardarEnter(); return;
  }

  const avaliacaoStr = await perguntar("Avaliação (0–10, deixe em branco para pular): ");
  let avaliacao: number | undefined = undefined;

  if (avaliacaoStr !== "") {
    avaliacao = parseFloat(avaliacaoStr);
    if (isNaN(avaliacao) || avaliacao < 0 || avaliacao > 10) {
      exibirErro("Avaliação deve ser entre 0 e 10."); await aguardarEnter(); return;
    }
  }

  const novoFilme: Filme = { titulo, anoLancamento: ano, genero, duracaoMinutos: duracao, avaliacao };

  try {
    catalogo.adicionarFilme(novoFilme);
    exibirSucesso(`"${titulo}" adicionado com sucesso!`);
  } catch (e: any) {
    exibirErro(e.message);
  }

  await aguardarEnter();
}

async function listarTodos(): Promise<void> {
  console.clear();
  const filmesOrdenados = catalogo.listarFilmes().sort((a, b) => a.anoLancamento - b.anoLancamento);
  exibirListaFilmes(filmesOrdenados, "TODOS OS FILMES (ORDEM DE LANÇAMENTO)");
  await aguardarEnter();
}

async function buscarPorTitulo(): Promise<void> {
  console.clear();
  console.log("\n  ╔══════════════════════════════════════╗");
  console.log("  ║          BUSCAR POR TÍTULO           ║");
  console.log("  ╚══════════════════════════════════════╝\n");

  const termo = await perguntar("Digite o título (ou parte dele): ");
  if (!termo) { exibirAviso("Nenhum termo informado."); await aguardarEnter(); return; }

  const resultado = catalogo.buscarPorTitulo(termo).sort((a, b) => a.anoLancamento - b.anoLancamento);
  exibirListaFilmes(resultado, `RESULTADOS PARA: "${termo}"`);
  await aguardarEnter();
}

async function buscarPorGenero(): Promise<void> {
  console.clear();
  console.log("\n  ╔══════════════════════════════════════╗");
  console.log("  ║          BUSCAR POR GÊNERO           ║");
  console.log("  ╚══════════════════════════════════════╝\n");

  const genero = await perguntar("Digite o gênero (ou parte dele): ");
  if (!genero) { exibirAviso("Nenhum gênero informado."); await aguardarEnter(); return; }

  const resultado = catalogo.buscarPorGenero(genero).sort((a, b) => a.anoLancamento - b.anoLancamento);
  exibirListaFilmes(resultado, `GÊNERO: "${genero}"`);
  await aguardarEnter();
}

async function removerFilme(): Promise<void> {
  console.clear();
  console.log("\n  ╔══════════════════════════════════════╗");
  console.log("  ║            REMOVER FILME             ║");
  console.log("  ╚══════════════════════════════════════╝\n");

  const titulo = await perguntar("Título exato do filme a remover: ");
  if (!titulo) { exibirAviso("Título não informado."); await aguardarEnter(); return; }

  const confirmacao = await perguntar(`Confirma remoção de "${titulo}"? (s/n): `);
  if (confirmacao.toLowerCase() !== "s") {
    exibirAviso("Operação cancelada."); await aguardarEnter(); return;
  }

  const removido = catalogo.removerPorTitulo(titulo);
  if (removido) {
    exibirSucesso(`"${titulo}" removido com sucesso!`);
  } else {
    exibirErro(`Filme "${titulo}" não encontrado.`);
  }

  await aguardarEnter();
}

async function ordenarFilme(): Promise<void> {
  console.clear();
  console.log("\n  ╔══════════════════════════════════════╗");
  console.log("  ║            ORDENAR FILMES            ║");
  console.log("  ╚══════════════════════════════════════╝\n");

  let ordenado = catalogo.ordenarFilmes();
  
  exibirListaFilmes(ordenado, "FILMES ORDENADOS POR ANO");

  await aguardarEnter();
}

async function main(): Promise<void> {
let dado = true
  while (dado) {
    exibirBanner();
    exibirMenuPrincipal();

    const opcao = await perguntar("Escolha uma opção: ");
    exibirSeparador();

    switch (opcao) {
      case "1": await adicionarFilme();    break;
      case "2": await listarTodos();       break;
      case "3": await buscarPorTitulo();   break;
      case "4": await buscarPorGenero();   break;
      case "5": await removerFilme();      break;
      case '6': await ordenarFilme();      break; 
      case "0":
        console.log("\nEncerrando o Catálogo de Filmes. Até logo!\n");
        dado = false;
        break;
      default:
        exibirAviso("Opção inválida. Tente novamente.");
        await aguardarEnter();
    }
  }
}

main();