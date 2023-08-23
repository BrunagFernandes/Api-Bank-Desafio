const bancoDeDados = require('../bancodedados')
let {contas, banco, numeroContaUnico, depositos, saques, transferencias} = require('../bancodedados')
const {format}= require('date-fns');

const listarContas = (req,res) =>{
    return res.status(200).json(contas);
}

const cadastrarConta = (req,res) =>{
    const {nome, cpf, data_nascimento, telefone, email, senha}= req.body;
   
    const verificarCPF = contas.find((usuario)=>{
        return usuario.usuario.cpf === cpf; 
    })
    
    if (verificarCPF) {
        return res.status(400).json('Cpf já cadastrado');
    }

    const verificarEmail = contas.find((usuario)=>{
        return usuario.usuario.email === email;
    })

    if (verificarEmail) {
        return res.status(400).json('E-mail já cadastrado');
    }

    const conta ={
        numero: String(numeroContaUnico++),
        saldo: 0,
        usuario :{
                nome,
                cpf,
                data_nascimento,
                telefone,
                email,
                senha
        }

    }

    contas.push(conta)

    return res.status(201).json()

}

const atualizarUsuario= (req,res) =>{
    const {nome, cpf, data_nascimento, telefone, email, senha}= req.body;
    const {id} = req.params;

    const verificaNumero= contas.find((usuario)=>{
        return Number( usuario.numero )=== Number(id);
    }) 

    if(!verificaNumero){
        return res.status(404).json({mensagem:'Conta não cadastrada'})
    }

    verificaNumero.usuario.nome =nome;
    verificaNumero.usuario.cpf=cpf;
    verificaNumero.usuario.data_nascimento= data_nascimento;
    verificaNumero.usuario.telefone= telefone;
    verificaNumero.usuario.email=email;
    verificaNumero.usuario.senha=senha;

    return res.status(204).send();
}

const deletarConta = (req,res) =>{
    const {id} = req.params;

    const verificaNumero= contas.find((usuario)=>{
        return usuario.numero=== id;
    }) 

    if(!verificaNumero){
        return res.status(404).json({mensagem:'Conta não cadastrada'})
    }

    if(verificaNumero.saldo != 0){
        return res.status(403).json({mensagem:'A conta só pode ser removida se o saldo for 0'})
    }

    contas = contas.filter((usuario)=>{
        return usuario.numero != id;
    })

    return res.status(200).send();

}

const depositar =(req, res) =>{
    const {numero_conta , valor} = req.body;
    const numeroDaConta= numero_conta
    const valorRecebido = valor
   
    let verificaNumero= contas.find((usuario)=>{
        return usuario.numero=== numero_conta;
    }) 

    if(!verificaNumero){
        return res.status(404).json({mensagem:'Conta não cadastrada'})
    }

    if( valor <= 0){
        return res.status(404).json({mensagem:'Você não pode depositar esse valor'})
    }

    const valorDepositoSomado = verificaNumero.saldo +valor;
    verificaNumero.saldo = valorDepositoSomado

    const data = new Date()

    const registroDeDeposito={
        data:data,
        numero_conta: numeroDaConta,
        valor: valorRecebido
    }

    depositos.push(registroDeDeposito);

    return res.status(201).json();
}

const sacar =(req,res)=>{
    const {numero_conta , valor, senha} = req.body;

    if(!numero_conta){
        return res.status(400).json({ mensagem: 'É obrigatorio informar a conta'})
    }

    if(!valor){
        return res.status(400).json({ mensagem: 'É obrigatorio informar o valor maior que zero'})
    }

    if(!senha){
        return res.status(400).json({ mensagem: 'É obrigatorio informar a senha'})
    }

    let verificaNumero= contas.find((usuario)=>{
        return usuario.numero=== numero_conta;
    }) 

    if(!verificaNumero){
        return res.status(404).json({mensagem:'Conta não cadastrada'})
    }

    if( valor <= 0){
        return res.status(404).json({mensagem:'Você não pode sacar esse valor'})
    }

    if ( Number(senha) != verificaNumero.usuario.senha){
        return res.status(404).json({mensagem:'A senha esta errada'})
    }

    if ( valor > verificaNumero.saldo){
        return res.status(404).json({mensagem:'Valor não disponível'})
    }

    const valorAposSaque= verificaNumero.saldo - valor
    verificaNumero.saldo = valorAposSaque;

    const data = new Date()

    const registroDeSaque={
        data:data,
        numero_conta: numero_conta,
        valor: valor
    }

    saques.push(registroDeSaque);

    return res.status(201).json();

}

