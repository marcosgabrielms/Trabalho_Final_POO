export class Acao {
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