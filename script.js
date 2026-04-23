const botao = document.querySelector('.botao-menu')
const menuLateral = document.querySelector('.menu-lateral')
const noticias = document.querySelector('.conteudo')
const fundo = document.querySelector('.fundo')

botao.addEventListener('click', () => {
    menuLateral.classList.add('ativo')
    botao.classList.add('ativo')
    
})