

document.addEventListener('DOMContentLoaded', () => {
  "use strict";

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Mobile nav toggle
   */

  const mobileNavShow = document.querySelector('.mobile-nav-show');
  const mobileNavHide = document.querySelector('.mobile-nav-hide');

  document.querySelectorAll('.mobile-nav-toggle').forEach(el => {
    el.addEventListener('click', function(event) {
      event.preventDefault();
      mobileNavToogle();
    })
  });

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavShow.classList.toggle('d-none');
    mobileNavHide.classList.toggle('d-none');
  }

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navbar a').forEach(navbarlink => {

    if (!navbarlink.hash) return;

    let section = document.querySelector(navbarlink.hash);
    if (!section) return;

    navbarlink.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  const navDropdowns = document.querySelectorAll('.navbar .dropdown > a');

  navDropdowns.forEach(el => {
    el.addEventListener('click', function(event) {
      if (document.querySelector('.mobile-nav-active')) {
        event.preventDefault();
        this.classList.toggle('active');
        this.nextElementSibling.classList.toggle('dropdown-active');

        let dropDownIndicator = this.querySelector('.dropdown-indicator');
        dropDownIndicator.classList.toggle('bi-chevron-up');
        dropDownIndicator.classList.toggle('bi-chevron-down');
      }
    })
  });

  /**
   * Scroll top button
   */
  const scrollTop = document.querySelector('.scroll-top');
  if (scrollTop) {
    const togglescrollTop = function() {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
    window.addEventListener('load', togglescrollTop);
    document.addEventListener('scroll', togglescrollTop);
    scrollTop.addEventListener('click', window.scrollTo({
      top: 0,
      behavior: 'smooth'
    }));
  }

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Porfolio isotope and filter
   */
  let portfolionIsotope = document.querySelector('.portfolio-isotope');

  if (portfolionIsotope) {

    let portfolioFilter = portfolionIsotope.getAttribute('data-portfolio-filter') ? portfolionIsotope.getAttribute('data-portfolio-filter') : '*';
    let portfolioLayout = portfolionIsotope.getAttribute('data-portfolio-layout') ? portfolionIsotope.getAttribute('data-portfolio-layout') : 'masonry';
    let portfolioSort = portfolionIsotope.getAttribute('data-portfolio-sort') ? portfolionIsotope.getAttribute('data-portfolio-sort') : 'original-order';

    window.addEventListener('load', () => {
      let portfolioIsotope = new Isotope(document.querySelector('.portfolio-container'), {
        itemSelector: '.portfolio-item',
        layoutMode: portfolioLayout,
        filter: portfolioFilter,
        sortBy: portfolioSort
      });

      let menuFilters = document.querySelectorAll('.portfolio-isotope .portfolio-flters li');
      menuFilters.forEach(function(el) {
        el.addEventListener('click', function() {
          document.querySelector('.portfolio-isotope .portfolio-flters .filter-active').classList.remove('filter-active');
          this.classList.add('filter-active');
          portfolioIsotope.arrange({
            filter: this.getAttribute('data-filter')
          });
          if (typeof aos_init === 'function') {
            aos_init();
          }
        }, false);
      });

    });

  }

  /**
   * Init swiper slider with 1 slide at once in desktop view
   */
  new Swiper('.slides-1', {
    speed: 600,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    slidesPerView: 'auto',
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    }
  });

  /**
   * Init swiper slider with 2 slides at once in desktop view
   */
  new Swiper('.slides-2', {
    speed: 600,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    slidesPerView: 'auto',
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    breakpoints: {
      320: {
        slidesPerView: 1,
        spaceBetween: 20
      },

      1200: {
        slidesPerView: 2,
        spaceBetween: 20
      }
    }
  });

  /**
   * Initiate pURE cOUNTER
   */
  new PureCounter();

  /**
   * Animation on scroll function and init
   */
  function aos_init() {
    AOS.init({
      duration: 800,
      easing: 'slide',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', () => {
    aos_init();
  });

});

const dropzone = document.querySelector('.dropzone');
const fileInput = document.getElementById('fileInput');
const progressBar = document.querySelector('.progress-bar');
const progress = document.querySelector('.progress');
const result = document.querySelector('.result');
const predictionText = document.getElementById('prediction');
const analyzedImage = document.getElementById('analyzedImage');

// Function to display loading progress
function updateProgress(value) {
  progress.style.width = value + '%'; // Concatenated the percentage value correctly
}

