import * as fs from 'fs';  // File System (Salvar e Recuperar dados do arquivo)
import { throwDeprecation } from 'process';
import * as  readline from 'readline';

// Enumeração //
enum TipoAcao {
    ATAQUE = "Ataque",
    MAGIA = "Magia",
    CRITICO = "Critico",
    FALHA = "Falha",
    ATAQUE_DUPLO = "Ataque Duplo",
    CURA = "Cura",
    DEFESA = "Defesa",
}
// Ação //
class Acao {
    origem: string;
    alvo: string;
    tipo: TipoAcao;
    valorDano: number;
    dataHora: Date;

    constructor(origem: string, alvo: string, tipo: TipoAcao, valorDano: number) {
        this.origem = origem;
        this.alvo = alvo;
        this.tipo = tipo;
        this.valorDano = valorDano;
        this.dataHora = new Date();
    }
    descricao(): string {
        return `[${this.dataHora.toLocaleDateString()}] 
        ${this.origem} usou 
        ${this.tipo} em
        ${this.alvo} (Valor: ${this.valorDano.toFixed(1)})`;
    }
}
// Classe Abstrata Personagem //
abstract class Personagem {
    protected _id: number;
    protected _nome: string;
    protected _vida: number;
    protected _vidaMaxima: number;
    protected _ataqueBase: number;
    protected _defesaBase: number;
    protected _historico: Acao[] = []; //Array para guardar o histórico de ações

    constructor(id: number, nome: string, ataque: number, defesa: number, vidaInicial: number = 100) {
        this._id = id;
        this._nome = nome;

        if (ataque < 1 || ataque > 20) throw new Error("O ataque deve ser entre 1 e 20.");
        if (defesa < 1 || defesa > 20) throw new Error("A defesa deve ser entre 1 e 20.");

        this._ataqueBase = ataque;
        this._defesaBase = defesa;
        this._vida = vidaInicial;
        this._vidaMaxima = vidaInicial;
    }

    get nome(): string { return this._nome;}
    get id(): number { return this._id; }
    get vida(): number { return this._vida; }
    get vivo(): boolean { return this._vida > 0;}

    abstract atacar(alvo: Personagem): void; // As subclasses são obrigadas a criarem a própria lógica de ataque

    public receberDano(danoRecebido: number): void {
        let danoReal = danoRecebido - (this._defesaBase / 2);
        if (danoReal < 0) danoReal = 0;

        this._vida -= danoReal;

        if (this._vida < 0) this._vida = 0;

        console.log(`${this._nome} sofreu ${danoReal.toFixed(1)} de dano. Vida restante ${this._vida.toFixed(1)}`);
    }

    public registrarAcao(acao: Acao): void {
        this._historico.push(acao);
    }
}

// Subclasses //

// Guerreiro // 

class Guerreiro extends Personagem {
    constructor(id: number, nome: string, ataque: number, defesa: number, vidaInicial: number = 100) {
        super(id, nome, ataque, defesa, vidaInicial)
    }
    atacar(alvo: Personagem): void {
        let danoCalculado = this._ataqueBase;
        const mensagens: string[] = [];

        // 30% de dano se vida < 30%
        if (this._vida < (this._vidaMaxima * 0.3)){
            danoCalculado = danoCalculado * 1.3
            mensagens.push("Fúria Ativada!")
        }
        // Bônus contra Mago
        if (alvo instanceof Mago) {
            danoCalculado += 3;
            mensagens.push("Bônus: Caçador de Magos (+3)")
        }
        alvo.receberDano(danoCalculado);

        const acao = new Acao(this.nome, alvo.nome, TipoAcao.ATAQUE, danoCalculado);
        this.registrarAcao(acao);
        console.log(`${this.nome} atacou ${alvo.nome} causando ${danoCalculado.toFixed(1)} de dano. ${mensagens.join(", ")}`);
    }
}

// Mago //

class Mago extends Personagem {
    constructor(id: number, nome: string, ataque: number, defesa: number, vidaInicial: number = 100) {
        super(id, nome, ataque, defesa, vidaInicial);
    }

    atacar(alvo: Personagem): void {
        const dano = this._ataqueBase;
        alvo.receberDano(dano);
        const acao = new Acao(this.nome, alvo.nome, TipoAcao.ATAQUE, dano);
        this.registrarAcao(acao);
        console.log(`${this.nome} usou ataque básico em ${alvo.nome}.`);
    }

    public lancarMagia(alvo: Personagem): void {
        this._vida -= 10; // Consome 10 pontos de vida para lançar magia
        console.log(`${this.nome} consumiu 10 pontos de vida para lançar magia!`);

        alvo.receberDano(25); // Causa dano fixo de 25 ignorando defesa

        const acao = new Acao(this.nome, alvo.nome, TipoAcao.MAGIA, 25);
        this. registrarAcao(acao);
    }
}

// Arqueiro // 
class Arqueiro extends Personagem {
    constructor(id: number, nome: string, ataque: number, defesa: number, vidaInicial: number = 100) {
        super(id, nome, ataque, defesa, vidaInicial);
    }

    atacar(alvo: Personagem): void {
        for (let i = 1; i <= 2; i++) {
            if (!alvo.vivo) break;

            let danoCalculado = this._ataqueBase;
            let tipoAcao = TipoAcao.ATAQUE_DUPLO;

            if(Math.random() < 0.15) {
                danoCalculado = danoCalculado * 2;
                let tipoAcao = TipoAcao.CRITICO;
                console.log(`CRÍTICO!!! Flecha precisa de ${this.nome}!`);
                
            }

            alvo.receberDano(danoCalculado);

            const acao = new Acao(this.nome, alvo.nome, tipoAcao, danoCalculado);
            this.registrarAcao(acao);
            console.log(`Flecha ${i}: ${this.nome} causou ${danoCalculado.toFixed(1)} de dano.`);
        }
    }
}