const transferencia = (req,res) =>{
     const {numero_conta_origem, numero_conta_destino, valor, senha }= req.body

     if(!numero_conta_origem || !numero_conta_destino || !valor || !senha){
        return res.status(400).json({ mensagem: 'É obrigatorio preencher todos os campos'})
    }

    let verificaNumeroOrigin= contas.find((usuario)=>{
        return usuario.numero=== numero_conta_origem;
    }) 

    if(!verificaNumeroOrigin){
        return res.status(404).json({mensagem:'Conta de origin não cadastrada'})
    }

    let verificaNumeroDestino= contas.find((usuario)=>{
        return usuario.numero=== numero_conta_destino
    }) 

    if(!verificaNumeroDestino){
        return res.status(404).json({mensagem:'Conta de destino não cadastrada'})
    }

    if ( Number(senha) != verificaNumeroOrigin.usuario.senha){
        return res.status(404).json({mensagem:'A senha esta errada'})
    }

    if (valor <=0){
        return res.status(404).json({mensagem:'Você não pode fazer uma transferenecia com valor zero ou negativo'})
    }

    if ( valor > verificaNumeroOrigin.saldo){
        return res.status(404).json({mensagem:'Saldo insulficiente'})
    }

    verificaNumeroOrigin.saldo = verificaNumeroOrigin.saldo - valor;
    verificaNumeroDestino.saldo = verificaNumeroDestino.saldo + valor;

    const data = new Date()

    const registroDeTranferencia={
        data: data,
        numero_conta_origem,
        numero_conta_destino,
        valor: valor
    }

    transferencias.push(registroDeTranferencia);

    return res.status(201).json();
}

const visualizarSaldo = (req, res)=>{
    const {numero_conta, senha} = req.query;

    let verificaNumero= contas.find((usuario)=>{
        return usuario.numero=== numero_conta;
    }) 

    if(!verificaNumero){
        return res.status(404).json({mensagem:'Conta não cadastrada'})
    }

    if (senha != verificaNumero.usuario.senha){
        return res.status(404).json({mensagem:'A senha informada está errada'})
    }

    const saldo = verificaNumero.saldo;
    return res.status(201).json({mensagem: saldo});

}

const extrato = (req,res) =>{
    const {numero_conta, senha} = req.query;

        let verificaNumero= contas.find((usuario)=>{
        return usuario.numero=== numero_conta;
    }) 

    if(!verificaNumero){
        return res.status(404).json({mensagem:'Conta bancaria não encontrada'})
    }

    if (senha != verificaNumero.usuario.senha){
        return res.status(404).json({mensagem:'A senha informada está errada'})
    }

    const extratoDeposito = depositos.find((usuario)=>{
        return usuario.numero_conta === numero_conta; 
    })

    const saque = saques.find((usuario)=>{
        return usuario.numero_conta === numero_conta; 
    })

    const transferenciaEnviadas = transferencias.find((usuario)=>{
        return usuario.numero_conta_origem === numero_conta; 
    })

    const transferenciaRecebidas = transferencias.find((usuario)=>{
        return usuario.numero_conta_destino === numero_conta; 
    })

    return res.status(201).json({depositos: extratoDeposito, saque, transferenciaEnviadas, transferenciaRecebidas});

}



module.exports ={
    listarContas,
    cadastrarConta,
    atualizarUsuario,
    deletarConta,
    depositar,
    sacar,
    transferencia,
    visualizarSaldo,
    extrato
}