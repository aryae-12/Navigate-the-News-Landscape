import { useState } from "react";

function Subscription() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();

    if (email.trim() === "") return;

    
    let stored = JSON.parse(localStorage.getItem("subscribers")) || [];
    stored.push(email);
    localStorage.setItem("subscribers", JSON.stringify(stored));

    setSubscribed(true);
    setEmail("");
  };

  return (
    <div className="subscription">
      <h2>📩 Subscribe for Daily News</h2>
      {subscribed ? (
        <p>✅ Thanks for subscribing!</p>
      ) : (
        <form onSubmit={handleSubscribe}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Subscribe</button>
        </form>
      )}
    </div>
  );
}

export default Subscription;
