import React from 'react';
// import di components
import Navbar from './components/Navbar';
import { Slider } from './components/Slider';
import PageNavigation from './components/PageNavigation';
// import di styles
import { StiliGlobali, Container } from './styles/Styles.js';
import './styles/PageNavigation.css';
// import di Material UI
import { fade, withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
// import di img
import Loader from './assets/img/loader.gif';
// import di mappers
import { mapTime } from './mappers/mapTime';
// import di axios
import axios from 'axios';

// definizione di stili per i component di Material UI
const styles = theme => ({
    barraDiRicerca: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
          backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing(2),
        marginLeft: '10px',
        width: 'auto',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(3),
            width: 'auto'
        }
    },
    campoDiRicerca: {
        width: '100%'
    },
    root: {
        minWidth: 275,
        margin: "1rem",
        textAlign: "center",
        boxShadow: "6px 6px 10px #aaaaaa"
    },
    titolo: {
        fontWeight: "bold"
    },
    metadata: {
        fontStyle: "italic",
    },
    data: {
        margin: "0.5rem 0.75rem",
        [theme.breakpoints.up('sm')]: {
            margin: "0.5rem 1.5rem"
        }
    },
    button: {
        margin: "0 auto"
    },
    link: {
        color: "#3F51B5",
        textDecoration: "none",
        "&:hover, &:focus": {
            textDecoration: "underline"
        }
    }
});

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            query: '',
            risultati: {},
            caricamento: false,
            messaggio: '',
            errore: '',
            risultatiTotali: 0,
            pagineTotali: 0,
            numeroPaginaCorrente: 0
        };
        this.cancella = '';
    }

    gestisciCambioInput = (event) => {
        const query = event.target.value;

        // se non viene inserita una query di ricerca assegna questi valori agli state...
        if (!query) {
            this.setState({
                query,
                risulati: {},
                risultatiTotali: 0,
                pagineTotali: 0,
                numeroPaginaCorrente: 0,
                messaggio: ''
            });
        } else {
            /* assegna la query inserita, imposta il caricamento come true ed il risultato della 
               chiamata alla funzione recuperaRisultatiRicerca */
            this.setState({ query, caricamento: true, messaggio: '' }, () => {
                this.recuperaRisultatiRicerca(1, query);
            });
        }
    };

    /**
     * Recupera i risultati della ricerca e aggiorna gli state con i risultati.
     * @param {int} numeroPaginaCorrente numero di pagina corrente.
     * @param {String} query query di ricerca.
     */
    recuperaRisultatiRicerca = (paginaCorrente = '', query) => {
        // definisci il parametro url del numero della pagina corrente
        const numeroPagina = paginaCorrente ? `&page=${paginaCorrente}` : '';
        // definisci l'url di ricerca completo da cui estrarre i dati di ricerca
        const urlRicerca = `https://hn.algolia.com/api/v1/search_by_date?query=${query}${numeroPagina}`;

        if (this.cancella) {
            // Cancella la richiesta precedente prima di effetturare una nuova richiesta
            this.cancel.cancel();
        }
        // Crea un nuovo CancelToken
        this.cancel = axios.CancelToken.source();

        // utilizzo di axios per recuperare i risultati
        axios.
            // chiamata get all'url di ricerca
            get(urlRicerca, {
                cancelToken: this.cancella.token
            })
            // assegna i risultati della ricerca agli state
            .then((risultato) => {
                const totale = risultato.data.nbHits;
                const numeroPagineTotali = this.ottieniNumeroPagine(totale, 20);
                const messaggioRisultatiNonTrovati = !risultato.data.hits.length ? 
                                                     'There are no more search result. Please try a new search.' : '';
                this.setState({
                    risultati: risultato.data.hits,
                    risultatiTotali: risultato.data.nbHits,
                    numeroPaginaCorrente: paginaCorrente,
                    pagineTotali: numeroPagineTotali,
                    messaggio: messaggioRisultatiNonTrovati,
                    caricamento: false
                });
            })
            // gestisce gli errori
            .catch((error) => {
                if (axios.isCancel(error) || error) {
                    this.setState({
                        caricamento: false,
                        messaggio: 'Failed to fetch results. Please check network'
                    });
                }
            });
    };

    mostraRisultatiRicerca = () => {
        // definizione della variabile risultati per lo state
        const { risultati } = this.state;
        // definizione this.props.classes per gli stili
        const { classes } = this.props;

        if (Object.keys(risultati).length && risultati.length) {
            return (
                <div>
                    {/* Itera su tutti gli elemnti presenti in risultati */}
                    {risultati.map((risultati) => {
                        /* Mostra i risultati solo se non sono null */
                        if ((risultati.story_url !== null) && (risultati.story_title !== null)) {
                            return (
                                <Card className={classes.root}>
                                    <CardContent>
                                        <Typography variant="h5" component="h2" className={classes.titolo} >
                                            <a 
                                                href={risultati.story_url} 
                                                target="_blank" 
                                                className={classes.link}
                                                rel="noopener noreferrer"
                                            >
                                                    {risultati.story_title}
                                                </a>  
                                        </Typography>
                                        <Typography variant="body2" component="p" className={classes.metadata}>
                                            <span className={classes.data}>
                                                <strong>By:</strong> {risultati.author}
                                            </span>
                                            <span className={classes.data}>
                                                <strong>Posted:</strong> {mapTime(risultati.created_at_i)}
                                            </span>
                                        </Typography>
                                    </CardContent>
                                </Card>
                            )
                        }  
                    })}
                </div>
            );
        }
    };

    /**
     * Ottieni il numero di pagine totali della ricerca.
     * @param totale numero di risultati totali
     * @param denominatore conteggio di risultati per pagina
     * @return {number}
     */
    ottieniNumeroPagine = (totale, denominatore) => {
        const divisibile = totale % denominatore === 0;
        const valoreDaAggiungere = divisibile ? 0 : 1;
        return Math.floor(totale / denominatore) + valoreDaAggiungere
    };

    /**
     * Fetch results according to the prev or next page requests.
     * @param {String} type 'prev' or 'next'
     */
    gestisciClickPagine = (type) => {
        const paginaCorrente = 'precedente' === type 
                               ? this.state.numeroPaginaCorrente - 1 
                               : this.state.numeroPaginaCorrente + 1;

        if (!this.state.caricamento) {
            this.setState({ caricamento: true, message: '' }, () => {
              // Fetch previous 20 Results
              this.recuperaRisultatiRicerca(paginaCorrente, this.state.query);
            });
        }
    }

    render() {
        // definizione delle variabili per gli state
        const { query, caricamento, messaggio, numeroPaginaCorrente, pagineTotali } = this.state;
        /* mostraLinkPrecedente sarà false quando ci troviamo nella prima pagina, quindi il link 
           "Precedente" non verrà mostrato nella prima pagina */
        const mostraLinkPrecedente = 1 < numeroPaginaCorrente;
        /* mostraLinkSuccessivo sarà false quando ci troviamo all'ultima pagina, quindi il link 
           "Successivo" non verrà mostrato nell'ultima pagina */
        const mostraLinkSuccessivo = pagineTotali > numeroPaginaCorrente;
        // definizione this.props.classes per gli stili
        const { classes } = this.props;
    
        return (
            <div>
                {/* Applica gli stili definiti in GlobalStyles in StoriesContainerStyles.js */}
                <StiliGlobali />
                {/* Aggiunge il component Navbar */}
                <Navbar />
                {/* Aggiunge il component Slider */}
                <Slider />
                {/* Applica gli stili definiti in StoriesContainerWrapper in StoriesContainerStyles.js */}
                <Container>
                    {/* Barra di ricerca */}
                    <div className={classes.barraDiRicerca}>
                        <TextField  
                            variant="outlined" 
                            value={query}
                            onChange={this.gestisciCambioInput}
                            className={classes.campoDiRicerca}
                        />
                    </div>

                    {/* Messaggio di errore */}
                    {messaggio && <p>{messaggio}</p>}

                    {/* Immagine di caricamento */}
                    <img
                        src={Loader}
                        className={`caricamento-ricerca ${caricamento ? "mostra" : "nascondi"}`}
                        alt="caricamento"
                    />    
    
                    {/* Risultati */}
                    {this.mostraRisultatiRicerca()}
    
                    {/* Buttons di navigazione */}
                    <PageNavigation
                        caricamento={caricamento}
                        mostraLinkPrecedente={mostraLinkPrecedente}
                        mostraLinkSuccessivo={mostraLinkSuccessivo}
                        gestisciClickPrecedente={() => this.gestisciClickPagine("precedente")}
                        gestisciClickSuccessivo={() => this.gestisciClickPagine("successivo")}
                    />
                </Container>
            </div>
        );
    };
};

// esporta App con withStyles
export default withStyles(styles, { withTheme: true })(App);