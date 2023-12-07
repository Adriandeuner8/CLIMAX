document.querySelector('#button-cep').addEventListener('click', (evt) => { 
    let cep = document.querySelector('#input-cep').value;
    
    function validarCEP(cep) {
        let cepNumero = cep.replace(/\D/g, '');
    
        if (/^\d{8}$/.test(cepNumero)) {

            fetch(`https://viacep.com.br/ws/${cep}/json/`)
                .then((res) => res.json())
                .then((res) => {
                    console.log(res);

                    setEndereco(res);
                    buscaPrevTemp(res.localidade);
                    buscaNoticia(res.localidade);
            });     
        } else {
            
            return alert("Cep Invalido! Tente novamente");
        }
    }

    validarCEP(cep);
    
});

// API ENDERECO - VIACEP
const setEndereco = (objEndereco) => {
    let divEndereco = document.querySelector('#endereco');

    let enderecoCompleto = `Logradouro: ${objEndereco.logradouro}<br>Bairro: ${objEndereco.bairro}<br>Localidade: ${objEndereco.localidade} - ${objEndereco.uf}`;
    
    divEndereco.innerHTML = enderecoCompleto;

    let x = document.getElementById('endereco');
        x.style.display = "block";
}

// API DE PRE-VISAO TEMPO - OPENWEATHER
const buscaPrevTemp = (localidade) => {

    const apiKeyPre = '3719640e7f2f767e2d68b64726db4378';
    const apiUtl = `https://api.openweathermap.org/data/2.5/weather?q=${localidade}&appid=${apiKeyPre}&units=metric&lang=pt_br`;

    fetch(apiUtl)
        .then((res) => res.json())
        .then((data) => {

            if(data.cod == '200') {
                exibePrevisaoTempo(data);
                
            } else {
                console.error('Erro na Busca de previsão do tempo', data.message);
            }


        })
        .catch((erro) => {
            console.error('Erro na Busca da API do tempo',error);
        });
};

const exibePrevisaoTempo = (dados) => {
    let divPrevTemp = document.querySelector('#prev-temp');
    
    let tempAtual = dados.main.temp;
    let tempMin = dados.main.temp_min;
    let tempMax = dados.main.temp_max;
    let descTempo = dados.weather[0].description;
    let localTempo = dados.name;
    let iconCode = dados.weather[0].icon;

    const emojiMap = {
        '01d': '☀️', 
        '01n': '🌙', 
        '02d': '⛅', 
        '02n': '☁️', 
        '03d': '☁️', 
        '03n': '☁️', 
        '04d': '☁️', 
        '04n': '☁️', 
        '09d': '🌧️', 
        '09n': '🌧️', 
        '10d': '🌦️', 
        '10n': '🌦️', 
        '11d': '⛈️', 
        '11n': '⛈️', 
        '13d': '❄️', 
        '13n': '❄️', 
        '50d': '🌫️', 
        '50n': '🌫️'  
    };

    let emoji = emojiMap[iconCode] || '❓';

    let prevElement = document.createElement('p');
    prevElement.innerHTML = `<h2>Clima ${emoji}</h2>${localTempo}<br>Temperatura Atual: ${tempAtual}°C <br>Condição: ${descTempo} <br>Temperatura Minima: ${tempMin}°C <br>Temperatura Maxima: ${tempMax}°C`;

    divPrevTemp.innerHTML = '';
    divPrevTemp.appendChild(prevElement);

    let x = document.getElementById('main');
        x.style.display = "flex";

    // API Mapa 
    if(map === undefined) {
        map = L.map('map').setView([dados.coord.lat, dados.coord.lon], 15);
    } else {
        map.remove();
        map = L.map('map').setView([dados.coord.lat, dados.coord.lon], 15);
    }

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        
    }).addTo(map);
            // marcador no map
    L.marker([dados.coord.lat, dados.coord.lon]).addTo(map)
        .bindPopup('Posição Atual')     // menssagem 
        .openPopup();

};
// MAP GlOBAL - para poder atualizar!
let map;


// Api de Notias NEWSAPI
const buscaNoticia = (localidade) => {
    
    const apiNoticiasUrl = 'https://servicodados.ibge.gov.br/api/v3/noticias/?tipo=noticia&qtd=4&de=05-12-2023';

    fetch(apiNoticiasUrl)
        .then((res) => res.json())
        .then((data) => {
            exibeNoticias(data.items);
        })
        .catch((error) => {
            console.error('Erro na busca de notícias:', erro);
        });
        
};

const exibeNoticias = (noticias) => {
    const divNoticias = document.querySelector('#noticia');
    divNoticias.innerHTML = '';

    if (noticias.length > 0) {
        const ul = document.createElement('ul');
        ul.classList.add('noticia-list');
        ul.innerHTML = '<h2>Notícias</h2><BR>';

        noticias.forEach((noticia) => {
            const li = document.createElement('li');
            li.classList.add('noticia-item'); 
            li.innerHTML = `<strong>${noticia.titulo}</strong>: ${noticia.introducao}<h6><br>${noticia.link}<br>${noticia.data_publicacao}</h6>`;
            ul.appendChild(li);
        });

        divNoticias.appendChild(ul);
    } else {
        divNoticias.textContent = 'Nenhuma notícia encontrada para esta região.';
    }
    let x = document.getElementById('noticia');
        x.style.display = "flex";
};


