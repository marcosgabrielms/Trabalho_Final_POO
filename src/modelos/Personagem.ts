import { Acao } from "./Acao";

export abstract class Personagem {
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
    get estaVivo(): boolean { return this._vida > 0; } 

    abstract atacar(alvo: Personagem): Acao; 

    public receberDano(valor: number): void {
        this._vida -= valor;
        if (this._vida < 0) this._vida = 0; 

        const percentual = Math.round((this._vida / this._vidaMaxima) * 100);
        console.log(`   💥 ${this._nome} tomou ${valor.toFixed(0)} de dano.`);
        console.log(`   ❤️  Status: ${this._vida}/${this._vidaMaxima} PV (${percentual}%)`);

        if (!this.estaVivo) console.log(`   💀 ${this._nome} foi derrotado!`);
    }

    public receberDanoVerdadeiro(valor: number): void {
        console.log(`   ⚡ DANO VERDADEIRO (Ignorou Defesa)`); 
        this._vida -= valor;
        if(this._vida < 0) this._vida = 0;
        const percentual = Math.round((this._vida / this._vidaMaxima) * 100);
        console.log(`   💥 ${this._nome} tomou ${valor.toFixed(0)} de dano.`);
        console.log(`   ❤️  Status: ${this._vida}/${this._vidaMaxima} PV (${percentual}%)`);

        if (!this.estaVivo) console.log(`   💀 ${this._nome} foi derrotado!`);
    }

    public registrarAcao(acao: Acao): void {
        this._historico.push(acao);
    }
}