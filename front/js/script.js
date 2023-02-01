fetch("http://localhost:3000/api/products")

.then(function(res) {
    if (res.ok) {
        return res.json();
    }
})

.then(function (value) {

    for (let canape of value){

        let objets = document.querySelector("#items")

        let product = `
            <a href="${"./product.html?id=" + canape._id}">
                <article>
                    <img src="${canape.imageUrl}" alt="${canape.altTxt}">
                    <h3 class="productName">${canape.name}</h3>
                    <p class="productDescription">${canape.description}</p>
                </article>
            </a>
        `
        objets.insertAdjacentHTML("beforeend",product)
    }
})

.catch(function(err) {
    // Une erreur est survenue
});