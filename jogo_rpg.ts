import * as fs from 'fs';       // Para salvar o arquivo 
import * as readline from 'readline'; // Para ler o input do usuário 

// --- CLASSE ACAO ---
// Log de Batalha
class Acao {
    id: number;
    origem: string;
    alvo: string;
    descricao: string;
    valorDano: number;
    dataHora: Date;

    constructor(id: number, origem: string, alvo: string, descricao: string, valorDano: number) {
        this.id = id;
        this.origem = origem;
        this.alvo = alvo;
        this.descricao = descricao;
        this.valorDano = valorDano;
        this.dataHora = new Date(); // Pega a data atual automaticamente
    }
}

//CLASSE PERSONAGEM

// "Abstract" pois ninguém é apenas "Personagem"
abstract class Personagem {
    // Protected: Só as subclasses (filhos) podem mexer nesses dados
    protected _id: number;
    protected _nome: string;
    protected _vida: number;
    protected _vidaMaxima: number;
    protected _ataque: number;
    protected _historico: Acao[] = []; 

    constructor(id: number, nome: string, ataque: number, vidaInicial: number = 100) {
        this._id = id;
        this._nome = nome;
        this._ataque = ataque;
        this._vida = vidaInicial;
        this._vidaMaxima = vidaInicial;
    }

    get nome(): string { return this._nome; }
    get id(): number { return this._id; }
    get vida(): number { return this._vida; }
    get estaVivo(): boolean { return this._vida > 0; } // Validação simples de status

    // Método Abstrato: Obriga cada classe filha a criar sua própria lógica de ataque
    abstract atacar(alvo: Personagem): Acao; 

    // Método padrão para receber dano 
    public receberDano(valor: number): void {
        this._vida -= valor;
        if (this._vida < 0) this._vida = 0; // Vida mínima é 0

        const percentual = Math.round((this._vida / this._vidaMaxima) * 100);
        console.log(`   💥 ${this._nome} tomou ${valor.toFixed(0)} de dano.`);
        console.log(`   ❤️  Status: ${this._vida}/${this._vidaMaxima} PV (${percentual}%)`);

        if (!this.estaVivo) console.log(`   💀 ${this._nome} foi derrotado!`);
    }

    // Método auxiliar para o Mago ignorar defesa 
    public receberDanoVerdadeiro(valor: number): void {
        console.log(`   ⚡ DANO VERDADEIRO (Ignorou Defesa)`); 
        this.receberDano(valor);
    }

    public registrarAcao(acao: Acao): void {
        this._historico.push(acao);
    }
}

//SUBCLASSES 

// 1. GUERREIRO
class Guerreiro extends Personagem {
    private _defesa: number;

    constructor(id: number, nome: string, ataque: number, defesa: number, vidaInicial: number = 100) {
        super(id, nome, ataque, vidaInicial);
        this._defesa = defesa;
    }

    // Sobrescrevi para usar a defesa antes de reduzir a vida
    public receberDano(valor: number): void {
        if (valor < this._defesa) {
            console.log(`   🛡️ ${this.nome} Defendeu totalmente! (Defesa ${this._defesa} > Ataque ${valor})`);
            return;
        }
        const danoReal = valor - this._defesa;
        console.log(`   🛡️ Defesa reduziu o impacto em ${this._defesa}.`);
        super.receberDano(danoReal);
    }
    
    atacar(alvo: Personagem): Acao {
        let valorAtaque = this._ataque;
        let msg = `Ataque de Espada`;
        
        // Passiva: Fúria (+30% dano se vida < 30%)
        if (this._vida < (this._vidaMaxima * 0.3)){
            valorAtaque = valorAtaque * 1.3;
            valorAtaque = Math.floor(valorAtaque); // Arredonda para baixo 
            msg += " 🔥 (FÚRIA +30%)";
            console.log(`   🔥 ${this.nome} está enfurecido! Dano aumentado.`);
        }
        console.log(`\n⚔️  ${this.nome} ATACA ${alvo.nome}!`);
        alvo.receberDano(valorAtaque);

        const idAcao = Date.now();
        const acao = new Acao(idAcao, this.nome, alvo.nome, msg, valorAtaque);
        this.registrarAcao(acao);
        return acao;             
    }
}

// 2. MAGO
class Mago extends Personagem {
    constructor(id: number, nome: string, ataque: number, vidaInicial: number = 100) {
        super(id, nome, ataque, vidaInicial);
    }