// Function to handle file drag and drop events with visual feedback
dropzone.addEventListener('dragover', (event) => {
  event.preventDefault();
  dropzone.classList.add('dragover'); // Add hover class for visual feedback
});

dropzone.addEventListener('dragleave', () => {
  dropzone.classList.remove('dragover');
});

dropzone.addEventListener('drop', (event) => {
  event.preventDefault();
  dropzone.classList.remove('dragover');
  const file = event.dataTransfer.files[0];
  uploadFile(file);
});

fileInput.addEventListener('change', () => {
  const file = fileInput.files[0];
  uploadFile(file);
});

// Function to handle file upload, display progress, and show result
async function uploadFile(file) {
  if (!file) {
    alert('Please select a file to upload.'); // Display an alert for missing file
    return;
  }

  // Show progress bar
  progressBar.classList.remove('hidden');

  // Create a FormData object to send the file
  const formData = new FormData();
  formData.append('file', file);

  try {
    // Send the file upload request to the backend
    const response = await fetch('/upload', {
      method: 'POST',
      body: formData,
      // Added an event listener for upload progress
      // onUploadProgress: (event) => {
      //   const progress = Math.round((event.loaded * 100) / event.total);
      //   updateProgress(progress);
      // }
    });

    // Hide progress bar
    progressBar.classList.add('hidden');

    // Check for successful response
    if (!response.ok) {
      throw new Error(`Error uploading file: ${response.statusText}`); // Corrected the string interpolation
    }

    // Parse the JSON response
    const data = await response.json();

    // Display result
    predictionText.textContent = data.prediction || 'Prediction unavailable.';
    analyzedImage.src = `data:image/jpeg;base64,${data.analyzed_image}`; // Corrected the image source syntax
    analyzedImage.style.display = 'block';
    result.classList.remove('hidden');
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred during upload. Please try again.');
  } finally {
    // Optional: Reset the upload input after submission (if needed)
    // uploadInput.value = '';
  }
}
const imageUpload = document.getElementById('image-upload');
const analyzeButton = document.getElementById('analyze-button');
const imagePreview = document.getElementById('image-preview');
const resultsSection = document.querySelector('.results-section');
const resultList = document.getElementById('results-list');
const errorMessage = document.getElementById('error-message');

// Function to handle file upload
function handleFileChange(event) {
  const file = event.target.files[0];
  if (!file) {
    return;
  }

  // Validate file type (optional)
  if (!file.type.startsWith('image/')) {
    errorMessage.textContent = 'Please select an image file.';
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    imagePreview.src = e.target.result;
    imagePreview.style.display = 'block';
    analyzeButton.disabled = false; // Enable analyze button
  };
  reader.readAsDataURL(file);
}

// Function to handle image analysis (replace with actual logic)
async function analyzeImage() {
    analyzeButton.disabled = true;
  
    // Show progress indicator
    const progressIndicator = document.getElementById('progress-indicator');
    progressIndicator.textContent = 'Analyzing image...';
  
    // Get the uploaded image
    const image = imagePreview.src;
  
    // Send the image data to the server for analysis
    const response = await fetch('/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ image: image })
    });
  
    // Handle the response from the server
    if (response.ok) {
      // Parse the response as JSON
      const data = await response.json();
  
      // Display the results
      // For demonstration, just logging the results to the console
      console.log('Prediction:', data);
    } else {
      // If there's an error, display an error message
      console.error('Error analyzing image:', response.statusText);
    }
  
    // Enable analyze button after analysis is complete
    analyzeButton.disabled = false;
    progressIndicator.textContent = ''; // Clear progress indicator
}

// Event listeners
imageUpload.addEventListener('change', handleFileChange);

analyzeButton.addEventListener('click', function() {
  analyzeButton.classList.add('active'); // Add progress bar animation
  analyzeImage();
});

// Optional: Drag and drop functionality
document.addEventListener('dragover', function(event) {
  event.preventDefault();
});

document.addEventListener('drop', function(event) {
  event.preventDefault();
  if (event.dataTransfer.files) {
    handleFileChange(event);
  }
  document.querySelector('.upload-section').classList.remove('drag-over');
});

document.querySelector('.upload-section').addEventListener('dragenter', function() {
  this.classList.add('drag-over');
});

document.querySelector('.upload-section').addEventListener('dragleave', function() {
  this.classList.remove('drag-over');
});
