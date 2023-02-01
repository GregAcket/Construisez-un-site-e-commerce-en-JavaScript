const canapeUrl = window.location.href
const url = new URL(canapeUrl)
const id = url.searchParams.get("id")

function deleteMessage () {

  document.querySelector(".okMessage").remove()

}

const objetUrl = "http://localhost:3000/api/products/" + id

fetch(objetUrl)

.then((res) => {
    if (res.ok) {
        return res.json();
    }
})

.then((data) => {

  document.querySelector('article img').src = data.imageUrl
  document.querySelector('article img').alt = data.altTxt
  document.getElementById('title').innerHTML = data.name
  document.querySelector('title').innerHTML = data.name
  document.querySelector('#price').innerHTML = data.price
  document.getElementById('description').innerHTML = data.description

  // Boucle qui crée un élément d'option pour chaque couleur du tableau.

  for ( let i = 0; i < data.colors.length; i++) {
    
    let opt = document.createElement("option")
    opt.setAttribute("value",data.colors[i])

    document
      .querySelector('#colors')
      .appendChild(opt)
      .innerHTML = data.colors[i]
  }

  // Récupération des données à l'envoi vers le panier
    
  const ajoutPanier = document.getElementById('addToCart')
  ajoutPanier.addEventListener('click', () => {

    const selectedColor = document.querySelector('#colors').value

    if(selectedColor == "" ) {
     return alert ("Vous devez selectionner une couleur")
    }

    const selectedQuantity = document.querySelector('#quantity').value

    if(selectedQuantity <= 0 || selectedQuantity > 100) {
      return alert ("Vous devez selectionner une quantité valide (entre 1 et 100)")
    }

    let selectedCanap = {
      id : id,
      quantity : selectedQuantity,
      couleur : selectedColor
    }

    let canapline = JSON.stringify([selectedCanap])

    let verifyStorage = JSON.parse(localStorage.getItem("selectedCanap"))

    //si le stockage n'est pas inexistant

    if (verifyStorage != null) {

      //on recherche si il existe deja un produit avec la meme id et la même couleur

      let findProduct = verifyStorage.find(search => search.id == id && search.couleur == selectedColor)

      // si un tel produit existe, on ajoute la nouvelle quantité à la quantité précédente       

      if (findProduct != undefined) {

        selectedCanap.quantity = parseInt(selectedCanap.quantity) + parseInt(findProduct.quantity)

        if(selectedCanap.quantity > 100) {
    
          return alert ("Vous ne pouvez pas selectionner plus de 100 articles identiques")

        }

        let indexProduct = verifyStorage.indexOf(findProduct)

        verifyStorage.splice(indexProduct,1,selectedCanap)

        localStorage.setItem("selectedCanap", JSON.stringify(verifyStorage))

        validationMessage()
        setTimeout(deleteMessage,2000)
        
      } else {

          // Si aucun element ne correspond, on l'ajoute à la liste des produits déjà existants

          verifyStorage.push(selectedCanap)

          localStorage.setItem("selectedCanap", JSON.stringify(verifyStorage))

          validationMessage()
          setTimeout(deleteMessage,2000)
        }

    //Si le localStorage est vide, on crée le premier objet

    } else {

      localStorage.setItem("selectedCanap",canapline)

      validationMessage()
      setTimeout(deleteMessage,2000)
    }
  })
})

.catch((err) => {
    // Une erreur est survenue
})

function validationMessage() {

  let showMessage = document.querySelector("#addToCart")
  
  let okMessage = `
  <div class="okMessage">Votre produit a bien été ajouté au panier</div>`

  showMessage.innerHTML += okMessage

  let selectMessage = document.querySelector(".okMessage")

  selectMessage.style.cssText = `
  	min-width: 500px;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    background-color: green;
    border-radius: 25px;
    text-align: center;
    font-size: 20px;`
}