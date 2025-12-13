import * as fs from 'fs';
import { Batalha } from "../core/batalha";
import { Personagem } from "../modelos/Personagem";
import { Guerreiro } from "../modelos/Guerreiro";
import { Mago } from "../modelos/Mago";
import { Arqueiro } from "../modelos/Arqueiro";
import { Necromante } from "../modelos/Necromante";
import { Templario } from "../modelos/Templario";

export function salvarJogo(batalha: Batalha): void {
    try {
        
        const dados = {
            personagens: batalha.listarPersonagens(),
            acoes: batalha.listarAcoes()
        };
        
        fs.writeFileSync('dados.json', JSON.stringify(dados, null, 2));
        console.log("💾 Jogo salvo com sucesso (Personagens + Histórico) em 'dados.json'.");
    } catch (e) {
        console.log("❌ Erro ao salvar:", e);
    }
}

export function carregarJogo(batalha: Batalha): void {
    try {
        if (!fs.existsSync('dados.json')) return;

        const arquivo = fs.readFileSync('dados.json', 'utf-8');
        const dados = JSON.parse(arquivo);

        const listarPersonagens = Array.isArray(dados) ? dados: dados.personagens;

        const listarAcoes = Array.isArray(dados) ? [] : dados.acoes;

        batalha.personagens = []; 

        for (const obj of dados) {
            let p: Personagem;

            if (obj.hasOwnProperty('_defesa')) { 
                p = new Guerreiro(obj._id, obj._nome, obj._ataque, obj._defesa, obj._vidaMaxima);
            } else if (obj.hasOwnProperty('_ataqueMultiplo')) { 
                p = new Arqueiro(obj._id, obj._nome, obj._ataque, obj._ataqueMultiplo, obj._vidaMaxima);
            } else if (obj.hasOwnProperty('_taxaDrenagem')) {
                p = new Necromante(obj._id, obj._nome, obj._ataque, obj._vidaMaxima);
            } else if (obj.hasOwnProperty('_bonusSagrado')) {
                p = new Templario(obj._id, obj._nome, obj._ataque, obj._vidaMaxima);
            } else { 
                p = new Mago(obj._id, obj._nome, obj._ataque, obj._vidaMaxima);
            }
            
            (p as any)._vida = obj._vida; 
            batalha.adicionarPersonagem(p);
        }

        if (listarAcoes) {
            const acoesRecuperadas = listarAcoes.map((a:any) => {
                a.dataHora = new Date(a.dataHora);
                return a;
            });
            batalha.setAcoes(acoesRecuperadas);
        }
        
        batalha.atualizarUltimoId();
        console.log(`📂 Jogo carregado: ${dados.length} personagens recuperados.`);
    } catch (e) {
        console.log("❌ Erro ao carregar:", e);
    }
}