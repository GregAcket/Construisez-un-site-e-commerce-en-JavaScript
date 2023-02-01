const canapeUrl = window.location.href
const url = new URL(canapeUrl)
const id = url.searchParams.get("orderid")



let orderSelector = document.querySelector("#orderId")
orderSelector.innerText = id
localStorage.clear()