const express = require('express');
const intermediarios = require('./controladores/intermediarios')
const funcoesDeRota= require('./controladores/funcoesDeRota')

const rotas = express();

rotas.get('/contas',intermediarios.validarSenha, funcoesDeRota.listarContas);
rotas.post('/contas',intermediarios.verificarCamposPreenchidos, funcoesDeRota.cadastrarConta);
rotas.put('/contas/:id/usuario', intermediarios.verificarCamposPreenchidos, funcoesDeRota.atualizarUsuario)
rotas.delete('/contas/:id', funcoesDeRota.deletarConta)
rotas.post('/transacoes/depositar', intermediarios.verificacao_de_deposito,funcoesDeRota.depositar)
rotas.post('/transacoes/sacar', funcoesDeRota.sacar)
rotas.post('/transacoes/transferir', funcoesDeRota.transferencia)
rotas.get("/contas/saldo", intermediarios.verificarNumero_e_senha,funcoesDeRota.visualizarSaldo)
rotas.get("/contas/extrato", intermediarios.verificarNumero_e_senha,funcoesDeRota.extrato)

module.exports =rotas;