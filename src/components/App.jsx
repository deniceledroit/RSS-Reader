import React, { useState } from 'react';
import DOMPurify from 'dompurify';

const App = () => {
    const [lien, setLien] = useState('');
    const [items, setItems] = useState([]);
    const [visibleSections, setVisibleSections] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(lien);
            const text = await response.text();
            const parser = new DOMParser();
            const xml = parser.parseFromString(text, 'application/xml');
            const items = Array.from(xml.getElementsByTagName('item'));
            setItems(items);
        } catch (error) {
            console.error('Erreur lors de la récupération des données XML:', error);
        }
    };

    const toggleSectionVisibility = (index) => {
        setVisibleSections((prevState) => ({
            ...prevState,
            [index]: !prevState[index],
        }));
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={lien}
                    onChange={(e) => setLien(e.target.value)}
                />
                <button type="submit">Valider</button>
            </form>
            <div>
                Nombre d'items: {items.length}
            </div>
            <ul>
                {items.map((item, index) => (
                    <li key={index}>
                        <h1 class="info__titre" onClick={() => toggleSectionVisibility(index)} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item.getElementsByTagName('title')[0]?.textContent || 'Sans titre') }}></h1>
                        {visibleSections[index] && (
                            <section class="info__contenu" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item.getElementsByTagName('description')[0]?.textContent || 'Pas de description') }}></section>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default App;