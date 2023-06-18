import React, { Component } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";

export default class News extends Component {
  static defaultProps = {
    country: "in",
    pageSize: 8,
    category: "general",
  };

  static propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
  };

  capitalize = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      loading: false,
      page: 1,
      totalResults: 0
    };
    document.title = `${this.capitalize(this.props.category)}-NewsDaily`;
  }

  async update() {
    const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.api}&page=${this.state.page}&pageSize=${this.props.pageSize}`;
    this.props.setProgress(0); 
    // this.setState({ loading: true });
    let data = await fetch(url);
    this.props.setProgress(30); 
    let parsedData = await data.json();
    this.props.setProgress(70); 
    this.setState({
      articles: parsedData.articles,
      totalResults: parsedData.totalResults,
      loading: false,
    });
    this.props.setProgress(100); 
  }

  async componentDidMount() {
    this.update();
  }

  // handleNextPage = async () => {
  //   this.setState({ page: this.state.page + 1 });
  //   this.update();
  //   // console.log(this.state.page)
  // };

  // handlePrevPage = async () => {
  //   this.setState({ page: this.state.page - 1 });
  //   this.update();
  // };

  fetchMoreData = async() => {
    this.setState({ page: this.state.page + 1 });
   
    const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.api}&page=${this.state.page + 1}&pageSize=${this.props.pageSize}`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          articles: this.state.articles.concat(data.articles),
          totalResults: data.totalResults,
        });
      });
  };

  render() {
    return (
      <>
        <h1 className="text-center my-3" style={{paddingTop:'50px'}}>
          NewsDaily - Top {this.capitalize(this.props.category)} Headlines
        </h1>
        {this.state.loading && <Spinner />}
        <hr />
        <InfiniteScroll
          dataLength={this.state.articles.length}
          next={this.fetchMoreData}
          hasMore={this.state.articles.length !== this.state.totalResults}
          loader={<Spinner />}
          endMessage={
            <p style={{ textAlign: 'center' }}>
              <b>Yay! You have seen it all</b>
            </p>
          }
        >
          <div className="container">
          <div className="row">
            {this.state.articles.map((element) => {
              return (
                <div className="col-md-4" key={element.url}>
                  <NewsItem
                    title={element.title ? element.title : " "}
                    description={
                      element.description ? element.description : " "
                    }
                    imgUrl={element.urlToImage}
                    url={element.url}
                    author={element.author}
                    date={element.publishedAt}
                    src={element.source.name}
                  />
                </div>
              );
            })}
          </div>
        </div>
        </InfiniteScroll>
        {/* <div className="container d-flex justify-content-between">
          <button
            type="button"
            disabled={this.state.page <= 1}
            className="btn btn-dark"
            onClick={this.handlePrevPage}
          >
            &larr;Previous
          </button>
          <button
            type="button"
            disabled={
              this.state.page >
              Math.ceil(this.state.totalResults / this.props.pageSize)
            }
            className="btn btn-dark"
            onClick={this.handleNextPage}
          >
            Next&rarr;
          </button>
        </div> */}
      </>
    );
  }
}
