# 🏰 Battle Royale RPG - Sistema de Batalha em Terminal

> Projeto final da disciplina de Programação Orientada a Objetos.

Este projeto consiste em um sistema de batalha por turnos via linha de comando (CLI), desenvolvido para demonstrar conceitos avançados de POO como Herança, Polimorfismo, Encapsulamento e Persistência de Dados. O sistema permite criar heróis, batalhar estrategicamente e salvar o progresso.

---

## 🏫 Informações Acadêmicas

| Instituição | **Instituto Federal do Piauí (IFPI)** |
| :--- | :--- |
| **Disciplina** | Programação Orientada a Objetos |
| **Professor** | Ely Miranda |
| **Aluno** | Marcos Gabriel |

---

## 🎥 Apresentação do Projeto

Confira o vídeo de demonstração do funcionamento, testes e explicação do código:

**[🔗Trabalho Final POO](https://youtu.be/CeJJ36nByF8)**

*(Link do vídeo no YouTube)*

---

## ✅ Checklist de Requisitos (PDF)

O projeto foi desenvolvido atendendo aos requisitos obrigatórios e implementando funcionalidades extras para pontuação adicional.

### 📜 Requisitos Funcionais Básicos
- [x] **Modelagem de Classes:** Criação de classe abstrata `Personagem` e subclasses (`Guerreiro`, `Mago`, `Arqueiro`).
- [x] **Atributos e Encapsulamento:** Uso de atributos protegidos/privados (`_vida`, `_ataque`, etc.) com métodos de acesso.
- [x] **Polimorfismo:** Implementação do método abstrato `atacar()` com comportamentos distintos para cada classe.
- [x] **Lógica de Combate:** Sistema de turnos onde um personagem ataca e o outro recebe dano.
- [x] **Aleatoriedade:** Fatores de sorte (críticos, falhas ou ativação de habilidades) implementados via `Math.random()`.
- [x] **Interação:** Menu interativo para criação de personagens e controle da batalha.

### 🌟 Requisitos Extras (Diferenciais)
- [x] **Novos Personagens:** Implementação das classes **Necromante** (Roubo de Vida) e **Templário** (Dano Sagrado).
- [x] **Estado da Batalha:** Validação de personagens vivos/mortos e declaração de vencedor.
- [x] **Visualização:** Interface rica com emojis, barras de vida e logs detalhados de dano.
- [x] **Persistência de Dados:** Salvar e Carregar o estado dos personagens e o **histórico completo da batalha** em arquivo JSON (`dados.json`).
- [x] **Histórico de Ações:** Log detalhado de todas as ações ocorridas (ataques, esquivas, curas).
- [x] **Menu de Debug:** Funcionalidade administrativa para "Reviver" personagens e reiniciar rodadas para testes.
- [x] **Modularização:** Código refatorado e organizado em pastas (`src/core`, `src/modelos`, `src/utils`).
- [x] **Testes Automatizados:** Cobertura de testes unitários com **Jest** para todas as classes.

---

## ⚔️ Classes e Habilidades

| Classe | Especialidade | Mecânica Única |
| :--- | :--- | :--- |
| **🛡️ Guerreiro** | Tanque / Defesa | Possui atributo `Defesa` que reduz danos recebidos. Entra em **Fúria** (+30% dano) se a vida estiver baixa. |
| **🔮 Mago** | Dano Explosivo | Seus ataques ignoram a defesa do oponente (Dano Verdadeiro), mas consomem sua própria vida. |
| **🏹 Arqueiro** | Dano Crítico | Chance de realizar um ataque múltiplo (Dano x2 ou x3) baseado na sorte. |
| **💀 Necromante** | Sustentabilidade | Chance de **Roubar Vida** (Lifesteal) ao atacar, recuperando sua saúde. |
| **☀️ Templário** | Caçador de Sombras | Causa **Dano Dobrado** especificamente contra Necromantes (Golpe Divino). |

---

## 🛠️ Tecnologias Utilizadas

* **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
* **Runtime:** [Node.js](https://nodejs.org/) (Execução via `ts-node`)
* **Testes:** [Jest](https://jestjs.io/) (com `ts-jest`)
* **Persistência:** JSON (FileSystem)

---

## 🚀 Como Rodar o Projeto

Siga os passos abaixo para executar o projeto em sua máquina.

### 1. Clonar o repositório

```bash
git clone https://github.com/(seu-usuario)/trabalho_final_poo.git
cd trabalho_final_poo
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Executar o jogo

Para iniciar o jogo via terminal, utilize o `ts-node` para executar o arquivo principal:

```bash
npx ts-node src/jogo_rpg.ts
```

### 4. Executar os testes

Para rodar a suíte de testes unitários com Jest:

```bash
npm test
```

---

## 📂 Estrutura do Projeto

A organização dos arquivos segue a separação por responsabilidades (lógica, modelos, utilitários e testes):

```text
trabalho_final_poo/
│
├── src/
│   ├── core/
│   │   └── 📜 batalha.ts         # Lógica central do turno e validações
│   │
│   ├── modelos/                  # Classes do domínio
│   │   ├── 📜 Personagem.ts      # Classe base abstrata
│   │   ├── 📜 Guerreiro.ts       # Subclasse Guerreiro
│   │   ├── 📜 Mago.ts            # Subclasse Mago
│   │   ├── 📜 Arqueiro.ts        # Subclasse Arqueiro
│   │   ├── 📜 Necromante.ts      # Subclasse Necromante
│   │   ├── 📜 Templario.ts       # Subclasse Templário
│   │   └── 📜 Acao.ts            # Registro de log de batalha
│   │
│   ├── utils/                    # Ferramentas auxiliares
│   │   ├── 📜 io.ts              # Entrada de dados do usuário (readline)
│   │   └── 📜 armazenamento.ts   # Persistência em JSON (Salvar/Carregar)
│   │
│   └── 📜 jogo_rpg.ts            # Arquivo principal (Main / Menu)
│
├── tests/                        # Testes unitários
│   ├── 📜 Guerreiro.test.ts
│   ├── 📜 Mago.test.ts
│   ├── 📜 Arqueiro.test.ts
│   ├── 📜 Necromante.test.ts
│   └── 📜 Templario.test.ts
│
├── 📜 dados.json                 # Arquivo de persistência (gerado automaticamente)
├── 📜 package.json               # Dependências do Node.js e scripts
├── 📜PF tsconfig.json            # Configuração do TypeScript
└── 📜 jest.config.js             # Configuração do Jest
```
