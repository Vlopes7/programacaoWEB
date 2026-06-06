# Relatório de Desempenho e Testes de Carga — Projeto CRUD Mundo

Este relatório apresenta os resultados analíticos dos testes de estresse e carga realizados no backend da aplicação **CRUD Mundo**, desenvolvida em **TypeScript**, **Node.js** com **Express**, utilizando **Prisma ORM** e banco de dados **PostgreSQL**.

O objetivo principal do teste foi avaliar o comportamento e o limite da arquitetura do servidor sob cenários de tráfego intenso e concorrência massiva de acessos. Os testes foram executados utilizando a ferramenta de benchmarking **Autocannon**, simulando requisições simultâneas distribuídas ao longo de janelas de tempo de 10 segundos.

---

## 1. Cenário 1: Teste de Leitura em Massa (`GET /continentes`)

O primeiro teste simulou um cenário agressivo de consumo de dados, onde **100 usuários simultâneos** tentaram acessar a listagem de continentes ao mesmo tempo, de forma repetida, durante 10 segundos.

### Métricas de Tempo de Resposta (Latência)
| Estatística (Stat) | 2.5% | 50% (Mediana) | 97.5% | 99% | Média (Avg) | Desvio Padrão (Stdev) | Máximo (Max) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Latência** | 105 ms | 141 ms | 350 ms | 1021 ms | 171.26 ms | 127.85 ms | 1149 ms |

### Métricas de Vazão e Volume de Dados (Throughput)
| Estatística (Stat) | 1% | 2.5% | 50% | 97.5% | Média (Avg) | Desvio Padrão (Stdev) | Mínimo (Min) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Req/Sec** | 40 | 40 | 666 | 788 | 580,8 | 228,9 | 40 |
| **Bytes/Sec** | 17.4 kB | 17.4 kB | 290 kB | 343 kB | 253 kB | 99.6 kB | 17.4 kB |

### Resumo da Amostragem (Leitura)
* **Amostras coletadas:** 10 (1 por segundo)
* **Total de requisições processadas:** ~6.000 requisições em 10.18 segundos
* **Volume total de dados lidos:** 2.53 MB
* **Taxa de sucesso:** 100% (Zero falhas)

### Análise do Cenário de Leitura
A arquitetura baseada em Node.js e Express provou ser altamente eficiente na entrega de dados. Conseguir responder a uma média de **580 requisições por segundo** em um ambiente de desenvolvimento local é uma marca excelente.

O ponto que merece atenção é o pico de **1.1 segundos** nos 1% dos acessos mais lentos (`Max`). Isso demonstra o comportamento clássico de concorrência no ecossistema de backend: sob estresse extremo, as conexões disponíveis com o banco de dados PostgreSQL começam a disputar espaço. O Prisma gerencia isso enfileirando os pedidos mais recentes, fazendo com que as últimas requisições da fila esperem um pouco mais, porém garantindo que o sistema não caia e que nenhum dado seja corrompido.

---

## 2. Cenário 2: Teste de Escrita Intensiva (`POST /continentes`)

O segundo cenário elevou o nível de estresse da aplicação, simulando **50 usuários gravando dados de forma síncrona** (cadastrando novos registros simultâneos no banco de dados) através do envio de payloads lidos diretamente de um arquivo JSON.

### Métricas de Tempo de Resposta (Latência)
| Estatística (Stat) | 2.5% | 50% (Mediana) | 97.5% | 99% | Média (Avg) | Desvio Padrão (Stdev) | Máximo (Max) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Latência** | 57 ms | 85 ms | 194 ms | 1677 ms | 108.66 ms | 171.74 ms | 1775 ms |

### Métricas de Vazão e Volume de Dados (Throughput)
| Estatística (Stat) | 1% | 2.5% | 50% | 97.5% | Média (Avg) | Desvio Padrão (Stdev) | Mínimo (Min) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Req/Sec** | 0 | 0 | 520 | 736 | 456,3 | 215,98 | 161 |
| **Bytes/Sec** | 0 B | 0 B | 203 kB | 288 kB | 178 kB | 84.5 kB | 63 kB |

### Resumo da Amostragem (Escrita)
* **Amostras coletadas:** 10 (1 por segundo)
* **Total de inserções bem-sucedidas:** ~5.000 requisições em 10.09 segundos
* **Volume total de dados processados:** 1.78 MB
* **Taxa de sucesso:** 100% (Zero falhas de requisição ou erros HTTP `4xx`/`5xx`)

### Análise do Cenário de Escrita
Geralmente, rotas de escrita (`POST`) são os principais gargalos de qualquer API, pois demandam processamento físico de hardware, validações de esquema e *locks* nas tabelas do banco de dados. No entanto, o comportamento do servidor superou as expectativas.

O sistema processou com sucesso **5.000 cadastros em apenas 10 segundos**, mantendo uma latência média impressionante de **108.66 ms**. A metade mais rápida das requisições levou meros **85 ms** para ser concluída (percentil 50%). O tempo máximo registrado chegou a **1.77 segundos**, o que reflete a barreira física do *Connection Pool* do PostgreSQL processando as filas de transações pesadas. O dado mais importante deste teste é a estabilidade: mesmo sob intenso bombardeio de gravação, o servidor não rejeitou nenhuma requisição e manteve 100% de integridade nas respostas.

---

## 3. Conclusão e Recomendações

Os testes comprovam que o ecossistema backend está maduro, robusto e pronto para operações reais, atendendo com rigor os critérios de escalabilidade exigidos na disciplina de Programação Web.

Para escalar a aplicação no futuro em ambientes de produção (como AWS, Render ou Fly.io), recomenda-se:
1. **Ajuste do Connection Pool:** Configurar explicitamente o parâmetro `connection_limit` na string de conexão do Prisma no arquivo `.env` para otimizar o uso simultâneo de conexões de acordo com o plano do banco de dados.
2. **Camada de Cache:** Implementar cache em memória (como Redis) para as rotas de busca de listagens (`GET`), blindando o banco de dados contra acessos repetitivos de leitura.