    atacar(alvo: Personagem): Acao {
        let valorAtaque = this._ataque;
        let msg = `Magia Arcana`;

        console.log(`\n✨ ${this.nome} Conjura uma magia em ${alvo.nome}!`);
        
        // Regra: Mago gasta vida para atacar
        this._vida -= 10;
        console.log(`   💧 ${this._nome} gastou 10 PV para usar magia.`);

        // Regra: Dano dobrado em Arqueiro
        if (alvo instanceof Arqueiro) {
            valorAtaque = valorAtaque * 2;
            msg += " 🎯 (Crítico vs Arqueiro)";
            console.log(`   🎯 Dano DOBRADO pela vulnerabilidade do Arqueiro!`);
        }
        
        // Regra: Ignora defesa de Guerreiro
        if (alvo instanceof Guerreiro) {
            msg += " ⚡ (Ignorou Defesa)";
            alvo.receberDanoVerdadeiro(valorAtaque);
        } else {
            alvo.receberDano(valorAtaque);
        }

        const idAcao = Date.now();
        const acao = new Acao(idAcao, this.nome, alvo.nome, msg, valorAtaque);
        this.registrarAcao(acao);

        // Registra o custo de vida como ação separada no histórico
        this.registrarAcao(new Acao(idAcao+1, this.nome, this.nome, "Custo de Mana", 10));

        return acao;
    }
}

// 3. ARQUEIRO
class Arqueiro extends Personagem {
    private _ataqueMultiplo: number;

    constructor(id: number, nome: string, ataque: number, ataqueMultiplo: number = 2, vidaInicial: number = 100) {
        super(id, nome, ataque, vidaInicial);
        this._ataqueMultiplo = ataqueMultiplo;
    }

    atacar(alvo: Personagem): Acao {
        let valorAtaque = this._ataque;
        let msg = `Disparo Simples`;
        let visual = "🏹";
        
        // 50% de chance de ativar ataque múltiplo 
        if(Math.random() < 0.5) {
            valorAtaque = valorAtaque * this._ataqueMultiplo;
            msg = `🏹 Chuva de Flechas (${this._ataqueMultiplo}x)`;
            visual = "🏹🏹🏹";
            console.log(`   🎲 Sorteio: ATAQUE MÚLTIPLO ativado!`);
        } else {
            console.log(`   🎲 Sorteio: Ataque normal.`);
        }
        
        console.log(`\n${visual} ${this.nome} DISPARA contra ${alvo.nome}!`);
        alvo.receberDano(valorAtaque);

        const idAcao = Date.now();
        const acao = new Acao(idAcao, this.nome, alvo.nome, msg, valorAtaque);
        this.registrarAcao(acao);
        return acao;        
    }
}

// CLASSE BATALHA 
class Batalha {
    personagens: Personagem[] = [];
    acoes: Acao[] = [];
    _idSequencial: number = 1;

    gerarId(): number {
        return this._idSequencial++;
    }

    atualizarUltimoId(): void {
        if (this.personagens.length > 0) {
            const maiorId = Math.max (...this.personagens.map(p => p.id));
            this._idSequencial = maiorId + 1;
        }
    }

    // Adiciona validando se o nome já existe
    adicionarPersonagem(personagem: Personagem): void {
        for (const p of this.personagens) {
            if (p.nome === personagem.nome) {
                throw new Error("Já existe um personagem com este nome!");
            }
        }
        this.personagens.push(personagem);
        console.log("✅ Personagem adicionado: " + personagem.nome);
    }
    
    // Busca personagem pelo nome na lista
    consultarPersonagem(nomeBuscado: string): Personagem {
        for (const p of this.personagens) {
            if(p.nome === nomeBuscado)
                return p;
        }
        throw new Error("Personagem não encontrado");
    }

    // Gerencia o turno de ataque
    turno(atacanteId: number, defensorId: number): Acao[] {
        let atacante: Personagem | null = null;
        let defensor: Personagem | null = null;

        // Busca manual pelos IDs
        for (const p of this.personagens) {
            if (p.id === atacanteId) atacante = p;
            if (p.id === defensorId) defensor = p;
        }
        
        // Validações obrigatórias (Requisito 4)
        if (atacante === null) throw new Error("Atacante não encontrado");
        if (defensor === null) throw new Error("Defensor não encontrado");
        if (atacante === defensor) throw new Error("Personagem não pode atacar a si mesmo");
        if (!atacante.estaVivo) throw new Error ("Personagem morto não pode atacar");
        if (!defensor.estaVivo) throw new Error ("Personagem morto não pode ser atacado");

        const acao = atacante.atacar(defensor);
        this.acoes.push(acao);

        return [acao];
    }

    listarPersonagens(): Personagem[] { return this.personagens; }
    listarAcoes(): Acao[] { return this.acoes; }

    verificarVencedor(): Personagem | null {
        let contadorVivos = 0;
        let ultimoVivo: Personagem | null = null;

        for(const p of this.personagens) {
            if (p.estaVivo) {
                contadorVivos++;
                ultimoVivo = p;
            }
        }
        // Se só sobrar 1 vivo, ele venceu
        if (contadorVivos === 1) return ultimoVivo;
        return null;
    }
}

// --- INTERFACE E PERSISTÊNCIA ---

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function perguntar(query: string): Promise<string> {
    return new Promise(resolve => rl.question(query, resolve));
}

// Salva os dados em JSON 
function salvarJogo(batalha: Batalha): void {
    try {
        const dados = JSON.stringify(batalha.listarPersonagens(), null, 2);
        fs.writeFileSync('dados.json', dados);
        console.log("💾 Jogo salvo com sucesso em 'dados.json'.");
    } catch (e) {
        console.log("❌ Erro ao salvar:", e);
    }
}

