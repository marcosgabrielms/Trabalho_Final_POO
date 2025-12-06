import * as fs from 'fs';  // File System (Salvar e Recuperar dados do arquivo)
import { throwDeprecation } from 'process';
import * as  readline from 'readline';
import { inflate } from 'zlib';

// Ação //
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
        this.dataHora = new Date();
    }
}
// Classe Abstrata Personagem //
abstract class Personagem {
    protected _id: number;
    protected _nome: string;
    protected _vida: number;
    protected _vidaMaxima: number;
    protected _ataque: number;
    protected _historico: Acao[] = []; //Array para guardar o histórico de ações

    constructor(id: number, nome: string, ataque: number, vidaInicial: number = 100) {
        this._id = id;
        this._nome = nome;
        this._ataque = ataque;
        this._vida = vidaInicial;
        this._vidaMaxima = vidaInicial;
    }

    get nome(): string { return this._nome;}
    get id(): number { return this._id; }
    get vida(): number { return this._vida; }
    get estaVivo(): boolean { return this._vida > 0;}

    abstract atacar(alvo: Personagem): Acao; // As subclasses são obrigadas a criarem a própria lógica de ataque

    public receberDano(valor: number): void {
        this._vida -= valor;
        if (this._vida < 0) this._vida = 0;

        const percentual = Math.round((this._vida / this._vidaMaxima) * 100);
        console.log(`   💥 ${this._nome} tomou ${valor.toFixed(0)} de dano.`);
        console.log(`   ❤️  Status: ${this._vida}/${this._vidaMaxima} PV (${percentual}%)`);

        if (!this.estaVivo) console.log(` 💀 ${this._nome} foi derrotado!`);
    }

    public receberDanoVerdadeiro(valor: number): void {
        console.log(` ⚡ DANO VERDADEIRO (Ignorou Defesa)`) // Para MAGO
        this.receberDano(valor);
    }

    public registrarAcao(acao: Acao): void {
        this._historico.push(acao);
    }
}

// Subclasses //

// Guerreiro // 

class Guerreiro extends Personagem {
    private _defesa: number;

    constructor(id: number, nome: string, ataque: number, defesa: number, vidaInicial: number = 100) {
        super(id, nome, ataque, vidaInicial)
        this._defesa = defesa;
    }

    public receberDano(valor: number): void {
        if (valor < this._defesa) {
            console.log (`   🛡️ ${this.nome} Defendeu totalmente o ataque! (Def: ${this._defesa} > Atq: ${valor})`);
            return;
        }
        const danoReal = valor - this._defesa;
        console.log(` 🛡️ Defesa reduziu o dano em ${this._defesa}.`);
        super.receberDano(danoReal);
    }
    
    atacar(alvo: Personagem): Acao {
        let valorAtaque = this._ataque;
        let msg = `Ataque de Espada`
        
        // 30% de dano se vida < 30%
        if (this._vida < (this._vidaMaxima * 0.3)){
            valorAtaque = valorAtaque * 1.3;
            valorAtaque = Math.floor(valorAtaque);
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

// Mago //

class Mago extends Personagem {
    constructor(id: number, nome: string, ataque: number, defesa: number, vidaInicial: number = 100) {
        super(id, nome, ataque, vidaInicial);
    }

    atacar(alvo: Personagem): Acao {
        let valorAtaque = this._ataque;
        let msg = `Magia Arcana`;

        console.log(`\n✨ ${this.nome} Conjura uma magia em ${alvo.nome}!`);
        this._vida -= 10;
        console.log(`   💧 ${this.nome} gastou 10 Pontos de Vida ao castar magia. (Vida: ${this._vida})`);

        if (alvo instanceof Arqueiro) {
            valorAtaque = valorAtaque * 2;
            msg += " 🎯 (Crítico!! vs Arqueiro)";
            console.log(`   🎯 Dano DOBRADO pela vulnerabilidade do Arqueiro!`);
        }
        if (alvo instanceof Guerreiro) {
            msg += " ⚡ (Ignorou Defesa)";
            alvo.receberDanoVerdadeiro(valorAtaque);
        } else {
            alvo.receberDano(valorAtaque);
        }

        const idAcao = Date.now();
        const acao = new Acao(idAcao, this.nome, alvo.nome, msg, valorAtaque);
        this.registrarAcao(acao);

        this.registrarAcao(new Acao(idAcao+1, this.nome, this.nome,"Custo de vida", 10))

        return acao;
        
    }
}

// Arqueiro // 
class Arqueiro extends Personagem {
    private _ataqueMultiplo: number;

    constructor(id: number, nome: string, ataque: number, ataqueMultiplo: number = 2, vidaInicial: number = 100) {
        super(id, nome, ataque, vidaInicial);
        this._ataqueMultiplo = ataqueMultiplo
    }

    atacar(alvo: Personagem): Acao {
        let valorAtaque = this._ataque;
        this._ataqueMultiplo = this._ataqueMultiplo;
        let msg = `Disparo Simples`;
        let visual = "🏹";
        
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
        const acao = new Acao (idAcao, this.nome, alvo. nome, msg, valorAtaque);
        this.registrarAcao(acao);
        return acao;        
    }
}

class Batalha {
    personagens: Personagem[] = [];
    acoes: Acao[] = [];

    adicionarPersonagem(personagem: Personagem): void {
        for (const p of this.personagens) {
            if (p.nome === personagem.nome) {
                throw new Error("Já existe um personagem com este nome!");
            }
        }
        this.personagens.push(personagem);
        console.log("✅ Personagem adicionado: " + personagem.nome);
    }
    consultarPersonagem(nomeBuscado: string): Personagem {
        for (const p of this.personagens) {
            if(p.nome === nomeBuscado)
                return p;
        }
        throw new Error("Personagem não encontrado");
    }

    turno(atacanteId: number, defensorId: number): Acao[] {
        let atacante: Personagem | null = null;
        let defensor: Personagem | null = null;

        for (const p of this.personagens) {
            if (p.id === atacanteId) atacante = p;
            if (p.id === defensorId) defensor = p;
        }
        if (atacante === null) throw new Error("Atacante não encontrado");
        if (defensor === null) throw new Error("Defensor não encontrado");
        if (atacante === defensor) throw new Error("Personagem não pode atacar a si mesmo");
        if (!atacante.estaVivo) throw new Error ("Personagem morto não pode atacar");
        if (!defensor.estaVivo) throw new Error ("Personagem morto não pode ser atacado");

        const acao = atacante.atacar(defensor);

        this.acoes.push(acao);

        return [acao];
    }

    listarPersonagens(): Personagem[] {
        return this.personagens;
    }
    listarAcoes(): Acao[] {
        return this.acoes;
    }

    verificarVencerdor(): Personagem | null {
        let contadorVivos = 0;
        let ultimoVivo: Personagem | null = null;

        for(const p of this.personagens) {
            if (p.estaVivo) {
                contadorVivos++;
                ultimoVivo = p;
            }
        }
        if (contadorVivos === 1) return ultimoVivo;
        return null;
    }


}