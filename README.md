<p align="center">
  <img width="128" height="auto" src="https://i.imgur.com/6uDjYpu.png" />
</p>
<h1 align="center">👨🏼‍🍳 Foodfy - Desafio Final</h1>

<h2>📜 Introdução</h2>
<p>Foodfy é uma Aplicação Web que foi desenvolvida durante o Bootcamp Launchstore da Rocketseat e foi escolhida como o projeto
de Desafio Final. O site consiste em criar um sistema capaz de registrar usuários para que os mesmos compartilhem suas receitas
com os demais usuários/chefs que decidirem participar da comunidade da Aplicação.</p>

<h2>👨🏼‍💻 Tecnologia</h2>
<p>O projeto foi construído utilizando das seguintes tecnologias:</p>
<ul>
    <li>node.js;</li>
    <li>JavaScript;</li>
    <li>PostgreSQL;</li>
    <li>HTML5;</li>
    <li>CSS3.</li>
</ul>
<p>Com ajuda das seguintes bibliotecas/frameworks:</p>
<ul>
    <li>express.js;</li>
    <li>nunjucks.</li>
</ul>

<h2>🚀 Configurando</h2>
<p>Para que o projeto seja utilizado, deve-se seguir alguns passos para configurá-lo corretamente:</p>
<p>Primeiramente, baixe a aplicação ou, utilizando o código de versionamento (git), clone o mesmo:</p>
<code>git clone https://github.com/eric-zanchettin/foodfy.git</code>
<p>Após escolher uma das opções, esteja ciente de que o projeto deve ter sido baixado/clonado em um ambiente de desenvolvimento
que esteja pronto para uso com node.js</p>
<p>Agora, digite no console do ambiente:</p>
<code>npm install</code>
<p>Isso irá instalar todas as dependências utilizadas no projeto de maneira automática.</p>
<p>Há um arquivo incluso no projeto "database.pgsql" que contém todas as instruções passo a passo de como foi criado o Banco de Dados
do projeto, e para que o mesmo funcione, você deve criar a database, as tables e procedures utilizadas, portanto, rode os códigos pgsql
deste arquivo.</p>
<p>O projeto ficará hospedado e poderá ser acessado pelo endereço: http://localhost:3000<p>
<h4>❗ Considerações Finais:</h4>
<ul>
    <li>O Banco de Dados deve ser mantido com o nome de "foodfy";</li>
    <li>Não esqueça de mudar as credencias do Banco de Dados para as configuradas em seu computador, isso pode ser alterado pelo arquivo db.js
    localizado no diretório: config/db.js</li>
    <li>O projeto conta com um sistema simples de envio de E-mail, usando o mailtrap, portanto, também lembre-se de configurar o mesmo com o usuário e senha
    que poderá ser gerado automaticamente no site do <a href="https://mailtrap.io/inboxes/">mailtrap</a> ao criar um inbox e na SMTP Settings mudar a integração
    para o nodemailer.</li>
</ul>

<h2>🌱 Seeding</h2>
<p>Há também um arquivo configurado como seeder do projeto, ou seja, caso não queria ficar criando diversos registros, você pode utilizar
o "seeds.js" para popular as tabelas com informações aleatórias que são geradas automaticamente com a biblioteca "faker", para tanto, escreva no console:</p>
<code>node seeds.js</code>
<p>Na raíz do projeto para que o seeder preencha as tabelas.</p>

<p align="center">
  <img width="64" height="auto" src="https://i.imgur.com/1BZZqy0.png" />
</p>
<p>O que é o Bootcamp Launchstore da Rocketseat?</p>
<p>Rocketseat Launchbase é um Bootcamp com propósito de levar a carreira/conhecimento dos participantes para o próximo nível indo diretamente ao ponto chave da programação: CODAR! É uma maneira incrível de dar seus primeiros passos na programação e também uma ótima maneira de expandir seus conhecimentos em programação. Se você quiser saber mais sobre a instituição, sinta-se à vontade de checar o GitHub da <a href="https://github.com/Rocketseat">Rocketseat</a> também.</p>