// NÃO CONSEGUI IMPLEMENTAR A CURA DO SACERDOTE


import { Personagem } from "./Personagem";
import { Acao } from "./Acao";

export class Sacerdote extends Personagem {
    private _taxaCura: number = 10; 

    constructor(id: number, nome: string, ataque: number, vidaInicial: number = 100) {
        super(id, nome, ataque, vidaInicial);
    }

    atacar(alvo: Personagem): Acao {
        let valorAtaque = this._ataque;
        let msg = `Cura`;
        
        msg += "  (Cura Divina)";
        console.log(` ${this.nome} usou Cura em  ${alvo.nome} PV!`);

        
        
        alvo.receberDano(this._taxaCura);

        const idAcao = Date.now();
        const acao = new Acao(idAcao, this.nome, alvo.nome, msg, valorAtaque);
        this.registrarAcao(acao);
        return acao;
    }
}