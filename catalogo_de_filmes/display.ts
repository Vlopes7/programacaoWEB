import { Filme } from "./Filme";

export function exibirFilme(filme: Filme, indice?: number): void {
  const prefixo = indice !== undefined ? `[${indice + 1}] ` : "   ";
  const avaliacao =
    filme.avaliacao !== undefined ? `${filme.avaliacao}/10` : "Não avaliado";
  const estrelas = filme.avaliacao !== undefined ? gerarEstrelas(filme.avaliacao) : "----------";

  console.log(`${prefixo}🎬 ${filme.titulo}`);
  console.log(`     📅 Ano: ${filme.anoLancamento}  |  🎭 Gênero: ${filme.genero}  |  ⏱  Duração: ${filme.duracaoMinutos} min`);
  console.log(`     ⭐ Avaliação: ${avaliacao} ${estrelas}`);
  console.log("");
}

export function exibirListaFilmes(filmes: Filme[], titulo: string): void {
  console.log("");
  console.log(`╔${"═".repeat(54)}╗`);
  console.log(`║  ${titulo.padEnd(52)}║`);
  console.log(`╚${"═".repeat(54)}╝`);

  if (filmes.length === 0) {
    console.log("  Nenhum filme encontrado.\n");
    return;
  }

  console.log(`  Total: ${filmes.length} filme(s)\n`);
  filmes.forEach((f, i) => exibirFilme(f, i));
}

function gerarEstrelas(avaliacao: number): string {
  const cheiasCount = Math.round(avaliacao / 2);
  const vazias = 5 - cheiasCount;
  return "★".repeat(cheiasCount) + "☆".repeat(vazias);
}

export function exibirSeparador(): void {
  console.log("─".repeat(56));
}

export function exibirSucesso(msg: string): void {
  console.log(`\n  ✅ ${msg}\n`);
}

export function exibirErro(msg: string): void {
  console.log(`\n  ❌ ${msg}\n`);
}

export function exibirAviso(msg: string): void {
  console.log(`\n  ⚠️  ${msg}\n`);
}