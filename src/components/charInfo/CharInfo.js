import { Component } from 'react';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Sceleton from '../skeleton/Skeleton';
import MarvelService from '../../services/MarvelService';

import './charInfo.scss';
import thor from '../../resources/img/thor.jpeg';

class CharInfo extends Component {
    state = {
        char: null,
        loading: false,
        error: false
    }

    marvelService = new MarvelService();

    componentDidMount() {
        this.updateChar();
    }

    componentDidUpdate(newProps) {
        if (newProps.charId !== this.props.charId) {
            this.updateChar();
        }
    }

    componentDidCatch(err, info) {
        console.log(err, info);
        this.setState({error: true});
    }

    onCharLoading = () => {
        this.setState({loading: true});
    }

    onCharLoaded = (char) => {
        this.setState({char, loading: false});
    }

    onError = () => {
        this.setState({loading: false, error: true});
    }

    updateChar = () => {
        if (this.props.charId) {
            this.onCharLoading();
            this.marvelService.getCharacter(this.props.charId).then(this.onCharLoaded).catch(this.onError);
        }
    };

    render() {
        const {char, loading, error} = this.state;
        const sceleton = char ? null : <Sceleton/>;
        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = (char && !(loading || error)) ? <View char={char}/> : null;
        return (
            <div className="char__info">
                {sceleton}
                {errorMessage}
                {spinner}
                {content}
            </div>
        )    
    }
}

const View = ({char}) => {
    let {name, description, thumbnail, homepage, wiki, comics} = char;
    if (!description) {
        description = "Description not found";
    } //else if (description.length > 220) {
        // description = description.substring(0,220) + "...";
    //}
    let imgStyle = {'objectFit' : 'cover'};
    // двигаем картинку image not found
    if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
        imgStyle = {'objectFit' : 'contain'};
    }   
    return (
        <>
            <div className="char__basics">
                <img src={thumbnail} alt={name} style={imgStyle} />
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">{description}</div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {comics.length > 0 ? null : 'Not found'}
                {
                    comics.map((item, i) => {
                        // eslint-disable-next-line
                        if (i>9) return;
                        return (
                            <li key={i} className="char__comics-item">
                                {item.name}
                            </li>
                        )
                    })
                }
            </ul>
        </>
    );     
}

export default CharInfo;