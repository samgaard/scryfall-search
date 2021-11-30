import React, {useState} from "react";
import axios from 'axios';
import './custom.css';

function Form() {
    const [searchString, setSearchString] = useState('');
    const [scryfallResults, setSearchResults] = useState([]);
    const [cardArtType, setCardArtType] = useState('art_crop');
    const [manaSymbols, setManaSymbols] = useState([]);

    const ManaSymbols = () => {
        const toggleManaSymbols = function(e) {
            const manaSymbol = e.target.getAttribute('data-color');

            setManaSymbols(
                manaSymbols.indexOf(manaSymbol) !== -1
                ? manaSymbols.filter(e => e !== manaSymbol)
                : manaSymbols.concat(manaSymbol)
            );
        };

        return <>
            {['R', 'U', 'B', 'G', 'W']
                .map(color =>
                    <img
                        key={color}
                        alt={color}
                        className={'mana-symbol opacity-' + (manaSymbols.indexOf(color) !== -1 ? '100' : '25')}
                        width={35}
                        height={35}
                        data-color={color}
                        onClick={toggleManaSymbols}
                        src={`/images/${color}.svg`}
                    />
                )
            }
        </>
    }

    const formSubmit = (e) => {
        e.preventDefault();
        if (!searchString.length) return;

        const url = 'https://api.scryfall.com/cards/search';
        const query = '?q=' + searchString;
        const colors = manaSymbols.length ? ' c:' + manaSymbols.join(' c:') : '';

        axios
            .get(url + query + colors)
            .then(({data}) => setSearchResults(data.data))
            .catch(setSearchResults('No Results Found'))
    }

    const cardImageSrc = card => {
        let {image_uris} = card;
        if (!image_uris) {
            // get first double sided card image
            image_uris = card.card_faces[0].image_uris;
        }
        return image_uris[cardArtType];
    };

    const CardImage = ({card}) => {
        if (!card) return;
        return <img
            alt={card.name}
            className={'img-fluid'}
            src={cardImageSrc(card)}
        />
    };

    const SearchResults = () => {
        if (!scryfallResults.length) return '';
        return <div className={'row'}>
            {
                Array.isArray(scryfallResults)
                ? scryfallResults.map((r) =>
                    <div className="col-sm-3 mb-4 text-center" key={r.id}>
                        <CardImage card={r}/>
                    </div>)
                : <div className="col-sm-12 text-center">{scryfallResults}</div>
            }
        </div>
    }

    return <>
        <div className="mb-5">
            <form onSubmit={formSubmit}>
                <div className="row mb-2">

                    <div className="col-sm-3 offset-sm-1">
                        <ManaSymbols/>
                    </div>

                    <div className="col-sm-5">
                        <input
                            name="text-search"
                            type="text"
                            value={searchString}
                            onChange={e => setSearchString(e.target.value)}
                            placeholder="Card Name"
                            className="form-control"
                            required
                        />
                    </div>

                    <div className="col-sm-2">
                        <select className="form-select" onChange={e => setCardArtType(e.target.value)}>
                            <option value="art_crop">Cropped</option>
                            <option value="small">Small</option>
                        </select>
                    </div>
                </div>

                <div className="row">
                    <div className="col-sm-12">
                        <button className="btn btn-outline-secondary float-end" type="submit">Search</button>
                    </div>
                </div>

            </form>
        </div>
        <SearchResults results={scryfallResults} cardArtType={cardArtType}/>
    </>;
}

export default Form