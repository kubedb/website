document.addEventListener("DOMContentLoaded", () => {
  // Get all "navbar-burger" elements
  const $navbarBurgers = Array.prototype.slice.call(
    document.querySelectorAll(".navbar-burger"),
    0
  );

  // Check if there are any navbar burgers
  if ($navbarBurgers.length > 0) {
    // Add a click event on each of them
    $navbarBurgers.forEach(el => {
      el.addEventListener("click", () => {
        // Get the target from the "data-target" attribute
        const target = el.dataset.target;
        const $target = document.getElementById(target);

        // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
        el.classList.toggle("is-active");
        $target.classList.toggle("is-active");
      });
    });
  }
});

// menu sticky
// Not a ton of code, but hard to
const nav = document.querySelector("#header");
let topOfNav = nav.offsetTop;

function fixNav() {
  if (window.scrollY > topOfNav) {
    document.body.style.paddingTop = nav.offsetHeight + "px";
    document.body.classList.add("fixed-nav");
  } else {
    document.body.classList.remove("fixed-nav");
    document.body.style.paddingTop = 0;
  }
}

window.addEventListener("scroll", fixNav);

//bulma carousel
bulmaCarousel.attach("#carousel-demo", {
  slidesToScroll: 1,
  slidesToShow: 1,
  infinite: true,
  autoplay: false
});

// For FAQ Collaps Page
const accordionItem = document.querySelectorAll(".accordion-item");
const onClickAccordionHeader = e => {
  if (e.currentTarget.parentNode.classList.contains("active")) {
    e.currentTarget.parentNode.classList.remove("active");
  } else {
    Array.prototype.forEach.call(accordionItem, e => {
      e.classList.remove("active");
    });
    e.currentTarget.parentNode.classList.add("active");
  }
};
const init = () => {
  Array.prototype.forEach.call(accordionItem, e => {
    e.querySelector(".accordion-header").addEventListener(
      "click",
      onClickAccordionHeader,
      false
    );
  });
};

document.addEventListener("DOMContentLoaded", init);

// Right sidebar SpyScrolling
const makeNavLinksSmooth = () => {
  const navLinks = document.querySelectorAll(".nav-link");

  // for (let n in navLinks) {
  //   if (navLinks.hasOwnProperty(n)) {
  //     navLinks[n].addEventListener("click", e => {
  //       e.preventDefault();
  //       const el = document.querySelector(navLinks[n].hash);
  //       const pos = el.offsetTop;
  //       window.scrollTo({
  //         top: pos,
  //         behavior: "smooth"
  //       });
  //     });
  //   }
  // }
};
const spyScrolling = () => {
  const sections = document.querySelectorAll(".single-info");

  window.onscroll = () => {
    const scrollPos =
      document.documentElement.scrollTop || document.body.scrollTop;

    for (let s in sections)
      if (sections.hasOwnProperty(s) && sections[s].offsetTop <= scrollPos) {
        const id = sections[s].id;
        document.querySelector(".active").classList.remove("active");
        document
          .querySelector(`a[href*=${id}]`)
          .parentNode.classList.add("active");
      }
  };
};

makeNavLinksSmooth();
spyScrolling();

// tabs active class add script - setup | install page

const tabItems = document.querySelectorAll(".nav-item .nav-link");
tabItems.forEach(tab => {
  tab.addEventListener("click", e => {
    e.preventDefault();
    const el = e.currentTarget;

    // add .active class to the clicked item, remove .active from others
    document.querySelectorAll(".nav-item .nav-link").forEach(navLink => {
      navLink === el
        ? navLink.classList.add("active")
        : navLink.classList.remove("active");
    });

    // add .show class to the target tab-pane, remove from others
    const elHref = el.getAttribute("href");
    const tabPaneTarget = document.querySelector(elHref);

    document.querySelectorAll(".tab-pane").forEach(tabPane => {
      tabPane === tabPaneTarget
        ? tabPane.classList.add("show")
        : tabPane.classList.remove("show");
    });

    tabPane.classList.add("show");
  });
});
