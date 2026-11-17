# Portfólio — Danilo Silva

Portfólio profissional de Danilo Silva, Desenvolvedor Backend Java, desenvolvido em HTML, CSS e JavaScript puro.

O projeto apresenta trajetória profissional, formação, habilidades técnicas, projetos, presença no GitHub, currículo e formas de contato.

## Visão geral

- Desenvolvedor Backend Java especializado em APIs, automação e sistemas de gestão
- Experiência com Java, Spring Boot, Python, Flask, Docker e bancos de dados
- Interface responsiva para desktop e dispositivos móveis
- Menu mobile acessível
- Tema claro e escuro
- Estatísticas públicas do GitHub
- Filtros de projetos
- Estudos de caso dos principais projetos
- Currículo disponível para download
- Metadados para SEO e compartilhamento em redes sociais

## Tecnologias

- HTML5
- CSS3
- JavaScript
- GitHub REST API
- GSAP e ScrollTrigger
- Typed.js
- tsParticles
- Lucide Icons
- EmailJS

## Estrutura do projeto

```text
.
├── index.html
├── style.css
├── script.js
├── Curriculo Danilo Teodoro - 1.pdf
├── img/
│   └── imagens do portfólio
└── README.md
```

## Executar localmente

Não é necessário instalar dependências.

1. Clone o repositório:

```bash
git clone git@github.com:Danilo019/My_Portifolio_Danilo.git
cd My_Portifolio_Danilo
```

2. Abra o projeto de uma das formas:

- Abrir `index.html` diretamente no navegador
- Executar com o Live Server no VS Code
- Executar um servidor local:

```bash
python3 -m http.server 8000
```

Depois, acesse `http://localhost:8000`.

## Configurar o formulário

O portfólio possui uma integração preparada para o EmailJS.

Em `script.js`, configure:

```javascript
const emailConfig = {
    publicKey: 'YOUR_PUBLIC_KEY',
    serviceId: 'YOUR_SERVICE_ID',
    templateId: 'YOUR_TEMPLATE_ID'
};
```

Substitua os valores pelos dados da sua conta no EmailJS:

1. Crie uma conta em https://www.emailjs.com/
2. Conecte um serviço de e-mail
3. Crie um template com `user_name`, `user_email` e `message`
4. Copie a Public Key, o Service ID e o Template ID

## Publicar no GitHub Pages

O repositório já usa `index.html`, portanto pode ser publicado diretamente pelo GitHub Pages.

### Primeira publicação

1. Confirme suas alterações:

```bash
git add .
git commit -m "feat: adiciona portfólio profissional"
git push origin main
```

2. Acesse o repositório no GitHub:

https://github.com/Danilo019/My_Portifolio_Danilo

3. Vá em **Settings > Pages**
4. Em **Build and deployment**:
   - Source: **Deploy from a branch**
   - Branch: **main**
   - Folder: **/ (root)**
5. Clique em **Save**

O endereço padrão será:

```text
https://danilo019.github.io/My_Portifolio_Danilo/
```

O primeiro deployment pode levar alguns minutos.

## Atualizar o portfólio

Depois de alterações locais:

```bash
git add .
git commit -m "feat: atualiza conteúdo do portfólio"
git push origin main
```

O GitHub Pages fará uma nova publicação automaticamente.

## Domínio personalizado

Para publicar em um domínio próprio:

1. Configure o domínio em **Settings > Pages**
2. Adicione o DNS no provedor do domínio
3. Atualize no `index.html`:
   - `canonical`
   - `og:url`
   - `og:image`
   - `twitter:image`
   - URLs dos dados estruturados JSON-LD

## Contato

- LinkedIn: https://www.linkedin.com/in/danilo-t-4b86a2136/
- GitHub: https://github.com/Danilo019
- WhatsApp: https://wa.me/5561995960467
- Instagram: https://instagram.com/dinnooboy

## Autor

**Danilo Silva**

Desenvolvedor Backend Java interessado em vagas, projetos freelance e colaborações.
