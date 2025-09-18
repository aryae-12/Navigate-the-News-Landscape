import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const API_KEY = "7deedaa69dfd4bfbac945bbdc3a7d332";

  const [articles, setArticles] = useState([]);
  const [savedArticles, setSavedArticles] = useState([]);
  const [category, setCategory] = useState("general");
  const [searchQuery, setSearchQuery] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [loading, setLoading] = useState(false);

  // --- subscription state
  const [email, setEmail] = useState("");
  const [subscribeMessage, setSubscribeMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true); // start loading
      try {
        let url = "";

        if (searchQuery) {
          url = `https://newsapi.org/v2/everything?q=${searchQuery}&apiKey=${API_KEY}`;
        } else {
          url = `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${API_KEY}`;
        }

        const response = await axios.get(url);
        setArticles(response.data.articles || []);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false); // stop loading
      }
    };

    fetchNews();
  }, [category, searchQuery]);

  const handleSearch = () => {
    setSearchQuery(inputValue);
  };

  const handleSaveArticle = (article) => {
    if (!savedArticles.some((a) => a.title === article.title)) {
      setSavedArticles([...savedArticles, article]);
    }
  };

  const handleUnsaveArticle = (article) => {
    setSavedArticles(savedArticles.filter((a) => a.title !== article.title));
  };

  // --- subscribe handler
  const handleSubscribe = () => {
    if (!email) {
      setSubscribeMessage({ text: "❌ Please enter your email.", type: "error" });
      return;
    }
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      setSubscribeMessage({ text: "❌ Please enter a valid email address.", type: "error" });
      return;
    }

    setSubscribeMessage({ text: "✅ Thank you for subscribing!", type: "success" });
    setEmail("");
  };

  return (
    <div className="app">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">🌏Newzly</div>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search news..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>
        <ul className="nav-links">
          {[
            "general",
            "business",
            "entertainment",
            "health",
            "science",
            "sports",
            "technology",
          ].map((cat) => (
            <li key={cat} onClick={() => setCategory(cat)}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </li>
          ))}
        </ul>
      </nav>

      {/* News Section */}
      <section className="news-grid">
        {loading ? (
          <div className="loading-spinner"></div>
        ) : (
          articles.map((article, index) => (
            <div
              className="news-card"
              key={index}
              onClick={() => setSelectedArticle(article)}
            >
              <img
                src={article.urlToImage}
                alt={article.title}
                className="news-img"
              />
              <div className="news-content">
                <h3 className="news-title">{article.title}</h3>
                <p className="news-description">{article.description}</p>
                <div className="news-footer">
                  <button
                    className={`save-btn-inline ${
                      savedArticles.some((a) => a.title === article.title)
                        ? "saved"
                        : ""
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      savedArticles.some((a) => a.title === article.title)
                        ? handleUnsaveArticle(article)
                        : handleSaveArticle(article);
                    }}
                  >
                    ★
                  </button>
                  <button
                    className="read-more"
                    onClick={() => setSelectedArticle(article)}
                  >
                    Read More →
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </section>

      {/* Saved News */}
      {savedArticles.length > 0 && (
        <section className="trending-section">
          <h2>⭐Saved News</h2>
          <div className="trending-grid">
            {savedArticles.map((article, index) => (
              <div
                className="trending-card"
                key={index}
                onClick={() => setSelectedArticle(article)}
              >
                <img
                  src={article.urlToImage}
                  alt={article.title}
                  className="trending-img"
                />
                <div className="trending-content">
                  <h3>{article.title}</h3>
                  <button
                    className="save-btn-inline saved"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUnsaveArticle(article);
                    }}
                  >
                    ★
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Newsletter Subscription */}
      <section className="subscription">
        <h2>🌏Newzly</h2>
        <p>Stay updated with the latest news delivered straight to your inbox.</p>
        <div className="subscription-box">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={handleSubscribe}>Subscribe</button>
        </div>

        {subscribeMessage.text && (
          <p
            className={`subscribe-message ${
              subscribeMessage.type === "success" ? "success" : "error"
            }`}
          >
            {subscribeMessage.text}
          </p>
        )}
      </section>

      {/* Modal Popup */}
      {selectedArticle && (
        <div
          className="modal-overlay show"
          onClick={() => setSelectedArticle(null)}
        >
          <div
            className="modal-content show"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="close-btn" onClick={() => setSelectedArticle(null)}>
              ✖
            </button>
            <h2>{selectedArticle.title}</h2>
            <img
              src={selectedArticle.urlToImage}
              alt={selectedArticle.title}
              className="modal-img"
            />
            <p>{selectedArticle.content || selectedArticle.description}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
