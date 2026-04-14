export interface Filme {
  titulo: string;
  anoLancamento: number;
  genero: string;
  duracaoMinutos: number;
  avaliacao?: number; 
}

export type OrdenacaoCriterio = "ano" | "avaliacao" | "titulo";
export type OrdenacaoDirecao = "asc" | "desc";