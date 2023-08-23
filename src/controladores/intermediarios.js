const validarSenha = (req, res, next)=>{
    const {senha_banco} = req.query;

    if(!senha_banco){
        return res.status(404).json({mensagem: 'Senha não informada'});
    }

    if (senha_banco !== 'Cubos123Bank'){
        return res.status(401).json({mensagem: 'A senha do banco informada é inválida'});
    }
    
     next()
}

const verificarCamposPreenchidos  = (req, res, next)=>{
const {nome, cpf, data_nascimento, telefone, email, senha}= req.body;

    if(!nome || !cpf || !data_nascimento || !telefone || !email|| !senha){
        return res.status(400).json({ mensagem: 'É obrigatorio preencher todos os campos'})
        
    }

next()
}

const verificarNumero_e_senha  = (req, res, next)=>{
    const {numero_conta, senha} = req.query;

    if(!numero_conta){
        return res.status(404).json({mensagem:'É necessário informar o numero da conta'})
    }

    if(!senha){
        return res.status(404).json({mensagem:'É necessário informar a senha da conta'})
    }

    next()
}

const verificacao_de_deposito  = (req, res, next)=>{
    const {numero_conta , valor} = req.body;
    const numeroDaConta= numero_conta
    const valorRecebido = valor
   
    if(!numero_conta){
        return res.status(400).json({ mensagem: 'É obrigatorio informar a conta'})
    }

    if(!valorRecebido){
        return res.status(400).json({ mensagem: 'É obrigatorio informar o valor maior que zero'})
    }

    next()
}



module.exports = {
    validarSenha,
    verificarCamposPreenchidos,
    verificarNumero_e_senha, 
    verificacao_de_deposito
}
