import styles from "./Home.module.css";
import CSSModules from "react-css-modules";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div styleName="home">
      {/* Background decorative elements */}
      <div styleName="home__background">
        <div styleName="home__circle home__circle--1"></div>
        <div styleName="home__circle home__circle--2"></div>
        <div styleName="home__circle home__circle--3"></div>
      </div>
      
      <div styleName="home__container">
        {/* Main content */}
        <div styleName="home__content">
          <div styleName="home__text">
            <div styleName="home__badge">Welcome to FlavorCraft</div>
            <h1 styleName="home__title">
              Transform Your
              <span styleName="home__highlight"> Cooking Experience</span>
            </h1>
            <p styleName="home__description">
              Discover the joy of cooking with our carefully curated recipes and 
              expert guidance. Whether you're a beginner or a seasoned chef, 
              we'll help you create delicious meals with confidence and creativity.
            </p>
            
            {/* Features grid */}
            <div styleName="home__features">
              <div styleName="home__feature">
                <span styleName="home__feature-icon">🍳</span>
                <span>Easy Recipes</span>
              </div>
              <div styleName="home__feature">
                <span styleName="home__feature-icon">⏱️</span>
                <span>Quick Meals</span>
              </div>
              <div styleName="home__feature">
                <span styleName="home__feature-icon">👨‍🍳</span>
                <span>Expert Tips</span>
              </div>
            </div>
          </div>
          
          {/* CTA Section */}
          <div styleName="home__cta">
            <Link to="/recipes" styleName="home__link">
              <button styleName="home__button" className="btn btn-primary">
                Explore Recipes
                <span styleName="home__button-arrow">→</span>
              </button>
            </Link>
            <div styleName="home__secondary">
              <span styleName="home__secondary-text">Join 10,000+ home cooks</span>
            </div>
          </div>
        </div>
        
        {/* Image/Illustration placeholder */}
        <div styleName="home__visual">
          <div styleName="home__image-placeholder">
            <div styleName="home__image-content">
              <span styleName="home__image-text">Let's Cook Something Amazing!</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CSSModules(Home, styles, {
  allowMultiple: true,
  handleNotFoundStyleName: "log",
});