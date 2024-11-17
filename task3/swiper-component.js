class SwiperSection extends HTMLElement {
  constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      
      // Create base structure
      this.shadowRoot.innerHTML = `
          <style>
              /* Import Swiper styles */
              @import 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css';

              :host {
                  display: block;
                  width: 100%;
                  max-width: 1440px;
                  margin: 0 auto;
                  padding: 20px;
              }

              .swiper {
                  width: 100%;
                  height: 500px;
              }

              @media (max-width: 768px) {
                  .swiper {
                      height: 400px;
                  }
              }

              @media (max-width: 375px) {
                  .swiper {
                      height: 300px;
                  }
              }

              .swiper-slide {
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  background: #fff;
                  overflow: hidden;
                  border-radius: 10px;
              }

              .swiper-slide img {
                  width: 100%;
                  height: 100%;
                  object-fit: cover;
              }

              .swiper-button-next,
              .swiper-button-prev {
                  color: #000;
                  background: rgba(255, 255, 255, 0.7);
                  width: 40px;
                  height: 40px;
                  border-radius: 50%;
                  --swiper-navigation-size: 20px;
              }

              .swiper-button-next:hover,
              .swiper-button-prev:hover {
                  background: rgba(0, 0, 0, 0.8);
                  color: #fff;
              }

              .toggle-button {
                  display: block;
                  margin: 20px auto;
                  padding: 10px 20px;
                  border: none;
                  background: #000;
                  color: #fff;
                  border-radius: 5px;
                  cursor: pointer;
              }

              .toggle-button:hover {
                  background: #333;
              }
          </style>

          <div class="swiper">
              <div class="swiper-wrapper">
                  <div class="swiper-slide">
                      <img src="/coi_tasks/task3/image1.jpeg" alt="Slide 1">
                  </div>
                  <div class="swiper-slide">
                      <img src="/coi_tasks/task3/image2.jpeg" alt="Slide 2">
                  </div>
                  <div class="swiper-slide">
                      <img src="/coi_tasks/task3/image3.jpeg" alt="Slide 3">
                  </div>
              </div>
              <div class="swiper-button-next"></div>
              <div class="swiper-button-prev"></div>
          </div>
          <button class="toggle-button">Toggle Swiper</button>
      `;

      this.toggleButton = this.shadowRoot.querySelector('.toggle-button');
      this.toggleButton.addEventListener('click', () => this.toggleSwiper());
  }

  connectedCallback() {
      this.initSwiper();
  }

  disconnectedCallback() {
      this.destroySwiper();
  }

  initSwiper() {
      if (this.swiper || !window.Swiper) return;

      const swiperEl = this.shadowRoot.querySelector('.swiper');
      
      this.swiper = new Swiper(swiperEl, {
          loop: true,
          slidesPerView: 3,
          spaceBetween: 20,
          
          // Responsive breakpoints
          breakpoints: {
              // when window width is >= 1440px
              1440: {
                  slidesPerView: 3,
                  spaceBetween: 20
              },
              // when window width is >= 768px
              768: {
                  slidesPerView: 2,
                  spaceBetween: 15
              },
              // when window width is >= 375px
              375: {
                  slidesPerView: 1,
                  spaceBetween: 10
              }
          },

          // Navigation arrows
          navigation: {
              nextEl: this.shadowRoot.querySelector('.swiper-button-next'),
              prevEl: this.shadowRoot.querySelector('.swiper-button-prev'),
          },

          // Log active slide on change
          on: {
              slideChange: () => {
                  console.log('Active slide index:', this.swiper.realIndex);
              }
          }
      });
  }

  destroySwiper() {
      if (this.swiper) {
          this.swiper.destroy(true, true);
          this.swiper = null;
      }
  }

  toggleSwiper() {
      if (this.swiper) {
          console.log('Destroying Swiper...');
          this.destroySwiper();
      } else {
          console.log('Initializing Swiper...');
          this.initSwiper();
      }
  }
}

// Register the custom element
customElements.define('swiper-section', SwiperSection);
