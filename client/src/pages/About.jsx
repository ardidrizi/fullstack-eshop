import "./About.css";

const About = () => {
  return (
    <section className="about-page">
      <div className="about-hero">
        <div>
          <p className="about-kicker">Our story</p>
          <h1>Built for everyday shopping, crafted with care.</h1>
          <p className="about-lead">
            E-Shop is a curated marketplace for modern essentials, combining fast
            discovery with a reliable checkout experience. We focus on quality,
            honest pricing, and a customer-first experience.
          </p>
        </div>
      </div>

      <div className="about-grid">
        <div className="about-card">
          <h2>Curated catalog</h2>
          <p>
            We hand-pick categories and seasonal collections so shoppers can find
            what they need without endless scrolling.
          </p>
        </div>
        <div className="about-card">
          <h2>Secure by design</h2>
          <p>
            Authentication and checkout flows are built with security in mind,
            keeping your account and order history protected.
          </p>
        </div>
        <div className="about-card">
          <h2>Fast fulfillment</h2>
          <p>
            Orders are routed to trusted partners for quick delivery and clear
            updates from cart to doorstep.
          </p>
        </div>
      </div>

      <div className="about-values">
        <div>
          <h2>What matters to us</h2>
          <ul>
            <li>Transparent pricing and clear product details.</li>
            <li>Responsive support with real people behind it.</li>
            <li>Thoughtful design that stays fast on any device.</li>
          </ul>
        </div>
        <div className="about-highlight">
          <h3>Ready to explore?</h3>
          <p>
            Browse the latest arrivals or head straight to categories to find
            your next favorite product.
          </p>
          <a className="about-cta" href="/shop">
            Shop the collection
          </a>
        </div>
      </div>
    </section>
  );
};

export default About;
