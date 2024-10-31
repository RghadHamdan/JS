const getProductDetails = async () => {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');
    const { data } = await axios.get(`https://dummyjson.com/products/${productId}`);
    return data;
}

const displayProductDetails = async () => {
    const product = await getProductDetails();
    const result = `
        <div>
        <a href="ProductDetails.html?id=${product.id}" class='product'>
            <img src='${product.thumbnail}' alt='${product.description}'>
            <h3>${product.title}</h3>
            <p>${product.description}</p>
            <span>${product.price}</span>
        </div>`;

    document.querySelector(".product-details").innerHTML = result;
}

displayProductDetails();