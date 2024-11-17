class CustomSection extends HTMLElement {
    constructor() {
      super();
      // Set up section content directly in the HTML of this custom component
      this.innerHTML = `
        <div class="custom-section__image-container">
          <img src="/coi_tasks/task1/photo.jpeg" alt="Sample Image" class="custom-section__image">
        </div>
        <div class="custom-section__content">
          <div class="custom-section__heading">Handcrafted and Responsibly Sourced</div>
          <div class="custom-section__text">
            On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain.
          </div>
          <button class="custom-section__button">Learn More</button>
        </div>
      `;
  
      // Intersection Observer to reveal component when scrolled into view
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.classList.add('custom-section--visible'); // Add fade-in class
          } else {
            this.classList.remove('custom-section--visible'); // Remove fade-in class
          }
        });
      }, { threshold: 0.5 });
  
      observer.observe(this);
  
      // Add event listener to button to hide it and display a new paragraph on click
      const button = this.querySelector('.custom-section__button');
      button.addEventListener('click', () => {
        // Hide the button
        button.style.display = 'none';
  
        // Get the existing paragraph text
        const existingText = this.querySelector('.custom-section__text').textContent;
  
        // Create a new paragraph element with the same content
        const newParagraph = document.createElement('div');
        newParagraph.className = 'custom-section__text';
        newParagraph.textContent = existingText;
  
        // Append the new paragraph to the content section
        this.querySelector('.custom-section__content').appendChild(newParagraph);
      });
    }
  }
  
  // Register custom element
  customElements.define('my-custom-section', CustomSection);
  