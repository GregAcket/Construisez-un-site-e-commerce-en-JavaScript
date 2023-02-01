const storage = JSON.parse(localStorage.getItem("selectedCanap")) ? JSON.parse(localStorage.getItem("selectedCanap")) : []


fetch("http://localhost:3000/api/products")

.then(function(res) {
    if (res.ok) {
        return res.json();
    }
})

.then(function(data) {

    let objetPanier = document.querySelector('#cart__items')

    for (let product of storage) {

        updateTotalQuantity()

        // recherche du produit correspondant à ceux dans le localstorage

        let findProduct = data.find(search => search._id == product.id)

        // ajout du html pour chaque produit

        let contenuPanier = `
            <article class="cart__item" data-id="${product.id}" data-color="${product.couleur}">
                <div class="cart__item__img">
                    <img src=${findProduct.imageUrl} alt="${findProduct.altTxt}">
                </div>
                <div class="cart__item__content">
                    <div class="cart__item__content__description">
                        <h2>${findProduct.name}</h2>
                        <p>${product.couleur}</p>
                        <p>${findProduct.price}</p>
                    </div>
                    <div class="cart__item__content__settings">
                        <div class="cart__item__content__settings__quantity">
                            <p>Qté : </p>
                            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value=${product.quantity}>
                        </div>
                        <div class="cart__item__content__settings__delete">
                            <p class="deleteItem">Supprimer</p>
                        </div>
                    </div>
                </div>
            </article> `
            
        objetPanier.insertAdjacentHTML("beforeend",contenuPanier)
        
        deleteItem()

        updateTotalPrice()

        updateLocalStorageQuantity()
    }

    //Fonction qui met à jour la quantité d'élements dans le localStorage

    function updateLocalStorageQuantity() {

        // on recherche tous les selecteurs correspondant à la quantité de produits

        const changeQuantity = document.querySelectorAll(".itemQuantity")

        // on va chercher individuellement les selecteurs des produits 

        for (let howMany of changeQuantity) {

            // on ajoute un événement d'écoute au changement de quantité

                howMany.addEventListener('change', function() {

                let newQuantity = howMany.value

                // on va chercher le produit correspondant

                let getCorrectCanap = howMany.closest(".cart__item")

                // on s'assure qu'il s'agit du bon produit

                let checkCorrectCanap = storage.find(search => search.id == getCorrectCanap.dataset.id && search.couleur == getCorrectCanap.dataset.color)

                if (newQuantity <= 0  || newQuantity > 100) {

                    howMany.value = checkCorrectCanap.quantity

                    return alert("Veuillez selectionner une quantité valide (entre 1 et 100)")                    
                }

                // on change la quantité de produit dans le localStorage et on met à jour la page

                if (checkCorrectCanap != undefined) {

                    checkCorrectCanap.quantity = parseInt(newQuantity)

                    localStorage.setItem("selectedCanap", JSON.stringify(storage))

                    updateTotalQuantity()

                    updateTotalPrice()
                }
            })        
        }
    }

    // fonction qui met à jour l'affichage de la quantité d'objets selectionnés 
    
    function updateTotalQuantity() {

        let totalProduct = storage.reduce((a, b) => a + parseInt(b.quantity), 0)

        document.querySelector("#totalQuantity").innerText = totalProduct
    }

    // Fonction de suppression d'un objet dans le localStorage et à l'affichage

    function deleteItem() {

        const selectDeleted = document.querySelectorAll(".deleteItem")

        selectDeleted.forEach(del => {

            del.addEventListener('click', function(){

               let chosenToBeDeleted = del.closest(".cart__item")

               let checkBeforeDeletion = storage.find(search => search.id == chosenToBeDeleted.dataset.id && search.couleur == chosenToBeDeleted.dataset.color)

               if (checkBeforeDeletion != undefined) {

                    let index = storage.indexOf(checkBeforeDeletion)

                    storage.splice(index,1)

                    chosenToBeDeleted.remove()

                    localStorage.setItem("selectedCanap", JSON.stringify(storage))

                    if (storage.length < 1 ) {

                        document.querySelector("#totalPrice").innerText = 0
                    }

                    updateTotalQuantity()

                    updateTotalPrice()
                }
            })
        })
    }

    // Fonction qui met à jour l'affichage du prix total

    function updateTotalPrice () {

        let price = document.querySelectorAll(".cart__item__content__description p:nth-child(3)")

        let finalPrice = 0

        price.forEach(prix => {

            let canapPrice = parseInt(prix.textContent)

            let research = prix.closest(".cart__item")

            let checkItem = storage.find(search => search.id == research.dataset.id && search.couleur == research.dataset.color)

            if (checkItem != undefined ) {

                let totalPricePerCanap = canapPrice * parseInt(checkItem.quantity)

                finalPrice = finalPrice + totalPricePerCanap

                document.querySelector("#totalPrice").innerText = finalPrice
            }                        
        })
    }
})

