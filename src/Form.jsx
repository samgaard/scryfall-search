import React, { useState } from "react";
import axios from 'axios';
import './custom.css';
import { manaCostSymbols } from "./modules/symbols";

function Form() {
    const [searchCardName, setSearchCardName] = useState('');
    const [searchPower, setSearchPower] = useState('');
    const [searchToughness, setSearchToughness] = useState('');
    const [scryfallResults, setSearchResults] = useState([]);
    const [cardArtType, setCardArtType] = useState('border_crop');
    const [manaSymbols, setManaSymbols] = useState([]);

    const ManaSymbols = () => {
        const toggleManaSymbols = e => {
            const manaSymbol = e.target.getAttribute('data-color');

            setManaSymbols(
                manaSymbols.indexOf(manaSymbol) !== -1
                ? manaSymbols.filter(e => e !== manaSymbol)
                : manaSymbols.concat(manaSymbol)
            );
        };

        return <>
            {manaCostSymbols
                .map(m =>
                    <img
                        key={m.key}
                        alt={m.stringName}
                        className={'mana-symbol opacity-' + (manaSymbols.indexOf(m.key) !== -1 ? '100' : '25')}
                        width={35}
                        height={35}
                        data-color={m.key}
                        onClick={toggleManaSymbols}
                        onMouseOver={e => e.target.setAttribute('class', 'mana-symbol opacity-100')}
                        onMouseOut={e => e.target.setAttribute('class', 'mana-symbol opacity-' + (manaSymbols.indexOf(m.key) !== -1 ? '100' : '25'))}
                        src={m.uri}
                    />
                )
            }
        </>
    }

    const formSubmit = e => {
        e.preventDefault();
        if (!searchCardName.length) return;

        const url = 'https://api.scryfall.com/cards/search';
        const query = '?q=' + searchCardName;
        const colors = manaSymbols.length ? ' c:' + manaSymbols.join(' c:') : '';
        const power = searchPower ? ' power:' + searchPower : '';
        const toughness = searchToughness ? ' toughness:' + searchToughness : '';

        axios
            .get(url + query + colors + power + toughness)
            .then(({data}) => setSearchResults(data.data))
            .catch(setSearchResults('No Results Found'))
    }

    const formReset = e => {
        e.preventDefault();
        setSearchCardName('');
        setSearchResults([]);
        setSearchPower('');
        setSearchToughness('');
        setManaSymbols([])
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
        return <>
            {
                Array.isArray(scryfallResults) && scryfallResults.length > 0
                ? scryfallResults.map((r) =>
                    <div className="col-sm-12 col-md-3 mb-4 text-center" key={r.id}>
                        <CardImage card={r}/>
                    </div>)
                : <div className="col-sm-12 text-center">{scryfallResults}</div>
            }
        </>
    }

    const CardStyleSelect = () => {
        return <select className="form-select float-end" value={cardArtType} onChange={e => setCardArtType(e.target.value)}>
            <option value="border_crop">Full Card</option>
            <option value="art_crop">Card Art</option>
        </select>
    }

    return <>
        <div className="mb-5 card card-body bg-light">
            <form onSubmit={formSubmit} onReset={formReset}>
                <div className="row">

                    <div className="col-sm-12 col-md-3 offset-sm-1 mb-2">
                        <ManaSymbols/>
                    </div>

                    <div className="col-sm-12 col-md-5 mb-2">
                        <input
                            type="text"
                            value={searchCardName}
                            onChange={e => setSearchCardName(e.target.value)}
                            placeholder="Card Name"
                            className="form-control"
                            required
                        />
                    </div>

                    <div className="col-sm-12 col-md-3 mb-2">
                        <div className="input-group mb-2 mr-sm-2">
                            <input
                                type="number"
                                value={searchPower}
                                onChange={e => setSearchPower(e.target.value)}
                                placeholder="Power"
                                min={0}
                                className="form-control mx-sm-1"
                            />
                            <input
                                type="number"
                                value={searchToughness}
                                onChange={e => setSearchToughness(e.target.value)}
                                placeholder="Toughness"
                                min={0}
                                className="form-control"
                            />
                        </div>
                    </div>
                </div>

                <div className="row">

                    <div className="col-sm-12">
                        <button className="btn btn-primary float-end" type="submit">Search</button>
                        <button className="btn btn-outline-secondary float-end mx-1" type="reset">Reset</button>
                    </div>

                </div>

            </form>
        </div>

        {
            Array.isArray(scryfallResults) && scryfallResults.length > 0 &&
            <div className="row mb-2">
                <div className="col-sm-12 offset-md-9 col-md-3 float-end">
                    <CardStyleSelect/>
                </div>
            </div>
        }

        <div className="row">
            <SearchResults/>
        </div>
    </>;
}

export default Form