// Carrega os dados e recria os objetos corretamente
function carregarJogo(batalha: Batalha): void {
    try {
        if (!fs.existsSync('dados.json')) return;

        const arquivo = fs.readFileSync('dados.json', 'utf-8');
        const dados = JSON.parse(arquivo);

        batalha.personagens = []; // Limpa para evitar duplicatas

        for (const obj of dados) {
            let p: Personagem;

            // Identifica a classe pelos atributos salvos
            if (obj.hasOwnProperty('_defesa')) { 
                p = new Guerreiro(obj._id, obj._nome, obj._ataque, obj._defesa, obj._vidaMaxima);
            } else if (obj.hasOwnProperty('_ataqueMultiplo')) { 
                p = new Arqueiro (obj._id, obj._nome, obj._ataque, obj._ataqueMultiplo, obj._vidaMaxima);
            } else { 
                p = new Mago (obj._id, obj._nome, obj._ataque, obj._vidaMaxima);
            }
            
            // Restaura a vida salva (usando 'any' para acessar protected)
            (p as any)._vida = obj._vida; 

            batalha.adicionarPersonagem(p);
        }

        batalha.atualizarUltimoId();

        console.log(`📂 Jogo carregado: ${dados.length} personagens recuperados.`);
    } catch (e) {
        console.log("❌ Erro ao carregar:", e);
    }
}

// --- LOOP PRINCIPAL (MAIN) ---
async function main() {
    const batalha = new Batalha();

    console.log("==================================");
    console.log("      🏰  BATTLE ROYALE  🏰      ");
    console.log("==================================");

    carregarJogo(batalha);

    while (true) {
        console.log("\n--- 📜 MENU PRINCIPAL ---");
        console.log("1. ➕ Criar Personagem");
        console.log("2. ⚔️  Realizar Batalha (Turno)");
        console.log("3. 📋 Listar Personagens (Status)");
        console.log("4. 💾 Salvar e Sair");

        const op = await perguntar("=> Escolha uma opção: ");

        try {
            switch (op) {
                case "1":
                    console.log("\n### Criar Novo Lutador ###");
                    const nome = await perguntar("Nome do Personagem: ");
                    console.log("Classes: [1] Guerreiro 🛡️  | [2] Mago ✨  | [3] Arqueiro 🏹");
                    const tipo = await perguntar("Escolha a classe: ");
                    const atq = Number(await perguntar("Ataque Base: "));
                    const id = batalha.gerarId(); // Gera ID único pelo tempo

                    if (tipo === "1") {
                        const def = Number(await perguntar("Defesa: "));
                        batalha.adicionarPersonagem(new Guerreiro(id, nome, atq, def));
                    } else if (tipo === "2") {
                        batalha.adicionarPersonagem(new Mago(id, nome, atq));
                    } else if (tipo === "3") {
                        const multi = Number(await perguntar("Multiplicador: "));
                        batalha.adicionarPersonagem(new Arqueiro(id, nome, atq, multi));
                    } else {
                        console.log("❌ Tipo inválido!");
                    }
                    break;

                case "2":
                    // Validação mínima de lutadores
                    if (batalha.listarPersonagens().length < 2) {
                        console.log("⚠️  Precisa de pelo menos 2 personagens.");
                        break;
                    }

                    console.log("\n--- ⚔️  ARENA DE COMBATE ⚔️  ---");
                    batalha.listarPersonagens().forEach(p => {
                        if (p.estaVivo) console.log(`[ID: ${p.id}] ${p.nome}`);
                    });

                    const id1 = Number(await perguntar("ID do Atacante: "));
                    const id2 = Number(await perguntar("ID do Alvo: "));

                    console.log("\n-----------------------------------------");
                    batalha.turno(id1, id2);
                    console.log("-----------------------------------------");

                    const vencedor = batalha.verificarVencedor();
                    if (vencedor) {
                        console.log(`\n🎉🏆 O VENCEDOR É: ${vencedor.nome} !!! 🏆🎉`);
                    }
                    break;

                case "3":
                    console.log("\n--- 📊 STATUS ATUAL ---");
                    const lista = batalha.listarPersonagens();
                    if (lista.length === 0) console.log("(Vazio)");

                    for (const p of lista) {
                        const barras = "█".repeat(Math.ceil(p.vida / 10));
                        const status = p.estaVivo ? "Vivo" : "Morto 💀";
                        console.log(`[${p.id}] ${p.nome.padEnd(10)} | Vida: ${p.vida} ${barras} | ${status}`);
                    }
                    break;

                case "4":
                    salvarJogo(batalha);
                    console.log("Encerrando... Até logo! 👋");
                    rl.close();
                    return; // Encerra o loop

                default:
                    console.log("❌ Opção inválida.");
            }
        } catch (erro: any) {
            console.log(`❌ ERRO: ${erro.message}`);
        }
    }
}

// Inicia o jogo
main();