import Swiper from "swiper/bundle";

const initSwiper = () => {
  const mySwiper = new Swiper(".mySwiper", {
    slidesPerView: 1, // Display as many slides as can fit within the container width
    spaceBetween: 500, // Adjust this value as needed to control the space between cards
    grabCursor: true,

    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },

    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },

    loop: true,
    speed: 1000,
  });

  // Update pagination when the slide changes
  mySwiper.on("slideChange", () => {
    const activeIndex = mySwiper.realIndex; // Use realIndex for correct active slide index
    const paginationItems = document.querySelectorAll(
      ".swiper-pagination-bullet"
    ); // Select pagination bullets
    paginationItems.forEach((item, index) => {
      // Add or remove the 'swiper-pagination-bullet-active' class to match the active slide
      if (index === activeIndex) {
        item.classList.add("swiper-pagination-bullet-active");
      } else {
        item.classList.remove("swiper-pagination-bullet-active");
      }
    });
  });
  
};

export default initSwiper;