.catch(function(err) {
    // Une erreur est survenue
})

//regex

const regexNomPrenomVille = /^[a-zA-ZÉÈéèç\/ñ\-\s]{2,}$/
const regexMail = /^[a-zA-Z0-9\.é_ñèç\%+\-]+@[a-zA-Z0-9ñ.-]+\.[a-zA-Zñ]{2,}$/
const regexadresse = /^[a-zA-Z0-9éèÉÈçñ\-\s]{5,}$/

const firstName = document.querySelector("#firstName")
const lastName = document.querySelector("#lastName")
const address = document.querySelector("#address")
const city = document.querySelector("#city")
const eMail = document.querySelector("#email")

firstName.addEventListener('change', function() {

    const errorFirstName = document.querySelector("#firstNameErrorMsg")

    if (regexNomPrenomVille.test(firstName.value)){

        firstName.style.cssText = `
            background-color: #5dd65d;`

        errorFirstName.innerText = " "
        
    } else {

        firstName.style.cssText = `
            background-color: #ffffff;`

        errorFirstName.innerText = "Veuillez remplir le champs correctement SVP (Uniquement des lettres, minimum 2 caractères)"
        errorFirstName.style.cssText = `
            color: #ff0000;
            `
    }
})

lastName.addEventListener('change', function() {

    const errorLastName = document.querySelector("#lastNameErrorMsg")

    if (regexNomPrenomVille.test(lastName.value)){

        lastName.style.cssText = `
            background-color: #5dd65d;`

        errorLastName.innerText = " "
        
    } else {

        lastName.style.cssText = `
            background-color: #ffffff;`

        errorLastName.innerText = "Veuillez remplir le champs correctement SVP (Uniquement des lettres, minimum 2 caractères)"
        errorLastName.style.cssText = `
            color: #ff0000;
            `
    }
})

address.addEventListener('change', function() {

    const errorAddress = document.querySelector("#addressErrorMsg")

    if (regexadresse.test(address.value)){

        address.style.cssText = `
            background-color: #5dd65d;`

        errorAddress.innerText = " "
        
    } else {

        address.style.cssText = `
            background-color: #ffffff;`

        errorAddress.innerText = "Veuillez remplir le champs correctement SVP (Uniquement des chiffres et des lettres, minimum 5 caractères)"
        errorAddress.style.cssText = `
            color: #ff0000;
            `
    }
})

city.addEventListener('change', function() {

    const errorCity = document.querySelector("#cityErrorMsg")

    if (regexNomPrenomVille.test(city.value)){

        city.style.cssText = `
            background-color: #5dd65d;`

        errorCity.innerText = " "
        
    } else {

        city.style.cssText = `
            background-color: #ffffff;`

        errorCity.innerText = "Veuillez remplir le champs correctement SVP (Uniquement des lettres, minimum 2 caractères)"
        errorCity.style.cssText = `
            color: #ff0000;
            `
    }
})

eMail.addEventListener('change', function() {

    const errorEMail = document.querySelector("#emailErrorMsg")

    if (regexMail.test(eMail.value)){

        eMail.style.cssText = `
            background-color: #5dd65d;`

        errorEMail.innerText = " "
        
    } else {

        eMail.style.cssText = `
            background-color: #ffffff;`

        errorEMail.innerText = "Veuillez remplir le champs correctement SVP (Par exemple: Guy_Banvil@caramail.fr)"
        errorEMail.style.cssText = `
            color: #ff0000;
            `
    }
})

const orderSelector = document.querySelector("#order")

orderSelector.addEventListener('click', (e) => {
    e.preventDefault();

    let checkFirstName = regexNomPrenomVille.test(firstName.value)
    let checkLastName = regexNomPrenomVille.test(lastName.value)
    let checkCity = regexNomPrenomVille.test(city.value)
    let checkAddress = regexadresse.test(address.value)
    let checkEMail = regexMail.test(eMail.value)

    if (storage.length < 1 ) {

        alert("Votre panier est vide, vous ne pouvez pas commander")
    
    } else if (checkFirstName == false || checkLastName == false || checkCity == false || checkAddress == false || checkEMail == false ) {

        alert("Il y a une erreur dans le remplissage de votre formulaire")

    } else {

        let productIdArray = []
        for( let ids of storage) {
            productIdArray.push(ids.id)
        }
        
        let order = {
            contact : {
                firstName : firstName.value,
                lastName : lastName.value,
                address : address.value,
                city : city.value,
                email : eMail.value,
            },

            products : productIdArray
        }

        fetch("http://localhost:3000/api/products/order", {
            method: "POST",
            headers: {
                'Accept': 'application/json', 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(order)
        })

        .then((resolve) => {
            if (resolve.ok) {
                return resolve.json();
            }
        })
            
        .then(data => {
            document.location.href = `confirmation.html?orderid=${data.orderId}`;
        })

        .catch((err) => {
                // Une erreur est survenue            
        })

        alert("Merci de votre achat")
    }
})