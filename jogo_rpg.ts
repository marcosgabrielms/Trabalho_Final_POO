import * as fs from 'fs';  // File System (Salvar e Recuperar dados do arquivo)
import { throwDeprecation } from 'process';
import * as  readline from 'readline';

enum TipoAcao {
    ATAQUE = "Ataque",
    MAGIA = "Magia",
    CRITICO = "Critico",
    FALHA = "Falha",
    ATAQUE_DUPLO = "Ataque Duplo",
    CURA = "Cura",
    DEFESA = "Defesa",
}

class Acao {
    origem: string;
    alvo: string;
    tipo: TipoAcao;
    valorDano: number;
    dataHora: Date;

    constructor(origem: string, alvo: string, tipo: TipoAcao, valorDano: number, dataHora: Date) {
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

abstract class Personagem {
    protected _id: number;
    protected _nome: string;
    protected _vida: number;
    protected _vidaMaxima: number;
    protected _ataqueBase: number;
    protected _defesaBase: number;
    protected _historico: Acao[] = []; //Array para guardar o histórico de ações

    constructor(id: number, nome: string, vida: number, ataque: number, defesa: number, vidaInicial: number = 100) {
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