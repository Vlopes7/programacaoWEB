import { Filme, OrdenacaoCriterio, OrdenacaoDirecao } from "./Filme";

export class CatalogoFilmes {
  private filmes: Filme[] = [];

  adicionarFilme(filme: Filme): void {
    if (filme.avaliacao !== undefined) {
      if (filme.avaliacao < 0 || filme.avaliacao > 10) {
        throw new Error("Avaliação deve estar entre 0 e 10.");
      }
    }

    const jaExiste = this.filmes.find(
      (f) => f.titulo.toLowerCase() === filme.titulo.toLowerCase()
    );
    if (jaExiste) {
      throw new Error(`Já existe um filme com o título "${filme.titulo}".`);
    }

    this.filmes.push(filme);
  }

  listarFilmes(): Filme[] {
    return [...this.filmes];
  }

  buscarPorTitulo(titulo: string): Filme[] {
    return this.filmes.filter((f) =>
      f.titulo.toLowerCase().includes(titulo.toLowerCase())
    );
  }

  buscarPorGenero(genero: string): Filme[] {
    return this.filmes.filter((f) =>
      f.genero.toLowerCase().includes(genero.toLowerCase())
    );
  }

  removerPorTitulo(titulo: string): boolean {
    const tamanhoAntes = this.filmes.length;
    this.filmes = this.filmes.filter(
      (f) => f.titulo.toLowerCase() !== titulo.toLowerCase()
    );
    return this.filmes.length < tamanhoAntes;
  }

  ordenarFilmes(): Filme[] {
    const copia = [...this.filmes];
    copia.sort((a, b) => a.anoLancamento - b.anoLancamento);

    return copia;
  }

  totalFilmes(): number {
    return this.filmes.length;
  }
}