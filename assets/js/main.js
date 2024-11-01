const getCategories = async () => {
    const { data } = await axios.get(`https://dummyjson.com/products/category-list`);
    return data;
}

const displayCategories = async () => {
    const loader = document.querySelector(".loader-container");
    loader.classList.add("active");
    try {
        const categories = await getCategories();
        const result = categories.map((category) => {
            return `<div class='category'>
            <h2>${category}</h2>
            <a href='CategoryDetails.html?category=${category}'>Details</a>
          </div>`;
        }).join('');

        document.querySelector(".categories .row").innerHTML = result;

    }
    catch (error) {
        document.querySelector(".categories .row").innerHTML = "<p>error loading categories</p>";
    }
    finally {
        loader.classList.remove("active");
    }
}
const getProducts = async (page) => {
    const skip = (page - 1) * 30;
    const { data } = await axios.get(`https://dummyjson.com/products?limit=8&skip=${skip}`);
    return data;
}
const displayProducts = async (page = 1) => {
    const loader = document.querySelector(".loader-container");
    try {
        const data = await getProducts(page);
        const numberOfPages = Math.ceil(data.total / 30);
        console.log(page);
        const result = data.products.map((product) => {
            return `<div class='product'>
            <img src='${product.thumbnail}' alt='${product.description}' class='img' />
            <h3>${product.title}</h3>
            <span>${product.price} $</span>
          </div>`;
        }).join(' ');
        document.querySelector(".products .row").innerHTML = result;

        let paginationLink = ``;
        if (page == 1) {
            paginationLink += `<li class="page-item"><button class="page-link" disabled>&laquo;</button></li>`;
        } else {
            paginationLink += `<li class="page-item"><button onclick="displayProducts('${page - 1}')" class="page-link">&laquo;</button></li>`;
        }
        for (let i = 1; i <= numberOfPages; i++) {
            paginationLink += `<li class="page-item ${i == page ? 'active' : ''}"><button onclick=displayProducts('${i}') class="page-link" >${i}</button></li>`;
        }
        if (page == numberOfPages) {
            paginationLink += `<li class="page-item"><button class="page-link" disabled>&raquo;</button></li>`;
        }
        else {
            paginationLink += `<li class="page-item"><button onclick=displayProducts('${parseInt(page) + 1}') class="page-link">&raquo;</button></li>`;
        }
        document.querySelector(".pagination").innerHTML = paginationLink;
        modal();

    } catch (error) {
        document.querySelector(".products .row").innerHTML = "<p>error loading products</p>";
    }
    finally {
        loader.classList.remove("active");
    }
}


displayCategories();
displayProducts();
window.onscroll = function () {
    const nav = document.querySelector("header");
    const categories = document.querySelector(".categories");

    if (window.scrollY > categories.offsetTop) {
        nav.classList.add("scrollNavber");
    }
    else {
        nav.classList.remove("scrollNavber");
    }
};
const countDown = () => {
    const countDownDate = new Date("2025-03-02T00:00:00").getTime();
    const now = new Date().getTime();
    const distance = countDownDate - now;
    const days = Math.floor(distance / 86400000);
    const hours = Math.floor((distance % 86400000) / 3600000);
    const minutes = Math.floor((distance % 3600000) / 60000);
    const seconds = Math.floor((distance % 60000) / 1000);
    document.querySelector("#days").textContent = days + " ";
    document.querySelector("#hours").textContent = hours + " ";
    document.querySelector("#minutes").textContent = minutes + " ";
    document.querySelector("#seconds").textContent = seconds + " ";
}
setInterval(() => {
    countDown();
}, 1000);

function modal() {
    const modal = document.querySelector(".my-modal");
    const closeBtn = document.querySelector(".close-btn");
    const leftBtn = document.querySelector(".left-btn");
    const rightBtn = document.querySelector(".right-btn");
    const images = Array.from(document.querySelectorAll("img"));
    let currentIndex = 0;

    images.forEach(function (img) {
        img.addEventListener("click", function (e) {
            modal.classList.remove('d-none');
            modal.querySelector("img").setAttribute("src", e.target.src);
            const currentImg = e.target;
            currentIndex = images.indexOf(currentImg);
            console.log(currentIndex);
        })
    })
    leftBtn.addEventListener("click", function () {
        currentIndex--;
        if (currentIndex < 0) {
            currentIndex = images.length - 1;
        }
        const src = images[currentIndex].src;
        modal.querySelector("img").setAttribute("src", src);
    })
    rightBtn.addEventListener("click", function () {
        currentIndex++;
        if (currentIndex >= images.length) {
            currentIndex = 0;
        }
        const src = images[currentIndex].src;
        modal.querySelector("img").setAttribute("src", src);
    })
    closeBtn.addEventListener("click", function () {
        modal.classList.add('d-none');
    });
    window.addEventListener("keydown", function (e) {
        if (e.code == "ArrowRight") {
            currentIndex++;
            if (currentIndex >= images.length) {
                currentIndex = 0;
            }
            const src = images[currentIndex].src;
            modal.querySelector("img").setAttribute("src", src);
        }  
        else if (e.code == "ArrowLeft") {
            currentIndex--;
            if (currentIndex < 0) {
                currentIndex = images.length - 1;
            }
            const src = images[currentIndex].src;
            modal.querySelector("img").setAttribute("src", src);
        }
       else if (e.code == "Escape") {
            console.log("Escape pressed");
            modal.classList.add('d-none');
        }
    });
}
