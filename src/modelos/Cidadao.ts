import { Personagem } from "./Personagem";
import { Acao } from "./Acao";

export class Cidadao extends Personagem {
    private _ataqueFraco: number = 0;

    constructor(id: number, nome: string, ataque: number, vidaInicial: number = 1) {
        super(id, nome, ataque, vidaInicial);
    
    }
    
    atacar(alvo: Personagem): Acao {
        let valorAtaque = 0;
        let msg = `Pancada`;
        
        
        console.log(`\n  ${this.nome} ATACA ${alvo.nome}!`);
        alvo.receberDano(valorAtaque);

        const idAcao = Date.now();
        const acao = new Acao(idAcao, this.nome, alvo.nome, msg, valorAtaque);
        this.registrarAcao(acao);
        return acao;             
    }
}