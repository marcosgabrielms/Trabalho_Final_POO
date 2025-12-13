import { Personagem } from "./Personagem";
import { Acao } from "./Acao";

export class Arqueiro extends Personagem {
    private _ataqueMultiplo: number;

    constructor(id: number, nome: string, ataque: number, ataqueMultiplo: number = 2, vidaInicial: number = 100) {
        super(id, nome, ataque, vidaInicial);
        this._ataqueMultiplo = ataqueMultiplo;
    }

    atacar(alvo: Personagem): Acao {
        let valorAtaque = this._ataque;
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
        const acao = new Acao(idAcao, this.nome, alvo.nome, msg, valorAtaque);
        this.registrarAcao(acao);
        return acao;        
    }
}