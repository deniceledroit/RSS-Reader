import React, { useState } from 'react';
import DOMPurify from 'dompurify';

const App = () => {
    const [lien, setLien] = useState('');
    const [items, setItems] = useState([]);
    const [source, setSource] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        fetch(proxyUrl + lien, {
            mode: 'cors',
            method: 'GET',
            headers: {
                'Content-Type': 'application/xml'
            }
        })
            .then(response => response.text())
            .then(text => {
                const parser = new DOMParser();
                const xml = parser.parseFromString(text, 'application/xml');
                const source = Array.from(xml.getElementsByTagName('channel'));
                setSource(source[0]);
                console.log('Source XML récupérée:', source);
                const items = Array.from(xml.getElementsByTagName('item'));
                setItems(items);
                console.log('Données XML récupérées:', items);
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des données XML:', error);
                alert('Erreur lors de la récupération des données XML');
            });
    };

    const toggleSectionVisibility = (index) => {
        const section = document.getElementsByClassName('info__items__contenu')[index];
        section.classList.toggle('hidden');
    };

    return (
        <>
            <header>
                <h1>RSS Reader</h1>
            </header>
            <main>
                <section class="info">
                    <h2 class="info__titre">Entrez le lien RSS</h2>
                    <form class="info__formulaire" onSubmit={handleSubmit}>
                        <input
                            class="class"
                            type="text"
                            value={lien}
                            onChange={(e) => setLien(e.target.value)}
                        />
                        <button type="submit">Valider</button>
                        <p>Nombre d'items: {items.length}</p>
                    </form>
                    {source && (
                    <section class="info__details">
                        <h2 class="info__details__titre">Détails du flux</h2>
                        <p class="info__details__source">Source: {source.getElementsByTagName('title')[0]?.textContent}</p>
                        <p class="info__details__description">Description: {source.getElementsByTagName('description')[0]?.textContent}</p>
                    </section>
                    )}
                    <section class="info__items">
                        {items.map((item, index) => (
                            <article class="info__item" key={index}>
                                <h1 class="info__items__titre" onClick={() => toggleSectionVisibility(index)} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item.getElementsByTagName('title')[0]?.textContent || 'Sans titre') }}></h1>
                                <a class="info__items__lien" href={item.getElementsByTagName('link')[0]?.textContent || '#'} target="_blank" rel="noopener noreferrer">Lien</a>
                                <section class="info__items__contenu hidden" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item.getElementsByTagName('description')[0]?.textContent || 'Pas de description') }}></section>
                            </article>
                        ))}
                    </section>
                </section>
            </main>
            <footer>
                <p>Projet réalisé par <a href="https://github.com/deniceledroit">Dénice Ledroit</a></p>
            </footer>

        </>

    );
};

export default App;