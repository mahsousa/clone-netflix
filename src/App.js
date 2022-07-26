import React, { useEffect, useState } from 'react';
import './App.css';
import Tmdb from './Tmdb';
import MovieRow from './components/MovieRow';
import FeaturedMovie from './components/FeaturedMovie';
import Header from './components/Header';

export default () => {

    const [movieList, setMoveList] = useState([]); //Iniciar com array vazio
    const [featuredData, setfeaturedData] = useState(null);
    const [blackHeader, setBlackHeader] = useState(false);
    useEffect(() => { //Quando a tela for carregada chama a função

        const loadAll = async () => {
            //Pegando a lista total
            let list = await Tmdb.getHomeList();
            setMoveList(list);

            //pegando as informações dos filmes
            let originals = list.filter(i => i.slug === 'originals'); //Puxar as informações Slug
            let randomChosen = Math.floor(Math.random() * (originals[0].items.results.length - 1)); //Puxar um numero aleatorio da lista de Filmes
            let chosen = originals[0].items.results[randomChosen];
            let chosenInfo = await Tmdb.getMovieInfo(chosen.id, 'tv')
            setfeaturedData(chosenInfo);

        }

        loadAll();
    }, []);

    //Adicionar evento de scroll no header da página

    useEffect(() => {
        const scrollListener = () => {
            if (window.scrollY > 10) {
                setBlackHeader(true);
            } else {
                setBlackHeader(false);
            }
        }

        window.addEventListener('scroll', scrollListener);

        return () => {
            window.removeEventListener('scroll', scrollListener);
        }
    }, []);

    return (
        //Mapear Lista
        <div className="page">
            <Header black={blackHeader} />
            {featuredData &&
                <FeaturedMovie item={featuredData} />
            }
            <section className="lists">
                {movieList.map((item, key) => (
                    <div>
                        <MovieRow key={key} title={item.title} items={item.items} />
                    </div>
                ))}
            </section>
            <footer>
                Direitos de imagem para Netflix<br />
                Dados pegos do Site Themoviedb.org
            </footer>
            {movieList.length <= 0 &&
                <div className="loading">
                    <img src="https://blog.ecadauma.com.br/wp-content/uploads/2020/04/netflix-loading.gif" alt="Carregando" />
                </div>
            }
        </div>
    );
}