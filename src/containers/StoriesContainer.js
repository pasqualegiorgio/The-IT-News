import React from 'react';
import { getStoryIds } from '../services/hnApi';
import { Story } from '../components/Story';
import { GlobalStyle, StoriesContainerWrapper } from '../styles/StoriesContainerStyles.js';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import Navbar from '../components/Navbar';
import { Slider } from '../components/Slider';
import { fade, withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import PageNavigation from '../components/PageNavigation';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { mapTime } from '../mappers/mapTime';
import Pagination from '@material-ui/lab/Pagination';
import Loader from '../assets/img/loader.gif';
import '../styles/PageNavigation.css';

const styles = theme => ({
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
          backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing(2),
        marginLeft: '10px',
        width: '50%',
        [theme.breakpoints.up('sm')]: {
          marginLeft: theme.spacing(3),
          width: 'auto',
        }
    },
    searchField: {
        width: '100%'
    },
    root: {
        minWidth: 275,
        margin: "1rem",
        textAlign: "center",
        boxShadow: "6px 6px 10px #aaaaaa"
    },
    title: {
        fontWeight: "bold"
    },
    metadata: {
        fontStyle: "italic",
    },
    data: {
        margin: "0.5rem 0.75rem",
        [theme.breakpoints.up('sm')]: {
            margin: "0.5rem 1.5rem",
        },
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

class StoriesContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            query: '',
            results: {},
            loading: false,
            message: '',
            error: '',
            totalResults: 0,
            totalPages: 0,
            currentPageNo: 0
        };
        this.cancel = '';
    }

    handleOnInputChange = (event) => {
        const query = event.target.value;

        if (!query) {
            this.setState({
                query,
                results: {},
                totalResults: 0,
                totalPages: 0,
                currentPageNo: 0,
                message: ''
            });
        } else {
            this.setState({ query, loading: true, message: '' }, () => {
                this.fetchSearchResults(1, query);
            });
        }
    };

    /**
     * Fetch the search results and update the state with the result.
     * @param {int} updatedPageNo Updated Page No.
     * @param {String} query Search Query.
     */
    fetchSearchResults = (updatedPageNo = '', query) => {
        const pageNumber = updatedPageNo ? `&page=${updatedPageNo}` : '';
        const searchUrl = `https://hn.algolia.com/api/v1/search_by_date?query=${query}?page=${pageNumber}`;

        if (this.cancel) {
            // Cancel the previous request before making a new request
            this.cancel.cancel();
        }
        // Create a new CancelToken
        this.cancel = axios.CancelToken.source();

        axios.
            get(searchUrl, {
                cancelToken: this.cancel.token
            })
            .then((res) => {
                const total = res.data.nbHits;
                const totalPagesCount = this.getPagesCount(total, 20);
                const resultNotFoundMsg = !res.data.hits.length ? 'There are no more search result. Please try a new search.' : '';
                this.setState({
                    results: res.data.hits,
                    totalResults: res.data.nbHits,
                    currentPageNo: updatedPageNo,
                    totalPages: totalPagesCount,
                    message: resultNotFoundMsg,
                    loading: false
                });
            })
            .catch((error) => {
                if (axios.isCancel(error) || error) {
                    this.setState({
                        loading: false,
                        message: 'Failed to fetch results. Please check network'
                    });
                }
            });
    };

    renderSearchResults = () => {
        const { results } = this.state;
        const { classes } = this.props;

        if (Object.keys(results).length && results.length) {
            return (
                <div className="results-container">
                    {results.map((results) => {
                        if ((results.story_url !== null) && (results.story_title !== null)) {
                            return (
                                <Card className={classes.root}>
                                    <CardContent>
                                        <Typography variant="h5" component="h2" className={classes.title} >
                                            <a 
                                                href={results.story_url} 
                                                target="_blank" 
                                                className="link">
                                                    {results.story_title}
                                                </a>  
                                        </Typography>
                                        <Typography variant="body2" component="p" className={classes.metadata}>
                                            <span className={classes.data}>
                                                <strong>By:</strong> {results.author}
                                            </span>
                                            <span className={classes.data}>
                                                <strong>Posted:</strong> {mapTime(results.created_at_i)}
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
     * Get the Total Pages count.
     * @param total
     * @param denominator Count of results per page
     * @return {number}
     */
    getPagesCount = (total, denominator) => {
        const divisible = total % denominator === 0;
        const valueToBeAdded = divisible ? 0 : 1;
        return Math.floor(total / denominator) + valueToBeAdded
    };

    /**
     * Fetch results according to the prev or next page requests.
     * @param {String} type 'prev' or 'next'
     */
    handlePageClick = (type) => {
        // event.preventDefault();
        const updatedPageNo = 'prev' === type ? this.state.currentPageNo - 1 : this.state.currentPageNo + 1;

        if (!this.state.loading) {
            this.setState({ loading: true, message: "" }, () => {
              // Fetch previous 20 Results
              this.fetchSearchResults(updatedPageNo, this.state.query);
            });
        }
    }

    render() {
        const { query, loading, message, currentPageNo, totalPages } = this.state;
        // showPrevLink will be false, when on the 1st page, hence Prev link be shown on 1st page.
        const showPrevLink = 1 < currentPageNo;
        // showNextLink will be false, when on the last page, hence Next link wont be show last page.
        const showNextLink = totalPages > currentPageNo;
        const { classes } = this.props;
    
        return (
            <>
                {/* Applica gli stili definiti in GlobalStyles in StoriesContainerStyles.js */}
                <GlobalStyle />
                {/* Aggiunge il component Navbar */}
                <Navbar />
                {/* Aggiunge il component Slider */}
                <Slider />
                {/* Applica gli stili definiti in StoriesContainerWrapper in StoriesContainerStyles.js */}
                <StoriesContainerWrapper>
                    <div className={classes.search}>
                        <TextField  
                            variant="outlined" 
                            value={query}
                            onChange={this.handleOnInputChange}
                            className={classes.searchField}
                        />
                    </div>
                    {/*Error Message */}
                    {message && <p className="message">{message}</p>}

                    {/*Loader*/}
                    <img
                        src={Loader}
                        className={`search-loading ${loading ? "show" : "hide"}`}
                        alt="loader"
                    />
    
    
                    {/*Result*/}
                    {this.renderSearchResults()}
    
                    {/*Navigation Bottom*/}
                    <PageNavigation
                        loading={loading}
                        showPrevLink={showPrevLink}
                        showNextLink={showNextLink}
                        handlePrevClick={() => this.handlePageClick("prev")}
                        handleNextClick={() => this.handlePageClick("next")}
                    />
                </StoriesContainerWrapper>
            </>
        );
    };
};

export default withStyles(styles, { withTheme: true })(StoriesContainer);




































/*
import React, { useEffect, useState } from 'react';
import { getStoryIds } from '../services/hnApi';
import { Story } from '../components/Story';
import { GlobalStyle, StoriesContainerWrapper } from '../styles/StoriesContainerStyles.js';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import Navbar from '../components/Navbar';
import { Slider } from '../components/Slider';
import { fade, makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
          backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing(2),
        marginLeft: '10px',
        width: '50%',
        [theme.breakpoints.up('sm')]: {
          marginLeft: theme.spacing(3),
          width: 'auto',
        },
      }
  }));

export const StoriesContainer = () => {
    const classes = useStyles();

    const { count } = useInfiniteScroll();
    const [storyIds, setStoryIds] = useState([]);

    useEffect(() => {
        /* Mediante la chiamata alla funzione getStoryIds() si ottiene l'array degli id degli articoli 
        e li si restituisce come dati nell'array storyIds mediante setStoryIds 
        getStoryIds().then(data => setStoryIds(data));
        /* Si mostra il console l'output 
        console.log('count', count);
    }, [count]);

    return (
        <>
            {/* Applica gli stili definiti in GlobalStyles in StoriesContainerStyles.js 
            <GlobalStyle />
            {/* Aggiunge il component Navbar
            <Navbar />
            {/* Aggiunge il component Slider
            <Slider />
            {/* Applica gli stili definiti in StoriesContainerWrapper in StoriesContainerStyles.js
            <StoriesContainerWrapper>
                <div className={classes.search}>
                    <TextField id="outlined-basic" label="Outlined" variant="outlined" />
                </div>
                {/* Si mostrano in output (mappando sull'array storyIds) gli elementi che vanno da 
                0 a count 
                {storyIds.slice(0, count).map(storyId => (
                    /* Si passa come prop storyId
                    <Story key={storyId} storyId={storyId} />
                ))}
            </StoriesContainerWrapper>
        </>
    );
};
*/